import { Hono } from 'hono';
import { z } from 'zod';
import { randomUUID } from 'crypto';
import { getStatements } from './db';

// Zod schemas for validation
const AddToCartSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  quantity: z.number().int().positive().default(1),
});

const UpdateCartItemSchema = z.object({
  quantity: z.number().int().positive('Quantity must be positive'),
});

// Types
type Cart = {
  id: string;
  session_id: string;
  created_at: string;
  updated_at: string;
};

type CartItem = {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
};

type CartItemWithProduct = CartItem & {
  product: {
    id: string;
    name: string;
    price: number;
    sku: string;
  };
};

const cart = new Hono();

// Helper: Get or create session_id from headers
function getSessionId(c: any): string {
  const sessionId = c.req.header('X-Session-Id');
  if (!sessionId) {
    return randomUUID();
  }
  return sessionId;
}

// Helper: Get or create cart for session
function getOrCreateCart(sessionId: string): Cart {
  const statements = getStatements();
  let cart = statements.getCartBySessionId.get({ $sessionId: sessionId }) as
    | Cart
    | undefined;
  if (!cart) {
    const cartId = randomUUID();
    const now = new Date().toISOString();
    statements.insertCart.run({
      $id: cartId,
      $sessionId: sessionId,
      $createdAt: now,
      $updatedAt: now,
    });
    cart = statements.getCartBySessionId.get({ $sessionId: sessionId }) as Cart;
  }
  return cart;
}

// POST /api/cart/items - Add item to cart
cart.post('/items', async (c) => {
  try {
    const body = await c.req.json();
    const validation = AddToCartSchema.safeParse(body);
    if (!validation.success) {
      return c.json(
        {
          error: 'Validation failed',
          details: validation.error.issues,
        },
        400
      );
    }
    const data = validation.data;
    const statements = getStatements();
    // Check if product exists
    const product = statements.getProductById.get({ $id: data.productId });
    if (!product) {
      return c.json(
        {
          error: 'Product not found',
          message: `No product found with id "${data.productId}"`,
        },
        400
      );
    }
    // Get or create session
    const sessionId = getSessionId(c);
    const cartRecord = getOrCreateCart(sessionId);
    // Check if item already exists in cart
    const existingItem = statements.getCartItemByProductId.get({
      $cartId: cartRecord.id,
      $productId: data.productId,
    }) as CartItem | undefined;
    const now = new Date().toISOString();
    let cartItem: CartItem;
    if (existingItem) {
      // Update quantity
      const newQuantity = existingItem.quantity + data.quantity;
      statements.updateCartItemQuantity.run({
        $id: existingItem.id,
        $quantity: newQuantity,
        $updatedAt: now,
      });
      cartItem = {
        ...existingItem,
        quantity: newQuantity,
        updatedAt: now,
      };
    } else {
      // Create new item
      const itemId = randomUUID();
      statements.insertCartItem.run({
        $id: itemId,
        $cartId: cartRecord.id,
        $productId: data.productId,
        $quantity: data.quantity,
        $createdAt: now,
        $updatedAt: now,
      });
      cartItem = {
        id: itemId,
        cartId: cartRecord.id,
        productId: data.productId,
        quantity: data.quantity,
        createdAt: now,
        updatedAt: now,
      };
    }
    // Update cart timestamp
    statements.updateCartTimestamp.run({
      $id: cartRecord.id,
      $updatedAt: now,
    });
    // Set session header
    c.header('X-Session-Id', sessionId);
    return c.json(cartItem, 201);
  } catch (error) {
    console.error('Error adding item to cart:', error);
    return c.json(
      {
        error: 'Failed to add item to cart',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
});

// GET /api/cart - Get full cart with items
cart.get('/', async (c) => {
  try {
    const sessionId = c.req.header('X-Session-Id');
    if (!sessionId) {
      return c.json(
        {
          error: 'Session ID required',
          message: 'X-Session-Id header is required',
        },
        400
      );
    }
    const statements = getStatements();
    const cartRecord = statements.getCartBySessionId.get({
      $sessionId: sessionId,
    }) as Cart | undefined;
    if (!cartRecord) {
      return c.json(
        {
          error: 'Cart not found',
          message: 'No cart found for this session',
        },
        404
      );
    }
    // Get cart items with product details
    const rawItems = statements.getCartItemsByCartId.all({
      $cartId: cartRecord.id,
    }) as any[];
    const items: CartItemWithProduct[] = rawItems.map((item: any) => ({
      id: item.id,
      cartId: item.cartId,
      productId: item.productId,
      quantity: item.quantity,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      product: {
        id: item.product_id,
        name: item.product_name,
        price: item.product_price,
        sku: item.product_sku,
      },
    }));
    return c.json({
      id: cartRecord.id,
      sessionId: cartRecord.session_id,
      items,
      createdAt: cartRecord.created_at,
      updatedAt: cartRecord.updated_at,
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    return c.json(
      {
        error: 'Failed to fetch cart',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
});

// GET /api/cart/summary - Get cart summary (count and total)
cart.get('/summary', async (c) => {
  try {
    const sessionId = c.req.header('X-Session-Id');
    if (!sessionId) {
      return c.json({
        itemCount: 0,
        totalAmount: 0,
      });
    }
    const statements = getStatements();
    const cartRecord = statements.getCartBySessionId.get({
      $sessionId: sessionId,
    }) as Cart | undefined;
    if (!cartRecord) {
      return c.json({
        itemCount: 0,
        totalAmount: 0,
      });
    }
    const rawItems = statements.getCartItemsByCartId.all({
      $cartId: cartRecord.id,
    }) as any[];
    const itemCount = rawItems.reduce(
      (sum: number, item: any) => sum + item.quantity,
      0
    );
    const totalAmount = rawItems.reduce(
      (sum: number, item: any) => sum + item.product_price * item.quantity,
      0
    );
    return c.json({
      itemCount,
      totalAmount,
    });
  } catch (error) {
    console.error('Error fetching cart summary:', error);
    return c.json({
      itemCount: 0,
      totalAmount: 0,
    });
  }
});

// PUT /api/cart/items/:id - Update cart item quantity
cart.put('/items/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    const validation = UpdateCartItemSchema.safeParse(body);
    if (!validation.success) {
      return c.json(
        {
          error: 'Validation failed',
          details: validation.error.issues,
        },
        400
      );
    }
    const data = validation.data;
    const statements = getStatements();
    const existingItem = statements.getCartItemById.get({ $id: id }) as
      | CartItem
      | undefined;
    if (!existingItem) {
      return c.json(
        {
          error: 'Cart item not found',
          message: `No cart item found with id "${id}"`,
        },
        404
      );
    }
    const now = new Date().toISOString();
    statements.updateCartItemQuantity.run({
      $id: id,
      $quantity: data.quantity,
      $updatedAt: now,
    });
    const updatedItem = statements.getCartItemById.get({ $id: id }) as any;
    return c.json({
      id: updatedItem.id,
      cartId: updatedItem.cart_id,
      productId: updatedItem.product_id,
      quantity: updatedItem.quantity,
      createdAt: updatedItem.created_at,
      updatedAt: updatedItem.updated_at,
    });
  } catch (error) {
    console.error('Error updating cart item:', error);
    return c.json(
      {
        error: 'Failed to update cart item',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
});

// DELETE /api/cart/items/:id - Remove cart item
cart.delete('/items/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const statements = getStatements();
    const existingItem = statements.getCartItemById.get({ $id: id }) as
      | CartItem
      | undefined;
    if (!existingItem) {
      return c.json(
        {
          error: 'Cart item not found',
          message: `No cart item found with id "${id}"`,
        },
        404
      );
    }
    statements.deleteCartItem.run({ $id: id });
    return c.body(null, 204);
  } catch (error) {
    console.error('Error removing cart item:', error);
    return c.json(
      {
        error: 'Failed to remove cart item',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
});

// DELETE /api/cart - Clear cart (remove all items)
cart.delete('/', async (c) => {
  try {
    const sessionId = c.req.header('X-Session-Id');
    if (!sessionId) {
      return c.json(
        {
          error: 'Session ID required',
          message: 'X-Session-Id header is required',
        },
        400
      );
    }
    const statements = getStatements();
    const cartRecord = statements.getCartBySessionId.get({
      $sessionId: sessionId,
    }) as Cart | undefined;
    if (!cartRecord) {
      return c.json(
        {
          error: 'Cart not found',
          message: 'No cart found for this session',
        },
        404
      );
    }
    statements.deleteCartItemsByCartId.run({ $cartId: cartRecord.id });
    return c.body(null, 204);
  } catch (error) {
    console.error('Error clearing cart:', error);
    return c.json(
      {
        error: 'Failed to clear cart',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
});

export default cart;

import { Hono } from 'hono';
import { z } from 'zod';
import { randomUUID } from 'crypto';
import { getStatements } from './db';

// Zod schema for product validation
const CreateProductSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().positive('Price must be positive'),
  sku: z.string().min(1, 'SKU is required'),
});

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  sku: string;
  createdAt: string;
};

const products = new Hono();

// POST /api/products - Create a new product
products.post('/', async (c) => {
  try {
    const body = await c.req.json();

    // Validate input
    const validation = CreateProductSchema.safeParse(body);
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

    // Check if SKU already exists
    const existingProduct = statements.getProductBySku.get({ $sku: data.sku });
    if (existingProduct) {
      return c.json(
        {
          error: 'SKU already exists',
          message: `A product with SKU "${data.sku}" already exists`,
        },
        400
      );
    }

    // Create product
    const productId = randomUUID();
    const createdAt = new Date().toISOString();

    statements.insertProduct.run({
      $id: productId,
      $name: data.name,
      $description: data.description,
      $price: data.price,
      $sku: data.sku,
      $createdAt: createdAt,
    });

    const product: Product = {
      id: productId,
      name: data.name,
      description: data.description,
      price: data.price,
      sku: data.sku,
      createdAt,
    };

    return c.json(product, 201);
  } catch (error) {
    console.error('Error creating product:', error);
    return c.json(
      {
        error: 'Failed to create product',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
});

// GET /api/products - List all products
products.get('/', async (c) => {
  try {
    const statements = getStatements();
    const allProducts = statements.getAllProducts.all() as Product[];

    return c.json(allProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    return c.json(
      {
        error: 'Failed to fetch products',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
});

// GET /api/products/:id - Get a single product by ID (bonus)
products.get('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const statements = getStatements();

    const product = statements.getProductById.get({ $id: id }) as
      | Product
      | undefined;

    if (!product) {
      return c.json(
        {
          error: 'Product not found',
          message: `No product found with id "${id}"`,
        },
        404
      );
    }

    return c.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return c.json(
      {
        error: 'Failed to fetch product',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
});

export default products;

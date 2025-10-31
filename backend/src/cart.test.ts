import { describe, it, expect, beforeEach } from 'bun:test';
import { Hono } from 'hono';
import cart from './cart';
import { initDatabase, getStatements } from './db';
import { randomUUID } from 'crypto';

describe('Cart API', () => {
  let app: Hono;
  let testProductId: string;
  beforeEach(() => {
    initDatabase();
    app = new Hono();
    app.route('/api/cart', cart);
    const statements = getStatements();
    testProductId = randomUUID();
    statements.insertProduct.run({
      $id: testProductId,
      $name: 'Test Product',
      $description: 'Test Description',
      $price: 99.99,
      $sku: `TEST-${randomUUID()}`,
      $createdAt: new Date().toISOString(),
    });
  });
  describe('POST /api/cart/items', () => {
    it('should add item to cart and create session', async () => {
      const req = new Request('http://localhost/api/cart/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: testProductId,
          quantity: 2,
        }),
      });
      const res = await app.fetch(req);
      expect(res.status).toBe(201);
      const sessionId = res.headers.get('X-Session-Id');
      expect(sessionId).toBeTruthy();
      const data = await res.json();
      expect(data).toHaveProperty('id');
      expect(data.productId).toBe(testProductId);
      expect(data.quantity).toBe(2);
    });
    it('should increment quantity if item already exists', async () => {
      // Add item first time
      const req1 = new Request('http://localhost/api/cart/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: testProductId,
          quantity: 1,
        }),
      });
      const res1 = await app.fetch(req1);
      const sessionId = res1.headers.get('X-Session-Id');
      // Add same item again
      const req2 = new Request('http://localhost/api/cart/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-Id': sessionId!,
        },
        body: JSON.stringify({
          productId: testProductId,
          quantity: 2,
        }),
      });
      const res2 = await app.fetch(req2);
      expect(res2.status).toBe(201);
      const data = await res2.json();
      expect(data.quantity).toBe(3);
    });
    it('should return 400 if product not found', async () => {
      const req = new Request('http://localhost/api/cart/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: 'non-existent-id',
          quantity: 1,
        }),
      });
      const res = await app.fetch(req);
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toBe('Product not found');
    });
    it('should validate quantity is positive', async () => {
      const req = new Request('http://localhost/api/cart/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: testProductId,
          quantity: -1,
        }),
      });
      const res = await app.fetch(req);
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toBe('Validation failed');
    });
  });
  describe('GET /api/cart', () => {
    it('should return cart with items', async () => {
      // Add item to cart
      const req1 = new Request('http://localhost/api/cart/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: testProductId,
          quantity: 2,
        }),
      });
      const res1 = await app.fetch(req1);
      const sessionId = res1.headers.get('X-Session-Id');
      // Get cart
      const req2 = new Request('http://localhost/api/cart', {
        headers: { 'X-Session-Id': sessionId! },
      });
      const res2 = await app.fetch(req2);
      expect(res2.status).toBe(200);
      const data = await res2.json();
      expect(data).toHaveProperty('id');
      expect(data).toHaveProperty('sessionId', sessionId);
      expect(data.items).toHaveLength(1);
      expect(data.items[0].productId).toBe(testProductId);
      expect(data.items[0].quantity).toBe(2);
      expect(data.items[0].product).toHaveProperty('name', 'Test Product');
    });
    it('should return 404 if cart not found', async () => {
      const req = new Request('http://localhost/api/cart', {
        headers: { 'X-Session-Id': 'non-existent-session' },
      });
      const res = await app.fetch(req);
      expect(res.status).toBe(404);
    });
    it('should return 400 if session ID not provided', async () => {
      const req = new Request('http://localhost/api/cart');
      const res = await app.fetch(req);
      expect(res.status).toBe(400);
    });
  });
  describe('GET /api/cart/summary', () => {
    it('should return summary with count and total', async () => {
      // Add items
      const req1 = new Request('http://localhost/api/cart/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: testProductId,
          quantity: 2,
        }),
      });
      const res1 = await app.fetch(req1);
      const sessionId = res1.headers.get('X-Session-Id');
      // Get summary
      const req2 = new Request('http://localhost/api/cart/summary', {
        headers: { 'X-Session-Id': sessionId! },
      });
      const res2 = await app.fetch(req2);
      expect(res2.status).toBe(200);
      const data = await res2.json();
      expect(data.itemCount).toBe(2);
      expect(data.totalAmount).toBe(199.98);
    });
    it('should return zeros if cart not found', async () => {
      const req = new Request('http://localhost/api/cart/summary', {
        headers: { 'X-Session-Id': 'non-existent-session' },
      });
      const res = await app.fetch(req);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.itemCount).toBe(0);
      expect(data.totalAmount).toBe(0);
    });
    it('should return zeros if no session ID', async () => {
      const req = new Request('http://localhost/api/cart/summary');
      const res = await app.fetch(req);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.itemCount).toBe(0);
      expect(data.totalAmount).toBe(0);
    });
  });
  describe('PUT /api/cart/items/:id', () => {
    it('should update item quantity', async () => {
      // Add item
      const req1 = new Request('http://localhost/api/cart/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: testProductId,
          quantity: 1,
        }),
      });
      const res1 = await app.fetch(req1);
      const item = await res1.json();
      // Update quantity
      const req2 = new Request(`http://localhost/api/cart/items/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quantity: 5,
        }),
      });
      const res2 = await app.fetch(req2);
      expect(res2.status).toBe(200);
      const data = await res2.json();
      expect(data.quantity).toBe(5);
    });
    it('should return 404 if item not found', async () => {
      const req = new Request(
        'http://localhost/api/cart/items/non-existent-id',
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            quantity: 5,
          }),
        }
      );
      const res = await app.fetch(req);
      expect(res.status).toBe(404);
    });
    it('should validate quantity is positive', async () => {
      const req1 = new Request('http://localhost/api/cart/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: testProductId,
          quantity: 1,
        }),
      });
      const res1 = await app.fetch(req1);
      const item = await res1.json();
      const req2 = new Request(`http://localhost/api/cart/items/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quantity: -1,
        }),
      });
      const res2 = await app.fetch(req2);
      expect(res2.status).toBe(400);
    });
  });
  describe('DELETE /api/cart/items/:id', () => {
    it('should remove item from cart', async () => {
      // Add item
      const req1 = new Request('http://localhost/api/cart/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: testProductId,
          quantity: 1,
        }),
      });
      const res1 = await app.fetch(req1);
      const item = await res1.json();
      // Remove item
      const req2 = new Request(`http://localhost/api/cart/items/${item.id}`, {
        method: 'DELETE',
      });
      const res2 = await app.fetch(req2);
      expect(res2.status).toBe(204);
    });
    it('should return 404 if item not found', async () => {
      const req = new Request(
        'http://localhost/api/cart/items/non-existent-id',
        {
          method: 'DELETE',
        }
      );
      const res = await app.fetch(req);
      expect(res.status).toBe(404);
    });
  });
  describe('DELETE /api/cart', () => {
    it('should clear all items from cart', async () => {
      // Add item
      const req1 = new Request('http://localhost/api/cart/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: testProductId,
          quantity: 2,
        }),
      });
      const res1 = await app.fetch(req1);
      const sessionId = res1.headers.get('X-Session-Id');
      // Clear cart
      const req2 = new Request('http://localhost/api/cart', {
        method: 'DELETE',
        headers: { 'X-Session-Id': sessionId! },
      });
      const res2 = await app.fetch(req2);
      expect(res2.status).toBe(204);
      // Verify cart is empty
      const req3 = new Request('http://localhost/api/cart/summary', {
        headers: { 'X-Session-Id': sessionId! },
      });
      const res3 = await app.fetch(req3);
      const data = await res3.json();
      expect(data.itemCount).toBe(0);
    });
    it('should return 404 if cart not found', async () => {
      const req = new Request('http://localhost/api/cart', {
        method: 'DELETE',
        headers: { 'X-Session-Id': 'non-existent-session' },
      });
      const res = await app.fetch(req);
      expect(res.status).toBe(404);
    });
    it('should return 400 if session ID not provided', async () => {
      const req = new Request('http://localhost/api/cart', {
        method: 'DELETE',
      });
      const res = await app.fetch(req);
      expect(res.status).toBe(400);
    });
  });
});

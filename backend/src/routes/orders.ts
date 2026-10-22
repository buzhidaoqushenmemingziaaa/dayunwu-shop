import { Router } from 'express';
import { prisma } from '../db.js';
import { asyncHandler } from '../async-handler.js';
import { createOrderSchema, idParamSchema } from '../schemas.js';

export const ordersRouter = Router();

ordersRouter.post(
  '/',
  asyncHandler(async (req, res) => {
    const parsed = createOrderSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: 'invalid order payload' });
      return;
    }
    const { items, paid } = parsed.data;

    const productIds = items.map((i) => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });
    const productMap = new Map(products.map((p) => [p.id, p]));

    const missing = productIds.filter((id) => !productMap.has(id));
    if (missing.length > 0) {
      res.status(400).json({ error: 'product not found', productIds: missing });
      return;
    }

    const insufficient = items.filter(
      (i) => (productMap.get(i.productId) as { stock: number }).stock < i.quantity
    );
    if (insufficient.length > 0) {
      res.status(400).json({ error: 'insufficient stock' });
      return;
    }

    const orderItems = items.map((i) => {
      const p = productMap.get(i.productId)!;
      return {
        productId: p.id,
        productName: p.name,
        quantity: i.quantity,
        unitPrice: p.price,
        subtotal: p.price * i.quantity,
      };
    });
    const totalAmount = orderItems.reduce((sum, it) => sum + it.subtotal, 0);
    const orderNumber = `DYW${Date.now()}${Math.floor(Math.random() * 1000)}`;

    const order = await prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          orderNumber,
          totalAmount,
          status: paid ? 'PAID' : 'PENDING',
          items: { create: orderItems },
        },
        include: { items: true },
      });
      for (const i of items) {
        await tx.product.update({
          where: { id: i.productId },
          data: { stock: { decrement: i.quantity } },
        });
      }
      return created;
    });

    res.status(201).json(order);
  })
);

ordersRouter.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const parsed = idParamSchema.safeParse(req.params);
    if (!parsed.success) {
      res.status(400).json({ error: 'invalid order id' });
      return;
    }
    const order = await prisma.order.findUnique({
      where: { id: parsed.data.id },
      include: { items: true },
    });
    if (!order) {
      res.status(404).json({ error: 'order not found' });
      return;
    }
    res.json(order);
  })
);

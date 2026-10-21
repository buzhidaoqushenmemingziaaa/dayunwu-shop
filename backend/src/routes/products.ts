import { Router } from 'express';
import { prisma } from '../db.js';
import { asyncHandler } from '../async-handler.js';
import { idParamSchema } from '../schemas.js';

export const productsRouter = Router();

productsRouter.get(
  '/',
  asyncHandler(async (_req, res) => {
    const products = await prisma.product.findMany({ orderBy: { id: 'asc' } });
    res.json(products);
  })
);

productsRouter.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const parsed = idParamSchema.safeParse(req.params);
    if (!parsed.success) {
      res.status(400).json({ error: 'invalid product id' });
      return;
    }
    const product = await prisma.product.findUnique({
      where: { id: parsed.data.id },
    });
    if (!product) {
      res.status(404).json({ error: 'product not found' });
      return;
    }
    res.json(product);
  })
);

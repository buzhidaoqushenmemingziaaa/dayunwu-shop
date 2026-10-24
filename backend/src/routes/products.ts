import { Router } from 'express';
import { Prisma } from '@prisma/client';
import { prisma } from '../db.js';
import { asyncHandler } from '../async-handler.js';
import { idParamSchema, productQuerySchema } from '../schemas.js';

export const productsRouter = Router();

productsRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const parsed = productQuerySchema.safeParse(req.query);
    if (!parsed.success) {
      res.status(400).json({ error: 'invalid query params' });
      return;
    }
    const { keyword, category, minPrice, maxPrice, page, pageSize, sort } =
      parsed.data;

    // 组装筛选条件
    const where: Prisma.ProductWhereInput = {};
    if (keyword) {
      where.OR = [
        { name: { contains: keyword } },
        { brand: { contains: keyword } },
        { intro: { contains: keyword } },
        { tags: { contains: keyword } },
      ];
    }
    if (category) where.category = category;
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {
        ...(minPrice !== undefined ? { gte: minPrice } : {}),
        ...(maxPrice !== undefined ? { lte: maxPrice } : {}),
      };
    }

    const orderBy: Prisma.ProductOrderByWithRelationInput =
      sort === 'price_asc'
        ? { price: 'asc' }
        : sort === 'price_desc'
          ? { price: 'desc' }
          : sort === 'newest'
            ? { createdAt: 'desc' }
            : { id: 'asc' };

    const [items, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.product.count({ where }),
    ]);

    res.json({ items, total });
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

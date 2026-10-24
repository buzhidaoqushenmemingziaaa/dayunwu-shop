import { z } from 'zod';

export const idParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

// 空字符串/空白查询参数视为未传
const blankToUndefined = (value: unknown) =>
  typeof value === 'string' && value.trim() === '' ? undefined : value;

// 商品列表查询参数：筛选 + 排序 + 分页
export const productQuerySchema = z
  .object({
    keyword: z.preprocess(blankToUndefined, z.string().trim().min(1).optional()),
    category: z.preprocess(blankToUndefined, z.string().trim().min(1).optional()),
    minPrice: z.preprocess(
      blankToUndefined,
      z.coerce.number().nonnegative().optional()
    ),
    maxPrice: z.preprocess(
      blankToUndefined,
      z.coerce.number().nonnegative().optional()
    ),
    page: z.preprocess(
      blankToUndefined,
      z.coerce.number().int().positive().default(1)
    ),
    pageSize: z.preprocess(
      blankToUndefined,
      z.coerce.number().int().positive().max(100).default(100)
    ),
    sort: z.preprocess(
      blankToUndefined,
      z
        .enum(['default', 'price_asc', 'price_desc', 'newest'])
        .default('default')
    ),
  })
  .refine(
    (q) =>
      q.minPrice === undefined ||
      q.maxPrice === undefined ||
      q.minPrice <= q.maxPrice,
    { message: 'minPrice must not exceed maxPrice', path: ['minPrice'] }
  );

export const createOrderSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.number().int().positive(),
        quantity: z.number().int().positive(),
      })
    )
    .min(1),
  // 模拟支付标记：true 表示已完成模拟支付
  paid: z.boolean().optional().default(false),
});

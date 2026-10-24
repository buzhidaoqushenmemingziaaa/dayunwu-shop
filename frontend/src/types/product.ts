// 与后端 Prisma Product 模型对应
export interface Product {
  id: number;
  name: string;
  brand: string;
  price: number;
  category: string;
  stock: number;
  image: string;
  intro: string;
  description: string;
  tags: string;
  createdAt: string;
}

// 商品列表分页响应
export interface ProductListResult {
  items: Product[];
  total: number;
}

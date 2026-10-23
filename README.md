# 大云屋购物

一个用于课程考核的演示型电商网站，实现「浏览 → 加购 → 下单 → 查看订单」完整闭环，**不涉及真实支付**。

## 技术栈

| 层 | 技术 |
|---|---|
| 前端 | Vite · React 19 · TypeScript · React Router · Zustand |
| 后端 | Express · Prisma · SQLite · zod |
| 包管理 | pnpm workspace |

## 目录

```
├── frontend/          # Vite + React 19 + TS，开发端口 5173
├── backend/           # Express + Prisma + SQLite，开发端口 3000
│   ├── prisma/        # schema.prisma + 本地 dev.db
│   └── .env.example   # 复制为 .env 使用
├── package.json       # pnpm workspace 根（dev 脚本同起前后端）
└── pnpm-workspace.yaml
```

## 环境要求

- Node.js ≥ 18
- pnpm ≥ 8（**必须用 pnpm**，不要用 npm/yarn）
  ```bash
  # 没装过 pnpm 的话，任选一种方式
  npm install -g pnpm
  # 或启用 corepack（Node 16.13+ 自带）
  corepack enable && corepack prepare pnpm@latest --activate
  ```

## 快速启动（首次克隆必做）

```bash
# 1. 安装依赖
pnpm install

# 2. 后端数据库配置（只需首次）
copy backend\.env.example backend\.env
# 内容只有一行：DATABASE_URL="file:./dev.db"，按需可改

# 3. 生成 Prisma Client + 写入种子商品（24 件）
pnpm --filter backend db:generate
pnpm --filter backend db:seed

# 4. 同时启动前后端
pnpm dev
```

启动成功后：

- 前端：http://localhost:5173
- 后端健康检查：http://localhost:3000/health → 应返回 `{"status":"ok",...}`
- Vite 自动把 `/api/*` 代理到后端 3000，前端无需关心跨域

## 生产构建

```bash
# 分别构建
pnpm --filter frontend build
pnpm --filter backend build

# 运行后端
cd backend && pnpm start

# 前端产物在 frontend/dist，直接扔到任意静态服务器（Vercel / nginx）
```

## 后端 API

| 方法 | 路径 | 说明 |
|---|---|---|
| GET | `/products` | 全部商品 |
| GET | `/products/:id` | 商品详情 |
| POST | `/orders` | 创建订单（支持模拟支付 `paid: true`） |
| GET | `/orders/:id` | 订单详情（含明细） |

前端统一通过 `/api/*` 代理调用；后端用 zod 做入参校验，返回 400 / 404 / 500 标准错误。

## 数据模型

- **Product**：name / brand / price / category / stock / image / intro / description / tags
- **Order**：orderNumber / totalAmount / status（`PENDING` / `PAID`）/ createdAt
- **OrderItem**：productId / productName / quantity / unitPrice / subtotal（快照字段，下单时固化）

## 功能进度
详见： [`process.md`](./process.md) 。
项目功能实现思路：[任务清单.md](./任务清单.md)


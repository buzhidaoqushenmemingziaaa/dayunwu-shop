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

## AI Coding 思路
1.先阅读考核要求，理解基本背景与需求
2.把 项目考核.docx 用work Buddy 转换成markdown格式，把 项目考核.md 给dsh生成 任务清单.md，标准是：
-对所有功能做出评估，从易实现到难完成，并且保证基本功能的达标
-尽量精简，但是清晰，不会让agent乱猜
-每一步都有手动检验的标准
我把它作为项目开发进程的参考，给我和agent看 （每一步我都自己检验过，确认真实性、合理性）
3.我新建process.md, 里面是项目开发进程和项目目录，还有我的思路、检验。
4.新建rules.md，里面是我让AI编程工具必须遵守的事项（我在这过程中也去看一些视频、推文，了解更多可以写进规则的内容，辅助完成项目）
5.后面我换用trae作为AI编程工具，我的收获：

## 我的疑问
1.可能因为基础还不够扎实，体系不够完善，我看任务清单.md里面的各个任务，没有办法很好的对任务大小（对agent来讲）有概念，所以有时候会导致直接执行了一个任务，很慢，花费很多token（我在rules.md里面注意了这个问题，但是好像agent每次都会讲规模不大）
2.我还没有部署上线，怎么看手机视口的响应式布局呢
3.我做所有项目以来，刚开始的时候都很困难，因为agent需要安装各种依赖，有时候又会和我电脑已有的版本发生冲突，还会有安装在这个环境下，但是我项目是在另一个环境下，导致安装成功，但是没有办法运行的情况。我好像对电脑里面的环境还不是很能掌控。

我后续会再自己查询怎么解决，这是我目前实操下来的疑惑




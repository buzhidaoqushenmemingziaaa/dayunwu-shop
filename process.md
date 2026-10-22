# 项目开发进程

## 项目目录
```
大云屋（购物）/
├── frontend/          # Vite + React 19 + TypeScript
├── backend/           # Express + Prisma + SQLite（商品/订单 API）
    backend/src/
    ├── index.ts          # 入口 + 404/500 中间件
    ├── db.ts             # PrismaClient 单例
    ├── async-handler.ts  # 异步错误转交
    ├── schemas.ts        # zod 校验
    └── routes/
        ├── products.ts   # GET /  GET /:id
        └── orders.ts     # POST /  GET /:id       
├── package.json       # pnpm workspace 根（dev 脚本一键同起）
├── pnpm-workspace.yaml
├── pnpm-lock.yaml
├── node_modules/
├── .pnpm-store/       # 沙箱本地 store（已 gitignore）
├── .pnpm-cache/       # 沙箱本地 cache（已 gitignore）
└── 任务清单.md / 项目考核.md / rules.md
```

## 变更记录
- [T0.1] 搭建前后端脚手架
- [T0.2] 完成Git仓库推送
- [T1.1] 商品数据与数据库
- [T1.2] 后端完整API
- [T1.3] 代理+apiClient联调
- [T1.4] 首页与导航条
- [T1.5] 商品列表页
- [T1.6] 商品详情页
- [T1.7] 侧拉式购物车
- [T1.8] 结算模拟支付与订单结果页

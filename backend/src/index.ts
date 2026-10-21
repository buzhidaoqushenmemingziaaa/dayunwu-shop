import express, {
  type ErrorRequestHandler,
  type RequestHandler,
} from 'express';
import cors from 'cors';
import { productsRouter } from './routes/products.js';
import { ordersRouter } from './routes/orders.js';

const app = express();
const PORT = Number(process.env.PORT ?? 3000);

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/products', productsRouter);
app.use('/orders', ordersRouter);

const notFound: RequestHandler = (_req, res) => {
  res.status(404).json({ error: 'not found' });
};
app.use(notFound);

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'internal server error' });
};
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import axios from 'axios';
import { config, logger } from './config';
import { connectToMongo, closeMongoConnection } from './database';
import { initializeFirebase } from './firebase';

import userRoutes from './routes/user.routes';
import authRoutes from './routes/auth.routes';
import groupRoutes from './routes/groups.routes';
import expensesRoutes from './routes/expenses.routes';
import integrationsRoutes from './routes/integrations.routes';
import adminRoutes from './routes/admin.routes';

const app = express();

// Initialize Services
async function startApp() {
  await connectToMongo();
  initializeFirebase();

let allowedOrigins: string[] = [];
if (config.allowAllOrigins) {
  allowedOrigins = ['*'];
  logger.debug('Development mode: CORS configured to allow all origins');
} else if (config.allowedOrigins) {
  allowedOrigins = config.allowedOrigins.split(',').map(o => o.trim()).filter(o => o);
} else {
  allowedOrigins = ['*'];
}

logger.info(`Allowed CORS origins: ${allowedOrigins}`);

app.use(cors({
  origin: allowedOrigins.includes('*') ? '*' : allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD', 'PATCH'],
  allowedHeaders: [
    'Accept',
    'Accept-Language',
    'Content-Language',
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Origin',
    'Cache-Control',
    'Pragma',
    'X-CSRFToken',
  ],
  exposedHeaders: ['*'],
  maxAge: 3600,
}));

// Middleware to parse JSON
app.use(express.json());

// Request Response Logging Middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info(`Incoming Request: ${req.method} ${req.url}`);
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(`Response: ${req.method} ${req.url} ${res.statusCode} ${duration}ms`);
  });
  next();
});

// Catch-all OPTIONS handler is handled by cors middleware

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'healthy', service: 'Splitwiser API (Node)' });
});

// Include routers here
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/groups', groupRoutes);
app.use('/groups/:group_id/expenses', expensesRoutes);
app.use('/import', integrationsRoutes);
app.use('/admin', adminRoutes);

const PORT = config.port;

  const server = app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
    startKeepAlive();
  });

  // Graceful shutdown
  process.on('SIGTERM', async () => {
    logger.info('SIGTERM received. Shutting down gracefully');
    server.close(async () => {
      await closeMongoConnection();
      process.exit(0);
    });
  });
  process.on('SIGINT', async () => {
    logger.info('SIGINT received. Shutting down gracefully');
    server.close(async () => {
      await closeMongoConnection();
      process.exit(0);
    });
  });
}

// Keep-alive function for Render free tier
function startKeepAlive() {
  const selfUrl = process.env.SELF_URL || 'https://splitsmart-gmfd.onrender.com';
  if (!selfUrl) return;

  // Render free tier spin down is 15 minutes of inactivity.
  // We ping every 14 minutes.
  const INTERVAL = 14 * 60 * 1000; 

  logger.info(`Starting keep-alive ping routine targeting ${selfUrl}/health`);
  
  // Initial ping after 1 minute
  setTimeout(() => {
    pingSelf(selfUrl);
  }, 60000);

  setInterval(() => {
    pingSelf(selfUrl);
  }, INTERVAL);
}

async function pingSelf(url: string) {
  try {
    logger.info(`Sending keep-alive ping to ${url}/health`);
    const res = await axios.get(`${url}/health`);
    logger.info(`Keep-alive ping successful: status ${res.status}`);
  } catch (err: any) {
    logger.error(`Keep-alive ping failed: ${err.message}`);
  }
}

startApp().catch(err => {
  logger.error(`Failed to start app: ${err}`);
  process.exit(1);
});

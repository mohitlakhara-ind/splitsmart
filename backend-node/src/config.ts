import dotenv from 'dotenv';
import winston from 'winston';

dotenv.config();

export const config = {
  mongodbUrl: process.env.MONGODB_URL || 'mongodb://localhost:27017/splitsmart',
  secretKey: process.env.SECRET_KEY || 'default-secret-key-change-me',
  firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
  firebaseServiceAccountPath: process.env.FIREBASE_SERVICE_ACCOUNT_PATH || './firebase-service-account.json',
  port: parseInt(process.env.PORT || '8000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  allowAllOrigins: process.env.ALLOW_ALL_ORIGINS === 'true',
  allowedOrigins: process.env.ALLOWED_ORIGINS || '',
};

export const logger = winston.createLogger({
  level: config.nodeEnv === 'development' ? 'debug' : 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console()
  ]
});

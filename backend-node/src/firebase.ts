import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { config, logger } from './config';
import fs from 'fs';

export function initializeFirebase() {
  if (getApps().length > 0) return;

  try {
    if (fs.existsSync(config.firebaseServiceAccountPath)) {
      const serviceAccount = JSON.parse(fs.readFileSync(config.firebaseServiceAccountPath, 'utf8'));
      initializeApp({
        credential: cert(serviceAccount),
        projectId: config.firebaseProjectId || serviceAccount.project_id
      });
      logger.info('Firebase initialized with service account file');
    } else if (config.firebaseProjectId) {
      // Fallback for environment variables or default
      initializeApp({
        projectId: config.firebaseProjectId
      });
      logger.info('Firebase initialized with project ID from env');
    } else {
      logger.warn('Firebase service account not found. Google auth may not work.');
    }
  } catch (error) {
    logger.error(`Error initializing Firebase: ${error}`);
  }
}

let authInstance;
try {
  authInstance = getAuth();
} catch (e) {
  // Ignore, will be initialized later
}

export const firebaseAuth = () => getAuth();

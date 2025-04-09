import { IDeveloper } from '../models/Developer';

declare global {
  namespace Express {
    interface Request {
      developer?: IDeveloper;
    }
  }
} 
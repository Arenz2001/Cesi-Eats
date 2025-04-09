import { IDeveloper } from '../models/Developer';

declare module 'express' {
  export interface Request {
    developer?: IDeveloper;
  }
} 
import { Request, Response, NextFunction } from 'express';
import { Developer } from '../models/Developer';

export const validateApiKey = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey) {
    return res.status(401).json({ message: 'API key is required' });
  }

  try {
    const developer = await Developer.findOne({ apiKey });
    if (!developer) {
      return res.status(401).json({ message: 'Invalid API key' });
    }
    
    // Add developer to request for use in later middleware
    // @ts-ignore - Ignorer l'erreur TypeScript
    req.developer = developer;
    next();
  } catch (error) {
    return res.status(500).json({ message: 'Error validating API key' });
  }
}; 
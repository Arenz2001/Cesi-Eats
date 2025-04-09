import { Request, Response } from 'express';
import { Developer, IDeveloper } from '../models/Developer';
import crypto from 'crypto';

// Create a new developer profile
export const createDeveloper = async (req: Request, res: Response) => {
  try {
    const { userId, company, position } = req.body;
    
    // Generate API key
    const apiKey = crypto.randomBytes(32).toString('hex');
    
    const developer = new Developer({
      userId,
      company,
      position,
      apiKey
    });

    await developer.save();
    
    res.status(201).json({
      message: 'Developer profile created successfully',
      apiKey,
      developer
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating developer profile' });
  }
};

// Get developer profile
export const getDeveloper = async (req: Request, res: Response) => {
  try {
    const developer = await Developer.findOne({ userId: req.params.userId });
    if (!developer) {
      return res.status(404).json({ message: 'Developer not found' });
    }
    res.json(developer);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching developer profile' });
  }
};

// Update developer profile
export const updateDeveloper = async (req: Request, res: Response) => {
  try {
    const { company, position } = req.body;
    const developer = await Developer.findOneAndUpdate(
      { userId: req.params.userId },
      { company, position },
      { new: true }
    );
    
    if (!developer) {
      return res.status(404).json({ message: 'Developer not found' });
    }
    
    res.json(developer);
  } catch (error) {
    res.status(500).json({ message: 'Error updating developer profile' });
  }
};

// Delete developer profile
export const deleteDeveloper = async (req: Request, res: Response) => {
  try {
    const developer = await Developer.findOneAndDelete({ userId: req.params.userId });
    if (!developer) {
      return res.status(404).json({ message: 'Developer not found' });
    }
    res.json({ message: 'Developer profile deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting developer profile' });
  }
}; 
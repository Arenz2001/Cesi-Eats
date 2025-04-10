import { Request, Response } from 'express';
import { Developer, IDeveloper } from '../models/Developer';
import crypto from 'crypto';

// Create a new developer profile
export const createDeveloper = async (req: Request, res: Response) => {
  try {
    const { userId, company, position } = req.body;
    
    // Check if a developer with this userId already exists
    const existingDeveloper = await Developer.findOne({ userId });
    if (existingDeveloper) {
      return res.status(400).json({ message: 'Developer profile already exists for this user' });
    }
    
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
    console.error('Error creating developer profile:', error);
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
    console.error('Error fetching developer profile:', error);
    res.status(500).json({ message: 'Error fetching developer profile' });
  }
};

export const getAllDevelopers = async (req: Request, res: Response) => {
  try {
    const developers = await Developer.find({});
    
    if (!developers || developers.length === 0) {
      return res.status(404).json({ message: 'No developers found' });
    }
    
    res.json(developers);
  } catch (error) {
    console.error('Error fetching all developers:', error);
    res.status(500).json({ message: 'Error fetching developers' });
  }
};

// Update developer profile
export const updateDeveloper = async (req: Request, res: Response) => {
  try {
    const { company, position, apiKey } = req.body;
    
    // Préparer l'objet de mise à jour
    const updateData: {
      company?: string;
      position?: string;
      apiKey?: string | null;
    } = {};
    
    // Ajouter les champs uniquement s'ils sont définis
    if (company !== undefined) updateData.company = company;
    if (position !== undefined) updateData.position = position;
    if (apiKey !== undefined) updateData.apiKey = apiKey;
    
    console.log('Updating developer profile:', { userId: req.params.userId, updateData });
    
    const developer = await Developer.findOneAndUpdate(
      { userId: req.params.userId },
      updateData,
      { new: true }
    );
    
    if (!developer) {
      return res.status(404).json({ message: 'Developer not found' });
    }
    
    res.json(developer);
  } catch (error) {
    console.error('Error updating developer profile:', error);
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
    console.error('Error deleting developer profile:', error);
    res.status(500).json({ message: 'Error deleting developer profile' });
  }
}; 
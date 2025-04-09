import { Request, Response } from 'express';
import { Component } from '../models/Component';

// List all available components
export const listComponents = async (req: Request, res: Response) => {
  try {
    const components = await Component.find({}, { downloadUrl: 0 });
    res.json(components);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching components' });
  }
};

// Get component details
export const getComponent = async (req: Request, res: Response) => {
  try {
    const component = await Component.findById(req.params.componentId, { downloadUrl: 0 });
    if (!component) {
      return res.status(404).json({ message: 'Component not found' });
    }
    res.json(component);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching component' });
  }
};

// Download component
export const downloadComponent = async (req: Request, res: Response) => {
  try {
    const component = await Component.findById(req.params.componentId);
    if (!component) {
      return res.status(404).json({ message: 'Component not found' });
    }
    
    // Here you would typically generate a temporary download URL or stream the file
    // For now, we'll just return the download URL
    res.json({ downloadUrl: component.downloadUrl });
  } catch (error) {
    res.status(500).json({ message: 'Error processing download request' });
  }
}; 
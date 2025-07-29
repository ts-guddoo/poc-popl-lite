import { Request, Response } from 'express';
import { ActivityService } from '../services/activityService';

const activityService = new ActivityService();

export const createActivity = async (req: Request, res: Response) => {
  try {
    const { name, timestamp, note, contactId } = req.body;
    
    if (!timestamp || !note || !contactId) {
      return res.status(400).json({ error: 'Timestamp, note, and contactId are required' });
    }

    const activity = await activityService.createActivity(name, timestamp, note, contactId);
    return res.status(201).json(activity);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Contact not found') {
        return res.status(404).json({ error: error.message });
      }
      if (error.message.includes('Validation failed')) {
        return res.status(400).json({ error: error.message });
      }
    }
    return res.status(500).json({ error: 'Failed to create activity' });
  }
};

import { Request, Response } from 'express';
import { ContactService } from '../services/contactService';
import { ActivityService } from '../services/activityService';

const contactService = new ContactService();
const activityService = new ActivityService();

export const createContact = async (req: Request, res: Response) => {
  try {
    const { name, email, companyId } = req.body;
    
    if (!name || !email || !companyId) {
      return res.status(400).json({ error: 'Name, email, and companyId are required' });
    }

    const contact = await contactService.createContact(name, email, companyId);
    return res.status(201).json(contact);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Company not found') {
        return res.status(404).json({ error: error.message });
      }
      if (error.message.includes('Validation failed')) {
        return res.status(400).json({ error: error.message });
      }
    }
    return res.status(500).json({ error: 'Failed to create contact' });
  }
};

export const getContact = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const contactId = Number(id);
    
    if (isNaN(contactId)) {
      return res.status(400).json({ error: 'Invalid contact ID' });
    }

    const contact = await contactService.getContactById(contactId);
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    return res.json(contact);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to get contact' });
  }
};

export const updateContact = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, companyId } = req.body;
    const contactId = Number(id);
    
    if (isNaN(contactId)) {
      return res.status(400).json({ error: 'Invalid contact ID' });
    }

    const updates: { name?: string; email?: string; companyId?: number } = {};
    if (name !== undefined) updates.name = name;
    if (email !== undefined) updates.email = email;
    if (companyId !== undefined) updates.companyId = companyId;

    const contact = await contactService.updateContact(contactId, updates);
    return res.json(contact);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Contact not found' || error.message === 'Company not found') {
        return res.status(404).json({ error: error.message });
      }
      if (error.message.includes('Validation failed')) {
        return res.status(400).json({ error: error.message });
      }
    }
    return res.status(500).json({ error: 'Failed to update contact' });
  }
};

export const deleteContact = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const contactId = Number(id);
    
    if (isNaN(contactId)) {
      return res.status(400).json({ error: 'Invalid contact ID' });
    }

    const deleted = await contactService.deleteContact(contactId);
    if (!deleted) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete contact' });
  }
};

export const listContacts = async (_req: Request, res: Response) => {
  try {
    const contacts = await contactService.listContacts();
    return res.json(contacts);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to list contacts' });
  }
};

export const listActivitiesByContact = async (req: Request, res: Response) => {
  try {
    const { contactId } = req.params;
    const contactIdNum = Number(contactId);
    
    if (isNaN(contactIdNum)) {
      return res.status(400).json({ error: 'Invalid contact ID' });
    }

    // Check if contact exists
    const contactExists = await contactService.contactExists(contactIdNum);
    if (!contactExists) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    const activities = await activityService.getActivitiesByContact(contactIdNum);
    return res.json(activities);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to list activities for contact' });
  }
}; 
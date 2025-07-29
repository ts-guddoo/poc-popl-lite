import { Request, Response } from 'express';
import { CompanyService } from '../services/companyService';
import { ActivityService } from '../services/activityService';

const companyService = new CompanyService();
const activityService = new ActivityService();

export const createCompany = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Company name is required' });
    }

    const company = await companyService.createCompany(name);
    return res.status(201).json(company);
  } catch (error) {
    if (error instanceof Error && error.message.includes('Validation failed')) {
      return res.status(400).json({ error: error.message });
    }
    return res.status(500).json({ error: 'Failed to create company' });
  }
};

export const getCompany = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const companyId = Number(id);
    
    if (isNaN(companyId)) {
      return res.status(400).json({ error: 'Invalid company ID' });
    }

    const company = await companyService.getCompanyById(companyId);
    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    return res.json(company);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to get company' });
  }
};

export const updateCompany = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const companyId = Number(id);
    
    if (isNaN(companyId)) {
      return res.status(400).json({ error: 'Invalid company ID' });
    }

    if (!name) {
      return res.status(400).json({ error: 'Company name is required' });
    }

    const company = await companyService.updateCompany(companyId, name);
    return res.json(company);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Company not found') {
        return res.status(404).json({ error: error.message });
      }
      if (error.message.includes('Validation failed')) {
        return res.status(400).json({ error: error.message });
      }
    }
    return res.status(500).json({ error: 'Failed to update company' });
  }
};

export const deleteCompany = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const companyId = Number(id);
    
    if (isNaN(companyId)) {
      return res.status(400).json({ error: 'Invalid company ID' });
    }

    const deleted = await companyService.deleteCompany(companyId);
    if (!deleted) {
      return res.status(404).json({ error: 'Company not found' });
    }

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete company' });
  }
};

export const listCompanies = async (_req: Request, res: Response) => {
  try {
    const companies = await companyService.listCompanies();
    return res.json(companies);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to list companies' });
  }
};

export const listActivitiesByCompany = async (req: Request, res: Response) => {
  try {
    const { companyId } = req.params;
    const companyIdNum = Number(companyId);
    
    if (isNaN(companyIdNum)) {
      return res.status(400).json({ error: 'Invalid company ID' });
    }

    // Check if company exists
    const companyExists = await companyService.companyExists(companyIdNum);
    if (!companyExists) {
      return res.status(404).json({ error: 'Company not found' });
    }

    const activities = await activityService.getActivitiesByCompany(companyIdNum);
    return res.json(activities);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to list activities for company' });
  }
}; 
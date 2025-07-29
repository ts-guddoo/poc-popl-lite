import { Router } from 'express';
import { createCompany, getCompany, updateCompany, deleteCompany, listCompanies, listActivitiesByCompany } from '../controllers/companyController';

const router = Router();

// POST /companies - create company
router.post('/', createCompany);

// GET /companies/:id - get company by id
router.get('/:id', getCompany);

// PUT /companies/:id - update company
router.put('/:id', updateCompany);

// DELETE /companies/:id - delete company
router.delete('/:id', deleteCompany);

// GET /companies - list all companies
router.get('/', listCompanies);

// GET /companies/:companyId/activities - list activities for a company
router.get('/:companyId/activities', listActivitiesByCompany);

export default router; 
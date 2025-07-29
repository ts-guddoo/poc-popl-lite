import { Router } from 'express';
import { createContact, getContact, updateContact, deleteContact, listContacts, listActivitiesByContact } from '../controllers/contactController';

const router = Router();

// POST /contacts - create contact
router.post('/', createContact);

// GET /contacts/:id - get contact by id
router.get('/:id', getContact);

// PUT /contacts/:id - update contact
router.put('/:id', updateContact);

// DELETE /contacts/:id - delete contact
router.delete('/:id', deleteContact);

// GET /contacts - list all contacts
router.get('/', listContacts);

// GET /contacts/:contactId/activities - list activities for a contact
router.get('/:contactId/activities', listActivitiesByContact);

export default router; 
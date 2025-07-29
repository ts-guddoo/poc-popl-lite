import { AppDataSource } from '../app';
import { Contact } from '../models/Contact';
import { Company } from '../models/Company';
import { validate } from 'class-validator';

export class ContactService {
  private get contactRepository() {
    return AppDataSource.getRepository(Contact);
  }

  private get companyRepository() {
    return AppDataSource.getRepository(Company);
  }

  async createContact(name: string, email: string, companyId: number): Promise<Contact> {
    const company = await this.companyRepository.findOneBy({ id: companyId });
    if (!company) {
      throw new Error('Company not found');
    }

    const contact = new Contact();
    contact.name = name;
    contact.email = email;
    contact.company = company;

    const errors = await validate(contact);
    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.map(e => Object.values(e.constraints || {})).flat().join(', ')}`);
    }

    return await this.contactRepository.save(contact);
  }

  async getContactById(id: number): Promise<Contact | null> {
    return await this.contactRepository.findOne({ 
      where: { id }, 
      relations: ['company', 'activities'] 
    });
  }

  async updateContact(id: number, updates: { name?: string; email?: string; companyId?: number }): Promise<Contact> {
    const contact = await this.contactRepository.findOne({ 
      where: { id }, 
      relations: ['company'] 
    });
    
    if (!contact) {
      throw new Error('Contact not found');
    }

    if (updates.companyId) {
      const company = await this.companyRepository.findOneBy({ id: updates.companyId });
      if (!company) {
        throw new Error('Company not found');
      }
      contact.company = company;
    }

    if (updates.name !== undefined) contact.name = updates.name;
    if (updates.email !== undefined) contact.email = updates.email;

    const errors = await validate(contact);
    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.map(e => Object.values(e.constraints || {})).flat().join(', ')}`);
    }

    return await this.contactRepository.save(contact);
  }

  async deleteContact(id: number): Promise<boolean> {
    const result = await this.contactRepository.delete(id);
    return result.affected !== 0;
  }

  async listContacts(): Promise<Contact[]> {
    return await this.contactRepository.find({ relations: ['company'] });
  }

  async contactExists(id: number): Promise<boolean> {
    const count = await this.contactRepository.count({ where: { id } });
    return count > 0;
  }

  async getContactsByCompany(companyId: number): Promise<Contact[]> {
    return await this.contactRepository.find({ 
      where: { company: { id: companyId } },
      relations: ['company']
    });
  }
} 
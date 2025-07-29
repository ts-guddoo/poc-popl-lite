import { AppDataSource } from '../app';
import { Activity } from '../models/Activity';
import { Contact } from '../models/Contact';
import { validate } from 'class-validator';

export class ActivityService {
  private get activityRepository() {
    return AppDataSource.getRepository(Activity);
  }

  private get contactRepository() {
    return AppDataSource.getRepository(Contact);
  }

  async createActivity(name: string | undefined, timestamp: string, note: string, contactId: number): Promise<Activity> {
    const contact = await this.contactRepository.findOneBy({ id: contactId });
    if (!contact) {
      throw new Error('Contact not found');
    }

    const activity = new Activity();
    activity.name = name;
    activity.timestamp = new Date(Math.floor(new Date(timestamp).getTime() / 1000) * 1000); // seconds granularity
    activity.note = note;
    activity.contact = contact;

    const errors = await validate(activity);
    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.map(e => Object.values(e.constraints || {})).flat().join(', ')}`);
    }

    return await this.activityRepository.save(activity);
  }

  async getActivitiesByContact(contactId: number): Promise<Activity[]> {
    return await this.activityRepository.find({
      where: { contact: { id: contactId } },
      order: { id: 'ASC' }, // Order by creation time (database insertion order)
      relations: ['contact']
    });
  }

  async getActivitiesByCompany(companyId: number): Promise<Activity[]> {
    // First get all contacts for the company
    const contacts = await this.contactRepository.find({ 
      where: { company: { id: companyId } } 
    });
    
    if (contacts.length === 0) {
      return [];
    }

    const contactIds = contacts.map(c => c.id);
    
    // Then get all activities for those contacts, ordered by creation time
    return await this.activityRepository
      .createQueryBuilder('activity')
      .leftJoinAndSelect('activity.contact', 'contact')
      .where('activity.contactId IN (:...contactIds)', { contactIds })
      .orderBy('activity.id', 'ASC') // Order by creation time (database insertion order)
      .getMany();
  }

  async activityExists(id: number): Promise<boolean> {
    const count = await this.activityRepository.count({ where: { id } });
    return count > 0;
  }
} 
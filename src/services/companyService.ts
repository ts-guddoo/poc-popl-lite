import { AppDataSource } from "../app";
import { Company } from "../models/Company";
import { validate } from "class-validator";

export class CompanyService {
  private get companyRepository() {
    return AppDataSource.getRepository(Company);
  }

  async createCompany(name: string): Promise<Company> {
    const company = new Company();
    company.name = name;

    const errors = await validate(company);
    if (errors.length > 0) {
      throw new Error(
        `Validation failed: ${errors
          .map((e) => Object.values(e.constraints || {}))
          .flat()
          .join(", ")}`
      );
    }

    return await this.companyRepository.save(company);
  }

  async getCompanyById(id: number): Promise<Company | null> {
    return await this.companyRepository.findOne({
      where: { id },
      relations: ["contacts"],
    });
  }

  async updateCompany(id: number, name: string): Promise<Company> {
    const company = await this.companyRepository.findOneBy({ id });
    if (!company) {
      throw new Error("Company not found");
    }

    company.name = name;
    const errors = await validate(company);
    if (errors.length > 0) {
      throw new Error(
        `Validation failed: ${errors
          .map((e) => Object.values(e.constraints || {}))
          .flat()
          .join(", ")}`
      );
    }

    return await this.companyRepository.save(company);
  }

  async deleteCompany(id: number): Promise<boolean> {
    const result = await this.companyRepository.delete(id);
    return result.affected !== 0;
  }

  async listCompanies(): Promise<Company[]> {
    return await this.companyRepository.find();
  }

  async companyExists(id: number): Promise<boolean> {
    const count = await this.companyRepository.count({ where: { id } });
    return count > 0;
  }
}

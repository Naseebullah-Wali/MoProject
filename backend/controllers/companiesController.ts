import express from 'express';
import Company from '../models/Companies';
import Country from '../models/Countries';
import Region from '../models/Region';

export class companyControllers {
  public static createCompany = async (req: express.Request, res: express.Response) => {
    try {
      const { Company_Name, Company_Logo, About, Country_ID, Region_ID } = req.body;

      const newCompany = await Company.create({
        Company_Name,
        Company_Logo,
        About,
        Country_ID,
        Region_ID,
      });

      res.status(201).json({ message: 'Company created successfully', data: newCompany });
    } catch (error) {
      console.error('Error creating company:', error);
      res.status(500).json({ message: 'Internal server error', error });
    }
  };

  public static getAllCompanies = async (req: express.Request, res: express.Response) => {
    try {
      const companies = await Company.findAll({
        include: [
          { model: Country, attributes: ['Country_Name'] },
          { model: Region, attributes: ['Region_Name'] },
        ],
      });

      res.status(200).json(companies);
    } catch (error) {
      console.error('Error fetching companies:', error);
      res.status(500).json({ message: 'Internal server error', error });
    }
  };

  public static getCompanyById = async (req: express.Request, res: express.Response) => {
    try {
      const company = await Company.findOne({
        where: { id: req.params.id },
        include: [
          { model: Country, attributes: ['Country_Name'] },
          { model: Region, attributes: ['Region_Name'] },
        ],
      });

      if (!company) {
        return res.status(404).json({ message: 'Company not found' });
      }

      res.status(200).json(company);
    } catch (error) {
      console.error('Error fetching company:', error);
      res.status(500).json({ message: 'Internal server error', error });
    }
  };

  public static updateCompany = async (req: express.Request, res: express.Response) => {
    try {
      const { Company_Name, Company_Logo, About, Country_ID, Region_ID } = req.body;

      const company = await Company.findOne({ where: { id: req.params.id } });

      if (!company) {
        return res.status(404).json({ message: 'Company not found' });
      }

      company.Company_Name = Company_Name;
      company.Company_Logo = Company_Logo;
      company.About = About;
      company.Country_ID = Country_ID;
      company.Region_ID = Region_ID;

      await company.save();

      res.status(200).json({ message: 'Company updated successfully', data: company });
    } catch (error) {
      console.error('Error updating company:', error);
      res.status(500).json({ message: 'Internal server error', error });
    }
  };

  public static deleteCompany = async (req: express.Request, res: express.Response) => {
    try {
      const company = await Company.findOne({ where: { id: req.params.id } });

      if (!company) {
        return res.status(404).json({ message: 'Company not found' });
      }

      await company.destroy();
      res.status(200).json({ message: 'Company deleted successfully' });
    } catch (error) {
      console.error('Error deleting company:', error);
      res.status(500).json({ message: 'Internal server error', error });
    }
  };
}

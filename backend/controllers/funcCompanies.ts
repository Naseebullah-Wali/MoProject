import express from "express";
import { supabase } from "../dbConfig/dbConfig";
import { v4 as uuidv4 } from 'uuid';

interface Country {
  id: number;
  name: string;
}

interface Company {
  id?: number;
  Company_Name: string;
  Company_Logo: string;
  About: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface CompanyCountryRelation {
  Company_ID: number;
  Country_ID: number;
}

export class CompaniesController {
  public static async getAllCompanies(req: express.Request, res: express.Response) {
    try {
      let { data: companies, error: companiesError } = await supabase
        .from("Companies")
        .select("*")
        .order('createdAt', { ascending: false });

      if (companiesError) {
        console.error("Error fetching companies:", companiesError);
        return res.status(500).json({ message: "Failed to fetch companies", error: companiesError });
      }

      if (!companies || companies.length === 0) {
        return res.status(404).json({ message: "No companies found" });
      }

      // Fetch company-country relations
      let { data: companyCountryRelations, error: relationsError } = await supabase
        .from("Companies_Countries")
        .select("Company_ID, Country_ID");

      if (relationsError || !companyCountryRelations) {
        console.error("Error fetching company-country relations:", relationsError);
        return res.status(500).json({ message: "Failed to fetch company-country relations", error: relationsError });
      }

      let { data: countries, error: countriesError } = await supabase
        .from("Countries")
        .select("id, Country_Name");

      if (countriesError || !countries) {
        console.error("Error fetching countries:", countriesError);
        return res.status(500).json({ message: "Failed to fetch countries", error: countriesError });
      }

      const companiesWithCountries = companies.map(company => {
        const relations = companyCountryRelations.filter(rel => rel.Company_ID === company.id);
        const countryNames = relations.map(rel => {
          const country = countries.find(country => country.id === rel.Country_ID);
          return country ? country.Country_Name : null;
        }).filter(name => name !== null);

        return {
          ...company,
          Country_Names: countryNames.join(', ')
        };
      });

      res.json(companiesWithCountries);
    } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ message: "Server error", error });
    }
  }

  public static async getCompanyById(req: express.Request, res: express.Response) {
    try {
      const companyId = req.params.id;

      if (!companyId) {
        return res.status(400).json({ message: "Company ID is required" });
      }
      let { data: company, error: companyError } = await supabase
        .from("Companies")
        .select("*")
        .eq("id", companyId)
        .single();

      if (companyError) {
        console.error("Error fetching company:", companyError);
        return res.status(500).json({ message: "Failed to fetch company", error: companyError });
      }

      if (!company) {
        return res.status(404).json({ message: "Company not found" });
      }

      // Fetch the company-country relations
      let { data: relations, error: relationError } = await supabase
        .from("Companies_Countries")
        .select("Country_ID")
        .eq("Company_ID", companyId);

      if (relationError || !relations) {
        console.error("Error fetching company-country relations:", relationError);
        return res.status(500).json({ message: "Failed to fetch company-country relations", error: relationError });
      }

      let { data: countries, error: countriesError } = await supabase
        .from("Countries")
        .select("name")
        .in("id", relations.map(rel => rel.Country_ID));

      if (countriesError || !countries) {
        console.error("Error fetching countries:", countriesError);
        return res.status(500).json({ message: "Failed to fetch countries", error: countriesError });
      }

      const countryNames = countries.map(country => country.name).join(', ');

      res.json({ ...company, Country_Names: countryNames });
    } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ message: "Server error", error });
    }
  }

  public static async addCompany(req: express.Request, res: express.Response) {
    try {
      const { Company_Name, About, Country_Ids }: { Company_Name: string, About: string, Country_Ids: number[] } = req.body;
      const file = req.file;

      if (!Company_Name || !file || !About || !Country_Ids || Country_Ids.length === 0) {
        return res.status(400).json({ message: "Company Name, Logo, About, and at least one Country are required" });
      }

      // Upload file to Supabase Storage
      const filePath = `company_logos/${uuidv4()}-${file.originalname}`;
      let { error: uploadError } = await supabase.storage.from('FilesFromFrontEnd').upload(filePath, file.buffer, {
        cacheControl: '3600',
        upsert: false
      });

      if (uploadError) {
        console.error("Error uploading file:", uploadError);
        return res.status(500).json({ message: "Failed to upload company logo", error: uploadError });
      }

      // Get the public URL of the uploaded file
      const { data: urlData } = supabase.storage.from('FilesFromFrontEnd').getPublicUrl(filePath);

      if (!urlData) {
        console.error("Error getting public URL:");
        return res.status(500).json({ message: "Failed to get public URL for company logo" });
      }

      // Save company data with the logo URL
      let { data: companyData, error: insertError } = await supabase.from("Companies").insert([
        { Company_Name, Company_Logo: urlData.publicUrl, About, createdAt: new Date(), updatedAt: new Date() }
      ]).select();

      if (insertError || !companyData || companyData.length === 0) {
        console.error("Error adding company:", insertError);
        return res.status(500).json({ message: "Failed to add company", error: insertError });
      }

      const companyCountryData: CompanyCountryRelation[] = Country_Ids.map(Country_Id => ({
        Company_ID: companyData[0].id,
        Country_ID: Country_Id
      }));

      let { error: relationError } = await supabase.from("Companies_Countries").insert(companyCountryData);

      if (relationError) {
        console.error("Error adding company-country relation:", relationError);
        return res.status(500).json({ message: "Failed to add company-country relation", error: relationError });
      }

      res.status(201).json(companyData);
    } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ message: "Server error", error });
    }
  }

  public static async updateCompany(req: express.Request, res: express.Response) {
    try {
      const companyId = req.params.id;
      const { Company_Name, About, Country_Ids }: { Company_Name: string, About: string, Country_Ids: number[] } = req.body;
      const file = req.file;

      if (!companyId) {
        return res.status(400).json({ message: "Company ID is required" });
      }

      let companyData: Partial<Company> = { Company_Name, About, updatedAt: new Date() };

      // If a new file is uploaded, update the logo
      if (file) {
        const filePath = `company_logos/${uuidv4()}-${file.originalname}`;
        let { error: uploadError } = await supabase.storage.from('FilesFromFrontEnd').upload(filePath, file.buffer, {
          cacheControl: '3600',
          upsert: false
        });

        if (uploadError) {
          console.error("Error uploading file:", uploadError);
          return res.status(500).json({ message: "Failed to upload company logo", error: uploadError });
        }

        const { data: urlData } = supabase.storage.from('FilesFromFrontEnd').getPublicUrl(filePath);

        if (!urlData) {
          console.error("Error getting public URL:");
          return res.status(500).json({ message: "Failed to get public URL for company logo" });
        }

        companyData.Company_Logo = urlData.publicUrl;
      }

      let { data, error } = await supabase.from("Companies").update(companyData).eq("id", companyId).select();

      if (error) {
        console.error("Error updating company:", error);
        return res.status(500).json({ message: "Failed to update company", error });
      }

      // Update Companies_Countries table
      let { error: deleteRelationError } = await supabase.from("Companies_Countries").delete().eq("Company_ID", companyId);

      if (deleteRelationError) {
        console.error("Error deleting company-country relations:", deleteRelationError);
        return res.status(500).json({ message: "Failed to delete company-country relations", error: deleteRelationError });
      }

      const companyCountryData: CompanyCountryRelation[] = Country_Ids.map(Country_Id => ({
        Company_ID: parseInt(companyId),
        Country_ID: Country_Id
      }));

      let { error: insertRelationError } = await supabase.from("Companies_Countries").insert(companyCountryData);

      if (insertRelationError) {
        console.error("Error adding company-country relations:", insertRelationError);
        return res.status(500).json({ message: "Failed to add company-country relations", error: insertRelationError });
      }

      res.json(data);
    } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ message: "Server error", error });
    }
  }

  public static async deleteCompany(req: express.Request, res: express.Response) {
    try {
      const companyId = req.params.id;

      if (!companyId) {
        return res.status(400).json({ message: "Company ID is required" });
      }

      let { data, error } = await supabase.from("Companies").update({ Is_Deleted: true, updatedAt: new Date() }).eq("id", companyId).select();

      if (error) {
        console.error("Error deleting company:", error);
        return res.status(500).json({ message: "Failed to delete company", error });
      }

      res.json({ message: "Company deleted successfully", data });
    } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ message: "Server error", error });
    }
  }
}

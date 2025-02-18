import express from "express";
import { supabase } from "../dbConfig/dbConfig";

export class CompaniesController {
  // Get all companies
  public static async getAllCompanies(req: express.Request, res: express.Response) {
    try {
      let { data, error } = await supabase.from("Companies").select("*");

      if (error) {
        console.error("Error fetching companies:", error);
        return res.status(500).json({ message: "Failed to fetch companies", error });
      }

      if (!data || data.length === 0) {
        return res.status(404).json({ message: "No companies found" });
      }

      res.json(data);
    } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ message: "Server error", error });
    }
  }

  // Get company by ID
  public static async getCompanyById(req: express.Request, res: express.Response) {
    try {
      const companyId = req.params.id;

      if (!companyId) {
        return res.status(400).json({ message: "Company ID is required" });
      }

      let { data, error } = await supabase.from("Companies").select("*").eq("id", companyId).single();

      if (error) {
        console.error("Error fetching company:", error);
        return res.status(500).json({ message: "Failed to fetch company", error });
      }

      if (!data) {
        return res.status(404).json({ message: "Company not found" });
      }

      res.json(data);
    } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ message: "Server error", error });
    }
  }

  // Add a new company
  public static async addCompany(req: express.Request, res: express.Response) {
    try {
      const { Company_Name, Company_Logo, About } = req.body;

      if (!Company_Name || !Company_Logo || !About) {
        // console.log(req.body)
        return res.status(400).json({ message: "Company Name, Logo, and About are required" });
      }

      let { data, error } = await supabase.from("Companies").insert([
        { Company_Name, Company_Logo, About, createdAt: new Date(), updatedAt: new Date() }
      ]).select();

      if (error) {
        console.error("Error adding company:", error);
        return res.status(500).json({ message: "Failed to add company", error });
      }

      res.status(201).json(data);
    } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ message: "Server error", error });
    }
  }

  // Update company details
  public static async updateCompany(req: express.Request, res: express.Response) {
    try {
      const companyId = req.params.id;
      const { Company_Name, Company_Logo, About } = req.body;

      if (!companyId) {
        return res.status(400).json({ message: "Company ID is required" });
      }

      let { data, error } = await supabase.from("Companies").update({
        Company_Name,
        Company_Logo,
        About,
        updatedAt: new Date()
      }).eq("id", companyId).select();

      if (error) {
        console.error("Error updating company:", error);
        return res.status(500).json({ message: "Failed to update company", error });
      }

      res.json(data);
    } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ message: "Server error", error });
    }
  }

  // Delete company (soft delete)
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




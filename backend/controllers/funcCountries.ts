import express from "express";
import { supabase } from "../dbConfig/dbConfig";
import { v4 as uuidv4 } from 'uuid';

export class CountriesController {
  // Get all countries
  public static async getAllCountries(req: express.Request, res: express.Response) {
    try {
      let { data, error } = await supabase.from("Countries").select("*");

      if (error) {
        console.error("Error fetching countries:", error);
        return res.status(500).json({ message: "Failed to fetch countries", error });
      }

      if (!data || data.length === 0) {
        return res.status(404).json({ message: "No countries found" });
      }

      res.json(data);
    } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ message: "Server error", error });
    }
  }

  // Get country by ID
  public static async getCountryById(req: express.Request, res: express.Response) {
    try {
      const countryId = req.params.id;

      if (!countryId) {
        return res.status(400).json({ message: "Country ID is required" });
      }

      let { data, error } = await supabase.from("Countries").select("*").eq("id", countryId).single();

      if (error) {
        console.error("Error fetching country:", error);
        return res.status(500).json({ message: "Failed to fetch country", error });
      }

      if (!data) {
        return res.status(404).json({ message: "Country not found" });
      }

      res.json(data);
    } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ message: "Server error", error });
    }
  }

  // Add a new country
  public static async addCountry(req: express.Request, res: express.Response) {
    try {
      const { Country_Name } = req.body;
      const file = req.file;

      if (!Country_Name || !file) {
        return res.status(400).json({ message: "Country Name and Flag are required" });
      }

      // Upload file to Supabase Storage
      const filePath = `country_flags/${uuidv4()}-${file.originalname}`;
      const { error: uploadError } = await supabase.storage.from('FilesFromFrontEnd').upload(filePath, file.buffer, {
        cacheControl: '3600',
        upsert: false
      });

      if (uploadError) {
        console.error("Error uploading file:", uploadError);
        return res.status(500).json({ message: "Failed to upload country flag", error: uploadError });
      }

      // Get the public URL of the uploaded file
      const { data: urlData } = supabase.storage.from('FilesFromFrontEnd').getPublicUrl(filePath);

      if (!urlData) {
        console.error("Error getting public URL:");
        return res.status(500).json({ message: "Failed to get public URL for country flag" });
      }

      // Save country data with the flag URL
      let { data, error } = await supabase.from("Countries").insert([
        { Country_Name, Flag: urlData.publicUrl, createdAt: new Date(), updatedAt: new Date() }
      ]).select();

      if (error) {
        console.error("Error adding country:", error);
        return res.status(500).json({ message: "Failed to add country", error });
      }

      res.status(201).json(data);
    } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ message: "Server error", error });
    }
  }

  // Update country details
  public static async updateCountry(req: express.Request, res: express.Response) {
    try {
      const countryId = req.params.id;
      const { Country_Name } = req.body;
      const file = req.file;
      const Flag = ''

      if (!countryId) {
        return res.status(400).json({ message: "Country ID is required" });
      }

      let countryData = { Country_Name, Flag, updatedAt: new Date() };

      // If a new file is uploaded, update the flag
      if (file) {
        const filePath = `country_flags/${uuidv4()}-${file.originalname}`;
        const { error: uploadError } = await supabase.storage.from('FilesFromFrontEnd').upload(filePath, file.buffer, {
          cacheControl: '3600',
          upsert: false
        });

        if (uploadError) {
          console.error("Error uploading file:", uploadError);
          return res.status(500).json({ message: "Failed to upload country flag", error: uploadError });
        }

        const { data: urlData } = supabase.storage.from('FilesFromFrontEnd').getPublicUrl(filePath);

        if (!urlData) {
          console.error("Error getting public URL:");
          return res.status(500).json({ message: "Failed to get public URL for country flag" });
        }

        countryData.Flag = urlData.publicUrl;
      }

      let { data, error } = await supabase.from("Countries").update(countryData).eq("id", countryId).select();

      if (error) {
        console.error("Error updating country:", error);
        return res.status(500).json({ message: "Failed to update country", error });
      }

      res.json(data);
    } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ message: "Server error", error });
    }
  }

  // Delete country (soft delete)
  public static async deleteCountry(req: express.Request, res: express.Response) {
    try {
      const countryId = req.params.id;

      if (!countryId) {
        return res.status(400).json({ message: "Country ID is required" });
      }

      let { data, error } = await supabase.from("Countries").update({ Is_Deleted: true, updatedAt: new Date() }).eq("id", countryId).select();

      if (error) {
        console.error("Error deleting country:", error);
        return res.status(500).json({ message: "Failed to delete country", error });
      }

      res.json({ message: "Country deleted successfully", data });
    } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ message: "Server error", error });
    }
  }
}

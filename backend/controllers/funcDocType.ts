import express from "express";
import { supabase } from "../dbConfig/dbConfig";

export class DocumentTypeController {
  public static async getAllDocumentTypes(req: express.Request, res: express.Response) {
    try {
      let { data, error } = await supabase
        .from("Document_Types")
        .select("*")
        .eq("Is_Deleted", false); 

      if (error) {
        console.error("Error fetching document types:", error);
        return res.status(500).json({ message: "Failed to fetch document types", error });
      }

      if (!data || data.length === 0) {
        return res.status(404).json({ message: "No document types found" });
      }

      res.json(data);
    } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ message: "Server error", error });
    }
  }

  public static async getDocumentTypeById(req: express.Request, res: express.Response) {
    try {
      const docTypeId = req.params.id;

      if (!docTypeId) {
        return res.status(400).json({ message: "Document Type ID is required" });
      }

      let { data, error } = await supabase
        .from("Document_Types")
        .select("*")
        .eq("id", docTypeId)
        .eq("Is_Deleted", false)
        .single();

      if (error) {
        console.error("Error fetching document type:", error);
        return res.status(500).json({ message: "Failed to fetch document type", error });
      }

      if (!data) {
        return res.status(404).json({ message: "Document type not found" });
      }

      res.json(data);
    } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ message: "Server error", error });
    }
  }

  public static async addDocumentType(req: express.Request, res: express.Response) {
    try {
      const { Doc_Type } = req.body;

      if (!Doc_Type) {
        return res.status(400).json({ message: "Document Type is required" });
      }

      let { data, error } = await supabase
        .from("Document_Types")
        .insert([{
          Doc_Type,
          Is_Deleted: false
        }])
        .select();

      if (error) {
        console.error("Error adding document type:", error);
        return res.status(500).json({ message: "Failed to add document type", error });
      }

      res.status(201).json(data);
    } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ message: "Server error", error });
    }
  }

  public static async updateDocumentType(req: express.Request, res: express.Response) {
    try {
      const docTypeId = req.params.id;
      const { Doc_Type } = req.body;

      if (!docTypeId) {
        return res.status(400).json({ message: "Document Type ID is required" });
      }

      let { data, error } = await supabase
        .from("Document_Types")
        .update({
          Doc_Type
        })
        .eq("id", docTypeId)
        .eq("Is_Deleted", false)
        .select();

      if (error) {
        console.error("Error updating document type:", error);
        return res.status(500).json({ message: "Failed to update document type", error });
      }

      res.json(data);
    } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ message: "Server error", error });
    }
  }

  public static async deleteDocumentType(req: express.Request, res: express.Response) {
    try {
      const docTypeId = req.params.id;

      if (!docTypeId) {
        return res.status(400).json({ message: "Document Type ID is required" });
      }

      let { data, error } = await supabase
        .from("Document_Types")
        .update({ Is_Deleted: true }) // Soft delete instead of hard delete
        .eq("id", docTypeId)
        .select();

      if (error) {
        console.error("Error deleting document type:", error);
        return res.status(500).json({ message: "Failed to delete document type", error });
      }

      res.json({ message: "Document type deleted successfully", data });
    } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ message: "Server error", error });
    }
  }
}

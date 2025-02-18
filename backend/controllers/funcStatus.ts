import express from "express";
import { supabase } from "../dbConfig/dbConfig";

export class StatusController {
  // Get all statuses (excluding soft deleted)
  public static async getAllStatuses(req: express.Request, res: express.Response) {
    try {
      let { data, error } = await supabase
        .from("Statuses")
        .select("*")
        .eq("Is_Deleted", false); // Exclude deleted statuses

      if (error) {
        console.error("Error fetching statuses:", error);
        return res.status(500).json({ message: "Failed to fetch statuses", error });
      }

      if (!data || data.length === 0) {
        return res.status(404).json({ message: "No statuses found" });
      }

      res.json(data);
    } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ message: "Server error", error });
    }
  }

  // Get status by ID (only if not deleted)
  public static async getStatusById(req: express.Request, res: express.Response) {
    try {
      const statusId = req.params.id;

      if (!statusId) {
        return res.status(400).json({ message: "Status ID is required" });
      }

      let { data, error } = await supabase
        .from("Statuses")
        .select("*")
        .eq("id", statusId)
        .eq("Is_Deleted", false)
        .single();

      if (error) {
        console.error("Error fetching status:", error);
        return res.status(500).json({ message: "Failed to fetch status", error });
      }

      if (!data) {
        return res.status(404).json({ message: "Status not found" });
      }

      res.json(data);
    } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ message: "Server error", error });
    }
  }

  // Add a new status
  public static async addStatus(req: express.Request, res: express.Response) {
    try {
      const { Status_Name } = req.body;

      if (!Status_Name) {
        return res.status(400).json({ message: "Status Name is required" });
      }

      let { data, error } = await supabase
        .from("Statuses")
        .insert([{ Status_Name, Is_Deleted: false, createdAt: new Date(), updatedAt: new Date() }])
        .select();

      if (error) {
        console.error("Error adding status:", error);
        return res.status(500).json({ message: "Failed to add status", error });
      }

      res.status(201).json(data);
    } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ message: "Server error", error });
    }
  }

  // Update status details
  public static async updateStatus(req: express.Request, res: express.Response) {
    try {
      const statusId = req.params.id;
      const { Status_Name } = req.body;

      if (!statusId) {
        return res.status(400).json({ message: "Status ID is required" });
      }

      let { data, error } = await supabase
        .from("Statuses")
        .update({ Status_Name, updatedAt: new Date() }) // Fix typo: updateAt → updatedAt
        .eq("id", statusId)
        .eq("Is_Deleted", false)
        .select();

      if (error) {
        console.error("Error updating status:", error);
        return res.status(500).json({ message: "Failed to update status", error });
      }

      res.json(data);
    } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ message: "Server error", error });
    }
  }

  // Soft delete status
  public static async deleteStatus(req: express.Request, res: express.Response) {
    try {
      const statusId = req.params.id;

      if (!statusId) {
        return res.status(400).json({ message: "Status ID is required" });
      }

      let { data, error } = await supabase
        .from("Statuses")
        .update({ Is_Deleted: true, updatedAt: new Date() }) // Soft delete instead of hard delete
        .eq("id", statusId)
        .select();

      if (error) {
        console.error("Error deleting status:", error);
        return res.status(500).json({ message: "Failed to delete status", error });
      }

      res.json({ message: "Status deleted successfully", data });
    } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ message: "Server error", error });
    }
  }
}

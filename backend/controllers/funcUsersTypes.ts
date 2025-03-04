import express from "express";
import { supabase } from "../dbConfig/dbConfig";

export class UserTypesController {
  // Get all user types
  public static async getAllUserTypes(req: express.Request, res: express.Response) {
    try {
      let { data, error } = await supabase
        .from("Users_Types")
        .select("*");

      if (error) {
        console.error("Error fetching user types:", error);
        return res.status(500).json({ message: "Failed to fetch user types", error });
      }

      if (!data || data.length === 0) {
        return res.status(404).json({ message: "No user types found" });
      }

      res.json(data);
    } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ message: "Server error", error });
    }
  }

  // Get user type by ID
  public static async getUserTypeById(req: express.Request, res: express.Response) {
    try {
      const userTypeId = req.params.id;

      if (!userTypeId) {
        return res.status(400).json({ message: "User Type ID is required" });
      }

      let { data, error } = await supabase
        .from("Users_Types")
        .select("*")
        .eq("id", userTypeId)
        .single();

      if (error) {
        console.error("Error fetching user type:", error);
        return res.status(500).json({ message: "Failed to fetch user type", error });
      }

      if (!data) {
        return res.status(404).json({ message: "User type not found" });
      }

      res.json(data);
    } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ message: "Server error", error });
    }
  }

  // Add a new user type
  public static async addUserType(req: express.Request, res: express.Response) {
    try {
      const { User_Type } = req.body;

      if (!User_Type) {
        return res.status(400).json({ message: "User Type is required" });
      }

      let { data, error } = await supabase
        .from("Users_Types")
        .insert([{ User_Type }])
        .select();

      if (error) {
        console.error("Error adding user type:", error);
        return res.status(500).json({ message: "Failed to add user type", error });
      }

      res.status(201).json(data);
    } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ message: "Server error", error });
    }
  }

  // Update user type details
  public static async updateUserType(req: express.Request, res: express.Response) {
    try {
      const userTypeId = req.params.id;
      const { User_Type } = req.body;

      if (!userTypeId) {
        return res.status(400).json({ message: "User Type ID is required" });
      }

      let { data, error } = await supabase
        .from("Users_Types")
        .update({ User_Type })
        .eq("id", userTypeId)
        .select();

      if (error) {
        console.error("Error updating user type:", error);
        return res.status(500).json({ message: "Failed to update user type", error });
      }

      res.json(data);
    } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ message: "Server error", error });
    }
  }

  // Delete user type
  public static async deleteUserType(req: express.Request, res: express.Response) {
    try {
      const userTypeId = req.params.id;

      if (!userTypeId) {
        return res.status(400).json({ message: "User Type ID is required" });
      }

      let { data, error } = await supabase
        .from("Users_Types")
        .delete()
        .eq("id", userTypeId)
        .select();

      if (error) {
        console.error("Error deleting user type:", error);
        return res.status(500).json({ message: "Failed to delete user type", error });
      }

      res.json({ message: "User type deleted successfully", data });
    } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ message: "Server error", error });
    }
  }
}

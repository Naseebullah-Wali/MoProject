import express from "express";
import { supabase } from "../dbConfig/dbConfig";

export class CharactersController {
  public static async getAllCharacters(req: express.Request, res: express.Response) {
    try {
      let { data, error } = await supabase
        .from("Characters")
        .select("*")
        .eq("Is_Deleted", false); // Exclude deleted characters

      if (error) {
        console.error("Error fetching characters:", error);
        return res.status(500).json({ message: "Failed to fetch characters", error });
      }

      if (!data || data.length === 0) {
        return res.status(404).json({ message: "No characters found" });
      }

      res.json(data);
    } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ message: "Server error", error });
    }
  }

  public static async getCharacterById(req: express.Request, res: express.Response) {
    try {
      const characterId = req.params.id;

      if (!characterId) {
        return res.status(400).json({ message: "Character ID is required" });
      }

      let { data, error } = await supabase
        .from("Characters")
        .select("*")
        .eq("id", characterId)
        .eq("Is_Deleted", false)
        .single();

      if (error) {
        console.error("Error fetching character:", error);
        return res.status(500).json({ message: "Failed to fetch character", error });
      }

      if (!data) {
        return res.status(404).json({ message: "Character not found" });
      }

      res.json(data);
    } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ message: "Server error", error });
    }
  }

  public static async addCharacter(req: express.Request, res: express.Response) {
    try {
      const { Character_name } = req.body;

      if (!Character_name) {
        return res.status(400).json({ message: "Character Name is required" });
      }

      let { data, error } = await supabase
        .from("Characters")
        .insert([{ 
          Character_name, 
          Is_Deleted: false, 
          createdAt: new Date(), 
          updatedAt: new Date() 
        }])
        .select();

      if (error) {
        console.error("Error adding character:", error);
        return res.status(500).json({ message: "Failed to add character", error });
      }

      res.status(201).json(data);
    } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ message: "Server error", error });
    }
  }

  public static async updateCharacter(req: express.Request, res: express.Response) {
    try {
      const characterId = req.params.id;
      const { Character_name } = req.body;

      if (!characterId) {
        return res.status(400).json({ message: "Character ID is required" });
      }

      let { data, error } = await supabase
        .from("Characters")
        .update({ 
          Character_name, 
          updatedAt: new Date() 
        })
        .eq("id", characterId)
        .eq("Is_Deleted", false)
        .select();

      if (error) {
        console.error("Error updating character:", error);
        return res.status(500).json({ message: "Failed to update character", error });
      }

      res.json(data);
    } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ message: "Server error", error });
    }
  }

  public static async deleteCharacter(req: express.Request, res: express.Response) {
    try {
      const characterId = req.params.id;

      if (!characterId) {
        return res.status(400).json({ message: "Character ID is required" });
      }

      let { data, error } = await supabase
        .from("Characters")
        .update({ Is_Deleted: true, updatedAt: new Date() }) // Soft delete instead of hard delete
        .eq("id", characterId)
        .select();

      if (error) {
        console.error("Error deleting character:", error);
        return res.status(500).json({ message: "Failed to delete character", error });
      }

      res.json({ message: "Character deleted successfully", data });
    } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ message: "Server error", error });
    }
  }
}

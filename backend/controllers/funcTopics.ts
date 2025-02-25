import express from "express";
import { supabase } from "../dbConfig/dbConfig";

export class TopicsController {
  // Get all topics (excluding soft-deleted)
  public static async getAllTopics(req: express.Request, res: express.Response) {
    try {
      let { data, error } = await supabase
        .from("Topics")
        .select("*")
        .eq("Is_Deleted", false); // Exclude deleted topics

      if (error) {
        console.error("Error fetching topics:", error);
        return res.status(500).json({ message: "Failed to fetch topics", error });
      }

      if (!data || data.length === 0) {
        return res.status(404).json({ message: "No topics found" });
      }

      res.json(data);
    } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ message: "Server error", error });
    }
  }

  // Get topic by ID (only if not deleted)
  public static async getTopicById(req: express.Request, res: express.Response) {
    try {
      const topicId = req.params.id;

      if (!topicId) {
        return res.status(400).json({ message: "Topic ID is required" });
      }

      let { data, error } = await supabase
        .from("Topics")
        .select("*")
        .eq("id", topicId)
        .eq("Is_Deleted", false)
        .single();

      if (error) {
        console.error("Error fetching topic:", error);
        return res.status(500).json({ message: "Failed to fetch topic", error });
      }

      if (!data) {
        return res.status(404).json({ message: "Topic not found" });
      }

      res.json(data);
    } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ message: "Server error", error });
    }
  }

  // Add a new topic
  public static async addTopic(req: express.Request, res: express.Response) {
    try {
      const { Topic } = req.body;

      if (!Topic) {
        return res.status(400).json({ message: "Topic is required" });
      }

      let { data, error } = await supabase
        .from("Topics")
        .insert([{
          Topic,
          Is_Deleted: false,
          createdAt: new Date(),
          updatedAt: new Date()
        }])
        .select();

      if (error) {
        console.error("Error adding topic:", error);
        return res.status(500).json({ message: "Failed to add topic", error });
      }

      res.status(201).json(data);
    } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ message: "Server error", error });
    }
  }

  // Update topic details
  public static async updateTopic(req: express.Request, res: express.Response) {
    try {
      const topicId = req.params.id;
      const { Topic } = req.body;

      if (!topicId) {
        return res.status(400).json({ message: "Topic ID is required" });
      }

      let { data, error } = await supabase
        .from("Topics")
        .update({
          Topic,
          updatedAt: new Date()
        })
        .eq("id", topicId)
        .eq("Is_Deleted", false)
        .select();

      if (error) {
        console.error("Error updating topic:", error);
        return res.status(500).json({ message: "Failed to update topic", error });
      }

      res.json(data);
    } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ message: "Server error", error });
    }
  }

  // Soft delete topic
  public static async deleteTopic(req: express.Request, res: express.Response) {
    try {
      const topicId = req.params.id;

      if (!topicId) {
        return res.status(400).json({ message: "Topic ID is required" });
      }

      let { data, error } = await supabase
        .from("Topics")
        .update({ Is_Deleted: true, updatedAt: new Date() }) // Soft delete instead of hard delete
        .eq("id", topicId)
        .select();

      if (error) {
        console.error("Error deleting topic:", error);
        return res.status(500).json({ message: "Failed to delete topic", error });
      }

      res.json({ message: "Topic deleted successfully", data });
    } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ message: "Server error", error });
    }
  }
}

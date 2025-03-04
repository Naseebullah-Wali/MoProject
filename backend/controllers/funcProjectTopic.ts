import express from "express";
import { supabase } from "../dbConfig/dbConfig";

export class ProjectTopicsController {
  // Get all project topics (associations)
  public static async getAllProjectTopics(req: express.Request, res: express.Response) {
    try {
      let { data, error } = await supabase
        .from("Project_Topics")
        .select("*");

      if (error) {
        console.error("Error fetching project topics:", error);
        return res.status(500).json({ message: "Failed to fetch project topics", error });
      }

      if (!data || data.length === 0) {
        return res.status(404).json({ message: "No project topics found" });
      }

      res.json(data);
    } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ message: "Server error", error });
    }
  }

  // Get project topics by Project ID
  public static async getProjectTopicsByProjectId(req: express.Request, res: express.Response) {
    try {
      const projectId = req.params.projectId;

      if (!projectId) {
        return res.status(400).json({ message: "Project ID is required" });
      }

      let { data, error } = await supabase
        .from("Project_Topics")
        .select("*")
        .eq("Project_ID", projectId);

      if (error) {
        console.error("Error fetching project topics:", error);
        return res.status(500).json({ message: "Failed to fetch project topics", error });
      }

      if (!data || data.length === 0) {
        return res.status(404).json({ message: "No project topics found for this project" });
      }

      res.json(data);
    } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ message: "Server error", error });
    }
  }

  // Get project topics by Topic ID
  public static async getProjectTopicsByTopicId(req: express.Request, res: express.Response) {
    try {
      const topicId = req.params.topicId;

      if (!topicId) {
        return res.status(400).json({ message: "Topic ID is required" });
      }

      let { data, error } = await supabase
        .from("Project_Topics")
        .select("*")
        .eq("Topic_ID", topicId);

      if (error) {
        console.error("Error fetching project topics:", error);
        return res.status(500).json({ message: "Failed to fetch project topics", error });
      }

      if (!data || data.length === 0) {
        return res.status(404).json({ message: "No project topics found for this topic" });
      }

      res.json(data);
    } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ message: "Server error", error });
    }
  }

  // Add a new project topic association
  public static async addProjectTopic(req: express.Request, res: express.Response) {
    try {
      const { Project_ID, Topic_ID } = req.body;

      if (!Project_ID || !Topic_ID) {
        return res.status(400).json({ message: "Project ID and Topic ID are required" });
      }

      let { data, error } = await supabase
        .from("Project_Topics")
        .insert([{
          Project_ID,
          Topic_ID
        }])
        .select();

      if (error) {
        console.error("Error adding project topic:", error);
        return res.status(500).json({ message: "Failed to add project topic", error });
      }

      res.status(201).json(data);
    } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ message: "Server error", error });
    }
  }

  // Delete a project topic association
  public static async deleteProjectTopic(req: express.Request, res: express.Response) {
    try {
     console.log("test", req.params.id, "body", req.body)
      const projectTopicId = req.params.id;

      if (!projectTopicId) {
        return res.status(400).json({ message: "Project Topic ID is required" });
      }

      let { data, error } = await supabase
        .from("Project_Topics")
        .delete()
        .eq("id", projectTopicId)
        .select();

      if (error) {
        console.error("Error deleting project topic:", error);
        return res.status(500).json({ message: "Failed to delete project topic", error });
      }

      res.json({ message: "Project topic deleted successfully", data });
    } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ message: "Server error", error });
    }
  }
}

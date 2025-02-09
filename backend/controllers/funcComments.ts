import express from "express";
import { supabase } from "../dbConfig/dbConfig";

export class ProjectCommentsController {
  public static async getProjectCommentsByProjectId(req: express.Request, res: express.Response) {
    try {
      const projectId = req.params.projectId; // Extract project ID from request parameters

      if (!projectId) {
        return res.status(400).json({ message: "Project ID is required" });
      }

      // Call the Supabase RPC function
      let { data, error } = await supabase.rpc("get_projectcomments_by_projectid", {
        p_project_id: projectId,
      });

      if (error) {
        console.error("Error fetching project comments:", error);
        return res.status(500).json({ message: "Failed to fetch project comments", error });
      }

      if (!data || data.length === 0) {
        return res.status(404).json({ message: "No comments found for this project" });
      }
      
      res.json(data);
    } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ message: "Server error", error });
    }
  }
}
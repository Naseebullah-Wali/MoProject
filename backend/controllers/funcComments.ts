import express from "express";
import { supabase } from "../dbConfig/dbConfig";

export class ProjectCommentsController {
  public static async getProjectCommentsByProjectId(req: express.Request, res: express.Response) {
    try {
      const projectId = req.params.projectId;

      if (!projectId) {
        return res.status(400).json({ message: "Project ID is required" });
      }

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

  public static async addProjectComment(req: express.Request, res: express.Response) {
    try {
      const { User_ID, Project_ID, Comment } = req.body;
    // console.log("Backend req rec", User_ID, Project_ID,Comment)
      if (!User_ID || !Project_ID || !Comment) {
        return res.status(400).json({ message: "User ID, Project ID, and Comment are required" });
      }

      let { data, error } = await supabase.from("Project_Comments").insert([
        { User_ID, Project_ID, Comment }
      ]).select();

      if (error) {
        console.error("Error adding project comment:", error);
        return res.status(500).json({ message: "Failed to add comment", error });
      }

      res.status(201).json(data);
    } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ message: "Server error", error });
    }
  }

  public static async updateProjectComment(req: express.Request, res: express.Response) {
    try {
      const commentId = req.params.commentId;
      const { Comment, Is_Deleted } = req.body;

      if (!commentId) {
        return res.status(400).json({ message: "Comment ID is required" });
      }

      let { data, error } = await supabase.from("Project_Comments").update({ Comment, Is_Deleted, update_date: new Date() }).eq("id", commentId).select();

      if (error) {
        console.error("Error updating project comment:", error);
        return res.status(500).json({ message: "Failed to update comment", error });
      }

      res.json(data);
    } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ message: "Server error", error });
    }
  }

  public static async deleteProjectComment(req: express.Request, res: express.Response) {
    try {
      const commentId = req.params.commentId;

      if (!commentId) {
        return res.status(400).json({ message: "Comment ID is required" });
      }

      let { data, error } = await supabase.from("Project_Comments").update({ Is_Deleted: true, update_date: new Date() }).eq("id", commentId).select();

      if (error) {
        console.error("Error deleting project comment:", error);
        return res.status(500).json({ message: "Failed to delete comment", error });
      }

      res.json({ message: "Comment deleted successfully", data });
    } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ message: "Server error", error });
    }
  }
}

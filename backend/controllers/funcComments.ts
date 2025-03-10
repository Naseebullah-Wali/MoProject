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

  public static async getAllComments(req: express.Request, res: express.Response) {
    try {
      // Fetch all comments
      let { data: comments, error: commentsError } = await supabase
        .from("Project_Comments")
        .select("*")
        .eq("Is_Deleted", false); // Assuming you want to exclude deleted comments

      if (commentsError) {
        console.error("Error fetching comments:", commentsError);
        return res.status(500).json({ message: "Failed to fetch comments", error: commentsError });
      }

      if (!comments || comments.length === 0) {
        return res.status(404).json({ message: "No comments found" });
      }

      // Get user IDs and project IDs from comments
      const userIds = [...new Set(comments.map(comment => comment.User_ID))];
      const projectIds = [...new Set(comments.map(comment => comment.Project_ID))];

      // Fetch user names
      let { data: users, error: usersError } = await supabase
        .from("Users")
        .select("id, Name")
        .in("id", userIds);

      if (usersError || !users) {
        console.error("Error fetching user names:", usersError);
        return res.status(500).json({ message: "Failed to fetch user names", error: usersError });
      }

      // Fetch project titles
      let { data: projects, error: projectsError } = await supabase
        .from("Projects")
        .select("id, Post_Title")
        .in("id", projectIds);

      if (projectsError || !projects) {
        console.error("Error fetching project titles:", projectsError);
        return res.status(500).json({ message: "Failed to fetch project titles", error: projectsError });
      }

      // Map user names and project titles to comments
      const commentsWithDetails = comments.map(comment => {
        const user = users.find(user => user.id === comment.User_ID);
        const project = projects.find(project => project.id === comment.Project_ID);

        return {
          ...comment,
          User_Name: user ? user.Name : "Unknown User",
          Project_Title: project ? project.Post_Title : "Unknown Project"
        };
      });

      res.json(commentsWithDetails);
    } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ message: "Server error", error });
    }
  }

  public static async addProjectComment(req: express.Request, res: express.Response) {
    try {
      const { User_ID, Project_ID, Comment } = req.body;

      if (!User_ID || !Project_ID || !Comment) {
        return res.status(400).json({ message: "User ID, Project ID, and Comment are required" });
      }

      let { data, error } = await supabase
        .from("Project_Comments")
        .insert([{ User_ID, Project_ID, Comment }])
        .select();

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

      let { data, error } = await supabase
        .from("Project_Comments")
        .update({ Comment, Is_Deleted, UpdatedAt: new Date() })
        .eq("id", commentId)
        .select();

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

      let { data, error } = await supabase
        .from("Project_Comments")
        .update({ Is_Deleted: true, UpdatedAt: new Date() })
        .eq("id", commentId)
        .select();

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

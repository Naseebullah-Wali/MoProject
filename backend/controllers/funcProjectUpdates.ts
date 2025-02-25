import express from "express";
import { supabase } from "../dbConfig/dbConfig";

export class ProjectUpdatesController {
  // Get all project updates (including project title)
  public static async getAllProjectUpdates(req: express.Request, res: express.Response) {
    try {
      let { data: updates, error: updatesError } = await supabase
        .from("ProjectUpdates")
        .select("id, Project_ID, update_date, update_content, file1, file2, file3, file4, file5, file6, created_at");

      if (updatesError) {
        console.error("Error fetching project updates:", updatesError);
        return res.status(500).json({ message: "Failed to fetch project updates", error: updatesError });
      }

      if (!updates || updates.length === 0) {
        return res.status(404).json({ message: "No project updates found" });
      }

      // Fetch project titles
      const projectIds = updates.map(update => update.Project_ID);
      let { data: projects, error: projectsError } = await supabase
        .from("Projects")
        .select("ID, Post_Title")
        .in("ID", projectIds);

      if (projectsError || !projects) {
        console.error("Error fetching projects:", projectsError);
        return res.status(500).json({ message: "Failed to fetch projects", error: projectsError });
      }

      // Map project titles to updates
      const updatesWithTitles = updates.map(update => {
        const project = projects.find(p => p.ID === update.Project_ID);
        return { ...update, Post_Title: project ? project.Post_Title : "Unknown Project" };
      });

      res.json(updatesWithTitles);
    } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ message: "Server error", error });
    }
  }

  // Get project update by ID (including project title)
  public static async getProjectUpdateById(req: express.Request, res: express.Response) {
    try {
      const updateId = req.params.id;

      if (!updateId) {
        return res.status(400).json({ message: "Project Update ID is required" });
      }

      let { data: update, error: updateError } = await supabase
        .from("ProjectUpdates")
        .select("id, Project_ID, update_date, update_content, file1, file2, file3, file4, file5, file6, created_at")
        .eq("id", updateId)
        .single();

      if (updateError) {
        console.error("Error fetching project update:", updateError);
        return res.status(500).json({ message: "Failed to fetch project update", error: updateError });
      }

      if (!update) {
        return res.status(404).json({ message: "Project update not found" });
      }

      // Fetch project title
      let { data: project, error: projectError } = await supabase
        .from("Projects")
        .select("Post_Title")
        .eq("ID", update.Project_ID)
        .single();

      if (projectError) {
        console.error("Error fetching project:", projectError);
        return res.status(500).json({ message: "Failed to fetch project", error: projectError });
      }

      res.json({ ...update, Post_Title: project ? project.Post_Title : "Unknown Project" });
    } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ message: "Server error", error });
    }
  }

  // Add a new project update
  public static async addProjectUpdate(req: express.Request, res: express.Response) {
    try {
      const { Project_ID, update_date, update_content, file1, file2, file3, file4, file5, file6 } = req.body;

      if (!Project_ID || !update_date || !update_content) {
        return res.status(400).json({ message: "Project ID, update date, and update content are required" });
      }

      let { data, error } = await supabase
        .from("ProjectUpdates")
        .insert([{
          Project_ID,
          update_date,
          update_content,
          file1,
          file2,
          file3,
          file4,
          file5,
          file6,
          created_at: new Date()
        }])
        .select();

      if (error) {
        console.error("Error adding project update:", error);
        return res.status(500).json({ message: "Failed to add project update", error });
      }

      res.status(201).json(data);
    } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ message: "Server error", error });
    }
  }

  // Update project update details
  public static async updateProjectUpdate(req: express.Request, res: express.Response) {
    try {
      const updateId = req.params.id;
      const { update_date, update_content, file1, file2, file3, file4, file5, file6 } = req.body;

      if (!updateId) {
        return res.status(400).json({ message: "Project Update ID is required" });
      }

      let { data, error } = await supabase
        .from("ProjectUpdates")
        .update({
          update_date,
          update_content,
          file1,
          file2,
          file3,
          file4,
          file5,
          file6
        })
        .eq("id", updateId)
        .select();

      if (error) {
        console.error("Error updating project update:", error);
        return res.status(500).json({ message: "Failed to update project update", error });
      }

      res.json(data);
    } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ message: "Server error", error });
    }
  }

  // Delete project update
  public static async deleteProjectUpdate(req: express.Request, res: express.Response) {
    try {
      const updateId = req.params.id;

      if (!updateId) {
        return res.status(400).json({ message: "Project Update ID is required" });
      }

      let { data, error } = await supabase
        .from("ProjectUpdates")
        .delete()
        .eq("id", updateId)
        .select();

      if (error) {
        console.error("Error deleting project update:", error);
        return res.status(500).json({ message: "Failed to delete project update", error });
      }

      res.json({ message: "Project update deleted successfully", data });
    } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ message: "Server error", error });
    }
  }
}

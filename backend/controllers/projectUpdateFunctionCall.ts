import express from "express";
import { supabase } from "../dbConfig/dbConfig";

export class ProjectUpdatesController {
  public static async getProjectUpdatesByProjectId(req: express.Request, res: express.Response) {
    try {
      const projectId = Number(req.params.id); 

      if (isNaN(projectId)) {
        return res.status(400).json({ message: "Invalid project ID" });
      }

      // Call Supabase RPC function
      let { data, error } = await supabase.rpc("get_projectupdates_by_projectid", {
        p_project_id: projectId, 
      });

      if (error) {
        console.error("Error fetching project updates:", error);
        return res.status(500).json({ message: "Failed to fetch project updates", error });
      }

      if (!data || data.length === 0) {
        return res.status(404).json({ message: "No updates found for this project" });
      }

      res.json(data); 
    } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ message: "Server error", error });
    }
  }
}

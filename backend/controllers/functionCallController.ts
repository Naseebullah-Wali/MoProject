  /**
   * Get project topics by project ID using Supabase function
   */
import express from "express";
import { supabase } from "../dbConfig/dbConfig";

export class ProjectTopicController {

  public static async getProjectTopicsByProjectId(req: express.Request, res: express.Response) {
    try {
      const projectId = Number(req.params.id); 

      if (isNaN(projectId)) {
        return res.status(400).json({ message: "Invalid project ID" });
      }

      // Correct Supabase RPC call format
      let { data, error } = await supabase.rpc("get_projects_by_userid", {
        p_user_id: projectId, 
      });
    //   console.log(data)
      
      if (error) {
        console.error("Error fetching project topics:", error);
        return res.status(500).json({ message: "Failed to fetch project topics", error });
      }

      
      if (!data || data.length === 0) {
        return res.status(404).json({ message: "No topics found for this project" });
      }
      res.json(data);
    } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ message: "Server error", error });
    }
  }
}

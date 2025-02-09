import express from "express";
import { supabase } from "../dbConfig/dbConfig";

export class ScientificReviewController {
  public static async getScientificReviewsByUserId(req: express.Request, res: express.Response) {
    try {
      const userId = req.params.userId; // Extract user ID from request parameters

      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }

      // Call the Supabase RPC function
      let { data, error } = await supabase.rpc("get_scientificreviews_by_userid", {
        p_user_id: userId,
      });

      if (error) {
        console.error("Error fetching scientific reviews:", error);
        return res.status(500).json({ message: "Failed to fetch scientific reviews", error });
      }

      if (!data || data.length === 0) {
        return res.status(404).json({ message: "No scientific reviews found for this user" });
      }
      
      res.json(data);
    } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ message: "Server error", error });
    }
  }
}
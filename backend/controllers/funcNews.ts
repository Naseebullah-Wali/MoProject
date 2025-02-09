import express from "express";
import { supabase } from "../dbConfig/dbConfig";

export class NewsController {
  public static async getNewsByUserId(req: express.Request, res: express.Response) {
    try {
      const userId = req.params.userId; // Extract user ID from request parameters

      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }

      // Call the Supabase RPC function
      let { data, error } = await supabase.rpc("get_news_by_userid", {
        p_user_id: userId,
      });

      if (error) {
        console.error("Error fetching news:", error);
        return res.status(500).json({ message: "Failed to fetch news", error });
      }

      if (!data || data.length === 0) {
        return res.status(404).json({ message: "No news found for this user" });
      }
      
      res.json(data);
    } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ message: "Server error", error });
    }
  }
}

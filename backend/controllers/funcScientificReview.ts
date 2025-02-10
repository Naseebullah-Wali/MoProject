import express from "express";
import { supabase } from "../dbConfig/dbConfig";

export class ScientificReviewController {
  public static async getScientificReviewsByUserId(req: express.Request, res: express.Response) {
    try {
      const userId = req.params.userId;

      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }

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

  public static async addScientificReview(req: express.Request, res: express.Response) {
    try {
      const { Permalink, Title, Content_text, Date, Image, Tematiki, Source, Link_to_source } = req.body;

      if (!Title || !Content_text || !Source) {
        return res.status(400).json({ message: "Title, Content, and Source are required" });
      }

      let { data, error } = await supabase.from("Scientific_Reviews").insert([
        { Permalink, Title, Content_text, Date, Image, Tematiki, Source, Link_to_source }
      ]).select();

      if (error) {
        console.error("Error adding scientific review:", error);
        return res.status(500).json({ message: "Failed to add scientific review", error });
      }

      res.status(201).json(data);
    } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ message: "Server error", error });
    }
  }

  public static async updateScientificReview(req: express.Request, res: express.Response) {
    try {
      const reviewId = req.params.reviewId;
      const { Permalink, Title, Content_text, Date, Image, Tematiki, Source, Link_to_source, Is_Deleted } = req.body;

      if (!reviewId) {
        return res.status(400).json({ message: "Review ID is required" });
      }

      let { data, error } = await supabase.from("Scientific_Reviews").update({
        Permalink, Title, Content_text, Date, Image, Tematiki, Source, Link_to_source, Is_Deleted
      }).eq("id", reviewId).select();

      if (error) {
        console.error("Error updating scientific review:", error);
        return res.status(500).json({ message: "Failed to update scientific review", error });
      }

      res.json(data);
    } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ message: "Server error", error });
    }
  }

  public static async deleteScientificReview(req: express.Request, res: express.Response) {
    try {
      const reviewId = req.params.reviewId;

      if (!reviewId) {
        return res.status(400).json({ message: "Review ID is required" });
      }

      let { data, error } = await supabase.from("Scientific_Reviews").update({ Is_Deleted: true }).eq("id", reviewId).select();

      if (error) {
        console.error("Error deleting scientific review:", error);
        return res.status(500).json({ message: "Failed to delete scientific review", error });
      }

      res.json({ message: "Scientific review deleted successfully", data });
    } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ message: "Server error", error });
    }
  }
}
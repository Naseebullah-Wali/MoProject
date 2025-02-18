import express from "express";
import { supabase } from "../dbConfig/dbConfig";

export class ScientificReviewController {
  // Get all scientific reviews (excluding soft-deleted ones)
  public static async getScientificReviews(req: express.Request, res: express.Response) {
    try {
      let { data, error } = await supabase
        .from("ScientificReviews")
        .select("*")
        .eq("Is_Deleted", false); // Exclude soft-deleted reviews

      if (error) {
        console.error("Error fetching scientific reviews:", error);
        return res.status(500).json({ message: "Failed to fetch scientific reviews", error });
      }

      if (!data || data.length === 0) {
        return res.status(404).json({ message: "No scientific reviews found" });
      }

      res.json(data);
    } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ message: "Server error", error });
    }
  }

  // Get scientific reviews by User ID
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

  // Add a new scientific review
  public static async addScientificReview(req: express.Request, res: express.Response) {
    try {
      const { Old_ID, Permalink, Title, Content_text, reviewDate, Image, Tematiki, Source, Link_to_source } = req.body;

      if (!Title || !Content_text || !Source) {
        return res.status(400).json({ message: "Title, Content, and Source are required" });
      }


      let { data, error } = await supabase
        .from("ScientificReviews")
        .insert([
          { Old_ID, Permalink, Title, Content_text, reviewDate: reviewDate, Image, Tematiki, Source, Link_to_source, Is_Deleted: false, createdAt: new Date(), updatedAt: new Date() }
        ])
        .select();

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

  // Update the most recent scientific review
  public static async updateScientificReview(req: express.Request, res: express.Response) {
    try {
      const reviewID = req.params.id;
      const { Old_ID, Permalink, Title, Content_text, reviewDate, Image, Tematiki, Source, Link_to_source, Is_Deleted } = req.body;

      if (!reviewID) {
        return res.status(400).json({ message: "ID is required" });
      }

      // Update the most recent review
      let { data, error } = await supabase
        .from("ScientificReviews")
        .update({
          Old_ID,
          Permalink,
          Title,
          Content_text,
          reviewDate: reviewDate,
          Image,
          Tematiki,
          Source,
          Link_to_source,
          Is_Deleted,
          updatedAt: new Date(),
        })
        .eq("id", reviewID)
        .select();

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

  // Soft delete the most recent scientific review
  public static async deleteScientificReview(req: express.Request, res: express.Response) {
    try {
  
      const reviewID = req.params.id;
      if (!reviewID) {
        return res.status(400).json({ message: "ID is required" });
      }
      let { data, error } = await supabase
      .from("ScientificReviews")
        .update({ Is_Deleted: true, updatedAt: new Date() }) // Fixed soft delete
        .eq("id", reviewID)
        .select();

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

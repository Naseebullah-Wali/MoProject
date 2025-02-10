import express from "express";
import { supabase } from "../dbConfig/dbConfig";

export class NewsController {
  public static async getNewsByUserId(req: express.Request, res: express.Response) {
    try {
      const userId = req.params.userId;

      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }

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

  public static async addNews(req: express.Request, res: express.Response) {
    try {
      const { Title, Content_Text, Image, Source, Link_To_Source } = req.body;

      if (!Title || !Content_Text || !Source) {
        return res.status(400).json({ message: "Title, Content, and Source are required" });
      }

      let { data, error } = await supabase.from("News").insert([
        { Title, Content_Text, Image, Source, Link_To_Source }
      ]).select();

      if (error) {
        console.error("Error adding news:", error);
        return res.status(500).json({ message: "Failed to add news", error });
      }

      res.status(201).json(data);
    } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ message: "Server error", error });
    }
  }

  public static async updateNews(req: express.Request, res: express.Response) {
    try {
      const newsId = req.params.newsId;
      const { Title, Content_Text, Image, Source, Link_To_Source, Is_Deleted } = req.body;

      if (!newsId) {
        return res.status(400).json({ message: "News ID is required" });
      }

      let { data, error } = await supabase.from("News").update({
        Title, Content_Text, Image, Source, Link_To_Source, Is_Deleted, update_at: new Date()
      }).eq("id", newsId).select();

      if (error) {
        console.error("Error updating news:", error);
        return res.status(500).json({ message: "Failed to update news", error });
      }

      res.json(data);
    } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ message: "Server error", error });
    }
  }

  public static async deleteNews(req: express.Request, res: express.Response) {
    try {
      const newsId = req.params.newsId;

      if (!newsId) {
        return res.status(400).json({ message: "News ID is required" });
      }

      let { data, error } = await supabase.from("News").update({ Is_Deleted: true, update_at: new Date() }).eq("id", newsId).select();

      if (error) {
        console.error("Error deleting news:", error);
        return res.status(500).json({ message: "Failed to delete news", error });
      }

      res.json({ message: "News deleted successfully", data });
    } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ message: "Server error", error });
    }
  }
}

import express from "express";
import { supabase } from "../dbConfig/dbConfig";
import { v4 as uuidv4 } from 'uuid';
export class ProjectUpdatesController {

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
        .select("id, Post_Title")
        .in("id", projectIds);

      if (projectsError || !projects) {
        console.error("Error fetching projects:", projectsError);
        return res.status(500).json({ message: "Failed to fetch projects", error: projectsError });
      }

      // Map project titles to updates
      const updatesWithTitles = updates.map(update => {
        const project = projects.find(p => p.id === update.Project_ID);
        const postTitle = project ? project.Post_Title : "Unknown Project";
        const { Project_ID, ...rest } = update;
        const updatedObject = {
          Project_ID,
          Project_Title: postTitle,
          ...rest
        };
      
        return updatedObject;
      });
      
      

      res.json(updatesWithTitles);
    } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ message: "Server error", error });
    }
  }

  // public static async getProjectUpdateById(req: express.Request, res: express.Response) {
  //   try {
  //     const updateId = req.params.id;

  //     if (!updateId) {
  //       return res.status(400).json({ message: "Project Update ID is required" });
  //     }

  //     let { data: update, error: updateError } = await supabase
  //       .from("ProjectUpdates")
  //       .select("id, Project_ID, update_date, update_content, file1, file2, file3, file4, file5, file6, created_at")
  //       .eq("id", updateId)
  //       .single();

  //     if (updateError) {
  //       console.error("Error fetching project update:", updateError);
  //       return res.status(500).json({ message: "Failed to fetch project update", error: updateError });
  //     }

  //     if (!update) {
  //       return res.status(404).json({ message: "Project update not found" });
  //     }

  //     // Fetch project title
  //     let { data: project, error: projectError } = await supabase
  //       .from("Projects")
  //       .select("Post_Title")
  //       .eq("ID", update.Project_ID)
  //       .single();

  //     if (projectError) {
  //       console.error("Error fetching project:", projectError);
  //       return res.status(500).json({ message: "Failed to fetch project", error: projectError });
  //     }

  //     res.json({ ...update, Post_Title: project ? project.Post_Title : "Unknown Project" });
  //   } catch (error) {
  //     console.error("Server Error:", error);
  //     res.status(500).json({ message: "Server error", error });
  //   }
  // }

  public static async addProjectUpdate(req: express.Request, res: express.Response) {
    try {
      const { Project_ID, update_date, update_content } = req.body;
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  
      if (!Project_ID || !update_date || !update_content) {
        return res.status(400).json({ message: "Project ID, update date, and update content are required" });
      }
  
      const fileUrls = {
        file1: null as string | null,
        file2: null as string | null,
        file3: null as string | null,
        file4: null as string | null,
        file5: null as string | null,
        file6: null as string | null
      };
  
      for (const [key, fileArray] of Object.entries(files)) {
        if (fileArray && fileArray.length > 0) {
          const file = fileArray[0];
          const filePath = `project_files/${uuidv4()}-${file.originalname}`;
          const { error: uploadError } = await supabase.storage.from('FilesFromFrontEnd').upload(filePath, file.buffer, {
            cacheControl: '3600',
            upsert: false
          });
  
          if (uploadError) {
            console.error("Error uploading file:", uploadError);
            return res.status(500).json({ message: "Failed to upload file", error: uploadError });
          }
  
          const { data: urlData } = supabase.storage.from('FilesFromFrontEnd').getPublicUrl(filePath);
  
          if (!urlData) {
            console.error("Error getting public URL:");
            return res.status(500).json({ message: "Failed to get public URL for file" });
          }
  
          fileUrls[key as keyof typeof fileUrls] = urlData.publicUrl;
        }
      }
  
      let { data, error } = await supabase
        .from("ProjectUpdates")
        .insert([{
          Project_ID,
          update_date,
          update_content,
          file1: fileUrls.file1,
          file2: fileUrls.file2,
          file3: fileUrls.file3,
          file4: fileUrls.file4,
          file5: fileUrls.file5,
          file6: fileUrls.file6,
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
  
  public static async updateProjectUpdate(req: express.Request, res: express.Response) {
    try {
      const updateId = req.params.id;
      const { update_date, update_content } = req.body;
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  
      if (!updateId) {
        return res.status(400).json({ message: "Project Update ID is required" });
      }
  
      const fileUrls = {
        file1: null as string | null,
        file2: null as string | null,
        file3: null as string | null,
        file4: null as string | null,
        file5: null as string | null,
        file6: null as string | null
      };
  
      for (const [key, fileArray] of Object.entries(files)) {
        if (fileArray && fileArray.length > 0) {
          const file = fileArray[0];
          const filePath = `project_files/${uuidv4()}-${file.originalname}`;
          const { error: uploadError } = await supabase.storage.from('FilesFromFrontEnd').upload(filePath, file.buffer, {
            cacheControl: '3600',
            upsert: false
          });
  
          if (uploadError) {
            console.error("Error uploading file:", uploadError);
            return res.status(500).json({ message: "Failed to upload file", error: uploadError });
          }
  
          const { data: urlData } = supabase.storage.from('FilesFromFrontEnd').getPublicUrl(filePath);
  
          if (!urlData) {
            console.error("Error getting public URL:");
            return res.status(500).json({ message: "Failed to get public URL for file" });
          }
  
          fileUrls[key as keyof typeof fileUrls] = urlData.publicUrl;
        }
      }
  
      let { data, error } = await supabase
        .from("ProjectUpdates")
        .update({
          update_date,
          update_content,
          file1: fileUrls.file1,
          file2: fileUrls.file2,
          file3: fileUrls.file3,
          file4: fileUrls.file4,
          file5: fileUrls.file5,
          file6: fileUrls.file6
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

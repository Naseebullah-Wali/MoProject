import express from "express";
import { supabase } from "../dbConfig/dbConfig";
import { v4 as uuidv4 } from 'uuid';

export class ProjectsController {
  // Get all projects with their associated relations
  public static async getAllProjects(req: express.Request, res: express.Response) {
    try {
      let { data: projects, error: projectsError } = await supabase
        .from("Projects")
        .select("*")
        .eq("Is_deleted", false)
        .order('CreatedAt', { ascending: false });
      if (projectsError) {
        console.error("Error fetching projects:", projectsError);
        return res.status(500).json({ message: "Failed to fetch projects", error: projectsError });
      }
  
      if (!projects || projects.length === 0) {
        return res.status(404).json({ message: "No projects found" });
      }
  
      // Fetch all related data
      const [
        countriesResponse,
        documentTypesResponse,
        charactersResponse,
        statusesResponse,
      ] = await Promise.all([
        supabase.from("Countries").select("id, Country_Name"),
        supabase.from("Document_Types").select("id, Doc_Type"),
        supabase.from("Characters").select("id, Character_name"),
        supabase.from("Statuses").select("id, Status_Name"),
      ]);
  
      // Check for errors in related data fetching
      const responses = [
        { name: "Countries", response: countriesResponse },
        { name: "Document_Types", response: documentTypesResponse },
        { name: "Characters", response: charactersResponse },
        { name: "Statuses", response: statusesResponse },
      ];
  
      for (const { name, response } of responses) {
        if (response.error) {
          console.error(`Error fetching ${name}:`, response.error);
          return res.status(500).json({ message: `Failed to fetch ${name}`, error: response.error });
        }
      }
  
      const countries = countriesResponse.data || [];
      const documentTypes = documentTypesResponse.data || [];
      const characters = charactersResponse.data || [];
      const statuses = statusesResponse.data || [];
  
      // Enrich projects with related data
      const enrichedProjects = projects.map(project => {
        // Get country name
        const country = countries.find(c => c.id === project.Country_ID);
        const countryName = country ? country.Country_Name : null;
  
        // Get document type name
        const documentType = documentTypes.find(dt => dt.id === project.Document_Type);
        const documentTypeName = documentType ? documentType.Doc_Type : null;
  
        // Get character name
        const character = characters.find(c => c.id === project.Character_ID);
        const characterName = character ? character.Character_name : null;
  
        // Get status name
        const status = statuses.find(s => s.id === project.Status_ID);
        const statusName = status ? status.Status_Name : null;
  
        return {
          ...project,
          Country_Name: countryName,
          Document_Type_Name: documentTypeName,
          Character_name: characterName,
          Status_Name: statusName,
        };
      });
  
      res.json(enrichedProjects);
    } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ message: "Server error", error });
    }
  }

  // Add a new project with its associated relations
  public static async addProject(req: express.Request, res: express.Response) {
    try {
      const {
        Country_ID,
        Priority,
        Post_Title,
        Post_Content,
        Project_Date,
        Project_Number,
        Developer_Organization,
        Document_Type,
        Character_ID,
        Status_ID,
        Original_Document,
        Took_Affect_Date,
        No_Longer_Valid_Date,
      } = req.body;
  
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    //   console.log(req.body)
      // Validate required fields
      if (!Country_ID || !Post_Title || !Post_Content || !Project_Date || 
          !Project_Number || !Developer_Organization || !Document_Type || 
          !Character_ID || !Status_ID) {
        return res.status(400).json({ 
          message: "Required fields missing",
          required: "Country_ID, Priority, Post_Title, Post_Content, Project_Date, Project_Number, Developer_Organization, Document_Type, Character_ID, Status_ID are required"
        });
      }
  
      // File paths and URLs
      let imageUrl = null;
      let file1Url = null;
      let file2Url = null;
      let file3Url = null;
  
      // Upload image if provided
      if (files.Image && files.Image.length > 0) {
        const image = files.Image[0];
        const imagePath = `project_images/${uuidv4()}-${image.originalname}`;
        let { error: uploadError } = await supabase.storage
          .from('FilesFromFrontEnd')
          .upload(imagePath, image.buffer, {
            cacheControl: '3600',
            upsert: false
          });
  
        if (uploadError) {
          console.error("Error uploading image:", uploadError);
          return res.status(500).json({ message: "Failed to upload project image", error: uploadError });
        }
  
        const { data: urlData } = supabase.storage.from('FilesFromFrontEnd').getPublicUrl(imagePath);
        imageUrl = urlData?.publicUrl || null;
      }
  
      // Upload File1 if provided
      if (files.File1 && files.File1.length > 0) {
        const file = files.File1[0];
        const filePath = `project_files/${uuidv4()}-${file.originalname}`;
        let { error: uploadError } = await supabase.storage
          .from('FilesFromFrontEnd')
          .upload(filePath, file.buffer, {
            cacheControl: '3600',
            upsert: false
          });
  
        if (uploadError) {
          console.error("Error uploading File1:", uploadError);
          return res.status(500).json({ message: "Failed to upload File1", error: uploadError });
        }
  
        const { data: urlData } = supabase.storage.from('FilesFromFrontEnd').getPublicUrl(filePath);
        file1Url = urlData?.publicUrl || null;
      }
  
      // Upload File2 if provided
      if (files.File2 && files.File2.length > 0) {
        const file = files.File2[0];
        const filePath = `project_files/${uuidv4()}-${file.originalname}`;
        let { error: uploadError } = await supabase.storage
          .from('FilesFromFrontEnd')
          .upload(filePath, file.buffer, {
            cacheControl: '3600',
            upsert: false
          });
  
        if (uploadError) {
          console.error("Error uploading File2:", uploadError);
          return res.status(500).json({ message: "Failed to upload File2", error: uploadError });
        }
  
        const { data: urlData } = supabase.storage.from('FilesFromFrontEnd').getPublicUrl(filePath);
        file2Url = urlData?.publicUrl || null;
      }
  
      // Upload File3 if provided
      if (files.File3 && files.File3.length > 0) {
        const file = files.File3[0];
        const filePath = `project_files/${uuidv4()}-${file.originalname}`;
        let { error: uploadError } = await supabase.storage
          .from('FilesFromFrontEnd')
          .upload(filePath, file.buffer, {
            cacheControl: '3600',
            upsert: false
          });
  
        if (uploadError) {
          console.error("Error uploading File3:", uploadError);
          return res.status(500).json({ message: "Failed to upload File3", error: uploadError });
        }
  
        const { data: urlData } = supabase.storage.from('FilesFromFrontEnd').getPublicUrl(filePath);
        file3Url = urlData?.publicUrl || null;
      }
  
      // Create new project
      const newProject = {
        Country_ID,
        Priority,
        Image: imageUrl,
        CreatedAt: new Date(),
        UpdatedAt: new Date(),
        Post_Title,
        Post_Content,
        Project_Date,
        Project_Number,
        Developer_Organization,
        File1: file1Url,
        File2: file2Url,
        File3: file3Url,
        Document_Type,
        Character_ID,
        Status_ID,
        Original_Document: Original_Document || null,
        Took_Affect_Date: Took_Affect_Date || null,
        No_Longer_Valid_Date: No_Longer_Valid_Date || null,
        Is_deleted: false
      };
  
      // Insert project into database
      let { data: insertedProject, error: insertError } = await supabase
        .from("Projects")
        .insert([newProject])
        .select();
  
      if (insertError || !insertedProject || insertedProject.length === 0) {
        console.error("Error adding project:", insertError);
        return res.status(500).json({ message: "Failed to add project", error: insertError });
      }
  
      res.status(201).json(insertedProject[0]);
    } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ message: "Server error", error });
    }
  }

  // Update project with its associated relations
  public static async updateProject(req: express.Request, res: express.Response) {
    try {
      const projectId = req.params.id;
  
      if (!projectId) {
        return res.status(400).json({ message: "Project ID is required" });
      }
  
      const {
        Country_ID,
        Priority,
        Post_Title,
        Post_Content,
        Project_Date,
        Project_Number,
        Developer_Organization,
        Document_Type,
        Character_ID,
        Status_ID,
        Original_Document,
        Took_Affect_Date,
        No_Longer_Valid_Date,
      } = req.body;
  
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  
      // Build update object with only provided fields
      let projectUpdate: any = { UpdatedAt: new Date() };
      
      // Update basic fields if provided
      if (Country_ID !== undefined) projectUpdate.Country_ID = Country_ID;
      if (Priority !== undefined) projectUpdate.Priority = Priority;
      if (Post_Title !== undefined) projectUpdate.Post_Title = Post_Title;
      if (Post_Content !== undefined) projectUpdate.Post_Content = Post_Content;
      if (Project_Date !== undefined) projectUpdate.Project_Date = Project_Date;
      if (Project_Number !== undefined) projectUpdate.Project_Number = Project_Number;
      if (Developer_Organization !== undefined) projectUpdate.Developer_Organization = Developer_Organization;
      if (Document_Type !== undefined) projectUpdate.Document_Type = Document_Type;
      if (Character_ID !== undefined) projectUpdate.Character_ID = Character_ID;
      if (Status_ID !== undefined) projectUpdate.Status_ID = Status_ID;
      if (Original_Document !== undefined) projectUpdate.Original_Document = Original_Document;
      if (Took_Affect_Date !== undefined) projectUpdate.Took_Affect_Date = Took_Affect_Date;
      if (No_Longer_Valid_Date !== undefined) projectUpdate.No_Longer_Valid_Date = No_Longer_Valid_Date;
    //   console.log(projectUpdate)
      // Upload and update Image if provided
      if (files.Image && files.Image.length > 0) {
        const image = files.Image[0];
        const imagePath = `project_images/${uuidv4()}-${image.originalname}`;
        let { error: uploadError } = await supabase.storage
          .from('FilesFromFrontEnd')
          .upload(imagePath, image.buffer, {
            cacheControl: '3600',
            upsert: false
          });
  
        if (uploadError) {
          console.error("Error uploading image:", uploadError);
          return res.status(500).json({ message: "Failed to upload project image", error: uploadError });
        }
  
        const { data: urlData } = supabase.storage.from('FilesFromFrontEnd').getPublicUrl(imagePath);
        projectUpdate.Image = urlData?.publicUrl || null;
      }
  
      // Upload and update File1 if provided
      if (files.File1 && files.File1.length > 0) {
        const file = files.File1[0];
        const filePath = `project_files/${uuidv4()}-${file.originalname}`;
        let { error: uploadError } = await supabase.storage
          .from('FilesFromFrontEnd')
          .upload(filePath, file.buffer, {
            cacheControl: '3600',
            upsert: false
          });
  
        if (uploadError) {
          console.error("Error uploading File1:", uploadError);
          return res.status(500).json({ message: "Failed to upload File1", error: uploadError });
        }
  
        const { data: urlData } = supabase.storage.from('FilesFromFrontEnd').getPublicUrl(filePath);
        projectUpdate.File1 = urlData?.publicUrl || null;
      }
  
      // Upload and update File2 if provided
      if (files.File2 && files.File2.length > 0) {
        const file = files.File2[0];
        const filePath = `project_files/${uuidv4()}-${file.originalname}`;
        let { error: uploadError } = await supabase.storage
          .from('FilesFromFrontEnd')
          .upload(filePath, file.buffer, {
            cacheControl: '3600',
            upsert: false
          });
  
        if (uploadError) {
          console.error("Error uploading File2:", uploadError);
          return res.status(500).json({ message: "Failed to upload File2", error: uploadError });
        }
  
        const { data: urlData } = supabase.storage.from('FilesFromFrontEnd').getPublicUrl(filePath);
        projectUpdate.File2 = urlData?.publicUrl || null;
      }
  
      // Upload and update File3 if provided
      if (files.File3 && files.File3.length > 0) {
        const file = files.File3[0];
        const filePath = `project_files/${uuidv4()}-${file.originalname}`;
        let { error: uploadError } = await supabase.storage
          .from('FilesFromFrontEnd')
          .upload(filePath, file.buffer, {
            cacheControl: '3600',
            upsert: false
          });
  
        if (uploadError) {
          console.error("Error uploading File3:", uploadError);
          return res.status(500).json({ message: "Failed to upload File3", error: uploadError });
        }
  
        const { data: urlData } = supabase.storage.from('FilesFromFrontEnd').getPublicUrl(filePath);
        projectUpdate.File3 = urlData?.publicUrl || null;
      }
  
      // Update project in database
      let { data: updatedProject, error: updateError } = await supabase
        .from("Projects")
        .update(projectUpdate)
        .eq("ID", projectId)
        .select();
  
      if (updateError) {
        console.error("Error updating project:", updateError);
        return res.status(500).json({ message: "Failed to update project", error: updateError });
      }
  
      res.json(updatedProject);
    } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ message: "Server error", error });
    }
  }

  // Delete project (soft delete)
  public static async deleteProject(req: express.Request, res: express.Response) {
    try {
      const projectId = req.params.id;

      if (!projectId) {
        return res.status(400).json({ message: "Project ID is required" });
      }

      let { data, error } = await supabase
        .from("Projects")
        .update({ Is_deleted: true, UpdatedAt: new Date() })
        .eq("id", projectId)
        .select();

      if (error) {
        console.error("Error deleting project:", error);
        return res.status(500).json({ message: "Failed to delete project", error });
      }

      res.json({ message: "Project deleted successfully", data });
    } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ message: "Server error", error });
    }
  }

}
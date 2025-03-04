import express from "express";
import { supabase } from "../dbConfig/dbConfig";

export class UsersController {
  // Get all users (excluding soft-deleted) with User_Type and Company_Name
  public static async getAllUsers(req: express.Request, res: express.Response) {
    try {
      let { data: users, error: usersError } = await supabase
        .from("Users")
        .select("id, Name, email, Phone, Telegram, Photo, Notify_on_Updates, createdAt, updatedAt, User_Type, Company_ID")
        .eq("Is_Deleted", false);

      if (usersError) {
        console.error("Error fetching users:", usersError);
        return res.status(500).json({ message: "Failed to fetch users", error: usersError });
      }

      if (!users || users.length === 0) {
        return res.status(404).json({ message: "No users found" });
      }

      // Fetch user types
      const userTypeIds = users.map(user => user.User_Type);
      let { data: userTypes, error: userTypesError } = await supabase
        .from("Users_Types")
        .select("id, User_Type")
        .in("id", userTypeIds);

      if (userTypesError || !userTypes) {
        console.error("Error fetching user types:", userTypesError);
        return res.status(500).json({ message: "Failed to fetch user types", error: userTypesError });
      }

      // Fetch company names
      const companyIds = users.map(user => user.Company_ID);
      let { data: companies, error: companiesError } = await supabase
        .from("Companies")
        .select("id, Company_Name")
        .in("id", companyIds);

      if (companiesError || !companies)  {
        console.error("Error fetching companies:", companiesError);
        return res.status(500).json({ message: "Failed to fetch companies", error: companiesError });
      }

      // Map user types and company names to users
      const usersWithDetails = users.map(user => {
        const userType = userTypes.find(ut => ut.id === user.User_Type);
        const company = companies.find(c => c.id === user.Company_ID);
        return {
          ...user,
          User_Type_Name: userType ? userType?.User_Type : "Unknown Name",
          User_Type_ID: userType ? userType.id : "Unknown Id",
          Company_Name: company ? company.Company_Name : "Unknown Company"
        };
      });

      res.json(usersWithDetails);
    } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ message: "Server error", error });
    }
  }

  // Get user by ID (only if not deleted) with User_Type and Company_Name
  public static async getUserById(req: express.Request, res: express.Response) {
    try {
      const userId = req.params.id;

      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }

      let { data: user, error: userError } = await supabase
        .from("Users")
        .select("id, Name, email, Phone, Telegram, Photo, Notify_on_Updates, createdAt, updatedAt, User_Type, Company_ID")
        .eq("id", userId)
        .eq("Is_Deleted", false)
        .single();

      if (userError) {
        console.error("Error fetching user:", userError);
        return res.status(500).json({ message: "Failed to fetch user", error: userError });
      }

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Fetch user type
      let { data: userType, error: userTypeError } = await supabase
        .from("Users_Types")
        .select("User_Type")
        .eq("id", user.User_Type)
        .single();

      if (userTypeError) {
        console.error("Error fetching user type:", userTypeError);
        return res.status(500).json({ message: "Failed to fetch user type", error: userTypeError });
      }

      // Fetch company name
      let { data: company, error: companyError } = await supabase
        .from("Companies")
        .select("Company_Name")
        .eq("id", user.Company_ID)
        .single();

      if (companyError) {
        console.error("Error fetching company:", companyError);
        return res.status(500).json({ message: "Failed to fetch company", error: companyError });
      }

      res.json({
        ...user,
        User_Type: userType ? userType.User_Type : "Unknown Type",
        Company_Name: company ? company.Company_Name : "Unknown Company"
      });
    } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ message: "Server error", error });
    }
  }

  // Add a new user
  public static async addUser(req: express.Request, res: express.Response) {
    try {
      const { email, User_Type, Company_ID } = req.body;
  
      if (!email || !User_Type || !Company_ID) {
        return res.status(400).json({ message: "Email, User_Type, and Company_ID are required" });
      }
  
      // Insert only the necessary fields initially
      let { data, error } = await supabase
        .from("Users")
        .insert([{
          email,
          User_Type,
          Company_ID,
          Is_Pending: true,  // Mark user as pending
          Is_Deleted: false,
          createdAt: new Date(),
          updatedAt: new Date()
        }])
        .select();
  
      if (error) {
        console.error("Error adding user:", error);
        return res.status(500).json({ message: "Failed to add user", error });
      }
  
      res.status(201).json(data);
    } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ message: "Server error", error });
    }
  }
  
  public static async acceptUser(req: express.Request, res: express.Response) {
    try {
      const { userId, Name, password, token, Phone, Telegram, Photo, Notify_on_Updates } = req.body;
  
      if (!userId || !Name || !password) {
        return res.status(400).json({ message: "User ID, Name, and password are required" });
      }
  
      // Update the user record with full information
      let { data, error } = await supabase
        .from("Users")
        .update({
          Name,
          password,
          token,
          Phone,
          Telegram,
          Photo,
          Notify_on_Updates,
          Is_Pending: false,  // Mark user as accepted
          updatedAt: new Date()
        })
        .eq('id', userId)
        .select();
  
      if (error) {
        console.error("Error updating user:", error);
        return res.status(500).json({ message: "Failed to update user", error });
      }
  
      res.status(200).json(data);
    } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ message: "Server error", error });
    }
  }
  

  // Update user details
  public static async updateUser(req: express.Request, res: express.Response) {
    console.log(req.body)
    try {
      const userId = req.params.id;
      const { Name, email, password, token, User_Type, Phone, Company_ID, Telegram, Photo, Notify_on_Updates } = req.body;

      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }

      let { data, error } = await supabase
        .from("Users")
        .update({
          Name,
          email,
          password,
          token,
          User_Type,
          Phone,
          Company_ID,
          Telegram,
          Photo,
          Notify_on_Updates,
          updatedAt: new Date()
        })
        .eq("id", userId)
        .eq("Is_Deleted", false)
        .select();

      if (error) {
        console.error("Error updating user:", error);
        return res.status(500).json({ message: "Failed to update user", error });
      }

      res.json(data);
    } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ message: "Server error", error });
    }
  }

  // Soft delete user
  public static async deleteUser(req: express.Request, res: express.Response) {
    try {
      const userId = req.params.id;

      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }

      let { data, error } = await supabase
        .from("Users")
        .update({ Is_Deleted: true, updatedAt: new Date() }) // Soft delete instead of hard delete
        .eq("id", userId)
        .select();

      if (error) {
        console.error("Error deleting user:", error);
        return res.status(500).json({ message: "Failed to delete user", error });
      }

      res.json({ message: "User deleted successfully", data });
    } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ message: "Server error", error });
    }
  }
}

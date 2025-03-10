import express from "express";
import { supabase } from "../dbConfig/dbConfig";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";

// Configure environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'jwtsecret';
const EMAIL_USER = process.env.EMAIL_USER || 'walinaseebullah@gmail.com';
const EMAIL_PASS = process.env.EMAIL_PASS || 'ljss jrnm oqyt ldaw'; //google app password
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://moproject.onrender.com';

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail', // or your email service provider
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

export class UsersController {
  // Get all users (excluding soft-deleted) with User_Type and Company_Name
  public static async getAllUsers(req: express.Request, res: express.Response) {
    try {
      const { companyId } = req.query;
      let query = supabase
        .from("Users")
        .select("id, Name, email, Phone, Telegram, Photo, Notify_on_Updates, createdAt, updatedAt, User_Type, Company_ID")
        .eq("Is_Deleted", false);
      
      // Filter by company if companyId is provided
      if (companyId) {
        query = query.eq("Company_ID", companyId);
      }
      
      let { data: users, error: usersError } = await query;

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
          User_Type_Name: userType ? userType.User_Type : "Unknown Type",
          User_Type_ID: userType ? userType.id : "Unknown ID",
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

  // Add a new user with optional email invitation
  public static async addUser(req: express.Request, res: express.Response) {
    try {
        const { email, User_Type, Company_ID, send_invitation } = req.body;

        if (!email || !User_Type || !Company_ID) {
            return res.status(400).json({ message: "Email, User_Type, and Company_ID are required" });
        }

        // Check if user with this email already exists
        let { data: existingUser, error: existingUserError } = await supabase
            .from("Users")
            .select("id")
            .eq("email", email)
            .maybeSingle(); // Fix: Use maybeSingle to avoid PGRST116 error

        if (existingUserError) {
            console.error("Error checking existing user:", existingUserError);
            return res.status(500).json({ message: "Error checking existing user", error: existingUserError });
        }

        if (existingUser) {
            return res.status(400).json({ message: "User with this email has already been invited" });
        }

        // Generate a random password for the new user
        const generatedPassword = crypto.randomBytes(8).toString('hex');

        // Hash the password
        const hashedPassword = await bcrypt.hash(generatedPassword, 10);

        // Generate verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');

        // Insert only the necessary fields initially
        let { data, error } = await supabase
            .from("Users")
            .insert([
                {
                    email,
                    password: hashedPassword,
                    User_Type,
                    Company_ID,
                    Is_Pending: true,
                    Is_Deleted: false,
                    token: verificationToken,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            ])
            .select();

        if (error) {
            console.error("Error adding user:", error);
            return res.status(500).json({ message: "Failed to add user", error });
        }

        // Send invitation email if requested
        if (send_invitation && data && data.length > 0) {
            try {
                await UsersController.sendInvitationEmail(email, generatedPassword, verificationToken);
            } catch (emailError) {
                console.error("Error sending invitation email:", emailError);
                // We still created the user, just failed to send email, so don't return error
            }
        }

        res.status(201).json({
            message: "User created successfully",
            userId: data && data.length > 0 ? data[0].id : null
        });
    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ message: "Server error", error });
    }
}

  
  // Accept invitation and complete user profile
  public static async acceptInvitation(req: express.Request, res: express.Response) {
    try {
      const { token, Name, password, Phone, Telegram, Photo, Notify_on_Updates } = req.body;
  
      if (!token || !Name || !password) {
        return res.status(400).json({ message: "Token, Name, and password are required" });
      }
      
      // Find user by verification token
      let { data: user, error: userError } = await supabase
        .from("Users")
        .select("id")
        .eq("token", token)
        .eq("Is_Deleted", false)
        .single();
        
      if (userError || !user) {
        console.error("Error finding user by token:", userError);
        return res.status(400).json({ message: "Invalid token or user not found" });
      }
      
      // Hash the new password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Update the user record with full information
      let { data, error } = await supabase
        .from("Users")
        .update({
          Name,
          password: hashedPassword,
          Phone,
          Telegram,
          Photo,
          Notify_on_Updates,
          Is_Pending: false,
          token: null,
          updatedAt: new Date()
        })
        .eq('id', user.id)
        .select();
  
      if (error) {
        console.error("Error updating user:", error);
        return res.status(500).json({ message: "Failed to update user", error });
      }
  
      res.status(200).json({ message: "Account activation successful. You can now login." });
    } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ message: "Server error", error });
    }
  }

  // Update user details
  public static async updateUser(req: express.Request, res: express.Response) {
    try {
      const userId = req.params.id;
      const { Name, email, User_Type, Phone, Company_ID, Telegram, Photo, Notify_on_Updates } = req.body;

      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }
      
      const updateData: any = { updatedAt: new Date() };
      
      // Only include fields that are provided
      if (Name !== undefined) updateData.Name = Name;
      if (email !== undefined) updateData.email = email;
      if (User_Type !== undefined) updateData.User_Type = User_Type;
      if (Phone !== undefined) updateData.Phone = Phone;
      if (Company_ID !== undefined) updateData.Company_ID = Company_ID;
      if (Telegram !== undefined) updateData.Telegram = Telegram;
      if (Photo !== undefined) updateData.Photo = Photo;
      if (Notify_on_Updates !== undefined) updateData.Notify_on_Updates = Notify_on_Updates;

      let { data, error } = await supabase
        .from("Users")
        .update(updateData)
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
  
  // Update user profile (for users to update their own profile)
  public static async updateProfile(req: express.Request, res: express.Response) {
    try {
      const userId = req.params.id;
      const { Name, Phone, Telegram, Photo, Notify_on_Updates } = req.body;
      
      // Verify that the user is updating their own profile
      // This assumes an auth middleware that adds userId to the request
      if ((req as any).userId !== parseInt(userId)) {
        return res.status(403).json({ message: 'Not authorized to update this profile' });
      }

      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }
      
      const updateData: any = { updatedAt: new Date() };
      
      // Only include fields that are provided
      if (Name !== undefined) updateData.Name = Name;
      if (Phone !== undefined) updateData.Phone = Phone;
      if (Telegram !== undefined) updateData.Telegram = Telegram;
      if (Photo !== undefined) updateData.Photo = Photo;
      if (Notify_on_Updates !== undefined) updateData.Notify_on_Updates = Notify_on_Updates;

      let { data, error } = await supabase
        .from("Users")
        .update(updateData)
        .eq("id", userId)
        .eq("Is_Deleted", false)
        .select();

      if (error) {
        console.error("Error updating profile:", error);
        return res.status(500).json({ message: "Failed to update profile", error });
      }

      res.json({ message: "Profile updated successfully", user: data });
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
        .update({ Is_Deleted: true, updatedAt: new Date() })
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
  
  // User login
  public static async login(req: express.Request, res: express.Response) {
    try {
      const { email, password } = req.body;
      
      // Find user by email
      let { data: user, error: userError } = await supabase
        .from("Users")
        .select("id, email, password, User_Type, Company_ID, Is_Pending")
        .eq("email", email)
        .eq("Is_Deleted", false)
        .single();
      
      if (userError || !user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      
      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      
      // Check if user is pending
      if (user.Is_Pending) {
        return res.status(401).json({ message: "Your account is pending. Please complete your profile." });
      }
      
      // Fetch user type name
      let { data: userType, error: userTypeError } = await supabase
        .from("Users_Types")
        .select("User_Type")
        .eq("id", user.User_Type)
        .single();
        
      if (userTypeError || !userType) {
        console.error("Error fetching user type:", userTypeError);
        return res.status(500).json({ message: "Error fetching user type information" });
      }
      
      // Generate JWT token
      const token = jwt.sign(
        { 
          userId: user.id, 
          email: user.email, 
          role: userType.User_Type 
        }, 
        JWT_SECRET, 
        { expiresIn: '24h' }
      );
      
      // Return user information and token
      res.status(200).json({
        user_id: user.id,
        company_id: user.Company_ID,
        role: userType.User_Type,
        token
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Login failed", error });
    }
  }
  
  // Change password (with current password verification)
  public static async changePassword(req: express.Request, res: express.Response) {
    try {
      const userId = req.params.id;
      const { currentPassword, newPassword } = req.body;
      
      // Verify that the user is changing their own password
      // This assumes an auth middleware that adds userId to the request
      if ((req as any).userId !== parseInt(userId)) {
        return res.status(403).json({ message: 'Not authorized to change this password' });
      }
      
      // Fetch user
      let { data: user, error: userError } = await supabase
        .from("Users")
        .select("id, password")
        .eq("id", userId)
        .eq("Is_Deleted", false)
        .single();
        
      if (userError || !user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Verify current password
      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
      
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Current password is incorrect" });
      }
      
      // Hash and save new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      
      let { error: updateError } = await supabase
        .from("Users")
        .update({ 
          password: hashedPassword,
          updatedAt: new Date()
        })
        .eq("id", userId);
        
      if (updateError) {
        console.error("Error updating password:", updateError);
        return res.status(500).json({ message: "Failed to update password", error: updateError });
      }
      
      res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
      console.error("Error changing password:", error);
      res.status(500).json({ message: "Failed to change password", error });
    }
  }
  
  // Forgot password - send reset email
  public static async forgotPassword(req: express.Request, res: express.Response) {
    try {
      const { email } = req.body;
      
      // Find user by email
      let { data: user, error: userError } = await supabase
        .from("Users")
        .select("id")
        .eq("email", email)
        .eq("Is_Deleted", false)
        .single();
      
      if (userError && !userError.message.includes("No rows found")) {
        console.error("Error finding user:", userError);
        return res.status(500).json({ message: "Error processing request" });
      }
      
      // For security reasons, don't reveal if email exists or not
      if (!user) {
        return res.status(200).json({ message: "If your email is registered, you will receive a password reset link" });
      }
      
      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      
      // Calculate expiration (24 hours from now)
      const resetTokenExpires = new Date();
      resetTokenExpires.setHours(resetTokenExpires.getHours() + 24);
      
      // Save token to user record
      let { error: updateError } = await supabase
        .from("Users")
        .update({ 
          reset_token: resetToken,
          reset_token_expires: resetTokenExpires.toISOString(),
          updatedAt: new Date()
        })
        .eq("id", user.id);
        
      if (updateError) {
        console.error("Error updating reset token:", updateError);
        return res.status(500).json({ message: "Error processing request" });
      }
      
      // Send password reset email
      try {
        await UsersController.sendPasswordResetEmail(email, resetToken);
      } catch (emailError) {
        console.error("Error sending reset email:", emailError);
        return res.status(500).json({ message: "Error sending email" });
      }
      
      res.status(200).json({ message: "If your email is registered, you will receive a password reset link" });
    } catch (error) {
      console.error("Error processing forgot password request:", error);
      res.status(500).json({ message: "Failed to process request", error });
    }
  }
  
  // Reset password with token
  public static async resetPassword(req: express.Request, res: express.Response) {
    try {
      const { token, newPassword } = req.body;
      
      if (!token || !newPassword) {
        return res.status(400).json({ message: "Token and new password are required" });
      }
      
      // Find user by reset token and ensure token hasn't expired
      let { data: user, error: userError } = await supabase
        .from("Users")
        .select("id, reset_token_expires")
        .eq("reset_token", token)
        .eq("Is_Deleted", false)
        .single();
        
      if (userError || !user) {
        return res.status(400).json({ message: "Invalid or expired token" });
      }
      
      // Check if token has expired
      const tokenExpires = new Date(user.reset_token_expires);
      if (tokenExpires < new Date()) {
        return res.status(400).json({ message: "Reset token has expired" });
      }
      
      // Hash and save new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      
      let { error: updateError } = await supabase
        .from("Users")
        .update({ 
          password: hashedPassword,
          reset_token: null,
          reset_token_expires: null,
          updatedAt: new Date()
        })
        .eq("id", user.id);
        
      if (updateError) {
        console.error("Error resetting password:", updateError);
        return res.status(500).json({ message: "Failed to reset password", error: updateError });
      }
      
      res.status(200).json({ message: "Password has been reset successfully" });
    } catch (error) {
      console.error("Error resetting password:", error);
      res.status(500).json({ message: "Failed to reset password", error });
    }
  }
  
  // Helper method to send invitation email
  private static async sendInvitationEmail(email: string, password: string, token: string) {
    const activationLink = `${FRONTEND_URL}/activate-account?token=${token}`;
    
    const mailOptions = {
      from: EMAIL_USER,
      to: email,
      subject: 'Your Account Invitation',
      html: `
        <h2>Welcome!</h2>
        <p>You have been invited to join our system.</p>
        <p>Please use these temporary credentials to log in:</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Temporary Password:</strong> ${password}</p>
        <p>To activate your account and set up your profile, please click the link below:</p>
        <a href="${activationLink}">Complete Your Profile</a>
        <p>This link will expire in 24 hours.</p>
        <p>If you didn't request this invitation, please ignore this email.</p>
      `
    };
    
    await transporter.sendMail(mailOptions);
  }
  
  // Helper method to send password reset email
  private static async sendPasswordResetEmail(email: string, token: string) {
    const resetLink = `${FRONTEND_URL}/reset-password?token=${token}`;
    
    const mailOptions = {
      from: EMAIL_USER,
      to: email,
      subject: 'Password Reset Request',
      html: `
        <h2>Password Reset Request</h2>
        <p>You requested to reset your password.</p>
        <p>Click the link below to set a new password:</p>
        <a href="${resetLink}">Reset Your Password</a>
        <p>This link will expire in 24 hours.</p>
        <p>If you didn't request a password reset, please ignore this email.</p>
      `
    };
    
    await transporter.sendMail(mailOptions);
  }

  public static async verifyToken(req: express.Request, res: express.Response) {
    try {
      const { token } = req.body;
      if (!token) return res.status(400).json({ message: "Token is required" });

      const { data: user, error } = await supabase
        .from("Users")
        .select("id, email, Name, Phone, Telegram, Notify_on_Updates")
        .eq("token", token)
        .eq("Is_Deleted", false)
        .single();

      if (error || !user) return res.status(400).json({ message: "Invalid or expired token" });

      res.json({ userData: user });
    } catch (error) {
      console.error("Error verifying token:", error);
      res.status(500).json({ message: "Server error", error });
    }
  }

  public static async activateAccount(req: express.Request, res: express.Response) {
    try {
      const { token, currentPassword, newPassword, profile } = req.body;
      if (!token || !currentPassword || !newPassword) {
        return res.status(400).json({ message: "All fields are required" });
      }

      // Check if token is valid
      const { data: user, error } = await supabase
        .from("Users")
        .select("id, email, password")
        .eq("token", token)
        .eq("Is_Pending", true)
        .eq("Is_Deleted", false)
        .single();

      if (error || !user) return res.status(400).json({ message: "Invalid or expired token" });

      // Validate temporary password
      const passwordMatch = await bcrypt.compare(currentPassword, user.password);
      if (!passwordMatch) return res.status(400).json({ message: "Invalid temporary password" });

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update user profile
      const updateData = {
        password: hashedPassword,
        Name: profile.Name || null,
        Phone: profile.Phone || null,
        Telegram: profile.Telegram || null,
        Notify_on_Updates: profile.Notify_on_Updates || false,
        Is_Pending: false, // Mark as activated
        token: null, // Remove token
        updatedAt: new Date(),
      };

      const { error: updateError } = await supabase
        .from("Users")
        .update(updateData)
        .eq("id", user.id)
        .eq("Is_Deleted", false);

      if (updateError) throw updateError;

      // Generate a new auth token
      const authToken = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
        expiresIn: "7d",
      });

      res.json({ message: "Account activated successfully", token: authToken });
    } catch (error) {
      console.error("Error activating account:", error);
      res.status(500).json({ message: "Server error", error });
    }
  }

  public static async resendActivationEmail(req: express.Request, res: express.Response) {
    try {
      const { email } = req.body;
      if (!email) return res.status(400).json({ message: "Email is required" });

      const { data: user, error } = await supabase
        .from("Users")
        .select("id, email, token")
        .eq("email", email)
        .eq("Is_Pending", true)
        .eq("Is_Deleted", false)
        .single();

      if (error || !user) return res.status(400).json({ message: "No pending activation for this email" });

      // Generate new token
      const newToken = crypto.randomBytes(32).toString("hex");
      await supabase.from("Users").update({ token: newToken }).eq("id", user.id);

      // Send activation email
      await UsersController.sendInvitationEmail(user.email, "Use your temporary password", newToken);

      res.json({ message: "Activation email resent" });
    } catch (error) {
      console.error("Error resending activation email:", error);
      res.status(500).json({ message: "Server error", error });
    }
  }

  

}
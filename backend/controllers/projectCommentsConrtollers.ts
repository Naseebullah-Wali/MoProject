import express from "express";
import ProjectComment from "../models/project_comments";
import Project from "../models/Projects";
import User from "../models/user";

export class ProjectCommentController {
  public static addComment = async (req: express.Request, res: express.Response) => {
    try {
      const { User_ID, Project_ID, Comment, Is_Deleted } = req.body;

      // Check if the User exists
      const userExists = await User.findByPk(User_ID);
      if (!userExists) {
        return res.status(404).json({ message: "User not found. Please provide a valid User_ID." });
      }

      // Check if the Project exists
      const projectExists = await Project.findByPk(Project_ID);
      if (!projectExists) {
        return res.status(404).json({ message: "Project not found. Please provide a valid Project_ID." });
      }

      // Create new comment
      const newComment = await ProjectComment.create({ User_ID, Project_ID, Comment, Is_Deleted: Is_Deleted || false });

      return res.status(201).json({ message: "Comment added successfully.", comment: newComment });
    } catch (error) {
      console.error("Error adding comment:", error);
      res.status(500).json({ message: "Internal server error", error });
    }
  };

  public static getAllComments = async (req: express.Request, res: express.Response) => {
    try {
      const comments = await ProjectComment.findAll({
        include: [
          { model: User, attributes: ["id", "username", "email"] },
          { model: Project, attributes: ["id", "Post_Title"] },
        ],
      });

      res.status(200).json(comments);
    } catch (error) {
      console.error("Error fetching comments:", error);
      res.status(500).json({ message: "Internal server error", error });
    }
  };

  public static getCommentById = async (req: express.Request, res: express.Response) => {
    try {
      const commentId = req.params.id;
      const comment = await ProjectComment.findByPk(commentId, {
        include: [
          { model: User, attributes: ["id", "username", "email"] },
          { model: Project, attributes: ["id", "Post_Title"] },
        ],
      });

      if (!comment) {
        return res.status(404).json({ message: "Comment not found." });
      }

      res.status(200).json(comment);
    } catch (error) {
      console.error("Error fetching comment:", error);
      res.status(500).json({ message: "Internal server error", error });
    }
  };

  public static updateComment = async (req: express.Request, res: express.Response) => {
    try {
      const commentId = req.params.id;
      const { Comment, Is_Deleted } = req.body;

      const comment = await ProjectComment.findByPk(commentId);
      if (!comment) {
        return res.status(404).json({ message: "Comment not found." });
      }

      // Update fields if provided
      comment.Comment = Comment || comment.Comment;
      comment.Is_Deleted = Is_Deleted !== undefined ? Is_Deleted : comment.Is_Deleted;

      await comment.save();
      res.status(200).json({ message: "Comment updated successfully.", comment });
    } catch (error) {
      console.error("Error updating comment:", error);
      res.status(500).json({ message: "Internal server error", error });
    }
  };

  public static deleteComment = async (req: express.Request, res: express.Response) => {
    try {
      const commentId = req.params.id;

      const comment = await ProjectComment.findByPk(commentId);
      if (!comment) {
        return res.status(404).json({ message: "Comment not found." });
      }

      // Instead of hard delete, mark as deleted
      comment.Is_Deleted = true;
      await comment.save();

      res.status(200).json({ message: "Comment marked as deleted." });
    } catch (error) {
      console.error("Error deleting comment:", error);
      res.status(500).json({ message: "Internal server error", error });
    }
  };
}

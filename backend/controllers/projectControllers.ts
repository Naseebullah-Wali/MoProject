import express from 'express';
import Project from '../models/Projects';
import Country from '../models/Countries';
import Topic from '../models/Topics';

export class projectController {
  public static async createProject(req: express.Request, res: express.Response) {
    try {
      const project = await Project.create(req.body);
      res.status(201).json(project);
    } catch (error) {
      console.error('Error creating project:', error);
      res.status(500).json({ message: 'Error creating project', error });
    }
  }

  public static async getProjects(req: express.Request, res: express.Response) {
    try {
      const projects = await Project.findAll({
        include: [Country, Topic],
      });
      res.status(200).json(projects);
    } catch (error) {
      console.error('Error fetching projects:', error);
      res.status(500).json({ message: 'Error fetching projects', error });
    }
  }

  public static async getProjectById(req: express.Request, res: express.Response) {
    const { id } = req.params;
    try {
      const project = await Project.findOne({
        where: { id },
        include: [Country, Topic],
      });
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }
      res.status(200).json(project);
    } catch (error) {
      console.error('Error fetching project by ID:', error);
      res.status(500).json({ message: 'Error fetching project', error });
    }
  }

  public static async updateProject(req: express.Request, res: express.Response) {
    const { id } = req.params;
    try {
      const project = await Project.findOne({ where: { id } });
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }
      await project.update(req.body);
      res.status(200).json({ message: 'Project updated successfully', project });
    } catch (error) {
      console.error('Error updating project:', error);
      res.status(500).json({ message: 'Error updating project', error });
    }
  }

  public static async deleteProject(req: express.Request, res: express.Response) {
    const { id } = req.params;
    try {
      const project = await Project.destroy({ where: { id } });
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }
      res.status(200).json({ message: 'Project deleted successfully' });
    } catch (error) {
      console.error('Error deleting project:', error);
      res.status(500).json({ message: 'Error deleting project', error });
    }
  }
}

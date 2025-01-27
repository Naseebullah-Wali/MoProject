import express from 'express';
import Topic from '../models/Topics';

export class topicsController {
  public static async createTopic(req: express.Request, res: express.Response) {
    const { Topic } = req.body;

    try {
      const newTopic = await Topic.create({ Topic });
      res.status(201).json(newTopic);
    } catch (error) {
      console.error('Error creating topic:', error);
      res.status(500).json({ message: 'Error creating topic', error });
    }
  }

  public static async getAllTopics(req: express.Request, res: express.Response) {
    try {
      const topics = await Topic.findAll();
      res.status(200).json(topics);
    } catch (error) {
      console.error('Error fetching topics:', error);
      res.status(500).json({ message: 'Error fetching topics', error });
    }
  }

  public static async getTopicById(req: express.Request, res: express.Response) {
    const { id } = req.params;

    try {
      const topic = await Topic.findOne({ where: { id } });
      if (!topic) {
        return res.status(404).json({ message: 'Topic not found' });
      }
      res.status(200).json(topic);
    } catch (error) {
      console.error('Error fetching topic:', error);
      res.status(500).json({ message: 'Error fetching topic', error });
    }
  }

  public static async updateTopic(req: express.Request, res: express.Response) {
    const { id } = req.params;
    const { Topic } = req.body;

    try {
      const topic = await Topic.findOne({ where: { id } });
      if (!topic) {
        return res.status(404).json({ message: 'Topic not found' });
      }

      topic.Topic = Topic;
      await topic.save();
      res.status(200).json(topic);
    } catch (error) {
      console.error('Error updating topic:', error);
      res.status(500).json({ message: 'Error updating topic', error });
    }
  }

  public static async deleteTopic(req: express.Request, res: express.Response) {
    const { id } = req.params;

    try {
      const rowsDeleted = await Topic.destroy({ where: { id } });
      if (rowsDeleted === 0) {
        return res.status(404).json({ message: 'Topic not found' });
      }
      res.status(200).json({ message: 'Topic deleted successfully' });
    } catch (error) {
      console.error('Error deleting topic:', error);
      res.status(500).json({ message: 'Error deleting topic', error });
    }
  }
}

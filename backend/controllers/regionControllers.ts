import express from 'express';
import Region from '../models/Region'; // Import the Region model

export class regionControllers {
  // POST: Create a new region
  public static CreateRegion = async (req: express.Request, res: express.Response) => {
    const { Region_Name } = req.body;

    if (!Region_Name) {
      return res.status(400).json({ message: "Region_Name is required!" });
    }

    try {
      const newRegion = await Region.create({ Region_Name });
      res.status(201).json({
        message: `Region "${Region_Name}" created successfully!`,
        region: newRegion,
      });
    } catch (error) {
      console.error("Error creating region:", error);
      res.status(500).json({ message: "An error occurred while creating the region." });
    }
  };

  // GET: Show all regions
  public static ShowRegions = async (req: express.Request, res: express.Response) => {
    try {
      const allRegions = await Region.findAll();
      res.status(200).json(allRegions);
    } catch (error) {
      console.error("Error fetching regions:", error);
      res.status(500).json({ message: "An error occurred while fetching regions." });
    }
  };

  // GET: Find region by ID
  public static FindRegionById = async (req: express.Request, res: express.Response) => {
    const { id } = req.params;

    try {
      const region = await Region.findOne({ where: { id } });
      if (!region) {
        return res.status(404).json({ message: "Region not found!" });
      }
      res.status(200).json(region);
    } catch (error) {
      console.error("Error fetching region by ID:", error);
      res.status(500).json({ message: "An error occurred while fetching the region." });
    }
  };

  // PUT: Update a region
  public static UpdateRegion = async (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    const { Region_Name } = req.body;

    try {
      const region = await Region.findOne({ where: { id } });
      if (!region) {
        return res.status(404).json({ message: "Region not found!" });
      }

      region.Region_Name = Region_Name || region.Region_Name; // Update if a new value is provided
      await region.save();

      res.status(200).json({
        message: `Region "${id}" updated successfully!`,
        region,
      });
    } catch (error) {
      console.error("Error updating region:", error);
      res.status(500).json({ message: "An error occurred while updating the region." });
    }
  };

  // DELETE: Delete a region
  public static DeleteRegion = async (req: express.Request, res: express.Response) => {
    const { id } = req.params;

    try {
      const deletedRows = await Region.destroy({ where: { id } });
      if (!deletedRows) {
        return res.status(404).json({ message: "Region not found!" });
      }

      res.status(200).json({ message: `Region "${id}" deleted successfully!` });
    } catch (error) {
      console.error("Error deleting region:", error);
      res.status(500).json({ message: "An error occurred while deleting the region." });
    }
  };
}

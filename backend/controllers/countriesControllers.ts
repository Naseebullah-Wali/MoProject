import express from 'express';
import Country from '../models/Countries'; 
import Region from '../models/Region'; 

export class countryControllers {
  public static addCountry = async (req: express.Request, res: express.Response) => {
    try {
      const { Country_Name, Flag, Region_ID } = req.body;

      const regionExists = await Region.findByPk(Region_ID);
      if (!regionExists) {
        return res.status(404).json({ message: "Region not found. Please provide a valid Region_ID." });
      }

      const newCountry = await Country.create({ Country_Name, Flag, Region_ID });
      return res.status(201).json({ message: "Country added successfully.", country: newCountry });
    } catch (error) {
      console.error("Error adding country:", error);
      res.status(500).json({ message: "Internal server error", error });
    }
  };

  public static getAllCountries = async (req: express.Request, res: express.Response) => {
    try {
      const countries = await Country.findAll({
        include: [{ model: Region, attributes: ['Region_Name'] }],
      });
      res.status(200).json(countries);
    } catch (error) {
      console.error("Error fetching countries:", error);
      res.status(500).json({ message: "Internal server error", error });
    }
  };


  public static getCountryById = async (req: express.Request, res: express.Response) => {
    try {
      const countryId = req.params.id;
      const country = await Country.findByPk(countryId, {
        include: [{ model: Region, attributes: ['Region_Name'] }], 
      });

      if (!country) {
        return res.status(404).json({ message: "Country not found." });
      }
      res.status(200).json(country);
    } catch (error) {
      console.error("Error fetching country:", error);
      res.status(500).json({ message: "Internal server error", error });
    }
  };

  public static updateCountry = async (req: express.Request, res: express.Response) => {
    try {
      const countryId = req.params.id;
      const { Country_Name, Flag, Region_ID } = req.body;

      const country = await Country.findByPk(countryId);
      if (!country) {
        return res.status(404).json({ message: "Country not found." });
      }

      if (Region_ID) {
        const regionExists = await Region.findByPk(Region_ID);
        if (!regionExists) {
          return res.status(404).json({ message: "Region not found. Please provide a valid Region_ID." });
        }
      }

      country.Country_Name = Country_Name || country.Country_Name;
      country.Flag = Flag || country.Flag;
      country.Region_ID = Region_ID || country.Region_ID;

      await country.save();
      res.status(200).json({ message: "Country updated successfully.", country });
    } catch (error) {
      console.error("Error updating country:", error);
      res.status(500).json({ message: "Internal server error", error });
    }
  };

  public static deleteCountry = async (req: express.Request, res: express.Response) => {
    try {
      const countryId = req.params.id;

      const country = await Country.findByPk(countryId);
      if (!country) {
        return res.status(404).json({ message: "Country not found." });
      }

      await country.destroy();
      res.status(200).json({ message: "Country deleted successfully." });
    } catch (error) {
      console.error("Error deleting country:", error);
      res.status(500).json({ message: "Internal server error", error });
    }
  };
}

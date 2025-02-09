import { Sequelize } from "sequelize-typescript";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv"; 
dotenv.config();

import User from "../models/user";
import Region from "../models/Region";
import Country from "../models/Countries";
import Company from "../models/Companies";
import Topic from "../models/Topics";
import Project from "../models/Projects";
import ProjectComment from "../models/project_comments";
import { setupAssociations } from "../models/associations";

const SUPABASE_URL = process.env.SUPABASE_URL || "";
const SUPABASE_KEY = process.env.SUPABASE_KEY || "";
const sequelize = new Sequelize({
  database: process.env.DB_NAME || "postgres",
  dialect: "postgres",
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "your_password",
  host: process.env.DB_HOST || "your_host",
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 6543,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  logging: false,
});

// sequelize.addModels([User, Region, Country, Company, Topic, Project, ProjectComment]);
sequelize.addModels([User]);

// Set up Model Associations
// setupAssociations();

// Sync Database
sequelize
  .sync()
  .then(() => {
    console.log("Database is synced ✅");
  })
  .catch((error) => {
    console.error("Error syncing database:", error);
  });

// Supabase Client Configuration
// console.log(SUPABASE_KEY, SUPABASE_URL)
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export { sequelize, supabase };

import Region from "./Region";
import Country from "./Countries";
import Company from "./Companies";
import Topic from "./Topics";
import Project from "./Projects";
import User from "./user";
import ProjectComment from "./project_comments";

export const setupAssociations = () => {
  // 🏢 Region-Company association
  Region.hasMany(Company, { foreignKey: "Region_ID" });
  Company.belongsTo(Region, { foreignKey: "Region_ID" });

  // 🌍 Country-Company association
  Country.hasMany(Company, { foreignKey: "Country_ID" });
  Company.belongsTo(Country, { foreignKey: "Country_ID" });

  // 🌍 Country-Project association
  Country.hasMany(Project, { foreignKey: "Country_ID" });
  Project.belongsTo(Country, { foreignKey: "Country_ID" });

  // 📌 Topic-Project association
  Topic.hasMany(Project, { foreignKey: "Topic_ID" });
  Project.belongsTo(Topic, { foreignKey: "Topic_ID" });

  // 👥 User-ProjectComment association
  User.hasMany(ProjectComment, { foreignKey: "User_ID" });
  ProjectComment.belongsTo(User, { foreignKey: "User_ID" });

  // 📄 Project-ProjectComment association
  Project.hasMany(ProjectComment, { foreignKey: "Project_ID" });
  ProjectComment.belongsTo(Project, { foreignKey: "Project_ID" });
};

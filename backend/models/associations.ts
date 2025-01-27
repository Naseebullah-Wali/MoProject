import Region from './Region';
import Country from './Countries';
import Company from './Companies';
import Topic from './Topics';
import Project from './Projects';

export const setupAssociations = () => {
  // Region-Company association
  Region.hasMany(Company, { foreignKey: 'Region_ID' });
  Company.belongsTo(Region, { foreignKey: 'Region_ID' });

  // Country-Company association
  Country.hasMany(Company, { foreignKey: 'Country_ID' });
  Company.belongsTo(Country, { foreignKey: 'Country_ID' });

  // Country-Project association
  Country.hasMany(Project, { foreignKey: 'Country_ID' });
  Project.belongsTo(Country, { foreignKey: 'Country_ID' });

  // Topic-Project association
  Topic.hasMany(Project, { foreignKey: 'Topic_ID' });
  Project.belongsTo(Topic, { foreignKey: 'Topic_ID' });
};

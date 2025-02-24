import express from "express";
import { userControllers } from "../controllers/pageControllers";
import { body } from "express-validator";
import jwtout from "../middleware/jwtout";
import { regionControllers } from "../controllers/regionControllers";
// import { companyControllers } from "../controllers/companiesController";
import { topicsController } from "../controllers/topicsControllers";
// import { projectController } from "../controllers/projectControllers";
import { ProjectTopicController } from "../controllers/functionCallController"; // Import the new controller
import { ProjectUpdatesController } from "../controllers/projectUpdateFunctionCall";
import { NewsController } from "../controllers/funcNews";
import { ProjectCommentsController } from "../controllers/funcComments";
import { ScientificReviewController } from "../controllers/funcScientificReview";
import { CountriesController } from "../controllers/funcCountries";
import { CompaniesController } from "../controllers/funcCompanies";
import { CharactersController } from "../controllers/funcCharacter";
import { StatusController } from "../controllers/funcStatus";
// import upload from '../middleware/multer';

const rout: express.Router = express.Router();

// User Routes
rout.post('/users', userControllers.UserPost);
rout.get('/users', userControllers.ShowUsers);
rout.get('/users/:id', userControllers.FindById);
rout.put('/users/:id', userControllers.UpdateUser);
rout.delete('/users/:id', userControllers.DeleteUser);
rout.post('/login', [
    body('email').not().isEmpty().withMessage('Email is required'),
    body('password').not().isEmpty().withMessage('Password is required')
], userControllers.Login);
rout.get('/jwt', jwtout, (req, res) => {
    console.log('JWT check successful');
});

// Regions
rout.get('/regions', regionControllers.ShowRegions);


// Topics
rout.post('/topics', topicsController.createTopic);
rout.get('/topics', topicsController.getAllTopics);
rout.get('/topics/:id', topicsController.getTopicById);
rout.put('/topics/:id', topicsController.updateTopic);
rout.delete('/topics/:id', topicsController.deleteTopic);

// Projects
// rout.post('/projects', projectController.createProject);
// rout.get('/projects', projectController.getProjects);
// rout.get('/projects/:id', projectController.getProjectById);
// rout.put('/projects/:id', projectController.updateProject);
// rout.delete('/projects/:id', projectController.deleteProject);


//function get project by user id
rout.get('/project-topics/:id', ProjectTopicController.getProjectTopicsByProjectId);
rout.get("/project-updates/:id", ProjectUpdatesController.getProjectUpdatesByProjectId);



//Sciencetific Reviews
rout.get("/scientific-reviews",ScientificReviewController.getScientificReviews)
rout.get("/scientific-reviews/user/:userId", ScientificReviewController.getScientificReviewsByUserId);
rout.post("/scientific-reviews", ScientificReviewController.addScientificReview);
rout.put("/scientific-reviews/:id", ScientificReviewController.updateScientificReview);
rout.delete("/scientific-reviews/:id", ScientificReviewController.deleteScientificReview);


//News
rout.get("/news", NewsController.getAllNews)
rout.get("/news/:userId", NewsController.getNewsByUserId);
rout.post("/news", NewsController.addNews);
rout.put("/news/:newsId", NewsController.updateNews);
rout.delete("/news/:newsId", NewsController.deleteNews);


//Comments
rout.get("/project-comments/:projectId", ProjectCommentsController.getProjectCommentsByProjectId);
rout.post("/project-comments", ProjectCommentsController.addProjectComment);
rout.put("/project-comments/:commentId", ProjectCommentsController.updateProjectComment);
rout.delete("/project-comments/:commentId", ProjectCommentsController.deleteProjectComment);
rout.get("/project-comments",ProjectCommentsController.getAllComments)

//Countries
rout.get("/countries", CountriesController.getAllCountries);
rout.get("/countries/:id", CountriesController.getCountryById);
// rout.post("/countries", CountriesController.addCountry);
// rout.put("/countries/:id", CountriesController.updateCountry);
rout.delete("/countries/:id", CountriesController.deleteCountry);
// rout.post('/countries', upload.single('Flag'), CountriesController.addCountry);
// rout.put('/countries/:id', upload.single('Flag'), CountriesController.updateCountry);



//Companies
// rout.post('/companies', upload.single('Company_Logo'), CompaniesController.addCompany);
// rout.put('/companies/:id', upload.single('Company_Logo'), CompaniesController.updateCompany);
rout.get("/companies", CompaniesController.getAllCompanies);
rout.get("/companies/:id", CompaniesController.getCompanyById);
// rout.post("/companies", CompaniesController.addCompany);
// rout.put("/companies/:id", CompaniesController.updateCompany);
rout.delete("/companies/:id", CompaniesController.deleteCompany);


//Characters
rout.get("/characters", CharactersController.getAllCharacters);
rout.get("/characters/:id", CharactersController.getCharacterById);
rout.post("/characters", CharactersController.addCharacter);
rout.put("/characters/:id", CharactersController.updateCharacter);
rout.delete("/characters/:id", CharactersController.deleteCharacter);



//Statuses
rout.get("/statuses", StatusController.getAllStatuses);
rout.get("/statuses/:id", StatusController.getStatusById);
rout.post("/statuses", StatusController.addStatus);
rout.put("/statuses/:id", StatusController.updateStatus);
rout.delete("/statuses/:id", StatusController.deleteStatus);

export default rout;

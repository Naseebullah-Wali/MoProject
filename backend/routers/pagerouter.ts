import express from "express";
import { userControllers } from "../controllers/pageControllers";
import { body } from "express-validator";
import jwtout from "../middleware/jwtout";
import { regionControllers } from "../controllers/regionControllers";
import { countryControllers } from "../controllers/countriesControllers";
import { companyControllers } from "../controllers/companiesController";
import { topicsController } from "../controllers/topicsControllers";
import { projectController } from "../controllers/projectControllers";
import { ProjectTopicController } from "../controllers/functionCallController"; // Import the new controller
import { ProjectUpdatesController } from "../controllers/projectUpdateFunctionCall";
import { ProjectCommentController } from "../controllers/projectCommentsConrtollers";
import { ScientificReviewController } from "../controllers/funcScientificReview";
import { NewsController } from "../controllers/funcNews";
import { ProjectCommentsController } from "../controllers/funcComments";




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

// Countries
rout.get('/countries', countryControllers.getAllCountries);

// Companies
rout.post('/companies', companyControllers.createCompany);
rout.get('/companies', companyControllers.getAllCompanies);
rout.get('/companies/:id', companyControllers.getCompanyById);
rout.put('/companies/:id', companyControllers.updateCompany);
rout.delete('/companies/:id', companyControllers.deleteCompany);

// Topics
rout.post('/topics', topicsController.createTopic);
rout.get('/topics', topicsController.getAllTopics);
rout.get('/topics/:id', topicsController.getTopicById);
rout.put('/topics/:id', topicsController.updateTopic);
rout.delete('/topics/:id', topicsController.deleteTopic);

// Projects
rout.post('/projects', projectController.createProject);
rout.get('/projects', projectController.getProjects);
rout.get('/projects/:id', projectController.getProjectById);
rout.put('/projects/:id', projectController.updateProject);
rout.delete('/projects/:id', projectController.deleteProject);



//Comments
// rout.post("/project-comments", ProjectCommentController.addComment);
// rout.get("/project-comments", ProjectCommentController.getAllComments);
// rout.get("/project-comments/:id", ProjectCommentController.getCommentById);
// rout.put("/project-comments/:id", ProjectCommentController.updateComment);
// rout.delete("/project-comments/:id", ProjectCommentController.deleteComment);



//function get project by user id
rout.get('/project-topics/:id', ProjectTopicController.getProjectTopicsByProjectId);
rout.get("/project-updates/:id", ProjectUpdatesController.getProjectUpdatesByProjectId);

//Sciencetific Reviews
rout.get("/SciReviews/:userId", ScientificReviewController.getScientificReviewsByUserId);

//News
rout.get("/news/:userId", NewsController.getNewsByUserId);


//Comments
rout.get("/project-comments/:projectId", ProjectCommentsController.getProjectCommentsByProjectId);


export default rout;

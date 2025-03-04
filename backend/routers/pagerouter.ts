import express from "express";
// import { userControllers } from "../controllers/pageControllers";
import { body } from "express-validator";
import jwtout from "../middleware/jwtout";
import { ProjectUpdatesController } from "../controllers/funcProjectUpdates";
import { TopicsController } from "../controllers/funcTopics";
import { ProjectsController } from "../controllers/funcProject";
import { ProjectTopicController } from "../controllers/functionCallController";
import { projectUpdateFunctionCall } from "../controllers/projectUpdateFunctionCall";
import { NewsController } from "../controllers/funcNews";
import { ProjectCommentsController } from "../controllers/funcComments";
import { ScientificReviewController } from "../controllers/funcScientificReview";
import { CountriesController } from "../controllers/funcCountries";
import { CompaniesController } from "../controllers/funcCompanies";
import { CharactersController } from "../controllers/funcCharacter";
import { StatusController } from "../controllers/funcStatus";
import { DocumentTypeController } from "../controllers/funcDocType";
import { ProjectTopicsController } from "../controllers/funcProjectTopic";
import { UsersController } from "../controllers/funcUsers";
import { UserTypesController } from "../controllers/funcUsersTypes";
import upload from '../middleware/multer';

const rout: express.Router = express.Router();

// // User Routes
// rout.post('/users', userControllers.UserPost);
// rout.get('/users', userControllers.ShowUsers);
// rout.get('/users/:id', userControllers.FindById);
// rout.put('/users/:id', userControllers.UpdateUser);
// rout.delete('/users/:id', userControllers.DeleteUser);
// rout.post('/login', [
//     body('email').not().isEmpty().withMessage('Email is required'),
//     body('password').not().isEmpty().withMessage('Password is required')
// ], userControllers.Login);
// rout.get('/jwt', jwtout, (req, res) => {
//     console.log('JWT check successful');
// });



// Topics
rout.post('/topics', TopicsController.addTopic);
rout.get('/topics', TopicsController.getAllTopics);
rout.get('/topics/:id', TopicsController.getTopicById);
rout.put('/topics/:id', TopicsController.updateTopic);
rout.delete('/topics/:id', TopicsController.deleteTopic);

// Projects
rout.get('/projects', ProjectsController.getAllProjects);
rout.delete('/projects/:id', ProjectsController.deleteProject);
rout.post('/projects', upload.fields([
    { name: 'Image', maxCount: 1 },
    { name: 'File1', maxCount: 1 },
    { name: 'File2', maxCount: 1 },
    { name: 'File3', maxCount: 1 }
  ]), ProjectsController.addProject);
  
  rout.put('/projects/:id', upload.fields([
    { name: 'Image', maxCount: 1 },
    { name: 'File1', maxCount: 1 },
    { name: 'File2', maxCount: 1 },
    { name: 'File3', maxCount: 1 }
  ]), ProjectsController.updateProject);





//function get project by user id
rout.get('/project-topics/:id', ProjectTopicController.getProjectTopicsByProjectId);
rout.get("/project-updates/:id", projectUpdateFunctionCall.getProjectUpdatesByProjectId);



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
rout.delete("/countries/:id", CountriesController.deleteCountry);
rout.post('/countries', upload.single('Flag'), CountriesController.addCountry);
rout.put('/countries/:id', upload.single('Flag'), CountriesController.updateCountry);



//Companies
rout.post('/companies', upload.single('Company_Logo'), CompaniesController.addCompany);
rout.put('/companies/:id', upload.single('Company_Logo'), CompaniesController.updateCompany);
rout.get("/companies", CompaniesController.getAllCompanies);
rout.get("/companies/:id", CompaniesController.getCompanyById);
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




//ProjectUpdates
rout.get('/project-updates', ProjectUpdatesController.getAllProjectUpdates);
rout.get('/project-updates/:id', ProjectUpdatesController.getProjectUpdateById);
rout.post('/project-updates', upload.fields([
  { name: 'file1', maxCount: 1 },
  { name: 'file2', maxCount: 1 },
  { name: 'file3', maxCount: 1 },
  { name: 'file4', maxCount: 1 },
  { name: 'file5', maxCount: 1 },
  { name: 'file6', maxCount: 1 }
]), ProjectUpdatesController.addProjectUpdate);
rout.put('/project-updates/:id', upload.fields([
  { name: 'file1', maxCount: 1 },
  { name: 'file2', maxCount: 1 },
  { name: 'file3', maxCount: 1 },
  { name: 'file4', maxCount: 1 },
  { name: 'file5', maxCount: 1 },
  { name: 'file6', maxCount: 1 }
]), ProjectUpdatesController.updateProjectUpdate);
rout.delete('/project-updates/:id', ProjectUpdatesController.deleteProjectUpdate);




//Document-Type
rout.get('/document-types', DocumentTypeController.getAllDocumentTypes);
rout.get('/document-types/:id', DocumentTypeController.getDocumentTypeById);
rout.post('/document-types', DocumentTypeController.addDocumentType);
rout.put('/document-types/:id', DocumentTypeController.updateDocumentType);
rout.delete('/document-types/:id', DocumentTypeController.deleteDocumentType);




//Project Topic Assiostion table
rout.get('/project-topicsRelation', ProjectTopicsController.getAllProjectTopics);
rout.get('/project-topicsRelation/project/:projectId', ProjectTopicsController.getProjectTopicsByProjectId);
rout.get('/project-topicsRelation/topic/:topicId', ProjectTopicsController.getProjectTopicsByTopicId);
rout.post('/project-topicsRelation', ProjectTopicsController.addProjectTopic);
rout.delete('/project-topicsRelation/:id', ProjectTopicsController.deleteProjectTopic);





//users
rout.get('/users', UsersController.getAllUsers);
rout.get('/users/:id', UsersController.getUserById);
rout.post('/users', UsersController.addUser);
rout.put('/users/:id', UsersController.updateUser);
rout.delete('/users/:id', UsersController.deleteUser);
rout.post('/accept-user', UsersController.acceptUser);

//users types
rout.get('/user-types', UserTypesController.getAllUserTypes);
rout.get('/user-types/:id', UserTypesController.getUserTypeById);
rout.post('/user-types', UserTypesController.addUserType);
rout.put('/user-types/:id', UserTypesController.updateUserType);
rout.delete('/user-types/:id', UserTypesController.deleteUserType);


export default rout;

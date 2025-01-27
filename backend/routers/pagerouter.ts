import express from "express"
import { userControllers } from "../controllers/pageControllers";
import {body, validationResult} from 'express-validator'
import jwtout from "../middleware/jwtout";
import { regionControllers } from "../controllers/regionControllers";
import { countryControllers } from "../controllers/countriesControllers";
import { companyControllers } from "../controllers/companiesController";
import { topicsController } from "../controllers/topicsControllers";
import { projectController } from "../controllers/projectControllers";
const rout:express.Router = express.Router();


rout.post('/users', userControllers.UserPost);
rout.get('/users',  userControllers.ShowUsers)
rout.get('/users/:id',userControllers.FindById)
rout.put('/users/:id',userControllers.UpdateUser)
rout.delete('/users/:id',userControllers.DeleteUser)
rout.post('/login',[
    body('email').not().isEmpty().withMessage('email is Required'),
    body('password').not().isEmpty().withMessage('password is Required')
],userControllers.Login)
rout.get('/jwt',jwtout, (req,res)=>{
    console.log('test')
})



//Regions
rout.get('/regions',  regionControllers.ShowRegions)


//Countries
rout.get('/countries',  countryControllers.getAllCountries)

//Companies
rout.post('/companies', companyControllers.createCompany);
rout.get('/companies', companyControllers.getAllCompanies);
rout.get('/companies/:id', companyControllers.getCompanyById);
rout.put('/companies/:id', companyControllers.updateCompany);
rout.delete('/companies/:id', companyControllers.deleteCompany);

//Topics
rout.post('/topics', topicsController.createTopic);
rout.get('/topics', topicsController.getAllTopics);
rout.get('/topics/:id', topicsController.getTopicById);
rout.put('/topics/:id', topicsController.updateTopic);
rout.delete('/topics/:id', topicsController.deleteTopic);


//Projects
rout.post('/projects', projectController.createProject);
rout.get('/projects', projectController.getProjects);
rout.get('/projects/:id', projectController.getProjectById);
rout.put('/projects/:id', projectController.updateProject);
rout.delete('/projects/:id', projectController.deleteProject);





export default rout;
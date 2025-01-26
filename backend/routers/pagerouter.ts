import express from "express"
// import {show,UserPost,ShowUsers,FindById,UpdateUser,DeleteUser} from "../Controllers/userControllers";
import { userControllers } from "../controllers/pageControllers";
import {body, validationResult} from 'express-validator'
import jwtout from "../middleware/jwtout";
import { regionControllers } from "../controllers/regionControllers";
const rout:express.Router = express.Router();


rout.post('/users', userControllers.UserPost);

rout.get('/users',  userControllers.ShowUsers)

rout.get('/regions',  regionControllers.ShowRegions)

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
export default rout;
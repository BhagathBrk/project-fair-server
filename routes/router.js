const express = require('express')
const router = new express.Router()
const userController = require('../controllers/userController')
const projectController = require("../controllers/projectControllers")
const jwtMiddleware = require("../middlewares/jwtMiddleware")
const multerMiddleware = require('../middlewares/multerMiddleware')




// register : http://localhost:3000/register
router.post('/register', userController.registerController)


// login : http://localhost:3000/login
router.post('/login', userController.loginController)

// add-project : http://localhost:3000/add-project
router.post('/add-project',jwtMiddleware, multerMiddleware.single('projectIMG'), projectController.addProjectController)

router.get('/home-project', projectController.homePageProjectController)

router.get('/all-project', jwtMiddleware, projectController.allProjectController)

// user-project : http://localhost:3000/user-project
router.get('/user-project', jwtMiddleware, projectController.userProjectController)

// projects/id/edit : http://localhost:3000/projects/id/edit
router.put('/projects/:id/edit',jwtMiddleware, multerMiddleware.single('projectIMG'), projectController.editProjectController)

// projects/id/edit : http://localhost:3000/projects/id/remove
router.delete('/projects/:id/remove',jwtMiddleware, projectController.removeProjectController)

// edit-user : http://localhost:3000/projects/id/remove
router.put('/edit-user',jwtMiddleware, multerMiddleware.single('profilePic'), userController.editUserController)


module.exports = router
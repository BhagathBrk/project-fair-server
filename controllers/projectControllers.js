const projects = require("../models/projectModel")

// add projects
exports.addProjectController = async (req, res) => {
    console.log("inside addProjectController");
    const userId = req.userId
    console.log(userId);

    const { title, languages, overview, github, website } = req.body

    const projectIMG = req.file.filename
    console.log(title, languages, overview, github, website, projectIMG);

    try {

        const existingProject = await projects.findOne({ github })
        // console.log(existingProject)
        if (existingProject) {
            res.status(406).json("Project already exists")
        } else {
            const newProject = new projects({
                title, languages, overview, github, website, projectIMG, userId
            })
            await newProject.save()
            res.status(200).json(newProject)
        }

    } catch (err) {
        res.status(401).json(err)
    }

}

exports.homePageProjectController = async (req, res)=>{
    console.log("inside homePageProjectController");

    try{
        const allHomeProjects = await projects.find().limit(3)
        res.status(200).json(allHomeProjects)
    }catch(err){
        res.status(401).json(err)
    }
    
}


// get all projects - authorization needed

exports.allProjectController = async (req, res)=>{
    const searchKey = req.query.search
    console.log(searchKey);
    
    console.log("inside allProjectController");

    const query = {
        languages: {
            $regex: searchKey,
             $options:'i'
        }
    }


    try{
        const allProjects = await projects.find(query)
        res.status(200).json(allProjects)
    }catch(err){
        res.status(401).json(err)
    }
    
}


// get user projects - authorization needed


exports.userProjectController = async (req, res)=>{    
    console.log("inside userProjectController");

  const userId = req.userId


    try{
const allUserProjects = await projects.find({userId})
        res.status(200).json(allUserProjects)
    }catch(err){
        res.status(401).json(err)
    }
    
}



// editProjects - authorization needed


exports.editProjectController = async (req, res)=>{    
    console.log("inside userProjectController");

 
    const id = req.params.id
    const userId = req.userId
    const {title, languages, overview, github, website, projectIMG} = req.body
    const reUploadProjectImg = req.file? req.file.filename : projectIMG


    try{

        const updateProject = await projects.findByIdAndUpdate({_id:id}, {title, languages, overview, github, website, projectIMG : reUploadProjectImg, userId}, {new:true})
        await updateProject.save()
        res.status(200).json(updateProject)
    }catch(err){
        res.status(401).json(err)
    }
    
}


// removeProject l- need authorization

exports.removeProjectController = async (req, res)=>{
    console.log("removeProjectController");
    const {id} = req.params
    try {

        const deleteProject = await projects.findByIdAndDelete({_id:id})
        res.status(200).json(deleteProject)

    } catch (err) {
        res.status(401).json(err)
        
        
    }
    
}
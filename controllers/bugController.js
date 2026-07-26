const Bug=require('../models/Bug');
const User=require('../models/User');

//CREATE a bug
const createBug=async(req,res)=>{
    try{
        const{ title,description, stepsToReproduce,severity}=req.body;
        const newBug= await Bug.create({
            title,
            description,
            stepsToReproduce,
            severity,
            reporterId:req.user.id,
        });
        const bug=await Bug.findByPk(newBug.id,{
            include:[
                {
                    model:User,as:'reporter',attributes:['id','name','email']
                },
                {
                    model:User,as:'assignee',attributes:['id','name','email']
                },
            ],
        });

      res.status(201).json({message:'Bug created successfully.',bug});

    }
    catch(error){
        res.status(500).json({message:'Failed to create bug.',error:error.message});
    }
};

//GET all bugs
const getAllBugs=async(req,res)=>{
    try{
        const bugs=await Bug.findAll({
            include:[
                {
                    model:User,as:'reporter',attributes:['id','name','email']
                },
                {
                    model:User,as:'assignee',attributes:['id','name','email']
                },
            ],
        });
        res.status(200).json({bugs});
    }
    catch(error){
        res.status(500).json({message:'Failed to fetch bugs.',error:error.message});
    }
};

//GET a single bug by id
const getBugById=async(req,res)=>{
    try{
        const bug=await Bug.findByPk(req.params.id,{
            include:[
                {
                    model:User,as:'reporter',attributes:['id','name','email']
                },
                {
                     model:User,as:'assignee',attributes:['id','name','email']
                },

            ],
        });
        if(!bug){
            return res.status(404).json({message:'Big not found.'});
        }
        res.status(200).json({bug});
    }
    catch(error){
        res.status(500).json({message:'Failed to fetch bug', error:error.message});
    }
    
};

//UPDATE a bug
const updateBug=async(req,res)=>{
    try{
        const bug=await Bug.findByPk(req.params.id);
        if(!bug){
            return res.status(404).json({message:'Bug not found.'});

        }
        const{title,description,severity,status,assigneeId}=req.body;
        await bug.update({ title,description,severity,status,assigneeId});
        
        const updatedBug = await Bug.findByPk(bug.id, {
      include: [
        { model: User, as: 'reporter', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'assignee', attributes: ['id', 'name', 'email'] },
      ],
    });
        res.status(200).json({message:'Bug updated successfully.',bug:updatedBug});

    }
    catch(error){
        res.status(500).json({mesage:'Failed to update bug.',error:error.message});
    }
};

//DELETE a bug
const deleteBug=async(req,res)=>{
    try{
        const bug= await Bug.findByPk(req.params.id);
        if(!bug){
            return res.status(404).json({message:'Bug not found.'});

        }
        await bug.destroy();
        res.status(200).json({message:'Bug deleted successfully.'});
    }
    catch(error){
        res.status(500).json({message:'Failed to delete bug.',error:error.message});

    }
};
module.exports= {createBug,getAllBugs,getBugById,updateBug,deleteBug
};

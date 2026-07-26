const bcrypt=require('bcryptjs');
const jwt = require('jsonwebtoken');
const User=require('../models/User');

const signup=async(req,res)=>{
    try{
        const{name,email,password} =req.body;

        //check if user already exists
        const existingUser=await User.findOne({where:{email}});
        if(existingUser){
            return res.status(400).json({message: 'User already exists with this email.'});
        }

        //Hash the password before saving
        const hashedPassword=await bcrypt.hash(password,10);

        // Create the user
        const newUser=await User.create({
            name,
            email,
            password:hashedPassword,
        });
        res.status(201).json({
            message:'User created successfully.',
            user:{id:newUser.id, 
                  name:newUser.name, 
                  email:newUser.email,
                  role:newUser.role},
        });
    }
    catch(error){
        res.status(500).json({message:'Signup failed.',error: error.message});
    }
};

const login=async (req,res)=>{
    try{
        const{email,password}=req.body;

        //Find the user
        const user=await User.findOne({where:{email}});
        if(!user){
            return res.status(400).json({message :'Invalid email or password.'});
        }

        //Compare password with hashed password
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({
                message:'Invalid email or password'
            });
        }

            //Create JWT token 
            const token =jwt.sign(
                {
                    id:user.id,
                    role:user.role
                },
                process.env.JWT_SECRET,
                {
                    expiresIn:'7d'
                }
            );
            res.status(200).json({
                message:'Login successful',
                token,
                user:{id:user.id,
                    name:user.name,
                    email:user.email,
                    role:user.role
                     },
            });

        }
        catch(error){
            res.status(500).json({message:'Login failed.',error:error.message});

        }
    };
    const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'name', 'email'],
    });
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users', error: error.message });
  }
};

    module.exports= {signup,login,getAllUsers};

            
        
    

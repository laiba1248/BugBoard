const protect=require('../middleware/authMiddleware');
const express =require('express');
const router= express.Router();
const {signup,login,getAllUsers}=require('../controllers/authControllers');


router.post('/signup',signup);
router.post('/login',login);
router.get('/profile',protect,(req,res)=>{
    res.json({message:'You accessed a protected route!',user:req.user});
});
router.get('/users', protect, getAllUsers);
module.exports=router;
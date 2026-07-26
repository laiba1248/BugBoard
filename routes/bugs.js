const express= require('express');
const router=express.Router();
const protect = require('../middleware/authMiddleware');
const{
    createBug,
    getAllBugs,
    getBugById,
    updateBug,
    deleteBug,
}=require('../controllers/bugController');

router.post('/',protect,createBug);
router.get('/',protect,getAllBugs);
router.get('/:id',protect,getBugById);
router.put('/:id',protect,updateBug);
router.delete('/:id',protect,deleteBug);

module.exports=router;
const bugRoutes=require('./routes/bugs');
const User=require('./models/User');
const Bug=require('./models/Bug');
const authRoutes = require('./routes/auth');
const sequelize=require('./config/db');
const express = require('express');
const cors=require ('cors');
require ('dotenv').config();


const app=express();

app.use(cors());
app.use(express.json());
app.use('/api/auth',authRoutes);//any request to /api/auth/signup or /api/auth/login gets sent to your new routes file.
app.use('/api/bugs',bugRoutes);

app.get('/',(req,res)=>{
  res.json({message:'Bugboard API is running!'});
});
const PORT =process.env.PORT || 5000;

sequelize.authenticate()
.then(()=>console.log('MySQL connected successfully.'))
.catch((err)=> console.error('Unable to connect to database',err));


sequelize.sync()
.then(()=>console.log('All models synced.'))
.catch((err)=>console.error('Models sync failed', err));

app.listen(PORT,()=>{
  console.log(`Server running on port ${PORT}`);
});

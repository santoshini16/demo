const express = require('express');
const { mongoose } = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const userRouter = require('./routes/userRoute');
const quizRouter = require('./routes/quizRoute');
const analyticsRoute = require('./routes/analyticsRoute');
const app = express();
const dotenv = require('dotenv').config();
const PORT =  3000

app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',  
    credentials: true,                
  }));
app.use(bodyParser.json());
app.use(express.json())

app.use('/user',userRouter);
app.use('/api',quizRouter);
app.use('/api',analyticsRoute);
mongoose.connect(process.env.MONGO_URL)
.then(()=>{
    console.log('mongodb connected');
})
.catch(()=>{
    console.log('failed to connect');
})

app.listen(PORT,(req,res)=>{
    console.log(`server is running at port ${PORT}`);
 })
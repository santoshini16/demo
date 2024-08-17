const express = require('express');
const { mongoose } = require('mongoose');
const bodyParser = require('body-parser');
const userRouter = require('./routes/userRoute');
const app = express();
const dotenv = require('dotenv').config();
const PORT =  3000

app.use(bodyParser.json());
app.use(express.json())

app.use('/user',userRouter);
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
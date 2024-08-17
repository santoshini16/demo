const express = require('express');
const { mongoose } = require('mongoose');

const app = express();
const dotenv = require('dotenv').config();
const PORT =  3000

app.use(express.json())

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
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const fs = require('fs');
const users = require('./MOCK_DATA.json');

const port = 8000;
app.listen(port,() => {
    console.log(`Server is listening to ${port}`)
});
//connection
mongoose.connect('mongodb://localhost:27017/usersDipshika')
.then(() => console.log("mongodb connected"))
.catch((err) => {console.log("An error occured")});
//schema
 const usersSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
    },
    lastName:{
        type:String,
        required:false,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    jobTitle:{
        type:String,
    },
    firstName:{
        type:String,
        required:true,
    },
      gender:{
        type:String,
    },

 },{timestamps:true});

 const user = mongoose.model('user',usersSchema);
 


app.use(express.urlencoded({extended:false}));//this converts the form data coming from front end to object.as it has access to th request, req.body k andar value daal dega

// a function that executes on every request.it may either forward the request further or give a response directly
// a kind of a plugin
app.use((req,res,next) => {
console.log("middleWare 1");
req.myUsername ="dipshikapradhan" 
next();
});
// if i have another middleware, then it wll have access to req.Username
app.use((req,res,next) => {
    console.log("middleWare 2",req.myUsername);
    fs.appendFile('logTxt', `\n${Date.now()} : ${req.ip} : ${req.method} : ${req.path}`,
    (error,data) => {
    next();
    })
    });



app.get('/api/users', async(req,res) =>{
    const users1 = await user.find({});
    return res.json(users1);
});
app.get('/users', async(req,res) =>{
    const allusers = await user.find({});
    console.log(req.myUsername);
    const html = `
    <ul>
    ${allusers.map((user) => `<li>${user.firstName} - ${user.email}</li>`).join("")}
        </ul>`
        res.send(html);
});
 
app.post('/api/users', async(req,res) =>{
    const body = req.body;
    if(
        !body ||
        !body.first_name ||
        !body.last_name ||
        !body.email ||
        !body.gender ||
        !body.job_title
    ){
        return res.status(400).json({msg:"All fields are necessary"});
    }
   const result = await user.create({
    firstName:body.first_name,
    lastName:body.last_name,
    email:body.email,
    gender:body.gender,
    jobTitle:body.job_title,
    });
    console.log("result",result);
    return res.status(200).json({msg: "Success"})
});

// since there is many /api/users/:1, we can accumulate and do the following
app.route('/api/users/:id')
.get(async(req,res) =>{
const user1 = await user.findById(req.params.id)
return res.json(user1);
})
.patch(async(req,res) =>{
    const users = await user.findByIdAndUpdate(req.params.id,{lastName:"Sandip Poptani"});
    console.log("Edit new user")
    return res.json({status:"changed",users});
})
.delete(async(req,res) =>{
    const users = await user.findByIdAndDelete(req.params.id)
    console.log("Delete a user")
    return res.json({status:'deleted',users});
});

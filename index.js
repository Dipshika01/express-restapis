const express = require('express');
const app = express();
const fs = require('fs');
const users = require('./MOCK_DATA.json');

const port = 8000;
app.listen(port,() => {
    console.log(`Server is listening to ${port}`)
});

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



app.get('/api/users', (req,res) =>{
    return res.json(users);
});
app.get('/users', (req,res) =>{
    console.log(req.myUsername);
    const html = `
    <ul>
    ${users.map((user) => `<li>${user.first_name}</li>`).join("")}
        </ul>`
        res.send(html);
});
 
app.post('/api/users', (req,res) =>{
    const body = req.body;
    users.push({...body,id : users.length+1});
    fs.writeFile('./MOCK_DATA.json',JSON.stringify(users),(error,data)=>{
    console.log("Create new user",body);
    return res.json({status:"success", id : users.length});
    });
});

// since there is many /api/users/:1, we can accumulate and do the following
app.route('/api/users/:id')
.get((req,res) =>{
    const id  = Number(req.params.id);
    const user = users.find((user) => user.id === id)
    return res.json(user);
})
.patch((req,res) =>{
    console.log("Edit new user")
    return res.json({status:"pending"});
})
.delete((req,res) =>{
    console.log("Delete new user")
    return res.json({status:'pending'});
});

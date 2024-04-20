const fs = require('fs');

const readFileP = fs.promises.readFile('text.txt');
readFileP.then((data) =>{
    console.log("file as read successfully",data.toString())
})
.catch((err) => {
console.log("An error has occured",err);
})
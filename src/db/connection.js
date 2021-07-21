const mongoose = require('mongoose');

// connection creation to the mongodb with mongoose
// mongoose.connect('mongodb://localhost:27017/employee-registration', {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useFindAndModify:false, 
//     useUnifiedTopology: true})
//     .then( () => console.log("Connected sucessfully..."))
//     .catch( () => console.log(err));

mongoose.connect("mongodb+srv://prnbbora4:qwertyuiop@1@cluster0.kvsxn.mongodb.net/emp_registration?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify:false, 
    useUnifiedTopology: true})
    .then( () => console.log("Connected sucessfully..."))
    .catch( () => console.log(err));
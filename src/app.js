require('dotenv').config();
const express = require("express");
const { handlebars } = require("hbs");
const app = express();
const path = require("path");
const hbs = require("hbs");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const auth = require("./middleware/auth");


const port = process.env.PORT || 3000;

// database connection
require("../src/db/connection");

// schema connection
const Employee = require("../src/models/schema");
const { access } = require("fs");

// Access static folder 
const static_path = path.join(__dirname, "../public");
app.use(express.static(static_path));

// Acess views and partials from templates folder
const templetes_path = path.join(__dirname, "../templetes/views");
const partials_path = path.join(__dirname, "../templetes/partials");


// Use handlebars as templete engine 
app.set("view engine", "hbs");
app.set("views", templetes_path);
hbs.registerPartials(partials_path);

// access json data from postman
app.use(express.json());

// cookie - parser
app.use(cookieParser());
// access input data from a form
app.use(express.urlencoded({extended: false}));

app.get('/', (req, res) => {
    res.render("index");
})

app.get('/secret', auth, (req, res) => {
    // console.log(`secret page ${req.cookies.jwt}`);
    res.render("secret");
})

app.get('/logout', auth, async (req, res) => {
    try {
        // for single device logout
        req.user.tokens = req.user.tokens.filter((currElement) => {
            return currElement.token !== req.token
        });

        res.clearCookie("jwt");
        console.log("logout success");

        await req.user.save();
        res.render("login");
    } catch (error) {
        res.status(500).send(error);
    }
})

app.get('/logout_all', auth, async (req, res) => {
    try {
        // logout from all devices
        req.user.tokens = [];

        res.clearCookie("jwt");
        console.log("logout success");

        await req.user.save();
        res.render("login");
    } catch (error) {
        res.status(500).send(error);
    }
})

app.get('/register', (req, res) => {
    res.render("register");
})

// register a user
app.post('/register', async (req, res) => {
    try {
        const password = req.body.password;
        const confirm_password = req.body.confirm_password;

        if(password === confirm_password){
            const registerEmployee = new Employee({
                name : req.body.name,
                email : req.body.email,
                gender : req.body.gender,
                password : password,
                confirm_password : confirm_password
            })
            
            // tokens generation as a middleware
            console.log(registerEmployee);
            const token = await  registerEmployee.generateAuthToken();
            console.log(token);

            res.cookie("jwt", token, {
                expires: new Date(Date.now() + 30000),
                httpOnly: true
            });

            const registered= await registerEmployee.save();
            res.status(201).render("login");

        }else{
            res.send("password no match")
        }
    } catch (error) {
        res.status(400).send(error);
    }
})

app.get('/login', (req, res) => {
    res.render("login");
})

// login with email and password
app.post('/login', async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const useremail= await Employee.findOne({email : email});
        
        // bcrypt compare password for login
        const isMatch = await bcrypt.compare(password, useremail.password);

        // tokens generation as a middleware
        const token = await  useremail.generateAuthToken();
        console.log(token);

        res.cookie("jwt", token, {
            expires: new Date(Date.now() + 60000),
            httpOnly: true,
            // secure: true
        });

        // console.log(useremail.password);
        if(isMatch){
            res.status(200).render("secret");
        }else{
            res.status(400).send("Invalid details");
        }
    } catch (error) {
        res.status(400).send("Invalid details");    
    }
})

// Running the app
app.listen(port, () => {
    console.log(`App is listening at http://localhost:${port}`);
})
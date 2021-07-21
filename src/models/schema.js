const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const employeeSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    gender:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true,
        trim: true
    },
    confirm_password:{
        type: String,
        required: true,
        trim: true
    },
    tokens:[{
        token: {
            type: String,
            required: true,
        }
    }]

})

// generating tokens
employeeSchema.methods.generateAuthToken = async function(){
    try {
        console.log(this._id);
        const token = jwt.sign({_id:this._id.toString()}, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({token:token})
        await this.save();
        return token;
    } catch (error) {
        res.send(error);
        
    }
}

// bcrypt hashing methods
employeeSchema.pre("save", async function(next) {
    if(this.isModified("password")){
        // console.log(`the current password id ${this.password}`);
        // console.log(`the current password id ${this.confirm_password}`);

        this.password = await bcrypt.hash(this.password, 10);
        this.confirm_password = await bcrypt.hash(this.password, 10);

        // console.log(`the hash password id ${this.password}`);
        // console.log(`the hash password id ${this.confirm_password}`);

        // this.confirm_password = undefined;
    }
    next();
})

const Employee = new mongoose.model("Register", employeeSchema)

module.exports = Employee;
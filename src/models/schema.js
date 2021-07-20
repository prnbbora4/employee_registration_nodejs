const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

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
    }

})

employeeSchema.pre("save", async function(next) {
    if(this.isModified("password")){
        // console.log(`the current password id ${this.password}`);
        this.password = await bcrypt.hash(this.password, 10);
        // console.log(`the hash password id ${this.password}`);

        this.confirm_password = undefined;
    }
    next();
})

const Employee = new mongoose.model("Register", employeeSchema)

module.exports = Employee;
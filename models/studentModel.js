const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const studentModel = new mongoose.Schema(
    {
        firstname: {
            type: String,
            required: [true, "First Name is required"],
            minLength: [3, "First name should be atleast 3 character long!"]
        },
        lastname: {
            type: String,
            required: [true, "Last Name is required"],
            minLength: [3, "Last name should be atleast 3 character long!"]
        },
        contact: {
            type: String,
            required: [true, "Contact is required"],
            maxLength: [10, "Contact must not exceed 10 characters!"],
            minLength: [10, "Contact should be atleast 10 characters!"],
        },
        city: {
            type: String,
            required: [true, "City Name is required"],
            minLength: [3, "City should be atleast 3 character long!"]
        },
        gender: { type: String, enum: ["Male", "Female", "Others"] },

        email: {
            type: String,
            unique: true,
            lowercase: true,
            required: [true, "Email is required"],
            match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
        },
        password: {
            type: String,
            required: true,
            select: false,
            minLength: [6, "Password must be at least 6 characters"],
            maxLength: [20, "Password must be at least 20 characters"],
            // match: [/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).{6,20}$/, "Password must contain at least one number, one lowercase letter, one uppercase letter, one special character and at least 6 characters"]
        },
        resetPasswordToken: {
            type: String,
            default: "0",
        },
        avatar: {
            type: Object,
            default: {
                fileId: "",
                url: "https://images.unsplash.com/photo-1711211118827-c889adafc9af?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            }
        },
        resume: {
            education: [],
            jobs: [],
            internships: [],
            responsibilities: [],
            courses: [],
            projects: [],
            skills: [],
            accomplishments: [],
        },
        internships: [{
            type: mongoose.Schema.Types.ObjectId, ref: 'internship',
        }],
        jobs: [{
            type: mongoose.Schema.Types.ObjectId, ref: 'job',
        }],

    }, { timestamps: true }
)

studentModel.pre("save", function () {

    if (!this.isModified("password")) {
        return;
    }

    let salt = bcrypt.genSaltSync(10);
    this.password = bcrypt.hashSync(this.password, salt);
})

studentModel.methods.comparepassword = function (password) {
    return bcrypt.compareSync(password, this.password);
}

studentModel.methods.getjwttoken = function () {
    const token = jwt.sign({
        _id: this._id,
        email: this.email
    }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE // expires in 24 hours
    });
    return token;
}

const Student = mongoose.model('student', studentModel);

module.exports = Student;
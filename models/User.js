import mongoose from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide name'],
        minlength: 3,
        maxlength: 20,
        trim: true,

    },
    email: {
        type: String,
        required: [true, 'Please provide email'],
        validate:{
            validator: validator.isEmail,
            message:'Please provide a valid email'
        },
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Please provide password'],
        minlength : 6,
        select:false,
    },
    lastname: {
        type: String,
        default:'LastName',
        maxlength: 20,
        trim: true,
    },
    location: {
        type: String,
        default:'my city',
        maxlength: 20,
        trim: true,
    },


})
// Before save the document
UserSchema.pre('save', async function () {
    // return variables lesquelles on a modifiés avec le request
    // console.log(this.modifiedPaths());

    if (!this.isModified('password')) return
     const salt = await bcrypt.genSalt(10);
     this.password = await bcrypt.hash(this.password,salt)
})

//Method to create a JWT For signing the user
UserSchema.methods.createJWT = function(){
    
    return jwt.sign({userId:this._id},process.env.JWT_SECRET,{expiresIn:process.env.JWT_LIFETIME})

}

//Method to compare password which the user signed with  and the password in the DB
UserSchema.methods.comparePassword = async function (candidatePassword) {
    const isMatch = await bcrypt.compare(candidatePassword,this.password)
    return isMatch
}

export default mongoose.model('User' , UserSchema)
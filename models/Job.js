import mongoose, { mongo } from "mongoose";

const JobSchema = new mongoose.Schema({
    company : {
        type:String,
        required:[true,'Please provide job company!'],
        maxlength:50
    },  
    position : {
        type:String,
        required:[true,'Please provide job position!'],
        maxlength:100
    },
    status :{
        type:String,
        enum:['interview','declined','pending'],
        default:'pending'
    },
    jobType :{
        type:String,
        enum:['full-time','full-remote','part-time','internship'],
        default:'full-time'
    },
    jobLocation :{
        type:String,
        default:'my-city',
        required:true
    },
    createdBy : {
        type:mongoose.Types.ObjectId,
        ref:'User',
        required:['true','Please provide user']
    },},
    {timestamps:true}

)



export default mongoose.model('Job',JobSchema)
import { StatusCodes } from "http-status-codes";
import BadRequestError from '../errors/bad-request.js'
import NotFoundError from "../errors/not-found.js";
import Job from "../models/Job.js";
import checkPermissions from "../utils/checkPermissions.js";


const createJob = async (req,res) =>{
    const { position , company } = req.body
    if (!position || !company)  {
        throw new BadRequestError('Please Provide all values')
    }

     req.body.createdBy = req.user.userId 

    const job = await Job.create(req.body)
    res.status(StatusCodes.CREATED).json({job})
}

const getAllJobs = async (req,res) =>{
    // to test
    // const jobs = await Job.find({createdBy:'63e3a17e0cd25b3456bf3b03'})
    const jobs = await Job.find({createdBy:req.user.userId})
    res.status(StatusCodes.OK).json({jobs ,totaljobs:jobs.length,numOfPages:1})
}

const updateJob = async (req,res) =>{
    const {id:jobId} = req.params
    const {company,position} = req.params

    if (!position || !company) {
        throw new BadRequestError('Please provide all values')
    }
    const job = await Job.findOne({_id:jobId})

    if(!job) {
        throw new NotFoundError('No job with this id to edit')
    }

    // check permissions( if user can update the job)
    // the following line is incorrect because userId is a string and createdBy is an object
    // req.user.userId(string) === job.createdBy(Object)

    checkPermissions(req.user,job.createdBy)


    const updatedJob = await Job.findOneAndUpdate({_id:jobId},req.body,{
        new:true,
        runValidators:true,
    })

    /* alternative approach for updating job
    job.position = position
    job.company = company

    await job.save()
    res.status(StatusCodes.OK).json({job})
    */
res.status(StatusCodes.OK).json({updatedJob})

}

const showStats = (req,res) =>{
    res.send('Show stats job')
}


const deleteJob = async (req,res) =>{
    const {id:jobId} = req.params

    const job = await Job.findOne({_id:jobId})

    if(!job) {
        throw new CustomError.NotFoundError('No job with this id to delete')
    }

    checkPermissions(req.user,job.createdBy)
await job.remove()
req.status(StatusCodes.OK).json({msg:'Success ! Job removed'})
}

export {createJob , deleteJob, getAllJobs , updateJob , showStats}
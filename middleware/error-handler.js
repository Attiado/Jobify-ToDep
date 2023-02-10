import { StatusCodes } from 'http-status-codes'

const errorHandlerMiddleware = (err,req,res,next) => {
console.log(err);
const defaultError = {
    statusCode: StatusCodes.INTERNAL_SERVER_ERROR ,
    msg:'Something went wrong , try again later'
}
// err can be defaultError.msg
res.status(defaultError.statusCode).json({msg: defaultError.msg })

}

export default errorHandlerMiddleware
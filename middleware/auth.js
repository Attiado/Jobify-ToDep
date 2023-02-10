
import jwt from "jsonwebtoken";
import UnAuthenticatedError from "../errors/unauthenticated.js";

const auth = async (req,res,next) =>{
   // const headers = req.headers
   /* remove
    const authHeader = req.headers.authorization
    console.log(authHeader);
    if (!authHeader || !authHeader.startsWith('Bearer')) {
        throw new UnAuthenticatedError('Authentication Invalid , Please Check Your Token !')
    }
       const token = authHeader.split(' ')[1]
    */
    //Everything goes correct
    //Get the token

    const token = req.cookies.token; 
    console.log(token);
    if(!token) {
        throw new UnAuthenticatedError('Authentication Invalid')
    }

    try {
        const payload = jwt.verify(token,process.env.JWT_SECRET)
        console.log(payload);
        req.user = {userId : payload.userId} 
        next(); 
    } catch (error) {
        throw new UnAuthenticatedError('Authentication Invalid , Please Check Your Token !')
    }
}

export default auth

import jwt from "jsonwebtoken";
import UnAuthenticatedError from "../errors/unauthenticated.js";

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
    const auth = async (req, res, next) => {
        const token = req.cookies.token;
        if (!token) {
          throw new UnAuthenticatedError('Authentication Invalid');
        }
        try {
          const payload = jwt.verify(token, process.env.JWT_SECRET);
          const testUser = payload.userId === '63628d5d178e918562ef9ce8';
          req.user = { userId: payload.userId, testUser };
          next();
        } catch (error) {
          throw new UnAuthenticatedError('Authentication Invalid');
        }
      };
      
      export default auth;
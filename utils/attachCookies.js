const attachCookies = ({res,token}) => {
    const oneDay = 1000 * 60 * 60 * 24;
    //httpOnly => only the browser can read it
    //secure  => the cookie will be set only if https 
    res.cookie("token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + oneDay),
      secure: process.env.NODE_ENV === 'production'
  });
  //console.log("cookies from attach cookies"); console.log(token);
}
export default attachCookies
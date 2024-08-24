import jwt from 'jsonwebtoken';
// import cookieParser from 'cookie-parser';

export const authenticateToken = (req, res, next) => {
    const token = req.cookies.access_token;
    console.log('token in middleware', token);
    
    
    if (!token) {
      return res.status(401).json({ message: "Access token is missing" });
    }
  
    jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, decodedToken) => {
      if (err) {
        return res.status(403).json({ message: "Invalid or expired token" });
      }
      
      req.user = decodedToken;
      next();
    });
};

export default authenticateToken;


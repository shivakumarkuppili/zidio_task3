import jwt from "jsonwebtoken";

const auth = async (req, res, next) => {
  try {
    // Check if the Authorization header is present
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'Authorization header is missing.' });
    }

    // Split the header and check for the token
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: 'Token is missing.' });
    }

    // Verify the token
    let decodedData;
    decodedData = jwt.verify(token, "sEcReT");
    req.userId = decodedData?.id; // Attach user ID to the request object

    next(); // Proceed to the next middleware/route handler
  } catch (error) {
    console.log(error);
    // Handle different types of errors
    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({ message: 'Invalid token.' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({ message: 'Token has expired.' });
    }
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

export default auth;

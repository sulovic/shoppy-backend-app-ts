import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface RequestWithAuth extends Request {
  auth?: UserData;
}

const verifyAccessToken = async (req: RequestWithAuth, res: Response, next: NextFunction) => {
  try {
    const authHeader = req?.headers?.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: "Unauthorized - Missing Authorization Header" });
    }
    const accessToken: string = authHeader.split(" ")[1];

    if (!accessToken) {
      return res.status(401).json({ error: "Unauthorized - Missing Access Token" });
    }

    // Verify the accessToken signature

    const decodedAccessToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET!) as JWTPayload;

    //Attach authUser for future use

    req.auth = decodedAccessToken.user;

    next();
  } catch (error: any) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Unauthorized - Invalid Access Token" });
    } else if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Unauthorized - Access Token Expired" });
    } else {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

export default verifyAccessToken;

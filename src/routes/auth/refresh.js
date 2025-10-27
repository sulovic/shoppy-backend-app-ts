const { PrismaClient } = require("../../prisma/users/client");
const prisma = new PrismaClient();
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

router.post("/", async (req, res) => {
  try {
    const refreshToken = req?.cookies?.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ error: "Unauthorized - Refresh token not presented" });
    }

    // Verify the token signature

    const decodedRefreshToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    // Check if the provided refresh token matches the one stored in the database

    const dbTokens = await prisma.tokens.findUnique({
      where: {
        email: decodedRefreshToken?.user?.email,
      },
    });

    if (refreshToken !== dbTokens?.refreshToken) {
      return res.status(401).json({ error: "Unauthorized - Invalid Refresh Token" });
    }

    // Refresh token is valid, issue new access token}

    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
    const accessTokenExp = Date.now() + 15 * 60 * 1000;

    const accessToken = jwt.sign(
      {
        user: decodedRefreshToken?.user,
        exp: accessTokenExp,
      },
      accessTokenSecret
    );

    return res.status(200).json({
      accessToken,
    });
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Unauthorized - Invalid Refresh Token" });
    } else if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Unauthorized - Refresh Token Expired" });
    } else {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  } finally {
    if (prisma) {
      await prisma.$disconnect();
    }
  }
});

module.exports = router;

const { PrismaClient } = require("../../prisma/users/client");
const prisma = new PrismaClient();
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

router.post("/", async (req, res) => {
  try {
    const refreshToken = req?.cookies?.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ error: "Unauthorized - No Refresh Token presented" });
    }

    //Verify refreshToken

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decodedRefreshToken) => {
      if (err) {
        return res.status(401).json({ error: "Unauthorized - Invalid Refresh Token" });
      } else {
        // Delete refreshToken from DB

        await prisma.tokens.update({
          where: {
            email: decodedRefreshToken?.user?.email,
          },
          data: { refreshToken: "" },
        });
      }

      // Remove refreshToken httpOnly cookie

      res
        .clearCookie("refreshToken", {
          httpOnly: true,
          secure: true,
          sameSite: "Strict",
        })
        .status(200)
        .json({ message: "Logout successful" });
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  } finally {
    if (prisma) {
      await prisma.$disconnect();
    }
  }
});

module.exports = router;

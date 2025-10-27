const { PrismaClient } = require("../../prisma/users/client");
const prisma = new PrismaClient();
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const verifyGoogleToken = require("../../middleware/verifyGoogleToken");

router.post("/", async (req, res) => {
  try {
    const { credential, clientId } = req?.body;

    if (!credential || !clientId) {
      return res.status(400).json({ error: "Bad Request - Missing Credentials or Client ID" });
    }

    // Get and verify Google token

    const decodedCredential = await verifyGoogleToken(credential);
    const userEmail = decodedCredential?.email;

    if (!userEmail) {
      return res.status(401).json({ error: "Unauthorized - Invalid Google Token" });
    }

    // Find user in DB

    const foundUser = await prisma.users.findUnique({
      where: {
        email: userEmail,
      },
      include: {
        role: true,
      },
    });

    // Check if User exists in DB

    if (foundUser && clientId === process.env.GOOGLE_CLIENT_ID) {
      const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
      const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
      const accessTokenExp = Date.now() + 15 * 60 * 1000;
      const refreshTokenExp = Date.now() + 24 * 60 * 60 * 1000;

      // Generate authUser and tokens

      const authUser = {
        name: foundUser?.ime_prezime,
        email: foundUser?.email,
        picture: decodedCredential?.picture,
        role_id: foundUser?.role_id,
        role: foundUser?.role.role,
      };

      const accessToken = jwt.sign(
        {
          user: authUser,
          exp: accessTokenExp,
        },
        accessTokenSecret
      );

      const refreshToken = jwt.sign(
        {
          user: authUser,
          exp: refreshTokenExp,
        },
        refreshTokenSecret
      );

      //write refreshToken to DB and send response

      await prisma.tokens.update({
        where: {
          email: foundUser?.email,
        },
        data: { refreshToken },
      });

      res
        .cookie("refreshToken", refreshToken, {
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000,
          sameSite: "Strict",
          secure: true,
        })
        .status(200)
        .json({
          info: "User found, Google token OK!",
          accessToken,
        });
    } else if (!foundUser) {
      return res.status(401).json({ error: "User not found" });
    } else {
      return res.status(401).json({ error: "Invalid Google Client ID provided" });
    }
  } catch (err) {
    if (err.name === "InvalidGoogleToken") {
      return res.status(401).json({ error: "Unauthorized - Invalid Google Token" });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  } finally {
    if (prisma) {
      await prisma.$disconnect();
    }
  }
});

module.exports = router;

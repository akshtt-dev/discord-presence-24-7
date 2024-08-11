import express from "express";
import { Client } from "discord.js-selfbot-v13";
import Token from "../models/storeToken.js";

const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.use((req, res, next) => {
  if (!req.session.user) {
    res.redirect("/auth/login");
  } else {
    next();
  }
});

router.get("/", (req, res) => {
  res.send("Hello World!");
});

router.post("/submittoken", async (req, res) => {
  const { name, token } = req.body;
  const username = req.session.user.username;
  if (!username || !name || !token) {
    return res
      .status(400)
      .json({ message: "Username, name, and token are required." });
  }

  try {
    const client = new Client();

    try {
      await client.login(token);

      let userToken = await Token.findOne({ username });
      if (userToken) {
        const existingToken = userToken.discord.find((t) => t.token === token);
        if (existingToken) {
          return res.status(409).json({ message: "Token already exists." });
        }

        userToken.discord.push({ token, name });
      } else {
        userToken = new Token({
          username,
          discord: [{ token, name }],
        });
      }

      await userToken.save();

      console.log(`${client.user.username} is ready!`);
      res
        .status(201)
        .json({ message: "Success", clientName: client.user.username });
    } catch (err) {
      if (err.message.includes("An invalid token was provided")) {
        return res.status(422).json({ message: "Invalid token." });
      }
      console.error("Client login error:", err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } catch (err) {
    console.error("Database query error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;

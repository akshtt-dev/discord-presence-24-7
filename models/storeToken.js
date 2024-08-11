import mongoose from "mongoose";
import { Client } from "discord.js-selfbot-v13";

const tokenSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  discord: [
    {
      token: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
    },
  ],
});

const Token = mongoose.model("Token", tokenSchema);

export default Token;

// Fetch tokens and log in clients
Token.find().then((res) => {
  res.forEach((user) => {
    const discordClients = user.discord; // Get the discord array for each user
    discordClients.forEach(async (r) => {
      const client = new Client();
      try {
        await client.login(r.token);
        console.log("Logged in as " + client.user.tag);
      } catch (error) {
        console.error("Error logging in with token:", r.token, "for user:", user.username, "Error:", error);

        // Remove the specific token that failed
        Token.updateOne(
          { username: user.username },
          { $pull: { discord: { token: r.token } } } // Remove the token from the discord array
        )
          .then(() => {
            console.log(`Removed failed token for user: ${user.username}`);
          })
          .catch((updateError) => {
            console.error("Error removing failed token:", updateError);
          });
      }
    });
  });
});

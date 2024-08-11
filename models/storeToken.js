import mongoose from "mongoose";

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

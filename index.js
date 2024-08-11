import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { join, dirname } from "path";
import { engine } from "express-handlebars";
import { fileURLToPath } from "url";
import session from "express-session";
import MongoStore from "connect-mongo";
dotenv.config();

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));
const port = process.env.PORT || 3000;

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
}

main()
  .then(() => console.log("Connected to database."))
  .catch((err) => console.log(err));

// Ensure this middleware is before your routes
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  })
);

// Your routes should come after session setup
app.use("/auth", authRouter);
app.use("/panel", panelRouter);

app.use(express.static(join(__dirname, "public")));

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", join(__dirname, "views"));

// Middleware to remove trailing slashes from URLs
app.use((req, res, next) => {
  if (req.path.substr(-1) === "/" && req.path.length > 1) {
    const query = req.url.slice(req.path.length);
    res.redirect(301, req.path.slice(0, -1) + query);
  } else {
    next();
  }
});

// Import and use routes
import indexRouter from "./routes/index.js";
import apiRouter from "./routes/api.js";
import authRouter from "./routes/auth.js"; // Import auth routes
import panelRouter from "./routes/panel.js"; // Import panel routes

app.use("/", indexRouter);
app.use("/api", apiRouter);
app.use("/auth", authRouter); // Use auth routes
app.use("/dashboard", panelRouter); // Use panel routes

// 404 handler
app.use((req, res, next) => {
  res.status(404).render("404", { title: "404 - Page Not Found" });
});

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});



// TODO: MAKE IT WORK PROPERLY FIX THE BUGS
import Token from "./models/storeToken.js";

Token.find()
  .then((tokens) => {
    const allTokens = tokens.map((user) => {
      return user.discord.map((discordAccount) => discordAccount.token);
    });
    console.log(allTokens);
  })
  .catch((error) => {
    console.error("Error retrieving tokens:", error);
  });
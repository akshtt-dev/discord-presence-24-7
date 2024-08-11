import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import * as svg from "../public/src/svg/svg.js";
import dotenv from "dotenv";
dotenv.config();
const router = express.Router();

router.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
    }),
  })
);

router.use((req, res, next) => {
  if (!req.session.user) {
    res.redirect("/auth/login");
  } else {
    next();
  }
});

router.get("/", (req, res) => {
  res.render("panel", { username: req.session.user.username, addSvg: svg.add, layout: "panel" });
});

router.get("/addclient", (req, res) => {
  res.render("addclient", { title: "Add Client", username: req.session.user.username, addSvg: svg.add, layout: "panel" });
});

export default router;

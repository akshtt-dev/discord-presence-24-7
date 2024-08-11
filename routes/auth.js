import express from "express";
import User from "../models/user.js";

const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// Registration route

router.get("/", (req, res) => {
  res.redirect("/auth/register");
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.redirect(
      "/auth/register?error=Username and password are required."
    );
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.redirect("/auth/register?error=Username already exists.");
    }

    const newUser = new User({ username, password });
    await newUser.save();
    res.redirect("/auth/login?message=Registration successful, please log in.");
  } catch (err) {
    console.error("Registration error:", err);
    res.redirect("/auth/register?error=An error occurred during registration.");
  }
});

// Login route
router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.redirect(
      "/auth/login?error=Username and password are required."
    );
  }

  try {
    const user = await User.findOne({ username });
    if (!user || !(await user.comparePassword(password))) {
      return res.redirect("/auth/login?error=Invalid username or password.");
    }

    console.log("Session before setting user:", req.session);
    req.session.user = { id: user._id, username: user.username };
    console.log("Session after setting user:", req.session);

    res.redirect("/dashboard");
  } catch (err) {
    console.error("Login error:", err);
    res.redirect("/auth/login?error=An error occurred during login.");
  }
});

export default router;

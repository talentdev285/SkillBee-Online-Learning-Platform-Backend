const express = require("express");
const router = express.Router();

// CourseDetails router imported here
const { courseDetails } = require("../controllers/allControllers");

// CourseDetails Get Router
router.get("/courses/:slug", courseDetails);
router.get("/about", (req, res) => res.send("About Page"));
router.get("/contact", (req, res) => res.send("Contact Page"));

module.exports = router;

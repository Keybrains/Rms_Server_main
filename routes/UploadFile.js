// Inside your Express routes file

const express = require("express");
const router = express.Router();
const UploadFile = require("../modals/UploadFile"); // Import the upload model

// Define a route for file uploads
router.post("/upload", (req, res) => {
    UploadFile.uploadFile(req, res);
});

module.exports = router;

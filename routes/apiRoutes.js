const express = require("express");
const router = express.Router();
const codeController = require("../controllers/codeController");
const curlController = require("../controllers/curlController");

router.post("/execute", codeController.executeCode);
router.post("/curl", curlController.executeCurl);

module.exports = router;

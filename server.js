const express = require("express");
const app = express();
const path = require("path");
const router = express.Router();

const PORT = 3001;

router.get("/", function (req, res) {
    res.sendFile(path.join(__dirname + "/index.html"));
});

//add the router
app.use("/", router);
app.listen(PORT || 3001);

console.log(`Listen at Port ${PORT}`);

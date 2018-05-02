const express = require("express");
const router = express.Router();

router.get('/', (req, res, next) => {
    res.json({
        title: "Error page",
        msg: 'Wrong URL'
    })
});

module.exports = router;
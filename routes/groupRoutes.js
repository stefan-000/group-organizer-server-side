const express = require("express");

const router = express.Router();

const bodyParser = require("body-parser");

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

const db = require("../services/dbServices");

router.get("/", (req, res, next) => {
  try {
    db.all("SELECT * FROM Groups", (err, rows) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({
        message: "success",
        data: rows,
      });
    });
  } catch (e) {
    console.error("Error while getting groups", e.message);
    next(e);
  }
});

router.get("/:id", (req, res, next) => {
  try {
    db.get(
      `SELECT * FROM Groups WHERE GroupId = ${req.params.id}`,
      (err, row) => {
        if (err) {
          res.status(400).json({ error: err.message });
          return;
        }
        res.json({
          message: "success",
          data: row,
        });
      }
    );
  } catch (e) {
    console.error("Error while getting group", e.message);
    next(e);
  }
});

router.post("/", (req, res, next) => {
  if (!req.body.title || req.body.title === "") {
    res.status(400).json({ error: "Group Title must be provided" });
    return;
  }
  const data = {
    GroupId: 0,
    Title: req.body.title,
    Description: req.body.description,
    ImageURL: req.body.imageUrl,
  };
  const sql = `INSERT INTO Groups 
  (Title, Description, ImageURL) 
  VALUES ("${data.Title}","${data.Description}","${data.ImageURL}")`;
  console.log("sql", sql);
  try {
    db.run(sql, function (err, result) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      data.GroupId = this.lastID;
      res.json({
        message: "success",
        data,
      });
    });
  } catch (e) {
    console.error("Error while creating group", e.message);
    next(e);
  }
});

module.exports = router;
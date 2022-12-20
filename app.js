const express = require("express");
const mysql = require("mysql");
require("dotenv").config();
const cors = require("cors");

var app = express();

app.use(cors());

app.use(express.json());

var con = mysql.createConnection({
  host: process.env.SQL_HOST,
  user: process.env.SQL_USER,
  password: process.env.SQL_PASSWORD,
  database: process.env.SQL_DB,
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});

// con.end();

app.get("/", (req, res) => {
  res.send("Hey there, Welcome to the cult....");
});

app.get("/total_users", (req, res) => {
  var query = "select count(*) as count from users";
  con.query(query, (error, results) => {
    if (error) {
      console.log(error);
      throw error;
    }
    res.json(results[0].count);
  });
});

app.post("/add_user", (req, res) => {
  const query = "insert into users set ?";
  con.query(query, { email: req.body.email }, (err) => {
    if (err) {
      if (err.sqlState === "23000") {
        res.status(407).json({ msg: "Duplicate entry" });
      }
      // throw err;
    } else res.send("Sucessfully added user");
  });
});

app.get("/users", (req, res) => {
  con.query("select * from users", (err, results) => {
    if (err) {
      throw err;
    } else res.json(results);
  });
});

app.get("/users/filter", (req, res) => {
  if (
    req.body.sortBy.toLowerCase() !== "asc" &&
    req.body.sortBy.toLowerCase() !== "desc"
  ) {
    res
      .status(400)
      .json({ msg: "/sort api only accepts 'ASC' & 'DESC' as parameters " });
  } else {
    console.log("yaha bhi aarha");
    con.query(
      `select * from users ${
        req.body.yearRange && req.body.filterBy
          ? `where email like '%${req.body.filterBy}%' and year(created_at) between ${req.body.yearRange[0]} and ${req.body.yearRange[1]}`
          : req.body.yearRange
          ? `where year(created_at) between ${req.body.yearRange[0]} and ${req.body.yearRange[1]}`
          : req.body.filterBy
          ? `where email like '%${req.body.filterBy}%'`
          : ""
      } ${req.body.sortBy ? `order by created_at ${req.body.sortBy}` : ""}`,
      (err, results) => {
        if (err) {
          if (err.sqlState === "42000") {
            res.status(400).json({
              msg: "Please check the filter parameter and try again with appropriate parameter values",
            });
          }
          throw err;
        } else res.json(results);
      }
    );
  }
});

app.listen(5000 || process.env.PORT, () =>
  console.log("connected and listening")
);

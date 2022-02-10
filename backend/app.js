const express = require('express');
const path = require("path");
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const postsRoutes = require('./routes/posts');
const userRoutes = require("./routes/user");

const app = express();
// KlFIY9n4YQuLWfJ1
mongoose.connect("mongodb+srv://mohamed:"+ process.env.MONGO_ATLS_PW  +"@cluster0.ckacw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority").then(() => {
    console.log('Connected to database');
  })
  .catch(() => {
    console.log('Connection faild');
  })

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));
app.use("/images", express.static(path.join("backend/images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.setHeader("Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS");
  next();
});

app.use("/api/posts", postsRoutes);
app.use("/api/user", userRoutes);

module.exports = app;

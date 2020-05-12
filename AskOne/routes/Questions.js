const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

const Questions = require("../controllers/questionController");

router.get("/getQuestion", Questions.getQuestion);

router.get("/Question/:id", Questions.getQuestionByID);

router.post("/saveQuestion", Questions.saveQuestion);

router.post("/answers/:id", Questions.saveAnswer)

router.post("/upvote/:id", Questions.saveUpvote);

router.post("/downvote/:id", Questions.saveDownvote);

router.post("/correctAnswer/:id", Questions.correctAnswer);


module.exports = router;



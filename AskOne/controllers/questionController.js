const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
const Profile = require("../models/User");
const Question = require("../models/questions");
const User = require("../models/User")
const mongo = require('mongodb')
const ObjectId = require('mongodb').ObjectID;
const Validator = require("validator");
const isEmpty = require("is-empty");


//Get Question By ID
exports.getQuestionByID = async (req, res) => {
    let QuestionID = req.params.id;
    let errors = {}
    try {
        let questions = await Question.findById({ '_id': QuestionID })
        if (!questions) {
            errors.Question = "Question is required";
            return res.status(400).json(errors);
        } else {
            return res.json({
                success: 'true',
                questions: questions,
                code: 200
            })
        }
    } catch (err) {
        errors.Question = err
        return res.status(400).json(errors);
    }

}

//Get all of the  Question
exports.getQuestion = async (req, res) => {
    try {
        let questions = await Question.find().sort({ date: "desc" })
        if (!questions) {
            errors.Question = "Question is required";
            return res.status(400).json(errors);
        } else {
            return res.json({
                success: 'true',
                questions: questions,
                code: 200
            })
        }
    } catch (err) {
        errors.Question = err
        return res.status(400).json(errors);
    }
}

//save  Question
exports.saveQuestion = async (req, res) => {
    let errors = {}
    if (Validator.isEmpty(req.body.textone)) {
        console.log("Invalid field")
        errors.Question = "Question is Required";
        return res.status(400).json(errors);
    }
    const newQuestion = new Question({
        textone: req.body.textone,
        texttwo: req.body.texttwo,
        user: req.body.userid,
    });
    try {
        let newOne = await newQuestion.save()
        if (!newOne) {
            errors.Question = "Error occured";
            return res.status(400).json(errors);
        } else {
            return res.json({
                success: 'true',
                questions: newOne,
                code: 200
            })
        }
    } catch (err) {
        errors.Question = err
        return res.status(400).json(errors);
    }
}

//save answer  for the answer Question
exports.saveAnswer = async (req, res) => {
    let errors = {}
    if (Validator.isEmpty(req.body.answer)) {
        errors.answer = "answer is required";
        return res.status(400).json(errors);
    }
    let QuestionID = req.body.question_id;
    await Question.findById({ '_id': QuestionID })
        .then(questions => {
            const newAnswer = {
                user: req.body.currentuser,
                text: req.body.answer,
            };
            questions.answers.unshift(newAnswer);
            questions
                .save()
                .then(questions => {
                    return res.json({
                        success: 'true',
                        questions: questions,
                        code: 200
                    })
                })
                .catch(err => {
                    return res.json({
                        success: 'false',
                        err: err,
                        code: 409
                    })
                });

        })
        .catch(err => {
            return res.json({
                success: 'false',
                err: err,
                code: 409
            })
        })
}

//save downvote option for the answer
exports.saveDownvote = async (req, res) => {
    let QuestionID = req.body.question_id;
    let answerID = req.body.answerID;
    let questions = await Question.findById({ '_id': QuestionID })
    if (!questions) {
        return res.json({
            success: 'false',
            err: err,
            code: 409
        })
    } else {
        await Question.findOneAndUpdate({ _id: QuestionID, 'answers._id': answerID },
            {
                $inc: { 'answers.$.upvotes': -1 }
            },
            { new: true }
        ).exec(function (error, post) {
            if (error) {
                return res.status(400).send({ msg: 'Update failed!' });
            } else {
                return res.json({
                    success: 'true',
                    questions: questions,
                    code: 200
                })
            }
        });
    }

}


//save upvote option for the answer
exports.saveUpvote = async (req, res) => {
    let QuestionID = req.body.question_id;
    let answerID = req.body.answerID;
    let questions = await Question.findById({ '_id': QuestionID })
    if (!questions) {
        return res.json({
            success: 'false',
            err: err,
            code: 409
        })
    } else {
        await Question.findOneAndUpdate(
            { _id: QuestionID, 'answers._id': answerID },
            {
                $inc: { 'answers.$.upvotes': 1 }
            },
            { new: true }
        ).exec(function (error, post) {
            if (error) {
                return res.status(400).send({ msg: 'Update failed!' });
            } else {
                return res.json({
                    success: 'true',
                    questions: questions,
                    code: 200
                })
            }
        });
    }

}


//save correct option for the answer
exports.correctAnswer = async (req, res) => {
    let QuestionID = req.body.question_id;
    let answerID = req.body.answerID;
    var userId;
    await Question.findOne({ _id: QuestionID, 'answers._id': answerID },
        {
            'answers.$': 1
        },
        { new: true }
    ).exec(function (error, questions) {
        if (error) {
            return res.status(400).send({ msg: 'Update failed!' });
        } else {
            User.findOneAndUpdate(
                { "_id": questions.answers[0].user },
                { $inc: { points: 100 } },
                { new: true }
            ).exec(function (error, questions) {
                if (error) {
                    console.log("error=====>", error)
                    return res.status(400).send({ msg: 'Update failed!' });
                }
            });
        }
    });
    await Question.findOneAndUpdate({ _id: QuestionID, 'answers._id': answerID },
        {
            "$set": {
                'answers.$.coorect': true,
                'solved': true
            }
        },
        { new: true }
    ).exec(function (error, questions) {
        if (error) {
            return res.status(400).send({ msg: 'Update failed!' });
        } else {
            return res.json({
                success: 'true',
                questions: questions,
                code: 200
            })
        }
    });


}
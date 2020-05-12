const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const QuestionSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "users"
    },
    textone: {
        type: String,
        required: true
    },
    texttwo: {
        type: String,
    },
    name: {
        type: String
    },
    solved: {
        type: Boolean,
        default: false
    },
    answers: [
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: "users"
            },
            text: {
                type: String,
                required: true
            },
            upvotes: { type: Number, default: 0 },
            downvote: { type: Number, default: 0 },
            coorect: {
                type: Boolean,
                default: false
            },
            date: {
                type: Date,
                default: Date.now
            }
        }
    ],
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = Question = mongoose.model("myQuestion", QuestionSchema);
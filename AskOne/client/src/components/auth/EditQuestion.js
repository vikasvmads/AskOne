import React, { Component } from "react";
import classnames from "classnames";
import { Link } from "react-router-dom";
import axios from "axios";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";


class EditQuestion extends Component {
    constructor(props) {
        super(props);
        this.state = {
            textone: "",
            texttwo: "",
            question_id: "",
            answers: [],
            newAnswer: "",
            upvote: '',
            downvote: '',
            quesUserId: '',
            currentuser: '',
            currentuserName: '',
            solved: false,
            correct: false,
            userPoints: '',
            errors: ''
        }
    }

    onLogoutClick = e => {
        e.preventDefault();
        this.props.logoutUser();
    };

    componentWillMount() {
        const { user } = this.props.auth;
        let userID = user.id;
        axios.get('/api/users/getUserById/' + userID)
            .then(response => {
                console.log("response for the user API" + response.data)
                console.log("response for the user API" + response.data.userInfo.points)
                this.setState({
                    userPoints: response.data.userInfo.points,
                    currentuser: userID,
                    currentuserName: user.name
                })
            })
            .catch(function (error) {
                console.log("error in userdata" + error);
            })
    }
    componentDidMount() {
        axios.get('/api/createApp/Question/' + this.props.match.params.id)
            .then(response => {
                console.log(response)
                this.setState({
                    textone: response.data.questions.textone,
                    texttwo: response.data.questions.texttwo,
                    question_id: response.data.questions._id,
                    answers: response.data.questions.answers,
                    upvote: response.data.questions.answers.upvotes,
                    solved: response.data.questions.solved,
                    quesUserId: response.data.questions.user,
                })
            })
            .catch(function (error) {
                this.setState({ errors: error })
            })

    }

    onChange = e => {
        this.setState({ [e.target.id]: e.target.value });
    };

    onSubmit = e => {
        e.preventDefault();
        const user = this.props.auth.user.name;
        const newAnswer = {
            textone: this.state.textone,
            texttwo: this.state.texttwo,
            answer: this.state.newAnswer,
            question_id: this.state.question_id,
            userid: this.state.user_id,
            currentuser: this.state.currentuser,
        };
        axios
            .post("/api/createApp/answers/:id" + this.state.question_id, newAnswer)
            .then(response => {
                //this.props.history.push("/dashboard");
                this.setState({
                    textone: response.data.questions.textone,
                    question_id: response.data.questions._id,
                    answers: response.data.questions.answers,
                    upvote: response.data.questions.answers.upvote,
                    newAnswer: ''
                })
            })
            .catch(err => {
                this.setState({ errors: err.response.data })
            }

            );

    };


    handleupvote = e => {
        e.preventDefault();

        const { value } = e.target; // same as "value = event.target.value"
        this.setState({ upvote: value });
        const answerID = {
            answerID: e.target.id,
            question_id: this.state.question_id,
            action: e.target.value
        };
        axios
            .post("/api/createApp//upvote/:id" + this.state.question_id, answerID)
            .then(response => {
                console.log("data is saved" + response)
                this.setState({
                    textone: response.data.questions.textone,
                    question_id: response.data.questions._id,
                    answers: response.data.questions.answers,
                    upvote: response.data.questions.answers.upvote,
                    newAnswer: ''
                })
            })
            .catch(err =>
                this.setState({ errors: err })
            );
    };

    handledownvoteupvote = e => {
        e.preventDefault();
        const answerID = {
            answerID: e.target.id,
            question_id: this.state.question_id,
            action: e.target.value
        };
        axios
            .post("/api/createApp/downvote/:id" + this.state.question_id, answerID)
            .then(response => {
                this.setState({
                    textone: response.data.questions.textone,
                    question_id: response.data.questions._id,
                    answers: response.data.questions.answers,
                    upvote: response.data.questions.answers.upvote,
                    newAnswer: ''
                })
            })
            .catch(err =>
                this.setState({ errors: err })
            );
    };

    correctAnswer = e => {
        e.preventDefault();
        const user = this.props.auth.user.id;
        const correctAnswer = {
            answerID: e.target.id,
            question_id: this.state.question_id,
            userID: user
        };
        axios
            .post("/api/createApp/correctAnswer/:id" + this.state.question_id, correctAnswer)
            .then(response => {
                console.log("data is saved" + response)
                this.setState({
                    textone: response.data.questions.textone,
                    question_id: response.data.questions._id,
                    answers: response.data.questions.answers,
                    upvote: response.data.questions.answers.upvote,
                    solved: response.data.questions.solved,
                    correct: response.data.questions.answers.correct
                })
            })
            .catch(err =>
                this.setState({ errors: err })
            );
    }


    render() {
        const user = this.props.auth.user.id;
        const { errors } = this.state;
        return (
            <div>
                <nav className="navbar navbar-default">
                    <div className="container-fluid">
                        <ul className="nav navbar-nav">
                            <li ><Link to={"/home/"}>Dashboard</Link></li>
                            <li><Link to={"/addQuestion/"}>Add Question</Link></li>
                        </ul>
                        <ul className="nav navbar-nav navbar-right">
                            <li>
                                <button
                                    className="btn btn-secondary btn-lg"
                                >
                                    {this.state.currentuserName}-{this.state.userPoints}
                                </button>
                            </li>
                            <li></li>
                            <li>
                                <button
                                    onClick={this.onLogoutClick}
                                    className="btn btn-secondary btn-lg"
                                >
                                    Logout
                             </button>
                            </li>
                        </ul>
                    </div>
                </nav>
                <blockquote className="blockquote text-center">
                    <h5 className="display-4">{this.state.textone}</h5>
                    <h6 className="display-4">{this.state.texttwo}</h6>
                    <footer className="blockquote-footer">
                        <cite title="Source Title"></cite></footer>
                </blockquote>

                <hr />
                <div className="container">
                    <div className="form-inline">
                        <div className="form-group">
                            <h4 class="display-4">Answers</h4>
                        </div>
                    </div>
                </div>
                <blockquote className="blockquote text-center">
                    <p class="mb-0"></p>
                    <footer class="blockquote-footer">
                        {this.state.answers.map(answer => {
                            return <div>
                                <p >{answer.text}</p>
                                <p >By {answer.user}</p>
                                <br />
                                <br />
                                {
                                    this.state.quesUserId === this.state.currentuser ?
                                        [
                                            this.state.solved ? [answer.coorect ?
                                                <button type="button" class="btn btn-success btn-lg">
                                                    < span class="glyphicon glyphicon-ok"></span> Its Right
                                                </button> : '']
                                                :
                                                <button type="button" class="btn btn-info btn-lg" id={answer._id} onClick={this.correctAnswer}>
                                                    <span class="glyphicon glyphicon-ok"></span>Right ?
                                                 </button>
                                        ] : ''

                                }
                                {
                                    this.state.quesUserId === this.state.currentuser ? '' :
                                        [answer.coorect ?
                                            <button type="button" class="btn btn-success btn-lg">
                                                < span class="glyphicon glyphicon-ok"></span> Its Right
                                            </button>
                                            : '']
                                }
                                {
                                    answer.user === this.state.currentuser ? '' :
                                        < i class="glyphicon glyphicon-chevron-up" id={answer._id}
                                            value="upvote" onClick={
                                                this.handleupvote
                                            }></i>
                                }
                                <span> </span>{' '}
                                <span class="label label-primary">{answer.upvotes}  </span>
                                {
                                    answer.user === this.state.currentuser ? '' :
                                        <i class="glyphicon glyphicon-chevron-down" id={answer._id}
                                            value="downvote" onClick={this.handledownvoteupvote} ></i>
                                }
                                <hr />
                            </div>
                        })}
                    </footer>
                </blockquote>

                {this.state.quesUserId === this.state.currentuser ? '' :
                    <form className="AddAnswer" onSubmit={this.onSubmit}>
                        <div className="container">
                            <div className="form-inline">
                                <div className="form-group col-lg-8">
                                    <h4>Your Answer</h4>
                                    <span className="red-text">{errors.answer}</span>
                                    <textarea
                                        class="form-control col-xs-12" rows="7" cols="100"
                                        type="text"
                                        onChange={this.onChange}
                                        value={this.state.newAnswer}
                                        id="newAnswer"
                                    />
                                </div>
                            </div>
                            <button type="submit" id="submit" className="btn btn-submit">Add</button>
                        </div>
                    </form>
                }

            </div>

        )
    }
}

const mapStateToProps = state => ({
    auth: state.auth
});
export default connect(
    mapStateToProps,
    { logoutUser }
)(EditQuestion);

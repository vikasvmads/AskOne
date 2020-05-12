import React, { Component } from "react";
import classnames from "classnames";
import { Link } from "react-router-dom";
import axios from "axios";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import Navbar from "../layout/Navbar";



class AddQuestion extends Component {
    constructor(props) {
        super(props);
        this.state = {
            textone: "",
            texttwo: "",
            userid: "",
            errors: ""
        };
    }


    onChange = e => {
        this.setState({ [e.target.id]: e.target.value });
    };

    onSubmit = e => {
        e.preventDefault();
        const newQuestion = {
            textone: this.state.textone,
            texttwo: this.state.texttwo,
            userid: this.state.user_id
        };
        console.log(newQuestion);
        // console.log(newUser);
        axios
            .post("/api/createApp/saveQuestion", newQuestion)
            .then(res => {
                this.props.history.push("/home");
            }) // re-direct to login on successful register
            .catch(err =>
                this.setState({ errors: err.response.data })
            );

    };

    onLogoutClick = e => {
        e.preventDefault();
        this.props.logoutUser();
    };


    render() {
        const { user } = this.props.auth;
        const { errors } = this.state;
        this.state.user_id = user ? user.id : '';

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
                                    onClick={this.onLogoutClick}
                                    className="btn btn-secondary btn-lg"
                                >
                                    Logout
                             </button>
                            </li>
                        </ul>
                    </div>
                </nav>

                <form onSubmit={this.onSubmit}>
                    <div className="container">
                        <div className="form-inline">
                            <div className="form-group col-lg-10">
                                <h4>Add Question</h4>
                                <textarea
                                    class="form-control col-xs-12" rows="7" cols="100"
                                    type="text"
                                    onChange={this.onChange}
                                    value={this.state.textone}
                                    id="textone"
                                />
                                <span className="red-text">{errors.Question}</span>
                            </div>
                            <div className="form-group col-lg-10">
                                <h4> Code </h4>
                                <textarea
                                    class="form-control col-xs-12" rows="7" cols="100"
                                    type="text"
                                    onChange={this.onChange}
                                    value={this.state.texttwo}
                                    id="texttwo"
                                />
                            </div>
                        </div>
                        <button type="submit" id="submit" className="btn btn-submit">Add</button>
                    </div>
                </form>
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
)(AddQuestion);

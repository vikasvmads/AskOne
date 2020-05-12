import React, { Component } from "react";
import classnames from "classnames";
import { Link } from "react-router-dom";
import axios from "axios";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";


class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allQuestion: [],
            currentuser: '',
            currentuserName: '',
            userPoints: ''
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
        axios.get("/api/createApp/getQuestion").
            then(res => {
                console.log(res.data)
                this.setState({
                    allQuestion: res.data.questions,

                })
                console.log(this.state.allQuestion)

            }).catch(err => {
                console.log(err);
            })
    }

    render() {
        const { user } = this.props.auth;
        console.log(user)

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

                <form>
                    <div className="container">
                        <div className="form-inline">
                            <div className="form-group">

                            </div>
                        </div>
                    </div>
                </form>
                <table className="table table-striped">
                    <thead className="thead-dark">
                        <tr>
                            <th scope="col">All Questions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.allQuestion ? this.state.allQuestion.map((data) =>
                            < tr >
                                <th scope="row"><Link to={"/Question/" + data._id}>{data.textone}</Link></th>

                            </tr>
                        ) : ''}
                    </tbody>
                </table>


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
)(Home);

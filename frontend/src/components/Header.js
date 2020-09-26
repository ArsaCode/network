import React, { useContext } from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom'

import UserContext from '../UserContext';

export default function Header() {
    const contextValue = useContext(UserContext)

    axios.defaults.xsrfCookieName = 'csrftoken'
    axios.defaults.xsrfHeaderName = 'X-CSRFToken'

    const handleLogout = (event) => {
        event.preventDefault()
        axios.post('http://127.0.0.1:8000/restauth/logout')
        .then(() => {
            contextValue.updateIsLogged(false)
            window.location.href = "/"
        }).catch(() => alert("Invalid request"))
    }

    return <div className="row">
        <div className="col">
        <header>
        <div className="jumbotron text-center mb-0">
        <h1 className="display-4">Welcome to CS50w Network !</h1>
        <p className="lead">This is a social network, made for CS50w by Arsalan Ghassemi.</p>
        <hr className="my-4"></hr>
        <p>It uses Django and ReactJS.</p>
        <p className="lead">
            <Link to="/" className="btn btn-primary btn-lg mx-1 text-white mt-3">All Posts</Link>
            {!contextValue.isLogged && <Link to="/register" className="btn btn-primary btn-lg mx-1 text-white mt-3">Register</Link>}
            {!contextValue.isLogged && <Link to="/login" className="btn btn-primary btn-lg mx-1 text-white mt-3">Login</Link>}
            {contextValue.isLogged && <Link to="/followings" className="btn btn-primary btn-lg mx-1 text-white mt-3">Followings</Link>} 
            {contextValue.isLogged && <button onClick={event => handleLogout(event)} className="btn btn-danger btn-lg mx-1 text-white mt-3">Logout</button>}
        </p>
        <span className="text-primary">{contextValue.isLogged ? `Hello ${contextValue.user.username}, you are logged in.` : "You are not logged in."}</span>
        </div>
        </header>
        </div>
    </div>
}
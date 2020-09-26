import React, {useState} from 'react'

import axios from 'axios';

export default function RegisterView() {

    const [username, setUsername] = useState(null);
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [confirmation, setConfirmation] = useState(null);

    function handleRegister(event) {
        event.preventDefault();
        axios.post('https://cs50network.herokuapp.com/restauth/register', {
        "username":username,
        "email": email,
        "password":password,
        "confirmation": confirmation
        })
        .then(res => {
          console.log(res)
          window.location.href = "/"
        }).catch(() => alert("Not valid"))
      }

    return <><h3 className="text-white pt-3">
            Register
        <div className="mb-3">
        <small className="text-muted">Register and join us today.</small>
        </div>
        </h3>
        <div className="container pb-3">
            <div className="row">
            <div className="col text-primary">
            <form className="registerform" onSubmit={(event) => handleRegister(event)}>
            <div className="form-group">
                <label htmlFor="usernameInput">Username</label>
                <input name="username" type="text" className="form-control" id="usernameInput" onChange={(event) => setUsername(event.target.value)}></input>
            </div>
            <div className="form-group">
                <label htmlFor="emailInput">E-mail address</label>
                <input name="email" type="email" className="form-control" id="emailInput" aria-describedby="emailHelp" onChange={(event) => setEmail(event.target.value)}></input>
                <small id="emailHelp" className="form-text text-muted">We'll never share your informations with anyone else.</small>
            </div>
            <div className="form-group">
                <label htmlFor="passwordInput">Password</label>
                <input name="password" type="password" className="form-control" id="passwordInput" onChange={(event) => setPassword(event.target.value)}></input>
            </div>
            <div className="form-group">
                <label htmlFor="confirmationInput">Password confirmation</label>
                <input name="confirmation" type="password" className="form-control" id="confirmationInput" onChange={(event) => setConfirmation(event.target.value)}></input>
            </div>
            <button type="submit" className="btn btn-primary">Register</button>
            </form>
            </div>
            </div>
        </div></>
}
import React, {useState, useContext} from 'react';
import axios from 'axios';

import UserContext from '../UserContext';

export default function LoginView(props) {

  const contextValue = useContext(UserContext)

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function handleLogin(event) {
    event.preventDefault();
    axios.post('https://cs50network.herokuapp.com/restauth/login', {
    "username":username,
    "password":password
    })
    .then(res => {
      window.location.href = "/";
    }).catch(() => alert("Not valid"))
  }

  return <><h3 className="text-white pt-3">
        Login
      <div className="mb-3">
      <small className="text-muted">Login to your account.</small>
      </div>
      </h3>
      <div className="container pt-3">
        <div className="row">
          <div className="col text-primary">
          <form className="loginform" onSubmit={event=>handleLogin(event)}>
          <div className="form-group">
            <label htmlFor="usernameInput">Username</label>
            <input name="username" value={username} type="text" className="form-control" id="usernameInput" aria-describedby="usernameHelp" onChange={event=>setUsername(event.target.value)}></input>
            <small id="usernameHelp" className="form-text text-muted">We'll never share your informations with anyone else.</small>
          </div>
          <div className="form-group">
            <label htmlFor="passwordInput">Password</label>
            <input name="password" value={password} type="password" className="form-control" id="passwordInput" onChange={event=>setPassword(event.target.value)}></input>
          </div>
          <button type="submit" className="btn btn-primary">Login</button>
        </form>
          </div>
        </div>
      </div></>
}
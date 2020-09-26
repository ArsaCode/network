import React, { useState, useEffect } from 'react';

import AllPostsView from './screens/AllPostsView';
import LoginView from './screens/LoginView';
import RegisterView from './screens/RegisterView';
import Header from './components/Header';
import Footer from './components/Footer';
import FollowingsView from './screens/FollowingsView';
import ProfileView from './screens/ProfileView';

import {
  HashRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import axios from 'axios'

import UserContext from './UserContext';

function App() {

  const [isLogged, setIsLogged] = useState(false);
  const [user, setUser] = useState([]);

  const contextValue = {
    isLogged,
    updateIsLogged: setIsLogged,
    user,
    updateUser: setUser
  }

  useEffect(() => {
    axios.get('/restauth')
    .then(res => {
      contextValue.updateIsLogged(true)
      contextValue.updateUser(res.data)
    }).catch(() => {
      contextValue.updateIsLogged(false)
      contextValue.updateUser(null)
    })
  }, [])
  
  return (
    <div className="App container-fluid">
        <Router>
            <UserContext.Provider value={contextValue}>
              <Header />
                <Switch>
                  <Route exact path="/" component={AllPostsView}>
                  </Route>
                  <Route exact path="/register" component={RegisterView}>
                  </Route>
                  <Route exact path="/login" component={LoginView}>
                  </Route>
                  <Route exact path="/followings" component={FollowingsView}>
                  </Route>
                  <Route exact path="/profile/:username" component={ProfileView}>
                  </Route>
                </Switch>
              <Footer />
          </UserContext.Provider>
        </Router>
    </div>
  );
}

export default App;

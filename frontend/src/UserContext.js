import React from 'react';

export default React.createContext({
    isLogged: false,
    updateIsLogged: bool => {
        isLogged = bool
    },
    username: null,
    updateUsername: name => {
        username = name
    }
});
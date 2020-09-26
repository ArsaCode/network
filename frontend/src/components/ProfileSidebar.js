import React, {useState, useEffect, useContext} from 'react';

import UserContext from '../UserContext';

import axios from 'axios';

export default function ProfileSidebar(props) {
    const [isOwnProfile, setIsOwnProfile] = useState(false);
    const [user, setUser] = useState(props.user);
    const contextValue = useContext(UserContext);
    
    useEffect(() => {
        console.log(props.user)
        setUser(props.user);
    }, [props.user])

    useEffect(() => {
        if (contextValue.user.username == user.username) {
            setIsOwnProfile(true);
        }
        else {
            setIsOwnProfile(false);
        }
    })

    const handleFollow = (event) => {
        event.preventDefault();
        axios.put(`/restapi/user/${user.username}`)
        .then(res => {
            setUser(res.data)
        })
    }

    return <div className="col-md-4">
                <div className="card border-info mb-3">
                    <div className="card-header"><strong>@{user.username}'s</strong> profile</div>
                        <div className="card-body text-info">
                            <h5 className="card-title">Followers :</h5>
                            <p className="card-text"><strong>{user.followers}</strong> followers.</p>
                            <h5 className="card-title">Followings :</h5>
                            <p className="card-text">Following <strong>{user.followings}</strong> users.</p>
                            {!isOwnProfile && <button onClick={(event) => handleFollow(event)} className={user.isFollowing ? 'btn btn-danger' : 'btn btn-success'}>{!user.isFollowing ? `Follow @${user.username}` : `Unfollow @${user.username}` }</button>}
                        </div>
                </div>
            </div>
}
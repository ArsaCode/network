import React, {useEffect, useState} from 'react'

import axios from 'axios';

export default function UserSidebar() {
  const [user, setUser] = useState([]);

  useEffect(() => {
    axios.get('/restauth')
    .then(res => {
      setUser(res.data)
    })
  }, [])

  return <div className="col-md-4">
  <div className="card border-info mb-4">
    <div className="card-header">My profile - <strong>@{user.username}</strong></div>
      <div className="card-body text-info">
        <h5 className="card-title">Followers :</h5>
        <p className="card-text">You have <strong>{user.followers}</strong> followers.</p>
        <h5 className="card-title">Followings :</h5>
        <p className="card-text">You are following <strong>{user.followings}</strong> users.</p>
      </div>
  </div>
</div>
}
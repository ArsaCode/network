import React, {useState, useEffect} from 'react';

import Post from '../components/Post';

import axios from 'axios';
import ProfileSidebar from '../components/ProfileSidebar';
import Pagination from '../components/Pagination';

export default function ProfileView({match}) {
    const [user, setUser] = useState([]);

    const [posts, setPosts] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);

    const postsPerPage = 10;

    const [currentPosts, setCurrentPosts] = useState([]);
    const [lastIndex, setLastIndex] = useState(10);
    const [firstIndex, setFirstIndex] = useState(0);


    useEffect(() => {
        axios.get(`/restapi/user/${match.params.username}`)
        .then(res => {
        setUser(res.data)
        })
    }, [])

    useEffect(() => {
        axios.get(`/restapi/user/${match.params.username}/posts`)
        .then(res => {
        setPosts(res.data)
        setCurrentPosts(res.data.slice(firstIndex, lastIndex));
        })
    }, [])

    const switchPage = (event, pageNb) => {
        if (pageNb === currentPage) {
          return;
        }
        event.preventDefault();
        setLastIndex(pageNb * postsPerPage);
        setFirstIndex((pageNb * postsPerPage) - postsPerPage);
        setCurrentPage(pageNb);
        setCurrentPosts([]);
    }

    return <><h3 className="text-white pt-3">
    @{user.username}'s Profile
    <div className="mb-3">
    <small className="text-muted">View content posted by {user.username}</small>
    </div>
    </h3>
    <div className="container">
        <div className="row">
            <ProfileSidebar user={user} />
            <div className="col-md-8">
                {currentPosts && currentPosts.map((item, key) => (
                <Post item={item} key={key} />
                ))}
                <Pagination totalPosts = {posts.length} postsPerPage = {postsPerPage} switchPage = {switchPage} /> 
            </div>
        </div>
    </div></>
}
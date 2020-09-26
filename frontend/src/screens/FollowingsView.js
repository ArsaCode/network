import React, {useState, useEffect, useContext} from 'react'

import Post from '../components/Post';

import axios from 'axios';

import UserContext from '../UserContext';
import UserSidebar from '../components/UserSidebar';
import Pagination from '../components/Pagination'

export default function FollowingsView() {
  const contextValue = useContext(UserContext);

  const [currentPage, setCurrentPage] = useState(1);

  const postsPerPage = 10;

  const [currentPosts, setCurrentPosts] = useState([]);
  const [lastIndex, setLastIndex] = useState(10);
  const [firstIndex, setFirstIndex] = useState(0);

  const [posts, setPosts] = useState([]);

  useEffect(() => {
      axios.get(`http://127.0.0.1:8000/restapi/user/${contextValue.user.username}/followings`)
      .then(res => {
      setPosts(res.data);
      setCurrentPosts(res.data.slice(firstIndex, lastIndex));
      })
  }, [currentPage])

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
  Followings Posts
  <div className="mb-3">
  <small className="text-muted">View the posts from the users you are following.</small>
  </div>
  </h3>
  <div className="container">
    <div className="row">
    {contextValue.isLogged && <UserSidebar />}
      <div className={contextValue.isLogged ? "col-md-8" : "col"}>
        {currentPosts && currentPosts.map((item, key) => (
          <Post item={item} key={key} />
        ))}
        <Pagination totalPosts = {posts.length} postsPerPage = {postsPerPage} switchPage = {switchPage} /> 
      </div>
    </div>
  </div></>
}
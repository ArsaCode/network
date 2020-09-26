import React, {useState, useEffect, useContext} from 'react';
import Post from '../components/Post';

import UserContext from '../UserContext';

import axios from 'axios';
import UserSidebar from '../components/UserSidebar';
import Pagination from '../components/Pagination'

export default function AllPostsViews() {
  const contextValue = useContext(UserContext);

  const [posts, setPosts] = useState([]);

  const [content, setContent] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const postsPerPage = 10;

  const [currentPosts, setCurrentPosts] = useState([]);
  const [lastIndex, setLastIndex] = useState(10);
  const [firstIndex, setFirstIndex] = useState(0);

  
  useEffect(() => {
    axios.get('https://cs50network.herokuapp.com/restapi/posts')
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

  function handleNewPost(event) {
    event.preventDefault();
    axios.post('https://cs50network.herokuapp.com/restapi/posts', {
    "content": content
    })
    .then(() => {
      window.location.href = "/"
    }).catch(err=>console.log(err))
  }

  return <><div className="container">
              <div className="row mb-3">
                <div className="col mx-3">
                  <h3 className="text-white pt-3">
                  All Posts
                  <div className="mb-3">
                  <small className="text-muted">View all posts, from all users.</small>
                  </div>
                  </h3>
                  {contextValue.isLogged && <form className="text-primary" onSubmit={event => handleNewPost(event)}>
                  <div className="form-group">
                    <label htmlFor="newPost">Create a new post</label>
                    <input name="content" type="textarea" className="form-control" id="newPost"  placeholder="Create a new post here" onChange={event => setContent(event.target.value)}></input>
                  </div>
                  <button type="submit" className="btn btn-primary">Post</button>
                  </form>}
                </div>
              </div>
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
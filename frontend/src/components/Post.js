import React, {useState, useContext} from 'react';
import axios from 'axios';

import {Link} from 'react-router-dom';

import UserContext from '../UserContext';

export default function Post(props) {

  const contextValue = useContext(UserContext)

  const [post, setPost] = useState(props.item)

  const [isEditing, setIsEditing] = useState(false);

  const [isHovering, setIsHovering] = useState(false);

  const [content, setContent] = useState(post.content);

  const handleLike = (event) => {
    event.preventDefault();
    axios.put(`https://cs50network.herokuapp.com/restapi/post/${post.id}/like`)
      .then(res => {
        setPost(res.data);
      })
  }

  const handleDelete = (event) => {
    event.preventDefault();
    axios.delete(`https://cs50network.herokuapp.com/restapi/post/${post.id}`)
      .then(() => {
        window.location.href = "/";
      })
  }

  const editSignal = (event) => {
    event.preventDefault();
    setIsEditing(true);
  }

  const handleEdit = (event) => {
    event.preventDefault();
    axios.put(`https://cs50network.herokuapp.com/restapi/post/${post.id}`, {
      "content": content
    })
    .then((res) => {
      setPost(res.data)
    }).catch(() => alert('Not valid'))
    setIsEditing(false)
  }

  return <div className="card border-primary mb-3">
      {!isHovering ? 
      <div onMouseOver={() => setIsHovering(true)} className="card-header bg-light border-primary text-dark"><strong>{!post.isAuthor ? `@${post.author}` : 'You' }</strong> posted :</div>
      :
      <Link to ={contextValue.isLogged ? `/profile/${post.author}` : "/login"} onMouseOut={() => setIsHovering(false)} className="card-header bg-primary"><strong>{!post.isAuthor ? `@${post.author}` : 'You' }</strong> posted :</Link>}
      <div className="card-body text-primary">
      {!isEditing ? <p className="card-text">{post.content}</p> : <input className="form-control" name="content" type="textarea" value={content} onChange={event => setContent(event.target.value)}></input>}
      </div>
      {contextValue.isLogged ? 
        <div className="btn-group mx-2 my-3">
        {!post.isLiking ? <button onClick={(event) => handleLike(event)} data-postid={post.id} type="button" className="btn btn-primary">Like</button>
        : <button onClick={(event) => handleLike(event)} data-postid={post.id} type="button" className="btn btn-outline-primary">Unlike</button>}

        {post.isAuthor && !isEditing ? <button onClick={(event) => editSignal(event)} data-postid={post.id} type="button" className="btn btn-outline-warning">Edit</button> : null}

        {post.isAuthor && isEditing ? <button onClick={(event) => handleEdit(event)} data-postid={post.id} type="button" className="btn btn-outline-success">Confirm Edit</button> : null}

        {post.isAuthor && <button onClick={(event) => handleDelete(event)} data-postid={post.id} type="button" className="btn btn-outline-danger">Delete</button>}
        
        </div> 
      : null}
      <div className="card-footer bg-transparent border-primary"><strong className="text-dark">{post.likes.length} likes</strong> - <span className="text-muted">Posted on {post.timestamp}</span></div>
  </div>
}
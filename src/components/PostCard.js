import React, { useContext, useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import Spinner from "react-bootstrap/Spinner";
import { isEmpty } from "./Utils";
import FollowHandler from "./FollowHandler";
import { Link } from "react-router-dom";
import TimeAgo from "react-timeago";
import { BiCommentDetail } from "react-icons/bi";
import { BsShareFill } from "react-icons/bs";
import LikeButton from "./LikeButton";
import { FcLike } from "react-icons/fc";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineEdit } from "react-icons/ai";
import { AiOutlineDelete } from "react-icons/ai";
import Form from "react-bootstrap/Form";
import { Button } from "react-bootstrap";
import { updatePost, deletePost } from "../actions/post.actions";
import { Alert } from "react-bootstrap";
import Comments from "./Comments";
import { FaCheck } from "react-icons/fa";
import { UidContext } from "./Context";

function PostCard({ post }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdated, setIsUpdated] = useState(false);
  const [textUpdate, setTextUpdate] = useState(null);
  const [showComments, setShowComments] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const dispatch = useDispatch();
  const usersData = useSelector((state) => state.usersReducer);
  const uid = useContext(UidContext);
  // const userData = useSelector((state) => state.usersReducer);
  // const posts = useSelector((state) => state.postReducer);

  useEffect(() => {
    if (!isEmpty(usersData[0])) {
      setIsLoading(false);
    }
  }, [usersData]);

  function updatePostMessage() {
    if (textUpdate !== null) {
      dispatch(updatePost(post._id, textUpdate));
    }
    setIsUpdated(false);
  }

  function deleteUserPost() {
    dispatch(deletePost(post._id, post.picture.split(".com/")[1]));
    setShowDeleteConfirm(false);
  }
  return (
    <div className="posts-container">
      {isLoading ? (
        <Spinner animation="border" variant="secondary" />
      ) : (
        <>
          <Card className="post-card">
            <Card.Header className="d-flex align-items-center">
              <Link
                style={{ textAlign: "center", textDecoration: "none" }}
                to={`/user-profile/${post.posterId}`}
              >
                <img
                  className="poster-pic"
                  src={
                    !isEmpty(usersData[0]) &&
                    usersData
                      .map((user) => {
                        if (user._id === post.posterId) {
                          return user.picture;
                        } else {
                          return null;
                        }
                      })
                      .join("")
                  }
                  alt="poster-pic"
                />
              </Link>
              <span style={{ paddingRight: "10px" }}>
                {!isEmpty(usersData[0]) &&
                  usersData.map((user) => {
                    if (user._id === post.posterId) {
                      return (
                        <div key={post._id}>
                          <Link
                            style={{ textDecoration: "none" }}
                            to={`/user-profile/${post.posterId}`}
                          >
                            <span style={{ paddingRight: "10px" }}>
                              {user.username}
                            </span>
                          </Link>
                        </div>
                      );
                    }
                    return null;
                  })}
              </span>
              <span style={{ marginLeft: "auto", order: "2" }}>
                <TimeAgo className="text-muted" date={post.createdAt} />
                {post.posterId !== uid && (
                  <FollowHandler idToFollow={post.posterId} type={"card"} />
                )}
              </span>
            </Card.Header>
            {post.posterId === uid && (
              <Card.Body
                className="d-flex align-items-center justify-content-end pt-1 pb-1"
                style={{
                  cursor: "pointer",
                }}
              >
                {!isUpdated && (
                  <AiOutlineEdit
                    onClick={() => setIsUpdated(!isUpdated)}
                    size={22}
                    style={{
                      float: "right",
                      marginLeft: "5px",
                      cursor: "pointer",
                    }}
                  />
                )}
                {isUpdated && (
                  <FaCheck
                    onClick={updatePostMessage}
                    size={20}
                    style={{
                      float: "right",
                      marginLeft: "5px",
                      cursor: "pointer",
                    }}
                  />
                )}
                <AiOutlineDelete
                  onClick={() => setShowDeleteConfirm(!showDeleteConfirm)}
                  size={22}
                  style={{
                    float: "right",
                    marginLeft: "8px",
                    cursor: "pointer",
                  }}
                />
              </Card.Body>
            )}
            <Card.Body className="pt-2">
              {post.posterId === uid &&
                isUpdated === false && (
                  <Card.Text className="mb-2" style={{ marginTop: "-15px" }}>
                    {post.message}
                  </Card.Text>
                )}
              {post.posterId === uid &&
                isUpdated === true && (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      paddingBottom: "10px",
                    }}
                  >
                    <Form.Group className="mb-0">
                      <Form.Control
                        as="textarea"
                        style={{ height: "100px" }}
                        defaultValue={post.message}
                        onChange={(e) => setTextUpdate(e.target.value)}
                      />
                    </Form.Group>
                  </div>
                )}
              {post.posterId === uid &&
                showDeleteConfirm && (
                  <Alert
                    variant="danger"
                    onClose={() => setShowDeleteConfirm(false)}
                    dismissible
                  >
                    <p>Are you sure you want to delete this post?</p>
                    <hr />
                    <div className="d-flex justify-content-end">
                      <Button onClick={deleteUserPost} variant="outline-danger">
                        Delete
                      </Button>
                    </div>
                  </Alert>
                )}
              {post.posterId !== uid && (
                <Card.Text>{post.message}</Card.Text>
              )}
              <span style={{ display: "flex" }}>
                {post.picture && (
                  <img
                    className="post-content-pic"
                    src={post.picture}
                    alt="post-pic"
                  ></img>
                )}
                {post.video && (
                  <iframe
                    width="500"
                    height="300"
                    src={post.video}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={post._id}
                  ></iframe>
                )}
              </span>
              <div
                className="mt-2"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  {
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <span style={{ paddingRight: "3px" }}>
                        {post.likers.length}
                      </span>
                      <FcLike style={{ color: "red", marginBottom: "3px" }} />
                    </div>
                  }
                </div>
                <div>
                  {post.comments.length > 0 ? (
                    <span
                      onClick={() => setShowComments(!showComments)}
                      className="view-comments-link"
                    >
                      View {post.comments.length} comment(s)
                    </span>
                  ) : (
                    <span className="view-comments-link">No comments</span>
                  )}
                </div>
              </div>
            </Card.Body>
            <Card.Footer style={{ backgroundColor: "white" }}>
              <span className="d-flex align-items-center justify-content-around">
                <span>
                  <span style={{ paddingRight: "3px" }}>
                    {post.comments.length}
                  </span>
                  <BiCommentDetail
                    onClick={() => setShowComments(!showComments)}
                    size={20}
                    style={{ cursor: "pointer" }}
                  />
                </span>
                <span style={{ display: "flex" }}>
                  <LikeButton post={post} />
                </span>
                <BsShareFill style={{ cursor: "pointer" }} />
              </span>
            </Card.Footer>
            {showComments && <Comments post={post} />}
          </Card>
        </>
      )}
    </div>
  );
}

export default PostCard;

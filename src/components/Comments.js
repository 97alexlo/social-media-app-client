import React, { useState } from "react";
import Card from "react-bootstrap/Card";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { isEmpty} from "./Utils.js";
import FollowHandler from "./FollowHandler.js";
import TimeAgo from "react-timeago";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { addComment, getPosts } from "../actions/post.actions.js";
import EditDeleteComment from "./EditDeleteComment.js";

function Comments({ post }) {
  const [postACommentText, setPostACommentText] = useState("");
  //   const [text, setText] = useState("");
  const usersData = useSelector((state) => state.usersReducer);
  const userData = useSelector((state) => state.userReducer);
  const dispatch = useDispatch();
  //console.log(post);

  function handlePostComment(e) {
    e.preventDefault();

    if (postACommentText !== "") {
      dispatch(
        addComment(post._id, userData._id, postACommentText, userData.username)
      )
        .then(() => dispatch(getPosts()))
        .then(() => setPostACommentText(""));
    }
  }
  return (
    <ListGroup className="list-group-flush">
      {post.comments &&
        post.comments.map((comment) => {
          return (
            <ListGroupItem key={comment._id}>
              <Card.Text
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "3px",
                }}
              >
                <Link
                  style={{ textAlign: "center", textDecoration: "none" }}
                  to={`/user-profile/${comment.commenterId}`}
                >
                  <img
                    className="commenter-pic"
                    src={
                      !isEmpty(usersData[0]) &&
                      usersData
                        .map((user) => {
                          if (user._id === comment.commenterId) {
                            return user.picture;
                          } else {
                            return null;
                          }
                        })
                        .join("")
                    }
                    alt="poster-pic"
                  />
                  <span style={{ paddingRight: "10px" }}>
                    {comment.commenterUsername}
                  </span>
                </Link>
                <span style={{ marginLeft: "auto", order: "2" }}>
                  <TimeAgo className="text-muted" date={comment.timestamp} />
                  {comment.commenterId !== localStorage.getItem("uid") && (
                    <FollowHandler
                      idToFollow={comment.commenterId}
                      type={"card"}
                    />
                  )}
                </span>
              </Card.Text>
              {comment.commenterId !== localStorage.getItem("uid") &&
              <Card.Text className="mb-0">{comment.text}</Card.Text>
        }
              <EditDeleteComment comment={comment} postId={post._id} />
            </ListGroupItem>
          );
        })}
      <ListGroupItem>
        <Form onSubmit={handlePostComment}>
          <Form.Group className="d-flex align-items-center">
            <img
              className="commenter-pic"
              src={
                !isEmpty(usersData[0]) &&
                usersData
                  .map((user) => {
                    if (user._id === localStorage.getItem("uid")) {
                      return user.picture;
                    } else {
                      return null;
                    }
                  })
                  .join("")
              }
              alt="poster-pic"
            />
            <Form.Control
              style={{ marginRight: "10px" }}
              onChange={(e) => setPostACommentText(e.target.value)}
              value={postACommentText}
              placeholder="Leave a comment"
            ></Form.Control>
            <Button size="sm" type="submit" variant="success">
              Send
            </Button>
          </Form.Group>
        </Form>
      </ListGroupItem>
    </ListGroup>
  );
}

export default Comments;

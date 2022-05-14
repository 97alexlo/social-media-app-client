import React, { useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { deleteComment, editComment } from "../actions/post.actions";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { AiOutlineEdit } from "react-icons/ai";
import { AiOutlineDelete } from "react-icons/ai";
import { FaCheck } from "react-icons/fa";
import { Card } from "react-bootstrap";
import { Alert } from "react-bootstrap";
import { UidContext } from "./Context";

function EditDeleteComment({ comment, postId }) {
  const [isAuthor, setIsAuthor] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [edit, setEdit] = useState(false);
  const [text, setText] = useState("");
  const dispatch = useDispatch();
  const uid = useContext(UidContext);
  const handleEditComment = (e) => {
    e.preventDefault();

    if (text !== "") {
      dispatch(editComment(postId, comment._id, text));
      setText("");
      setEdit(false);
    } else {
      setEdit(false);
    }
  };

  const handleDelete = () => dispatch(deleteComment(postId, comment._id));

  useEffect(() => {
    const checkAuthor = () => {
      if (uid === comment.commenterId) {
        setIsAuthor(true);
      } else if (localStorage.getItem("uid") === comment.commenterId) {
        console.log("checking user id from local storage");
        setIsAuthor(true);
      }
    };
    checkAuthor();
  }, [comment.commenterId, uid]);

  return (
    <div>
      {isAuthor && edit === false && (
        <>
          <Card.Text className="mb-0">{comment.text}</Card.Text>
          <span className="d-flex justify-content-end">
            <AiOutlineEdit
              onClick={() => setEdit(!edit)}
              size={20}
              style={{ cursor: "pointer" }}
            />
            {/* <AiOutlineDelete
              size={18}
              style={{ marginLeft: "5px", cursor: "pointer" }}
            /> */}
          </span>
        </>
      )}
      {isAuthor && edit === true && (
        <>
          <Form.Group className="mb-3">
            <Form.Control
              as="textarea"
              placeholder="Write something about yourself"
              style={{ height: "55px" }}
              defaultValue={comment.text}
              onChange={(e) => setText(e.target.value)}
            />
          </Form.Group>
          {showDeleteConfirm && (
            <Alert
              className="d-flex align-items-center justify-content-between"
              variant="danger"
              onClose={() => setShowDeleteConfirm(false)}
              dismissible
            >
              <span>Are you sure?</span>
              <Button onClick={handleDelete} size="sm" variant="outline-danger">
                Delete
              </Button>
            </Alert>
          )}

          <span
            style={{ marginTop: "-10px" }}
            className="d-flex justify-content-end align-items-center"
          >
            <FaCheck
              size={18}
              style={{ cursor: "pointer" }}
              onClick={(e) => handleEditComment(e, comment._id)}
            >
              Save
            </FaCheck>
            {!showDeleteConfirm && (
              <AiOutlineDelete
                size={20}
                onClick={() => setShowDeleteConfirm(true)}
                style={{ marginLeft: "5px", cursor: "pointer" }}
              />
            )}
          </span>
        </>
      )}
    </div>
  );
}

export default EditDeleteComment;

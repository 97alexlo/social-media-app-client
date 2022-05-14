import React, { useState, useEffect, useRef } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Spinner from "react-bootstrap/Spinner";
import { useDispatch, useSelector } from "react-redux";
import { addPost, getPosts } from "../actions/post.actions";
import { isEmpty } from "./Utils";
import { Link } from "react-router-dom";

function NewPostForm() {
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [postPicture, setPostPicture] = useState(null);
  const [file, setFile] = useState("");
  const userData = useSelector((state) => state.userReducer);
  //const error = useSelector((state) => state.errorReducer.postError);
  const dispatch = useDispatch();
  const ref = useRef();

  const handlePost = async () => {
    if (message || postPicture) {
      const data = new FormData();
      data.append("posterId", userData._id);
      data.append("message", message);
      if (file) {
        data.append("file", file);
      }
      await dispatch(addPost(data));
      dispatch(getPosts());
      cancelImage();
      setMessage("");
    } else {
      alert("Please enter message");
    }
  };

  const handlePicture = (pic) => {
    const blob = pic.slice(0, pic.size, ".jpg");
    const newFile = new File(
      [blob],
      Date.now() + "post" + userData.username + ".jpg",
      {
        type: "image/jpg",
      }
    );
    setPostPicture(URL.createObjectURL(pic));
    setFile(newFile);
  };

  const cancelImage = () => {
    setPostPicture("");
    setFile("");
    ref.current.value = "";
  };

  useEffect(() => {
    if (!isEmpty(userData)) {
      setIsLoading(false);
    }
  }, [userData, message]);

  return (
    <div className="posts-container">
      {isLoading ? (
        <Spinner animation="border" variant="secondary" />
      ) : (
        <>
          <Card className="post-card">
            <Card.Header style={{ backgroundColor: "white" }}>
              <div className="d-flex flex-direction-row align-items-center">
                <Link
                  style={{ textAlign: "center", textDecoration: "none" }}
                  to={`/profile`}
                >
                  <img
                    className="poster-pic"
                    src={userData.picture}
                    alt="poster-pic"
                  />
                </Link>
                <Form.Control
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={`What's on your mind, ${userData.username}?`}
                ></Form.Control>
              </div>
              {postPicture ? (
                <div className="d-flex justify-content-center mt-2">
                  <img
                    className="post-content-pic"
                    src={postPicture}
                    alt="post-pic"
                  />
                </div>
              ) : null}
              <Form.Group
                className="d-flex align-items-center mt-2"
                controlId="formFile"
              >
                <Form.Control
                  ref={ref}
                  onChange={(e) => handlePicture(e.target.files[0])}
                  name="file"
                  accept=".jpg, .jpeg, .png, .webp"
                  type="file"
                />
                <Button
                  onClick={cancelImage}
                  style={{ marginLeft: "5px", whiteSpace: "nowrap" }}
                  variant="danger"
                  disabled={
                    postPicture !== "" && postPicture !== null ? false : true
                  }
                >
                  Remove Image
                </Button>
              </Form.Group>
              <Button
                onClick={handlePost}
                disabled={message || postPicture ? false : true}
                className="w-100 mt-2"
              >
                Post
              </Button>
            </Card.Header>
          </Card>
        </>
      )}
    </div>
  );
}

export default NewPostForm;

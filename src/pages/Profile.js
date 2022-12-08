import React, { useState, useEffect, useContext } from "react";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import ListGroupItem from "react-bootstrap/ListGroupItem";
import { useDispatch, useSelector } from "react-redux";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { uploadPicture, updateBio } from "../actions/user.actions.js";
import { getUserPosts } from "../actions/post.actions.js";
import { dateParser } from "../components/Utils.js";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";
import FollowHandler from "../components/FollowHandler.js";
import { Link } from "react-router-dom";
import { isEmpty } from "../components/Utils.js";
import PostCard from "../components/PostCard.js";
import PaginationComponent from "../components/PaginationComponent.js";
import { AiOutlineEdit } from "react-icons/ai";
import { FaCheck } from "react-icons/fa";
import NewPostForm from "../components/NewPostForm.js";
import { UidContext } from "../components/Context.js";

function Profile() {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.userReducer);
  const usersData = useSelector((state) => state.usersReducer);
  const posts = useSelector((state) => state.postReducer);
  const [file, setFile] = useState("");
  const [bio, setBio] = useState(null);
  const [updateForm, setUpdateForm] = useState(false);
  const [followingPopup, setFollowingPopup] = useState(false);
  const [followersPopup, setFollowersPopup] = useState(false);
  const uid = useContext(UidContext);

  useEffect(() => {
    if (uid !== null) {
      dispatch(getUserPosts(uid, 1));
    } 
  }, [dispatch, uid]);

  function handleClose() {
    setFollowersPopup(false);
    setFollowingPopup(false);
  }

  function handleFile(pic) {
    const blob = pic.slice(0, pic.size, ".jpg");
    const newFile = new File([blob], Date.now() + userData.username + ".jpg", {
      type: "image/jpg",
    });
    setFile(newFile);
  }

  async function handleUpload(e) {
    e.preventDefault();

    if (file !== "") {
      const data = new FormData();
      data.append("name", userData.pseudo);
      data.append("userId", userData._id);
      data.append("file", file);

      // dispatch(pic, user id, image to be deleted and replaced)
      const isDone = await dispatch(
        uploadPicture(data, userData._id, userData.picture.split(".com/")[1])
      );
      if (isDone === true) {
        window.location.reload();
      }
    }
  }

  function handleUpdateBio() {
    if (bio !== null) {
      dispatch(updateBio(userData._id, bio));
    }
    setUpdateForm(false);
  }

  return (
    <div className="profile-container">
      <Card className="profile-card">
        <Card.Header
          style={{ fontWeight: "bold", fontSize: "large" }}
          className="text-center"
        >
          {userData.username}'s profile
        </Card.Header>
        <ListGroup className="list-group-flush">
          <ListGroupItem className="profile-list-item">
            <Card.Text
              style={{ marginBottom: ".3em", textDecoration: "underline" }}
              className="text-center"
            >
              Profile Picture
            </Card.Text>
            {userData.picture ? (
              <Card.Img className="profile-pic" src={`${userData.picture}`} />
            ) : (
              <Card.Text>No profile picture!</Card.Text>
            )}
            <Card.Body className="profile-list-item">
              <Form.Group controlId="formFile" className="mb-3">
                <Form.Control
                  onChange={(e) => handleFile(e.target.files[0])}
                  name="file"
                  accept=".jpg, .jpeg, .png, .webp"
                  type="file"
                />
                <Form.Text className="upload-error"></Form.Text>
              </Form.Group>
              <Button
                onClick={(e) => handleUpload(e)}
                variant="primary"
                type="submit"
              >
                Upload
              </Button>
            </Card.Body>
          </ListGroupItem>
          <ListGroupItem>
            <Card.Body className="profile-list-item">
              <Card.Text
                style={{
                  textDecoration: "underline",
                  marginTop: "-.9em",
                  marginBottom: ".2em",
                }}
                className="text-center"
              >
                About
              </Card.Text>
              {updateForm === false ? (
                <>
                  <Card.Text
                    style={{ marginBottom: "1em" }}
                    onClick={() => setUpdateForm(true)}
                    className="text-center"
                  >
                    {userData.bio}
                  </Card.Text>
                  <AiOutlineEdit
                    size={25}
                    style={{ margin: "0 auto", cursor: "pointer" }}
                    onClick={() => setUpdateForm(true)}
                  >
                    Edit
                  </AiOutlineEdit>
                </>
              ) : (
                <>
                  <Form.Group className="mb-3">
                    <Form.Control
                      as="textarea"
                      placeholder="Write something about yourself"
                      style={{ height: "90px" }}
                      defaultValue={userData.bio}
                      onChange={(e) => setBio(e.target.value)}
                    />
                  </Form.Group>
                  <FaCheck
                    size={21}
                    style={{ margin: "0 auto", cursor: "pointer" }}
                    onClick={() => handleUpdateBio()}
                  >
                    Save
                  </FaCheck>
                </>
              )}
            </Card.Body>
          </ListGroupItem>
          <ListGroupItem>
            <Card.Body
              style={{ marginTop: "-.9em", marginBottom: "-.9em" }}
              className="follow-info"
            >
              <Button
                onClick={() => setFollowersPopup(true)}
                className="follow-btn"
                variant="secondary"
              >
                Followers:{" "}
                {userData.followers ? userData.followers.length : "0"}
              </Button>
              <Button
                onClick={() => setFollowingPopup(true)}
                className="follow-btn"
                variant="secondary"
              >
                Following:{" "}
                {userData.following ? userData.following.length : "0"}
              </Button>
            </Card.Body>
          </ListGroupItem>
          <ListGroupItem>
            <Card.Body>
              <Card.Text
                style={{ marginTop: "-.9em", marginBottom: "-.9em" }}
                className="text-center"
              >
                Email: {userData.email}
              </Card.Text>
            </Card.Body>
          </ListGroupItem>
          <ListGroupItem>
            <Card.Body>
              <Card.Text
                style={{ marginTop: "-.9em", marginBottom: "-.9em" }}
                className="text-center"
              >
                Member since: {dateParser(userData.createdAt)}
              </Card.Text>
            </Card.Body>
          </ListGroupItem>
        </ListGroup>
      </Card>
      <div className="profile-posts">
        <NewPostForm />
        {/* {!isEmpty(posts) && (
          <span style={{ fontWeight: "bold", fontSize: "large" }}>
            {userData.username}'s posts
          </span>
        )} */}
        {!isEmpty(posts["docs"]) &&
          posts.docs.map((post) => {
            return (
              <div key={post._id}>
                <PostCard post={post} />
              </div>
            );
          })}
        {posts.totalPages > 1 && (
          <PaginationComponent profile={true} uid={uid} />
        )}
      </div>
      <Modal scrollable centered show={followersPopup} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Followers</Modal.Title>
        </Modal.Header>
        <Modal.Body scrollable="true">
          <ListGroup>
            <Table striped bordered>
              <tbody>
                {userData.followers &&
                  Array.from(usersData).map((user) => {
                    for (let i = 0; i < userData.followers.length; i++) {
                      if (user._id === userData.followers[i]) {
                        return (
                          <tr key={user._id}>
                            <td>
                              <Link
                                style={{ textDecoration: "none" }}
                                to={`/user-profile/${user._id}`}
                              >
                                <img
                                  className="modal-picture"
                                  src={user.picture}
                                  alt="user-pic"
                                />
                                <span>{user.username}</span>
                              </Link>
                            </td>
                            <td className="btn-col">
                              <FollowHandler
                                idToFollow={user._id}
                                type={"suggestion"}
                              />
                            </td>
                          </tr>
                        );
                      }
                    }
                    return null;
                  })}
              </tbody>
            </Table>
          </ListGroup>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
      <Modal scrollable centered show={followingPopup} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Following</Modal.Title>
        </Modal.Header>
        <Modal.Body scrollable="true">
          <ListGroup>
            <Table striped bordered>
              <tbody>
                {userData.following &&
                  usersData.map((user) => {
                    for (let i = 0; i < userData.following.length; i++) {
                      if (user._id === userData.following[i]) {
                        return (
                          <tr key={user._id}>
                            <td>
                              <Link
                                style={{ textDecoration: "none" }}
                                to={`/user-profile/${user._id}`}
                              >
                                <img
                                  className="modal-picture"
                                  src={user.picture}
                                  alt="user-pic"
                                />
                                <span>{user.username}</span>
                              </Link>
                            </td>
                            <td className="btn-col">
                              <FollowHandler
                                idToFollow={user._id}
                                type={"suggestion"}
                              />
                            </td>
                          </tr>
                        );
                      }
                    }
                    return null;
                  })}
              </tbody>
            </Table>
          </ListGroup>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
    </div>
  );
}

export default Profile;

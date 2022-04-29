import React, { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import ListGroupItem from "react-bootstrap/ListGroupItem";
import { useDispatch, useSelector } from "react-redux";
import { getUserPosts } from "../actions/post.actions.js";
import { dateParser } from "../components/Utils.js";
import FollowHandler from "../components/FollowHandler.js";
import { useParams } from "react-router-dom";
import axios from "axios";
import { isEmpty } from "../components/Utils.js";
import { useNavigate } from "react-router-dom";
import PostCard from "../components/PostCard.js";
import PaginationComponent from "../components/PaginationComponent.js";

function OtherProfile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.postReducer);
  const [otherUserData, setOtherUserData] = useState({});

  const { userId } = useParams();

  useEffect(() => {
    async function checkuser() {
      try {
        // const res = await axios({
        //   method: "get",
        //   url: `${process.env.REACT_APP_API_URL}jwtid`,
        //   withCredentials: true,
        // });
        if (localStorage.getItem("uid") === userId) {
          navigate("/profile", { replace: true });
        } else {
          const res = await axios({
            method: "get",
            url: `${process.env.REACT_APP_API_URL}api/user/${userId}`,
            withCredentials: true,
          });
          if (res) {
            dispatch(getUserPosts(userId, 1));
            setOtherUserData(res.data);
          }
        }
      } catch (err) {
        console.log(err);
        navigate("/", { replace: true });
      }
    }
    checkuser();
  }, [dispatch, navigate, userId]);

  return (
    <div className="profile-container">
      <Card className="profile-card">
        <Card.Header
          style={{ fontWeight: "bold", fontSize: "large" }}
          className="text-center"
        >
          {otherUserData.username}'s profile
        </Card.Header>
        <ListGroup className="list-group-flush">
          <ListGroupItem className="profile-list-item">
            <Card.Text
              style={{ marginBottom: ".3em", textDecoration: "underline" }}
              className="text-center"
            >
              Profile Picture
            </Card.Text>
            {otherUserData.picture ? (
              <Card.Img
                className="profile-pic"
                src={`${otherUserData.picture}`}
              />
            ) : (
              <Card.Text>No profile picture!</Card.Text>
            )}
            <Card.Body className="profile-list-item">
              <FollowHandler
                idToFollow={otherUserData._id}
                type="suggestion"
              ></FollowHandler>
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
              <Card.Text className="text-center">{otherUserData.bio}</Card.Text>
            </Card.Body>
          </ListGroupItem>
          <ListGroupItem>
            <Card.Body>
              <Card.Text
                style={{ marginTop: "-.9em", marginBottom: "-.9em" }}
                className="text-center"
              >
                Email: {otherUserData.email}
              </Card.Text>
            </Card.Body>
          </ListGroupItem>
          <ListGroupItem>
            <Card.Body>
              <Card.Text
                style={{ marginTop: "-.9em", marginBottom: "-.9em" }}
                className="text-center"
              >
                Member since: {dateParser(otherUserData.createdAt)}
              </Card.Text>
            </Card.Body>
          </ListGroupItem>
        </ListGroup>
      </Card>
      <div className="profile-posts">
        {!isEmpty(posts["docs"]) &&
          posts.docs.map((post) => {
            if (post.posterId === userId) {
              return (
                <div key={post._id}>
                  <PostCard post={post} />
                </div>
              );
            }
            return null;
          })}
        {posts.totalPages > 1 && (
          <PaginationComponent profile={true} uid={userId} />
        )}
      </div>
    </div>
  );
}

export default OtherProfile;

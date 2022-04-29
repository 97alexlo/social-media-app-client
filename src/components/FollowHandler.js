import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import { useDispatch, useSelector } from "react-redux";
import { followUser, unfollowUser } from "../actions/user.actions.js";
import { isEmpty } from "../components/Utils.js";

const FollowHandler = ({ idToFollow, type }) => {
  const userData = useSelector((state) => state.userReducer);
  const [isFollowed, setIsFollowed] = useState(false);
  const dispatch = useDispatch();

  const handleFollow = () => {
    dispatch(followUser(userData._id, idToFollow));
    setIsFollowed(true);
  };

  const handleUnfollow = () => {
    dispatch(unfollowUser(userData._id, idToFollow));
    setIsFollowed(false);
  };

  useEffect(() => {
    if (!isEmpty(userData.following)) {
      if (userData.following.includes(idToFollow)) {
        setIsFollowed(true);
      } else setIsFollowed(false);
    }
  }, [userData, idToFollow]);

  return (
    <>
      {isFollowed && !isEmpty(userData) && (
        <>
          {type === "suggestion" && (
            <Button
              onClick={handleUnfollow}
              style={{ marginTop: "5px" }}
              variant="outline-primary"
            >
              Following
            </Button>
          )}
          {type === "card" && (
            <Button
              size="sm"
              style={{marginLeft: "10px"}}
              onClick={handleUnfollow}
              variant="outline-primary"
            >
              Following
            </Button>
          )}
        </>
      )}
      {isFollowed === false && !isEmpty(userData) && (
        <>
          {type === "suggestion" && (
            <Button
              onClick={handleFollow}
              style={{ marginTop: "5px" }}
              variant="primary"
            >
              Follow
            </Button>
          )}
          {type === "card" && (
            <Button
            style={{marginLeft: "10px"}}
              size="sm"
              onClick={handleFollow}
              variant="primary"
            >
              Follow
            </Button>
          )}
        </>
      )}
    </>
  );
};

export default FollowHandler;

import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { likePost, unlikePost } from "../actions/post.actions.js";
import { FcLike } from "react-icons/fc";
import { HiOutlineHeart } from "react-icons/hi";

function LikeButton({ post }) {
  const [liked, setLiked] = useState(false);
  const uid = localStorage.getItem("uid");
  const dispatch = useDispatch();

  const like = () => {
    dispatch(likePost(post._id, uid));
    setLiked(true);
  };

  const unlike = () => {
    dispatch(unlikePost(post._id, uid));
    setLiked(false);
  };

  useEffect(() => {
    if (post.likers.includes(uid)) {
      setLiked(true);
    } else {
      setLiked(false);
    }
  }, [liked, post.likers, uid]);

  return (
    <div>
      {uid && liked === false && (
        <HiOutlineHeart
          onClick={like}
          size={20}
          style={{ marginBottom: "4px", cursor: "pointer" }}
        />
      )}
      {uid && liked && (
        <FcLike
          onClick={unlike}
          size={20}
          style={{ color: "red", marginBottom: "4px", cursor: "pointer" }}
        />
      )}
    </div>
  );
}

export default LikeButton;

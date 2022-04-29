import React, { useEffect, useState } from "react";
import { Pagination } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { getPosts, getUserPosts } from "../actions/post.actions";

function PaginationComponent({profile, uid}) {
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.postReducer);
  const [userId, setUserId] = useState("")

  useEffect(() => {
    if(profile === false) {
      dispatch(getPosts(page));
    } else {
      if(userId === "") {
        setUserId(uid)
      }
      dispatch(getUserPosts(userId, page))
    }
  }, [dispatch, page, profile, uid, userId]);

  function handleNext() {
    setPage((p) => {
      return p + 1;
    });
  }

  function handlePrevious() {
    setPage((p) => {
      if (p === 1) {
        return p;
      }
      return p - 1;
    });
  }

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Pagination>
        <Pagination.First onClick={() => setPage(1)} />
        <Pagination.Prev disabled={page === 1} onClick={handlePrevious} />
        <Pagination.Item disabled>
          {page}/{posts.totalPages}
        </Pagination.Item>
        <Pagination.Next
          disabled={page === posts.totalPages}
          onClick={handleNext}
        />
        <Pagination.Last onClick={() => setPage(posts.totalPages)} />
      </Pagination>
    </div>
  );
}

export default PaginationComponent;

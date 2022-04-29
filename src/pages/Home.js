import React, { useEffect }from "react";
import { useSelector, useDispatch } from "react-redux";
import { isEmpty } from "../components/Utils";
import PostCard from "../components/PostCard";
import PaginationComponent from "../components/PaginationComponent";
import { getPosts } from "../actions/post.actions";
import NewPostForm from "../components/NewPostForm";

function Home() {
  const posts = useSelector((state) => state.postReducer);
  const dispatch = useDispatch();

  useEffect(() => {
      dispatch(getPosts(1))
  }, [dispatch])
  
  return (
    <div className="home-container">
      <NewPostForm />
      {!isEmpty(posts["docs"]) &&
        posts.docs.map((post) => {
          return <PostCard post={post} key={post._id} />;
        })}
      {posts.totalPages > 1 && <PaginationComponent profile={false} />}
    </div>
  );
}

export default Home;

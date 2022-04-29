import {
  GET_POSTS,
  GET_USER_POSTS,
  CLEAR_POSTS,
  LIKE_POST,
  UNLIKE_POST,
  UPDATE_POST,
  DELETE_POST,
  EDIT_COMMENT,
  DELETE_COMMENT,
} from "../actions/post.actions.js";

const initialState = {};

export default function postReducer(state = initialState, action) {
  switch (action.type) {
    case GET_POSTS:
      return action.payload;
    case GET_USER_POSTS:
      return action.payload;
    case CLEAR_POSTS:
      return {};
    case LIKE_POST:
      let likeState = state.docs.map((post) => {
        if (post._id === action.payload.postId) {
          return {
            ...post,
            likers: [action.payload.userId, ...post.likers],
          };
        }
        return post;
      });
      return {
        ...state,
        docs: likeState,
      };
    case UNLIKE_POST:
      let unlikeState = state.docs.map((post) => {
        if (post._id === action.payload.postId) {
          return {
            ...post,
            likers: post.likers.filter((id) => id !== action.payload.userId),
          };
        }
        return post;
      });
      return {
        ...state,
        docs: unlikeState,
      };
    case UPDATE_POST:
      let updateState = state.docs.map((post) => {
        if (post._id === action.payload.postId) {
          return {
            ...post,
            message: action.payload.message,
          };
        }
        return post;
      });
      return {
        ...state,
        docs: updateState,
      };
    case DELETE_POST:
      let deleteState = state.docs.filter(
        (post) => post._id !== action.payload.postId
      );
      return {
        ...state,
        totalDocs: state.totalDocs - 1,

        docs: deleteState, // posts array after deleting
      };
    case EDIT_COMMENT:
      let editCommentState = state.docs.map((post) => {
        if (post._id === action.payload.postId) {
          return {
            ...post,
            comments: post.comments.map((comment) => {
              if (comment._id === action.payload.commentId) {
                return {
                  ...comment,
                  text: action.payload.text,
                };
              } else {
                return comment;
              }
            }),
          };
        }
        return post;
      });
      return {
        ...state,
        docs: editCommentState,
      };
    case DELETE_COMMENT:
      let deleteCommentState = state.docs.map((post) => {
        if (post._id === action.payload.postId) {
          return {
            ...post,
            comments: post.comments.filter(
              (comment) => comment._id !== action.payload.commentId
            ),
          };
        }
        return post;
      });
      return {
        ...state,
        docs: deleteCommentState,
      };
    default:
      return state;
  }
}

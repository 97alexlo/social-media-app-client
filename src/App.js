import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import NavMenu from "./components/NavMenu";
import Home from "./pages/Home.js";
import Profile from "./pages/Profile.js";
import Login from "./pages/Login";
import Register from "./pages/Register";
import "./styles/app.css";
import { UidContext } from "./components/Context";
import axios from "axios";
import { useDispatch } from "react-redux";
import { getUser } from "./actions/user.actions.js";
import OtherProfile from "./pages/OtherProfile";

function App() {
  const [uid, setUid] = useState(null);
  const dispatch = useDispatch();
  
  useEffect(() => {
    const fetchToken = async () => {
      axios({
        method: "get",
        url: `${process.env.REACT_APP_API_URL}jwtid`,
        //withCredentials: true,
      })
        .then((res) => {
          setUid(res.data);
        })
        .catch((err) => {
          console.log("No token");
        });
    };
    fetchToken();
  }, [uid, dispatch]);

  if (uid !== null) {
    localStorage.setItem("uid", uid)
    dispatch(getUser(uid));
  }

  return (
    // pass user id to all the pages once logged in
    <UidContext.Provider value={uid}>
      <BrowserRouter>
        <NavMenu />
        <div className="wrapper">
          <main>
            <Routes>
              <Route exact path="/" element={uid ? <Home /> : <Login />} />
              <Route exact path="/login" element={uid ? <Home /> : <Login />} />
              <Route
                exact
                path="/register"
                element={uid ? <Home /> : <Register />}
              />
              <Route
                exact path="/profile"
                element={uid ? <Profile /> : <Login />}
              />
              <Route
                path="/user-profile/:userId"
                element={uid ? <OtherProfile /> : <Login />}
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </UidContext.Provider>
  );
}

export default App;

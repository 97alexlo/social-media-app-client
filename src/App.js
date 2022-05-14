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
        withCredentials: true,
      })
        .then((res) => {
          setUid(res.data);
        })
        .catch((err) => {
          console.log(err);
          console.log("No token");
        });
    };
    fetchToken();
  }, [uid, dispatch]);

  if (uid !== null) {
    //localStorage.setItem("uid", uid);
    dispatch(getUser(uid));
  }

  return (
    // pass user id to all the pages once logged in
    <UidContext.Provider value={uid}>
      <BrowserRouter>
        <NavMenu />
        <div className="wrapper">
          <main>
            {uid ? (
              <Routes>
                <Route exact path="/" element={<Home />} />
                <Route exact path="/login" element={<Home />} />
                <Route exact path="/register" element={<Home />} />
                <Route exact path="/profile" element={<Profile />} />
                <Route
                  path="/user-profile/:userId"
                  element={<OtherProfile />}
                />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            ) : (
              <Routes>
                <Route exact path="/login" element={<Login />} />
                <Route exact path="/register" element={<Register />} />
                <Route exact path="*" element={<Login />} />
              </Routes>
            )}
          </main>
        </div>
      </BrowserRouter>
    </UidContext.Provider>
  );
}

export default App;

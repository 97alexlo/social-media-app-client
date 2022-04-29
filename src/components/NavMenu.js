import React, { useContext, useState, useEffect } from "react";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Button from "react-bootstrap/Button";
import { Link, useLocation } from "react-router-dom";
import { UidContext } from "../components/Context.js";
import axios from "axios";
import cookie from "js-cookie";

function NavMenu() {
  const uid = useContext(UidContext);
  const [expanded, setExpanded] = useState(false);
  const location = useLocation(); // once ready, returns window.location object
  const [url, setUrl] = useState(null);
  const isMobile = window.matchMedia("(max-width: 576px)").matches;

  useEffect(() => {
    setUrl(location.pathname);
  }, [location]);

  const removeCookie = (key) => {
    console.log(window);
    if (window !== "undefined") {
      cookie.remove(key, { expires: 1 });
    }
  };

  function toggleNavCollapse() {
    //console.log(isMobile);
    if (isMobile) {
      setExpanded(false);
    }
  }

  const handleSignout = async () => {
    localStorage.clear();
    toggleNavCollapse();
    await axios({
      method: "get",
      url: `${process.env.REACT_APP_API_URL}api/user/logout`,
      withCredentials: true,
    })
      .then(() => removeCookie("jwt"))
      .catch((err) => console.log(err));

    // reloads page and checks for jwt, when there is no jwt, there is no uid which means the buttons will also change
    window.location = "/login";
  };

  return (
    <Navbar
      className="nav"
      collapseOnSelect
      expand="sm"
      expanded={expanded}
      bg="dark"
      variant="dark"
    >
      <Container>
        <Link to="/" style={{ textDecoration: "none" }}>
          <Navbar.Brand>Social Media App</Navbar.Brand>
        </Link>
        <Navbar.Toggle
          onClick={() =>
            setExpanded(expanded === "expanded" ? false : "expanded")
          }
          aria-controls="responsive-navbar-nav"
        />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="ms-auto">
            {uid ? (
              <>
                <span></span>
                <Link to="/">
                  {url === "/" ? (
                    <Button
                      active
                      onClick={toggleNavCollapse}
                      className="nav-btn"
                      variant="outline-light"
                    >
                      News Feed
                    </Button>
                  ) : (
                    <Button
                      onClick={toggleNavCollapse}
                      className="nav-btn"
                      variant="outline-light"
                    >
                      News Feed
                    </Button>
                  )}
                </Link>
                <Link to="/profile">
                  {url === "/profile" ? (
                    <Button
                      active
                      onClick={toggleNavCollapse}
                      className="nav-btn"
                      variant="outline-light"
                    >
                      Profile
                    </Button>
                  ) : (
                    <Button
                      onClick={toggleNavCollapse}
                      className="nav-btn"
                      variant="outline-light"
                    >
                      Profile
                    </Button>
                  )}
                </Link>
                <Link to="/login">
                  <Button
                    onClick={handleSignout}
                    className="nav-btn"
                    variant="outline-light"
                  >
                    Sign out
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button
                    onClick={toggleNavCollapse}
                    className="nav-btn"
                    variant="outline-light"
                  >
                    Log in
                  </Button>
                </Link>
                <Link to="/register">
                  <Button
                    onClick={toggleNavCollapse}
                    className="nav-btn"
                    variant="outline-light"
                  >
                    Sign up
                  </Button>
                </Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavMenu;

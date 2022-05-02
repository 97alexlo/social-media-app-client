import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import axios from "axios";
import { Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signInLoading, setIsSignInLoading] = useState(false);
  const [signInGuestLoading, setIsSignInGuestLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setIsSignInLoading(true);
    const emailError = document.querySelector(".email-error");
    const passwordError = document.querySelector(".password-error");

    axios({
      method: "post",
      url: `${process.env.REACT_APP_API_URL}api/user/login`,
      withCredentials: true,
      data: {
        email,
        password,
      },
    })
      .then((res) => {
        console.log(res);
        if (res.data.errors) {
          setIsSignInLoading(false);
          emailError.innerHTML = res.data.errors.email;
          passwordError.innerHTML = res.data.errors.password;
        } else {
          window.location = "/";
        }
      })
      .catch((err) => {
        setIsSignInLoading(false);
        console.log(err);
      });
  };

  function signInAsGuest(e) {
    e.preventDefault();
    setIsSignInGuestLoading(true);
    const emailError = document.querySelector(".email-error");
    const passwordError = document.querySelector(".password-error");

    axios({
      method: "post",
      url: `${process.env.REACT_APP_API_URL}api/user/login`,
      withCredentials: true,
      data: {
        email: "alex@gmail.com",
        password: "123456",
      },
    })
      .then((res) => {
        console.log(res);
        if (res.data.errors) {
          emailError.innerHTML = res.data.errors.email;
          passwordError.innerHTML = res.data.errors.password;
        } else {
          window.location = "/";
        }
      })
      .catch((err) => {
        setIsSignInGuestLoading(false);
        console.log(err);
      });
  }

  return (
    <div className="login-container">
      <Card className="login-card">
        <Card.Header className="text-center" as="h5">
          Sign in
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleLogin} className="loginForm">
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Enter your email"
              />
              <Form.Text className="email-error"></Form.Text>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Password"
                autoComplete="on"
              />
              <Form.Text className="password-error"></Form.Text>
            </Form.Group>
            <div className="btn-link">
              {signInLoading === false ? (
                <Button variant="primary" type="submit">
                  Sign in
                </Button>
              ) : (
                <Button disabled variant="primary" type="submit">
                  Loading... (takes a few seconds)
                </Button>
              )}
              {signInGuestLoading === false ? (
                <Button
                  onClick={(e) => signInAsGuest(e)}
                  style={{ marginTop: ".5em" }}
                  variant="success"
                >
                  Sign in as guest
                </Button>
              ) : (
                <Button
                  disabled
                  style={{ marginTop: ".5em" }}
                  variant="success"
                >
                  Loading... (Takes a few seconds)
                </Button>
              )}
              <Form.Text className="link-to-register">
                <Link to="/register">Don't have an account? Sign up here</Link>
              </Form.Text>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}

export default Login;

import React, { useState } from "react";
import axios from "axios";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Alert from "react-bootstrap/Alert";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [accountCreated, setAccountCreated] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    const usernameError = document.querySelector(".username-error");
    const emailError = document.querySelector(".email-error");
    const passwordError = document.querySelector(".password-error");
    const confirmPasswordError = document.querySelector(
      ".password-confirm-error"
    );
    usernameError.innerHTML = "";
    emailError.innerHTML = "";
    confirmPasswordError.innerHTML = "";

    if (password !== confirmPassword) {
      confirmPasswordError.innerHTML = "Passwords do not match";
    } else {
      await axios({
        method: "post",
        url: `${process.env.REACT_APP_API_URL}api/user/register`,
        data: {
          username,
          email,
          password,
        },
      })
        .then((res) => {
          console.log(res);
          if (res.data.errors) {
            usernameError.innerHTML = res.data.errors.username;
            emailError.innerHTML = res.data.errors.email;
            passwordError.innerHTML = res.data.errors.password;
          } else {
            setAccountCreated(true);
          }
        })
        .catch((err) => console.log(err));
    }
  };
  return (
    <div className="login-container">
      <Card className="login-card">
        <Card.Header className="text-center" as="h5">
          Sign up
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleRegister} className="loginForm">
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter a username"
              />
              <Form.Text className="username-error"></Form.Text>
            </Form.Group>
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
            <Form.Group className="mb-3" controlId="formConfirmBasicPassword">
              <Form.Label>Confirm password</Form.Label>
              <Form.Control
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                type="password"
                placeholder="Password"
                autoComplete="on"
              />
              <Form.Text className="password-confirm-error"></Form.Text>
            </Form.Group>
            <div className="btn-link">
              <Button variant="primary" type="submit">
                Sign up
              </Button>
              {accountCreated ? (
                <Alert className="signup-success-alert" variant="success">
                  Account created successfully!{" "}
                  <a href="/login">Sign in here</a>
                </Alert>
              ) : (
                <Form.Text className="link-to-register">
                  <a href="/login">Already have an account? Sign in here</a>
                </Form.Text>
              )}
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}

export default Register;

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
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  
  const checkSignIn = (loginAsGuest) => {
    if (loginAsGuest) {
      setIsSignInGuestLoading(true);
    } else {
      setIsSignInLoading(true);
    }
  };

  const setEmptyFieldsError = () => {
    let emptyErrors = 0;
    if (email.length === 0) {
      setEmailError("Please enter an email")
      emptyErrors++;
    } else {
      setEmailError("")
    }
    if (password.length === 0) {
      setPasswordError("Please enter a password")
      emptyErrors++;
    } else {
      setPasswordError("")
    }
    if (emptyErrors > 0) {
      return true
    }
    return false
  }

  const resetLoginButtonText = () => {
    setIsSignInGuestLoading(() => false);
    setIsSignInLoading(() => false);
  }

  const handleLogin = (e, loginAsGuest) => {
    e.preventDefault();
    checkSignIn(loginAsGuest);

    let isEmpty = false;
    if (!loginAsGuest) {
      isEmpty = setEmptyFieldsError()
    }

    if (loginAsGuest || (!isEmpty && !loginAsGuest)) {
      axios({
        method: "post",
        url: `${process.env.REACT_APP_API_URL}api/user/login`,
        withCredentials: true,
        data: {
          email: loginAsGuest ? "alex@gmail.com" : !isEmpty && email,
          password: loginAsGuest ? "123456" : !isEmpty && password,
        },
      })
        .then((res) => {
          console.log(res);
          if (res.data.errors) {
            setEmailError(res.data.errors.email);
            setPasswordError(res.data.errors.password);
            resetLoginButtonText()
          } else {
            window.location = "/";
          }
        })
        .catch((err) => {
          resetLoginButtonText()
          console.log(err);
        });
    } else {
      resetLoginButtonText()
    }
  };

  return (
    <div className="login-container">
      <Card className="login-card">
        <Card.Header className="text-center" as="h5">
          Sign in
        </Card.Header>
        <Card.Body>
          <Form onSubmit={(e) => handleLogin(e, false)} className="loginForm">
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Enter your email"
              />
              <Form.Text className="email-error">{emailError.length > 0 && emailError}</Form.Text>
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
              <Form.Text className="password-error">{passwordError.length > 0 && passwordError}</Form.Text>
            </Form.Group>
            <div className="btn-link">
              <Button 
                variant="primary" 
                type="submit"
                disabled={signInLoading}>
                {signInLoading ? 'Loading... (takes ~10 seconds)' : 'Sign in'}
              </Button>
              <Button
                onClick={(e) => handleLogin(e, true)}
                style={{ marginTop: ".5em" }}
                variant="success"
                disabled={signInGuestLoading}
              >
                {signInGuestLoading ? 'Loading... (takes ~10 seconds)' : 'Sign in as guest'}
              </Button>
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

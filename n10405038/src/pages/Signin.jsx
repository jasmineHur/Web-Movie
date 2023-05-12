import { useState } from "react";
import { Form, Button } from "react-bootstrap";
// Notification module
import {
  NotificationContainer,
  NotificationManager
} from "react-notifications";
import "react-notifications/lib/notifications.css";
// API URL
const API_URL = `http://sefdb02.qut.edu.au:3000`;
// Email regular expression
const EMAIL_RE =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

const ALLTOKEN = localStorage.getItem("token");

export default function Signin() {
  if (
    ALLTOKEN === null ||
    ALLTOKEN === "null" ||
    ALLTOKEN === undefined ||
    ALLTOKEN === "undefined"
  ) {
    return <SigninForm />;
  } else {
    <p> You have been signin </p>;
    setTimeout(function () {
      window.location.href = "/";
    }, 2000);
  }
}

function SigninForm() {
  // useState for conditions
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emptyError, setEmptyError] = useState("");
  const [emailErrors, setEmailErrors] = useState({});
  // empty check condition
  const emptyCheck =
    email === undefined ||
    email === null ||
    email === "undefiend" ||
    email === "" ||
    password === undefined ||
    password === null ||
    password === "undefiend" ||
    password === "";

  // function for signin by clicking the button
  const handleSubmittedInput = (event) => {
    if (emptyCheck) {
      setEmptyError("Please check empty Input.");
    } else {
      if (!EMAIL_RE.test(email)) {
        setEmailErrors({
          ...emailErrors,
          email: "Your email is invalid. Please check your input and try again."
        });
      } else {
        setEmailErrors("");
        signInAccount(email, password);
      }
    }
  };

  const signInAccount = async () => {
    const url_login = `${API_URL}/user/login`;

    const headers = {
      "Content-Type": "application/json"
    };
    // Try and catch the error
    try {
      const registerResponse = await (
        await fetch(url_login, {
          method: "POST",
          headers,
          body: JSON.stringify({ email: email, password: password })
        })
      ).json();
      // if response has error throw to catch
      if (registerResponse.error) {
        throw new Error(registerResponse.message);
      } else if (
        // if get response gets success
        // both bearer and refresh token will be contained to localStorage
        registerResponse.bearerToken &&
        registerResponse.bearerToken.token
      ) {
        let tokens = {
          bearer: `${registerResponse.bearerToken.token}`,
          refresh: `${registerResponse.refreshToken.token}`
        };

        localStorage.setItem("token", JSON.stringify(tokens));
        localStorage.setItem("signin", email);
        NotificationManager.info(`Enjoy the movie!`, "Signin Success", 3000);
        // use window.location for re-loading status
        setTimeout(function () {
          window.location.href = "/";
        }, 2000);
      }
    } catch (error) {
      // catched error will be printed out
      NotificationManager.error(`${error}`, "Please Try Again", 3000);
    }
  };

  return (
    <>
      <h2>SignIn Page</h2>
      <div className="d-flex flex-column align-items-center">
        <Form className="register-form">
          <p className="warning-p">{emptyError}</p>
          <Form.Group className="input-form">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-field"
            />
            <Form.Control.Feedback type="invalid" className="warning-p">
              {emailErrors.email}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="input-form">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-field"
            />
          </Form.Group>

          <Button onClick={handleSubmittedInput} className="button regi-button">
            Submit Form
          </Button>
        </Form>
        <NotificationContainer />
      </div>
    </>
  );
}

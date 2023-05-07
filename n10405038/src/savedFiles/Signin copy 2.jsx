import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import {
  NotificationContainer,
  NotificationManager
} from "react-notifications";
import "react-notifications/lib/notifications.css";

const API_KEY = "a200f9321de34a5ba67fc4beadc723c5";
const EMAIL_VAL_API =
  "https://emailvalidation.abstractapi.com/v1/?api_key=" + API_KEY;
const API_URL = `http://sefdb02.qut.edu.au:3000`;

const token = localStorage.getItem("token");

export default function Signin() {
  const [message, setMessage] = useState(null);
  if (
    token === null ||
    token === "null" ||
    token === undefined ||
    token === "undefined"
  ) {
    return <SigninForm {...{ message, setMessage }} />;
  } else {
    return <p> You have been signin </p>;
  }
}

function SigninForm({ message, setMessage }) {
  const [email, setEmail] = useState("mike@gmail.com");
  const [password, setPassword] = useState("password");
  const [emptyError, setEmptyError] = useState("");
  const [emailErrors, setEmailErrors] = useState({});
  const [pwErrors, setPwErrors] = useState({});
  const emptyCheck =
    email === undefined ||
    email === null ||
    email === "undefiend" ||
    email === "" ||
    password === undefined ||
    password === null ||
    password === "undefiend" ||
    password === "";

  const handleSubmittedInput = async () => {
    if (emptyCheck) {
      setEmptyError("Please check empty Input.");
    } else {
      const isValid = await sendEmailValidationRequest();
      if (isValid) {
        // if email validation is correct then goes to next step
        setEmailErrors({ ...emailErrors, email: null });
        signInAccount();
        const response = await signInAccount();
        console.log(response.bearerToken.expires_in);
        if (response.error) {
          NotificationManager.error(
            `${response.message}`,
            "Please Try Again",
            3000
          );
        } else {
          NotificationManager.info(
            "Please Enjoy the website",
            "SignIn Success",
            3000
          );
          // window.location.href = "/";
        }
      } else {
        setEmailErrors({
          ...emailErrors,
          email: "Your email is invalid. Please check your input and try again."
        });
        console.log("EMAIL NOT VALID. ", email);
      }
    }
  };

  const sendEmailValidationRequest = async () => {
    const fullURL = EMAIL_VAL_API + "&email=" + email;
    const validationResponse = await (await fetch(fullURL)).json();
    return validationResponse.is_valid_format.value;
  };

  const signInAccount = async () => {
    const url_login = `${API_URL}/user/login`;

    const headers = {
      "Content-Type": "application/json"
    };

    const registerResponse = await (
      await fetch(url_login, {
        method: "POST",
        headers,
        body: JSON.stringify({ email: email, password: password })
      })
    ).json();

    if (registerResponse.error) {
      return registerResponse;
    } else if (
      registerResponse.bearerToken &&
      registerResponse.bearerToken.token
    ) {
      let tokens = {
        bearer: `${registerResponse.bearerToken.token}`,
        refresh: `${registerResponse.refreshToken.token}`
      };

      localStorage.setItem("token", JSON.stringify(tokens));
      return registerResponse;
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
              isInvalid={!!emailErrors.email}
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

function SigninFunc({ email, password }) {
  const url = `${API_URL}/user/login`;
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  })
    .then((res) => res.json())
    .then((res) => {
      localStorage.setItem("token", res.bearerToken.token);
      if (
        res.bearerToken.token === null ||
        res.bearerToken.token === undefined ||
        res.bearerToken.token === "undefined"
      ) {
        alert(res.message);
      } else {
        window.location.href = "/";
      }
    })
    .catch((error) => console.log(error));
}

// const headers = {
//   bearerToken: {
//     token: `Bearer ${token}`,
//     token_type: "Bearer",
//     expires_in: 600
//   },
//   refreshToken: {
//     token: `Bearer ${token}`,
//     token_type: "Refresh",
//     expires_in: 86400
//   }
// };

import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import {
  NotificationContainer,
  NotificationManager
} from "react-notifications";
import "react-notifications/lib/notifications.css";
// REST API address
const API_URL = `http://sefdb02.qut.edu.au:3000`;
// Email Validation API
const API_KEY = "a200f9321de34a5ba67fc4beadc723c5";
const EMAIL_VAL_API =
  "https://emailvalidation.abstractapi.com/v1/?api_key=" + API_KEY;

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [matchPassword, setMatchPassword] = useState("");
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
    password === "" ||
    matchPassword === undefined ||
    matchPassword === null ||
    matchPassword === "undefiend" ||
    matchPassword === "";

  const handleSubmittedInput = async () => {
    if (emptyCheck) {
      setEmptyError("Please check empty Input.");
    } else {
      const isValid = await sendEmailValidationRequest();
      if (isValid) {
        // if email validation is correct then goes to next step
        setEmailErrors({ ...emailErrors, email: null });
        // Check password matched
        if (password !== matchPassword) {
          setPwErrors({
            ...pwErrors,
            matchPassword:
              "Password is not matched. Please check your input and try again."
          });
        } else {
          registerAccount();
          const response = await registerAccount();
          if (response.error) {
            NotificationManager.error(
              `${response.message}`,
              "Please Try Again",
              3000
            );
          } else {
            NotificationManager.info("Please Signin", "Register Success", 3000);
            // window.location.href = "/signin";
          }
        }
      } else {
        setEmailErrors({
          ...emailErrors,
          email: "Your email is invalid. Please check your input and try again."
        });
      }
    }
  };

  const sendEmailValidationRequest = async () => {
    const fullURL = EMAIL_VAL_API + "&email=" + email;
    const validationResponse = await (await fetch(fullURL)).json();
    return validationResponse.is_valid_format.value;
  };

  const registerAccount = async () => {
    const url = `${API_URL}/user/register`;

    const headers = {
      accept: "application/json",
      "Content-Type": "application/json"
    };

    const registerResponse = await (
      await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify({ email: email, password: password })
      })
    ).json();

    return registerResponse;
  };

  return (
    <>
      <h2>Register Page</h2>
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
          <Form.Group className="input-form">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              value={matchPassword}
              onChange={(e) => setMatchPassword(e.target.value)}
              className="form-field"
            />
            <Form.Control.Feedback type="invalid" className="warning-p">
              {pwErrors.matchPassword}
            </Form.Control.Feedback>
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

// function RegisterFunc() {
//   // Giving the token to API
//   const onSubmitHandler = (event) => {
//     if (password !== checkPassword) {
//       alert("Check the password again please");
//     } else {
//       const url = `${API_URL}/user/register`;
//       const token = localStorage.getItem("token");
//       const headers = {
//         accept: "application/json",
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`
//       };
//       return fetch(url, {
//         method: "POST",
//         headers,
//         body: JSON.stringify({ email: email, password: password })
//       })
//         .then((res) => res.json())
//         .then((res) => {
//           if (res.error === true) {
//             alert(res.message);
//           } else {
//             window.location.href = "/signIn";
//           }
//         });
//     }
//   };
// }

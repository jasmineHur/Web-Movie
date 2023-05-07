import { useState } from "react";
import { Form, InputGroup, Button } from "react-bootstrap";
const API_KEY = "a200f9321de34a5ba67fc4beadc723c5";
const EMAIL_VAL_API =
  "https://emailvalidation.abstractapi.com/v1/?api_key=" + API_KEY;
const API_URL = `http://sefdb02.qut.edu.au:3000`;

export default function Signin() {
  const token = localStorage.getItem("token");
  const [message, setMessage] = useState(null);
  if (token === null || token === undefined || token === "undefined") {
    return <SigninForm {...{ message, setMessage }} />;
  } else {
    return <p> You have been signin </p>;
  }
}

function SigninForm({ message, setMessage }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

  console.log(email, password);

  return (
    <div>
      <h2>Login Page</h2>
      <p>{message}</p>
      <form
        onSubmit={async (event) => {
          event.preventDefault();
          const response = await SigninFunc({ email, password });
          setMessage(response);
        }}
        className="signin-form"
      >
        <p>
          <label htmlFor="email">Email:</label>
          <input
            type="text"
            value={email}
            className="form-field"
            onChange={(e) => setEmail(e.target.value)}
          />
        </p>
        <p>
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            type="password"
            value={password}
            className="form-field"
            onChange={(e) => setPassword(e.target.value)}
          />
        </p>
        <button className="button regi-button" type="submit">
          Login
        </button>
      </form>
    </div>
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

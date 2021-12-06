import { Login } from "@mui/icons-material";
import { Button } from "@mui/material";
import React from "react";
import { auth, provider } from "../Firebase/firebase";
import { Link } from "react-router-dom";
import "./Body.css";

function Body({ user }) {
  const Login = () => {
    auth
      .signInWithPopup(provider)
      .then((result) => {})
      .catch((err) => {
        alert(err.message);
      });
  };

  return (
    <div className="main__body">
      <center>
        <br />
        <br />
        <br />
        <h1>Get insights quickly, with RECursion Forms</h1>
        <br />
        <br />
        <p>
          • Easily create and share online forms and surveys, and analyze
          responses in real-time
        </p>
        <br />
        <br />
        <p>• Create an online form as easily as creating a document</p>
        <br />
        <br />
        <p>• Send polished surveys and forms</p>
        <br />
        <br />
        {user ? (
          <>
            <Link to="/create-form" className="createForm">
              Create a Form
            </Link>
          </>
        ) : (
          <>
            <Button
              className="btns"
              onClick={() => {
                Login();
              }}
            >
              Try for Free
            </Button>
          </>
        )}
      </center>
    </div>
  );
}

export default Body;

import React, { useEffect, useState } from "react";
import "./CreatedForm.css";
import { db } from "../Firebase/firebase";
import { useParams } from "react-router";
import Paragraph from "./Paragraph";
import MultipleChoice from "./MultipleChoice";
import CheckBox from "./CheckBox";
import CheckIcon from "@mui/icons-material/Check";
// Progress
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { auth, provider } from "../Firebase/firebase";
import { Button } from "@mui/material";
import Avatar from "@mui/material/Avatar";
// Logo
import Logo from "../Images/Logo.jpeg";

function CreatedForm() {
  let { Id, name } = useParams();
  // Getting the Questions
  const [questions, Setquestions] = useState(null);
  useEffect(() => {
    db.collection("Users")
      .doc(Id)
      .collection('Forms')
      .doc(name)
      .collection(name)
      .onSnapshot((SnapShot) => {
        Setquestions(SnapShot.docs.map((doc) => doc.data()));
      });
  }, []);
  //User Login
  const [user, setUser] = useState(null);
  const LogIn = () => {
    auth
      .signInWithPopup(provider)
      .then((result) => {
        setUser(result.user);
        console.log(result.user);
      })
      .catch((err) => {
        alert(err.message);
      });
  };
  // Submission
  const [Notsubmit, SetNotSubmission] = useState(true);
  return (
    <>
      {user && Notsubmit ? (
        <div className="createdForm">
          <p style={{textAlign:"right"}}><span style={{"color":"red",marginRight:"3px"}}>*</span> Required</p>
          <div className="createdForm__header">
            <Avatar src={user?.photoURL} />
            {questions ? (
              <>
                <h1 className="createdForm_title">{questions[0]?.Title}</h1>
                <h2 className="createdForm_description">
                  {questions[0]?.Description}
                </h2>
                <div className="createdform__questions">
                  {questions?.map((question) => {
                    if (question?.type === "Multiple Choice") {
                      return (
                        <MultipleChoice
                          question={question}
                          Disable={false}
                          Id={Id}
                          formName={name}
                          user={user}
                        />
                      );
                    } else if (question?.type === "Checkboxes") {
                      return (
                        <CheckBox
                          question={question}
                          Disable={false}
                          Id={Id}
                          formName={name}
                          user={user}
                        />
                      );
                    } else if (question?.type === "Paragraph") {
                      return (
                        <Paragraph
                          question={question}
                          Disable={false}
                          Id={Id}
                          formName={name}
                          user={user}
                        />
                      );
                    }
                  })}
                  <br />
                  <Button
                    onClick={() => {
                      SetNotSubmission(false);
                    }}
                    className="submitBtn"
                  >
                    Submit
                  </Button>
                </div>
              </>
            ) : (
              <center>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <CircularProgress />
                </Box>
              </center>
            )}
          </div>
        </div>
      ) : !Notsubmit ? (
        <>
          <div className="submitCard">
            <div>
              <h1>Thank you !</h1>
              <br />
              <h3>Your Response has been submitted</h3>
            </div>
            <CheckIcon className="submitIcon" />
          </div>
        </>
      ) : (
        <div className="Login_with_Google">
          <img src={Logo} alt="" />
          <h1>Please Login before you answer the questions</h1>
          <Button className="loginBtn" onClick={LogIn}>
            Login
          </Button>
        </div>
      )}

      <br />
      <br />
    </>
  );
}

export default CreatedForm;

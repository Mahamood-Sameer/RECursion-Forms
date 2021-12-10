import React, { useEffect, useState } from "react";
import "./Paragraph.css";
import { db } from "../Firebase/firebase";
// Question change Dialoue
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import EditIcon from "@mui/icons-material/Edit";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

function Paragraph({
  question,
  Disable,
  Id,
  formName,
  user,
  ChoosenAnswer,
  Editable,
  quesId
}) {
  const [answer, setAnswer] = useState("");

  // Open Dialouge
  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (!Disable) {
      if(question.FileType){
        db.collection("Response")
        .doc(Id)
        .collection(formName)
        .doc(user.user.uid)
        .collection(formName)
        .doc(question.Question)
        .set({
          Question: question.Question,
          Answer: answer,
          Type: question.type,
          FileType: question.FileType,
          FileURL: question.FileURL,
        });
      }else{
        db.collection("Response")
        .doc(Id)
        .collection(formName)
        .doc(user.user.uid)
        .collection(formName)
        .doc(question.Question)
        .set({
          Question: question.Question,
          Answer: answer,
          Type: question.type,
        });
      }
      
      db.collection("Response")
        .doc(Id)
        .collection(formName)
        .doc(user.user.uid)
        .set({
          ResponseName: user?.user.displayName,
          ResponseId: user?.user.uid,
        });
    }
  }, [answer]);

  const DeleteQuestion = ()=>{
    console.log(quesId)
  }

  return (
    <>
      <div className="paragraph_questions">
        {Editable ? (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
              }}
            >
              <IconButton>
                <EditIcon />
              </IconButton>
              <IconButton>
                <DeleteIcon onClick={setOpen(true)} />
              </IconButton>
            </div>
          </>
        ) : (
          <></>
        )}

        <strong className="question">{question?.Question}</strong>
        {question?.FileType == "Image" ? (
          <>
            <img
              src={question?.FileURL}
              style={{ width: "380px", objectFit: "contain" }}
            />
          </>
        ) : (
          <>
            {question?.FileType == "Video" ? (
              <>
                <video width="400" height="240" controls>
                  <source src={question?.FileURL} type="video/mp4" />
                </video>
              </>
            ) : (
              <>
                {question?.FileType == "Audio" ? (
                  <>
                    <audio controls>
                      <source src={question?.FileURL} type="audio/mpeg" />
                    </audio>
                  </>
                ) : (
                  <></>
                )}
              </>
            )}
          </>
        )}
        <input
          type="text"
          className="paragraph"
          placeholder="Long-Answer text"
          value={answer}
          onChange={(e) => {
            setAnswer(e.target.value);
          }}
          disabled={Disable}
        />
        {ChoosenAnswer ? (
          <>
            <br />
            <br />
            Given answer : <br />
            <br />
            {ChoosenAnswer}
          </>
        ) : (
          <></>
        )}
      </div>

      {/* Dialouge */}
      <Dialog open={open}>
        <DialogTitle>Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Do you want to delete the question ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Ok</Button>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Paragraph;

import React, { useEffect, useState } from "react";
import "./Paragraph.css";
import { storage } from "../Firebase/firebase";
import { db } from "../Firebase/firebase";
import EditIcon from "@mui/icons-material/Edit";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import ImageIcon from "@mui/icons-material/Image";
import VideoFileIcon from "@mui/icons-material/VideoFile";
import AudioFileIcon from "@mui/icons-material/AudioFile";
import { styled } from "@mui/material/styles";
// Backdrop
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { LinearProgress } from "@mui/material";

function Paragraph({
  question,
  Disable,
  Id,
  formName,
  user,
  ChoosenAnswer,
  Editable,
  quesId,
}) {
  const [answer, setAnswer] = useState("");

  //Dialouge box for Modification
  const [openDialouge, setOpenDialouge] = useState(false);
  // Backdrop
  const [BackdropOpen, setBackdropOpen] = useState(false);
  const [progress, setProgress] = useState(0);

  // Modified Question
  const [Modifiedquestion, setModifiedQuestion] = useState(question.Question);
  // Modified File
  const [ModifiedFile, setModifiedFile] = useState(null);
  const [ModifiedFileURL, setModifiedFileURL] = useState(question.FileURL);
  // For uploading files
  const Input = styled("input")({
    display: "none",
  });
  const Modify = () => {
    setOpenDialouge(false);
    if (ModifiedFile) {
      const fileref = storage
        .ref(`files/${user?.email}_${ModifiedFile?.File.name}`)
        .put(ModifiedFile.File);
      fileref.on(
        "state_changed",
        (snapshot) => {
          // Progress....
          const progress_bar = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgress(progress_bar);
          if (progress_bar == 100) {
            setBackdropOpen(false);
          } else {
            setBackdropOpen(true);
          }
        },
        (error) => {
          alert(error.message);
        },
        () => {
          storage
            .ref("files")
            .child(`${user?.email}_${ModifiedFile?.File.name}`)
            .getDownloadURL()
            .then((url) => {
              db.collection("Users")
                .doc(Id)
                .collection("Forms")
                .doc(question.Title)
                .collection(question.Title)
                .doc(quesId)
                .update({
                  FileURL: url,
                });
            });
        }
      );
    }
    if (ModifiedFile) {
      db.collection("Users")
        .doc(Id)
        .collection("Forms")
        .doc(question.Title)
        .collection(question.Title)
        .doc(quesId)
        .update({
          FileType: ModifiedFile?.type,
        });
    }

    db.collection("Users")
        .doc(Id)
        .collection("Forms")
        .doc(question.Title)
        .collection(question.Title)
        .doc(quesId)
        .update({
          Question: Modifiedquestion,
        });

    setModifiedFile(null);
  };

  useEffect(() => {
    if (!Disable) {
      if (question.FileType) {
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
      } else {
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

  const DeleteQuestion = () => {
    console.log(quesId);
    db.collection("Users")
      .doc(Id)
      .collection("Forms")
      .doc(question.Title)
      .collection(question.Title)
      .doc(quesId)
      .delete();
  };
  console.log(openDialouge);

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
              <IconButton
                onClick={() => {
                  setOpenDialouge(true);
                }}
              >
                <EditIcon />
              </IconButton>
              <IconButton onClick={DeleteQuestion}>
                <DeleteIcon />
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

      {/* Dialouge Box */}
      <Dialog open={openDialouge}>
        <DialogTitle>Modification</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            style={{ width: "40vw" }}
            label="Question"
            type="text"
            fullWidth
            variant="standard"
            value={Modifiedquestion}
            onChange={(e) => {
              setModifiedQuestion(e.target.value);
            }}
          />
          {!ModifiedFile ? (
            <>
              <Stack direction="row" alignItems="center" marginTop="10px">
                <label htmlFor="icon-button-file-Image">
                  <Input
                    accept="image/*"
                    id="icon-button-file-Image"
                    type="file"
                    onChange={(e) => {
                      if (e.target.files[0]) {
                        setModifiedFile({
                          type: "Image",
                          File: e.target.files[0],
                        });
                      }
                    }}
                  />
                  <IconButton component="span">
                    <ImageIcon />
                  </IconButton>
                </label>
                <label htmlFor="icon-button-file-Video">
                  <Input
                    accept="video/*"
                    id="icon-button-file-Video"
                    type="file"
                    onChange={(e) => {
                      if (e.target.files[0]) {
                        setModifiedFile({
                          type: "Video",
                          File: e.target.files[0],
                        });
                      }
                    }}
                  />
                  <IconButton component="span">
                    <VideoFileIcon />
                  </IconButton>
                </label>
                <label htmlFor="icon-button-file-Audio">
                  <Input
                    accept="audio/*"
                    id="icon-button-file-Audio"
                    type="file"
                    onChange={(e) => {
                      if (e.target.files[0]) {
                        setModifiedFile({
                          type: "Audio",
                          File: e.target.files[0],
                        });
                      }
                    }}
                  />
                  <IconButton component="span">
                    <AudioFileIcon />
                  </IconButton>
                </label>
              </Stack>
            </>
          ) : (
            <>
              <LinearProgress
                    variant="determinate"
                    value={100}
                    style={{ marginTop: "20px" }}
                  />{" "}
                  <span style={{ fontSize: "10px" }}>{ModifiedFile?.File.name}</span>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              Modify();
            }}
          >
            Modify
          </Button>
          <Button
            onClick={() => {
              setOpenDialouge(false);
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Backdrop */}
      <div>
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={BackdropOpen}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </div>
    </>
  );
}

export default Paragraph;

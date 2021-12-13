import React, { useEffect, useState } from "react";
import "./MultipleChoice.css";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
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
import { storage } from "../Firebase/firebase";

function MultipleChoice({
  question,
  Disable,
  Id,
  formName,
  user,
  ChoosenAnswer,
  Editable,
  quesId,
  owner
}) {
  const [Answer, setAnswer] = useState(null);
  const DeleteQuestion = () => {
    db.collection("Users")
      .doc(Id)
      .collection("Forms")
      .doc(question.Title)
      .collection(question.Title)
      .doc(quesId)
      .delete();
  };
  //Dialouge box for Modification
  const [openDialouge, setOpenDialouge] = useState(false);

  // Modified Question
  const [Modifiedquestion, setModifiedQuestion] = useState(question.Question);
  // Modified Options
  const [ModifiedoptA, setModifiedoptA] = useState(question.OptionA);
  const [ModifiedoptB, setModifiedoptB] = useState(question.OptionB);
  const [ModifiedoptC, setModifiedoptC] = useState(question.OptionC);
  const [ModifiedoptD, setModifiedoptD] = useState(question.OptionD);

  // Backdrop
  const [BackdropOpen, setBackdropOpen] = useState(false);
  const [progress, setProgress] = useState(0);
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
        .ref(`files/${owner?.email}_${ModifiedFile?.File.name}_${question.Title}`)
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
            .child(`${owner?.email}_${ModifiedFile?.File.name}_${question.Title}`)
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
    setModifiedFile(null);
    db.collection("Users")
      .doc(Id)
      .collection("Forms")
      .doc(question.Title)
      .collection(question.Title)
      .doc(quesId)
      .update({
        Question: Modifiedquestion,
        OptionA: ModifiedoptA,
        OptionB: ModifiedoptB,
        OptionC: ModifiedoptC,
        OptionD: ModifiedoptD,
      });
  };
  useEffect(() => {
    if (!Disable) {
      if (question.FileType) {
        db.collection("Response")
          .doc(Id)
          .collection(formName)
          .doc(user.uid)
          .collection(formName)
          .doc(question.Question)
          .set({
            Question: question.Question,
            Answer: Answer,
            Type: question.type,
            OptionA: question?.OptionA,
            OptionB: question?.OptionB,
            OptionC: question?.OptionC,
            OptionD: question?.OptionD,
            FileType: question.FileType,
            FileURL: question.FileURL,
            Required:question.Required
          });
      } else {
        db.collection("Response")
          .doc(Id)
          .collection(formName)
          .doc(user.uid)
          .collection(formName)
          .doc(question.Question)
          .set({
            Question: question.Question,
            Answer: Answer,
            Type: question.type,
            OptionA: question?.OptionA,
            OptionB: question?.OptionB,
            OptionC: question?.OptionC,
            OptionD: question?.OptionD,
            Required:question.Required
          });
      }

      db.collection("Response")
        .doc(Id)
        .collection(formName)
        .doc(user.uid)
        .set({
          ResponseName: user?.displayName,
          ResponseId: user?.uid,
        });
    }
  }, [Answer]);

  return (
    <>
      <div className="form__questions">
        {Editable ? (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
              }}
            >
              <IconButton onClick={() => setOpenDialouge(true)}>
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
        <FormControl component="fieldset">
          <strong className="question">{question?.Question}{
          question?.Required ? <span style={{color:"red",marginLeft:"3px"}}>*</span> : <></>
        }</strong>
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
          <RadioGroup>
            {question?.OptionA ? (
              <>
                <FormControlLabel
                  value={question?.OptionA}
                  control={<Radio />}
                  label={question?.OptionA}
                  disabled={Disable}
                  onClick={() => {
                    if (!Disable) {
                      setAnswer(question?.OptionA);
                    }
                  }}
                />
              </>
            ) : (
              <></>
            )}
            {question?.OptionB ? (
              <>
                <FormControlLabel
                  value={question?.OptionB}
                  control={<Radio />}
                  label={question?.OptionB}
                  disabled={Disable}
                  onClick={() => {
                    if (!Disable) {
                      setAnswer(question?.OptionB);
                    }
                  }}
                />
              </>
            ) : (
              <></>
            )}
            {question?.OptionC ? (
              <FormControlLabel
                value={question?.OptionC}
                control={<Radio />}
                label={question?.OptionC}
                disabled={Disable}
                onClick={() => {
                  if (!Disable) {
                    setAnswer(question?.OptionC);
                  }
                }}
              />
            ) : (
              <></>
            )}
            {question?.OptionD ? (
              <FormControlLabel
                value={question?.OptionD}
                control={<Radio />}
                label={question?.OptionD}
                disabled={Disable}
                onClick={() => {
                  if (!Disable) {
                    setAnswer(question?.OptionD);
                  }
                }}
              />
            ) : (
              <></>
            )}
          </RadioGroup>
        </FormControl>
        {ChoosenAnswer ? (
          <>
            <br />
            <br />
            Choosen option : {ChoosenAnswer}
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
              <span style={{ fontSize: "10px" }}>
                {ModifiedFile?.File.name}
              </span>
            </>
          )}
          <div className="options_container">
            {" "}
            <input
              type="text"
              placeholder=" Enter the Value of Option-A"
              className="Adding__options"
              value={ModifiedoptA}
              onChange={(e) => {
                setModifiedoptA(e.target.value);
              }}
            />
            <br />
            <input
              type="text"
              placeholder=" Enter the Value of Option-B"
              className="Adding__options"
              value={ModifiedoptB}
              onChange={(e) => {
                setModifiedoptB(e.target.value);
              }}
            />
            <br />
            <input
              type="text"
              placeholder=" Enter the Value of Option-C"
              className="Adding__options"
              value={ModifiedoptC}
              onChange={(e) => {
                setModifiedoptC(e.target.value);
              }}
            />
            <br />
            <input
              type="text"
              placeholder=" Enter the Value of Option-D"
              className="Adding__options"
              value={ModifiedoptD}
              onChange={(e) => {
                setModifiedoptD(e.target.value);
              }}
            />
            <br />
          </div>
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

export default MultipleChoice;

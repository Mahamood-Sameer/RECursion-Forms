import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import "./Form.css";
import MultipleChoice from "./MultipleChoice";
import Paragraph from "./Paragraph";
import CheckBox from "./CheckBox";
import { Link } from "react-router-dom";
// Adding Question
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
// DropDown Menu
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
// Database
import { db } from "../Firebase/firebase";
// Image Video Audio
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import Stack from "@mui/material/Stack";
import ImageIcon from "@mui/icons-material/Image";
import VideoFileIcon from "@mui/icons-material/VideoFile";
import AudioFileIcon from "@mui/icons-material/AudioFile";
import { styled } from "@mui/material/styles";
import { IconButton } from "@mui/material";
import { LinearProgress } from "@mui/material";
import { storage } from "../Firebase/firebase";

function Form({ user }) {
  //Form heading
  const [formName, setFormName] = useState("");
  // Form Description
  const [formDesc, setFormDesc] = useState("");

  // For Dialouge Box
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  //Question
  const [question, setquestion] = useState("");
  //Question type
  const [type, setType] = useState("Multiple Choice");
  //Options
  const [optA, setoptA] = useState("");
  const [optB, setoptB] = useState("");
  const [optC, setoptC] = useState("");
  const [optD, setoptD] = useState("");
  const [CheckoptA, setCheckoptA] = useState("");
  const [CheckoptB, setCheckoptB] = useState("");
  const [CheckoptC, setCheckoptC] = useState("");
  const [CheckoptD, setCheckoptD] = useState("");
  //Selection box
  const handleChange = (event) => {
    setType(event.target.value);
  };

  // For uploading files
  const Input = styled("input")({
    display: "none",
  });

  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(null);
  console.log(file);

  //   Add Question

  const Add_Question = () => {
    const fileref = storage
      .ref(`files/${user?.email}_${file?.File.name}`)
      .put(file.File);
    fileref.on(
      "state_changed",
      (snapshot) => {
        // Progress....
        const progress_bar = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress_bar);
        console.log(progress);
        setOpen(false);
      },
      (error) => {
        alert(error.message);
      },
      () => {
        storage
          .ref("files")
          .child(`${user?.email}_${file?.File.name}`)
          .getDownloadURL()
          .then((url) => {
            if (type === "Multiple Choice") {
              db.collection("Users")
                .doc(user?.uid)
                .collection("Forms")
                .doc(formName)
                .collection(formName)
                .add({
                  Title: formName,
                  Description: formDesc,
                  Question: question,
                  type: type,
                  OptionA: optA,
                  OptionB: optB,
                  OptionC: optC,
                  OptionD: optD,
                  Link: `/form/${user?.uid}/${formName}`,
                  FileType: file.type,
                  FileURL: url,
                });
              db.collection("Users")
                .doc(user?.uid)
                .collection("Forms")
                .doc(formName)
                .set({
                  Title: formName,
                  Description: formDesc,
                });
              setquestion("");
              setoptA("");
              setoptB("");
              setoptC("");
              setoptD("");
              setFile(null);
            } else if (type === "Checkboxes") {
              db.collection("Users")
                .doc(user?.uid)
                .collection("Forms")
                .doc(formName)
                .collection(formName)
                .add({
                  Title: formName,
                  Description: formDesc,
                  Question: question,
                  type: type,
                  OptionA: CheckoptA,
                  OptionB: CheckoptB,
                  OptionC: CheckoptC,
                  OptionD: CheckoptD,
                  Link: `/form/${user?.uid}/${formName}`,
                  FileType: file.type,
                  FileURL: url,
                });
              db.collection("Users")
                .doc(user?.uid)
                .collection("Forms")
                .doc(formName)
                .set({
                  Title: formName,
                  Description: formDesc,
                });
              setquestion("");
              setCheckoptA("");
              setCheckoptB("");
              setCheckoptC("");
              setCheckoptD("");
              setFile(null);
            } else {
              db.collection("Users")
                .doc(user?.uid)
                .collection("Forms")
                .doc(formName)
                .collection(formName)
                .add({
                  Title: formName,
                  Description: formDesc,
                  Question: question,
                  type: type,
                  Link: `/form/${user?.uid}/${formName}`,
                  FileType: file.type,
                  FileURL: url,
                });
              db.collection("Users")
                .doc(user?.uid)
                .collection("Forms")
                .doc(formName)
                .set({
                  Title: formName,
                  Description: formDesc,
                });
              setquestion("");
              setFile(null);
            }
          });
      }
    );
  };

  //FORM
  const [FORM, setForm] = useState(null);

  //Collecting questions from DB
  useEffect(() => {
    if (formName) {
      db.collection("Users")
        .doc(user?.uid)
        .collection("Forms")
        .doc(formName)
        .collection(formName)
        .onSnapshot((SnapShot) => {
          setForm(SnapShot.docs.map((doc) => doc.data()));
        });
    } else {
      console.log("Waiting");
    }
  }, [formName]);

  return (
    <>
      {user ? (
        <div className="formcard">
          {/* Question header */}
          <div className="form__header">
            <input
              type="text"
              placeholder="Untitled Form"
              className="form__title"
              value={formName}
              onChange={(e) => {
                setFormName(e.target.value);
              }}
            />
            <input
              type="text"
              placeholder="Form description"
              className="form__description"
              value={formDesc}
              onChange={(e) => {
                setFormDesc(e.target.value);
              }}
            />
          </div>
          {/* Questions Display */}
          {FORM?.map((question) => {
            if (question?.type === "Multiple Choice") {
              return (
                <MultipleChoice
                  question={question}
                  Disable={true}
                  Id={user?.uid}
                />
              );
            } else if (question?.type === "Checkboxes") {
              return (
                <CheckBox question={question} Disable={true} Id={user?.uid} />
              );
            } else if (question?.type === "Paragraph") {
              return (
                <Paragraph question={question} Disable={true} Id={user?.uid} />
              );
            }
          })}
          {/* Adding part */}
          <div className="adding__part">
            {formName && formDesc ? (
              <>
                <Button className="opt_btns" onClick={handleClickOpen}>
                  Add a Question
                </Button>
                <Link
                  to={`/form/${user?.uid}/${formName}`}
                  className="PreviewLink"
                >
                  Confirm
                </Link>
              </>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-around",
                  }}
                >
                  <Button className="opt_btns" disabled>
                    Add a Question
                  </Button>
                  <Button className="opt_btns" disabled>
                    Confirm
                  </Button>
                </div>
                <br />
                <p style={{ textAlign: "center" }}>
                  *Please enter the name of the Form and description before you
                  add the questions
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <>
          <h1 style={{ textAlign: "center", marginTop: "200px" }}>
            Please Login ...
          </h1>
        </>
      )}

      <br />
      <br />

      {/* Dialouge Box */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add a Question</DialogTitle>
        <DialogContent>
          {/* Text field */}
          <TextField
            autoFocus
            margin="dense"
            label="Question"
            type="email"
            fullWidth
            variant="standard"
            className="adding_a_ques"
            value={question}
            onChange={(e) => {
              setquestion(e.target.value);
            }}
          />
          {/* Question type */}
          <Box className="question__type">
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Type</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={type}
                label="Type"
                onChange={handleChange}
              >
                <MenuItem
                  value="Multiple Choice"
                  onClick={() => {
                    setType("Multiple Choice");
                  }}
                >
                  Multiple Choice
                </MenuItem>
                <MenuItem
                  value="Paragraph"
                  onClick={() => {
                    setType("Paragraph");
                  }}
                >
                  Paragraph
                </MenuItem>
                <MenuItem
                  value="Checkboxes"
                  onClick={() => {
                    setType("Checkboxes");
                  }}
                >
                  Checkboxes
                </MenuItem>
              </Select>
              {/* Files upload */}
              {!file ? (
                <>
                  <Stack direction="row" alignItems="center" marginTop="10px">
                    <label htmlFor="icon-button-file-Image">
                      <Input
                        accept="image/*"
                        id="icon-button-file-Image"
                        type="file"
                        onChange={(e) => {
                          if (e.target.files[0]) {
                            setFile({
                              type: "Image",
                              File: e.target.files[0],
                            });
                          }
                        }}
                      />
                      <IconButton  component="span">
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
                            setFile({
                              type: "Video",
                              File: e.target.files[0],
                            });
                          }
                        }}
                      />
                      <IconButton  component="span">
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
                            setFile({
                              type: "Audio",
                              File: e.target.files[0],
                            });
                          }
                        }}
                      />
                      <IconButton  component="span">
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
                  {file?.File.name}
                </>
              )}
            </FormControl>
          </Box>
          {type === "Multiple Choice" ? (
            <div className="options_container">
              {" "}
              <input
                type="text"
                placeholder=" Enter the Value of Option-A"
                className="Adding__options"
                value={optA}
                onChange={(e) => {
                  setoptA(e.target.value);
                }}
              />
              <br />
              <input
                type="text"
                placeholder=" Enter the Value of Option-B"
                className="Adding__options"
                value={optB}
                onChange={(e) => {
                  setoptB(e.target.value);
                }}
              />
              <br />
              <input
                type="text"
                placeholder=" Enter the Value of Option-C"
                className="Adding__options"
                value={optC}
                onChange={(e) => {
                  setoptC(e.target.value);
                }}
              />
              <br />
              <input
                type="text"
                placeholder=" Enter the Value of Option-D"
                className="Adding__options"
                value={optD}
                onChange={(e) => {
                  setoptD(e.target.value);
                }}
              />
              <br />
            </div>
          ) : type === "Checkboxes" ? (
            <>
              <div className="options_container">
                {" "}
                <input
                  type="text"
                  placeholder=" Enter the Value of Option-A"
                  className="Adding__options"
                  value={CheckoptA}
                  onChange={(e) => {
                    setCheckoptA(e.target.value);
                  }}
                />
                <br />
                <input
                  type="text"
                  placeholder=" Enter the Value of Option-B"
                  className="Adding__options"
                  value={CheckoptB}
                  onChange={(e) => {
                    setCheckoptB(e.target.value);
                  }}
                />
                <br />
                <input
                  type="text"
                  placeholder=" Enter the Value of Option-C"
                  className="Adding__options"
                  value={CheckoptC}
                  onChange={(e) => {
                    setCheckoptC(e.target.value);
                  }}
                />
                <br />
                <input
                  type="text"
                  placeholder=" Enter the Value of Option-D"
                  className="Adding__options"
                  value={CheckoptD}
                  onChange={(e) => {
                    setCheckoptD(e.target.value);
                  }}
                />
                <br />
              </div>
            </>
          ) : (
            <>
              <input
                type="text"
                placeholder="Long-Answer text"
                class="Adding__para"
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={Add_Question}>Ok</Button>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Form;

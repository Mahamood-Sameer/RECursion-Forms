import React, { useEffect, useState } from "react";
import "./Responses.css";
import { Link } from "react-router-dom";
import { useParams } from "react-router";
import { db } from "../Firebase/firebase";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import { IconButton, Tooltip } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import { Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

function Responses() {
  let { Id, name } = useParams();

  // Snackbar
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const action = (
    <React.Fragment>
      <Button color="secondary" size="small" onClick={handleClose}>
        UNDO
      </Button>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  // ----------------------------------------

  const [responses, setResponses] = useState([]);
  useEffect(() => {
    db.collection("Response")
      .doc(Id)
      .collection(name)
      .onSnapshot((Snapshot) => {
        setResponses(Snapshot?.docs.map((doc) => doc.data()));
      });
  }, []);

  return (
    <>
      <div className="responses__section">
        <div className="responses__header">
          <Link to={`/form/${Id}/${name}`} target="_blank">
            <h1>{name}</h1>
          </Link>
          <div style={{ marginTop: "20px" }}>
            <Tooltip title="Copy link to clickboard">
              <IconButton
                onClick={() => {
                  const link = window.location.host;
                  navigator.clipboard.writeText(`${link}/form/${Id}/${name}`);
                  setOpen(true)
                }}
              >
                <ContentPasteIcon className="clipboardCopy" />
              </IconButton>
            </Tooltip>
          </div>

          <span>Responses</span>
        </div>
        <div className="responses__body">
          {responses.length !== 0 ? (
            <>
              <h3 style={{ marginLeft: "10px" }}>
                These are the names of the people who had submitted the form
              </h3>
              <br />
              {responses?.map((response) => (
                <Link
                  to={`/${Id}/${name}/${response.ResponseId}/${response.ResponseName}`}
                  className="responsed_people"
                >
                  <p>{response.ResponseName}</p>
                  <ArrowForwardIcon />
                </Link>
              ))}
            </>
          ) : (
            <>
              <h4>No responses</h4>
            </>
          )}
        </div>
      </div>

      {/* Snackbar */}
      <Snackbar
        open={open}
        autoHideDuration={5000}
        onClose={handleClose}
        message="Copied to Clipboard"
        action={action}
      />
    </>
  );
}

export default Responses;

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
// Pagination
import Typography from "@mui/material/Typography";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

function Responses() {
  let { Id, name } = useParams();

  // Snackbar
  const [open, setOpen] = React.useState(false);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const action = (
    <React.Fragment>
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

  // Pagination variables
  const [page, setPage] = React.useState(1);
  const handleChange = (event, value) => {
    setPage(value);
  };

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
                  setOpen(true);
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
              {responses?.map((response, index) => {
                if (page === 1) {
                  if (index >= 0 && index <= 4) {
                    return (
                      <Link
                        to={`/${Id}/${name}/${response.ResponseId}/${response.ResponseName}`}
                        className="responsed_people"
                      >
                        <p>{response.ResponseName}</p>
                        <ArrowForwardIcon />
                      </Link>
                    );
                  }
                } else if (page > 1) {
                  if (index >= (page - 1) * 5 && index <= page * 5 - 1) {
                    return (
                      <Link
                        to={`/${Id}/${name}/${response.ResponseId}/${response.ResponseName}`}
                        className="responsed_people"
                      >
                        <p>{response.ResponseName}</p>
                        <ArrowForwardIcon />
                      </Link>
                    );
                  }
                }
              })}
              <Stack spacing={2} style={{ margin: "10px auto" }}>
                <Pagination
                  count={Math.ceil(responses?.length / 5)}
                  page={page}
                  onChange={handleChange}
                />
              </Stack>
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

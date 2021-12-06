import React, { useEffect, useState } from "react";
import "./CheckBox.css";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormControl";
import FormControl from "@mui/material/FormControl";
import Checkbox from "@mui/material/Checkbox";
import { db } from "../Firebase/firebase";

function CheckBox({ question, Disable, Id, formName, user, ChoosenAnswer }) {
  const [Answer, setAnswer] = useState([]);
  useEffect(() => {
    if (!Disable) {
      console.log(Answer);
      db.collection("Response")
        .doc(Id)
        .collection(formName)
        .doc(user.user.uid)
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
          ResponseName: user?.user.displayName,
          ResponseId: user?.user.uid,
        });

      db.collection("Response")
        .doc(Id)
        .collection(formName)
        .doc(user.user.uid)
        .set({
          ResponseName: user?.user.displayName,
          ResponseId: user?.user.uid,
        });
    }
  }, [Answer]);

  const AddOptions = (option) => {
    if (!Disable) {
      let INDEX = Answer.indexOf(option);
      if (INDEX === -1) {
        setAnswer([...Answer, option]);
      } else {
        console.log("Removing ", option);
        Answer.splice(INDEX, 1);
        setAnswer(Answer);
        db.collection("Response")
          .doc(Id)
          .collection(formName)
          .doc(user.user.uid)
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
            ResponseName: user?.user.displayName,
            ResponseId: user?.user.uid,
          });

        db.collection("Response")
          .doc(Id)
          .collection(formName)
          .doc(user.user.uid)
          .set({
            ResponseName: user?.user.displayName,
            ResponseId: user?.user.uid,
          });
      }
    }
  };

  return (
    <div className="form__questions">
      <FormControl component="fieldset">
        <strong className="question">{question?.Question}</strong>
        <FormGroup>
          <FormControlLabel
            control={<Checkbox />}
            label={question?.OptionA}
            value={question?.OptionA}
            disabled={Disable}
            onClick={() => {
              AddOptions(question?.OptionA);
            }}
          />
          <FormControlLabel
            control={<Checkbox />}
            label={question?.OptionB}
            value={question?.OptionB}
            disabled={Disable}
            onClick={() => {
              AddOptions(question?.OptionB);
            }}
          />
          <FormControlLabel
            control={<Checkbox />}
            label={question?.OptionC}
            value={question?.OptionC}
            disabled={Disable}
            onClick={() => {
              AddOptions(question?.OptionC);
            }}
          />
          <FormControlLabel
            control={<Checkbox />}
            label={question?.OptionD}
            value={question?.OptionD}
            disabled={Disable}
            onClick={() => {
              AddOptions(question?.OptionD);
            }}
          />
        </FormGroup>
      </FormControl>

      {ChoosenAnswer ? (
        <>
          <br />
          <br />
          Choosen Options :{" "}
          {ChoosenAnswer.map((opt) => (
            <span>{opt} , </span>
          ))}
        </>
      ) : (
        <></>
      )}
    </div>
  );
}

export default CheckBox;

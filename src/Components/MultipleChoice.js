import React, { useEffect, useState } from "react";
import "./MultipleChoice.css";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import { db } from "../Firebase/firebase";

function MultipleChoice({ question, Disable, Id, formName, user, ChoosenAnswer }) {
  const [Answer, setAnswer] = useState(null);
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

  return (
    <div className="form__questions">
      <FormControl component="fieldset">
        <strong className="question">{question?.Question}</strong>
        <RadioGroup>
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
  );
}

export default MultipleChoice;

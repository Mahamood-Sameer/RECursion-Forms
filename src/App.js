import { useEffect, useState } from "react";
import "./App.css";
import Header from "./Components/Header";
import { auth } from "./Firebase/firebase";
import Body from "./Components/Body";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Form from "./Components/Form";
import CreatedForm from "./Components/CreatedForm";
import Myforms from "./Components/Myforms";
import Responses from "./Components/Responses";
import ResponseForm from "./Components/ResponseForm";

function App() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setUser(user);
    });
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <div className="app">
              <Header />
              <Body user={user} />
            </div>
          }
        />
        <Route
          path="/create-form"
          element={
            <div className="app">
              <Header />
              <Form user={user} />
            </div>
          }
        />
        <Route
          path="/:Id/myforms"
          element={
            <div className="app">
              <Header />
              <Myforms user={user} />
            </div>
          }
        />
        <Route
          path="/:Id/myforms/:name"
          element={
            <div className="app">
              <Header />
              <Responses />
            </div>
          }
        />
        <Route path="/:Id/:name/:ResId/:Resname" element={
          <div className="app">
          <Header />
          <ResponseForm />
        </div>
        }/>
        <Route
          path="/form/:Id/:name"
          element={
            <div className="app">
              <CreatedForm />
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

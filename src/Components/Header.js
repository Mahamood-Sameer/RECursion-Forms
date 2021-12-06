import React, { useEffect, useState } from "react";
import "./Header.css";
import { Avatar, Button, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DescriptionIcon from "@mui/icons-material/Description";
import SearchIcon from "@mui/icons-material/Search";
import AppsIcon from "@mui/icons-material/Apps";
import { Link } from "react-router-dom";
import { auth, provider } from "../Firebase/firebase";

function Header() {
  const [user, setUser] = useState(null);
  const LogIn = () => {
    auth
      .signInWithPopup(provider)
      .then((result) => {
        setUser(result);
        console.log(result);
      })
      .catch((err) => {
        alert(err.message);
      });
  };
  const LogOut = () => {
    auth.signOut();
    window.location.reload();
    window.location.replace("/");
  };

  useEffect(() => {
    if (user == null) {
      auth.onAuthStateChanged((user) => {
        setUser(user);
      });
    }
  }, [user]);

  return (
    <div className="header">
      <div className="header__left">
        <IconButton>
          <MenuIcon />
        </IconButton>
        <Link to="/">
          <DescriptionIcon className="Document-image" />
        </Link>
        <Link to="/" className="homeLink">
          RECursion Forms
        </Link>
      </div>
      <div className="header__middle">
        <IconButton>
          <SearchIcon />
        </IconButton>
        <input type="text" placeholder="Search" />
      </div>
      <div className="header__right">
        <IconButton>
          <AppsIcon />
        </IconButton>
        {user ? (
          <>
            <Avatar className="profile_pic" src={user?.user?.photoURL} />
            <Link
              to={`/${user?.uid}/myforms`}
              style={{ textDecoration: "none" }}
            >
              <Button className="buttons">My forms</Button>
            </Link>

            <Button
              className="buttons"
              onClick={() => {
                LogOut();
              }}
            >
              Logout
            </Button>
          </>
        ) : (
          <Button
            className="buttons"
            onClick={() => {
              LogIn();
            }}
          >
            Login
          </Button>
        )}
      </div>
    </div>
  );
}

export default Header;

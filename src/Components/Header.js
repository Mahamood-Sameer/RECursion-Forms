import React, { useEffect, useState } from "react";
import "./Header.css";
import { Avatar, Button, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DescriptionIcon from "@mui/icons-material/Description";
import SearchIcon from "@mui/icons-material/Search";
import AppsIcon from "@mui/icons-material/Apps";
import { Link } from "react-router-dom";
import { auth, provider } from "../Firebase/firebase";

// Profile options
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import Email from "@mui/icons-material/Email";
import AddIcon from '@mui/icons-material/Add';

function Header() {
  const [user, setUser] = useState(null);
  const LogIn = () => {
    auth
      .signInWithPopup(provider)
      .then((result) => {
        setUser(result.user);
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

  // Profile popup
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
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
              <Tooltip title="Account">
                <Avatar
                  onClick={handleClick}
                  className="profile_pic"
                  src={user?.photoURL}
                />
              </Tooltip>

              <Settings style={{ marginLeft: "20px" }} />
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
      {/* Menu card on clicking the profile */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem>
          <ListItemIcon>
            <PersonIcon />
          </ListItemIcon>
          Hii ,{" "}
          <span style={{ fontSize: "12px", fontWeight: "600", marginLeft: "5px" }}>
            {" "}
            {user?.displayName}
          </span>
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <Email />
          </ListItemIcon>
          <span style={{ fontSize: "12px", fontWeight: "600" }}>
            {" "}
            {user?.email}
          </span>
        </MenuItem>
        <Divider />
        <Link
          to={`/${user?.uid}/myforms`}
          style={{ textDecoration: "none", color: "black" }}
        >
          <MenuItem>
            <ListItemIcon>
              <DescriptionIcon />
            </ListItemIcon>
            My Forms
          </MenuItem>
        </Link>
        <Link
          to="/create-form"
          style={{ textDecoration: "none", color: "black" }}
        >
          <MenuItem>
            <ListItemIcon>
              <AddIcon />
            </ListItemIcon>
            Create Form
          </MenuItem>
        </Link>
        <MenuItem
          onClick={() => {
            LogOut();
          }}
        >
          <ListItemIcon>
            <Logout />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </>
  );
}

export default Header;

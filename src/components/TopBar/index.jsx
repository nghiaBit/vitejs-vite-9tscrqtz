import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";
import "./styles.css";
import fetchModel from "../../lib/fetchModelData";

function TopBar() {
  const location = useLocation();
  const [contextUser, setContextUser] = useState(null);

  const parts = location.pathname.split("/").filter(Boolean);
  const viewType = parts[0] || "";
  const userId = parts[1] || "";

  useEffect(() => {
    if (userId) {
      fetchModel(`/user/${userId}`)
        .then((res) => setContextUser(res.data))
        .catch(() => setContextUser(null));
    } else {
      setContextUser(null);
    }
  }, [userId]);

  const getContextText = () => {
    if (contextUser) {
      const fullName = `${contextUser.first_name} ${contextUser.last_name}`;
      if (viewType === "users") {
        return fullName;
      }
      if (viewType === "photos") {
        return `Photos of ${fullName}`;
      }
      if (viewType === "comments") {
        return `Comments of ${fullName}`;
      }
    }
    return "Photo Sharing App";
  };

  return (
    <AppBar className="topbar-appBar" position="fixed">
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h5" color="inherit">
          Vũ Quốc Nghĩa
        </Typography>
        <Typography variant="h5" color="inherit">
          {getContextText()}
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;

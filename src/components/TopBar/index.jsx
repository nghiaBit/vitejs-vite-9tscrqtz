import React, { useEffect, useState } from "react";
import {
  AppBar,
  Box,
  Checkbox,
  FormControlLabel,
  Toolbar,
  Typography,
} from "@mui/material";
import { useLocation } from "react-router-dom";
import fetchModel from "../../lib/fetchModelData";
import "./styles.css";

function TopBar({ advancedFeatures, onAdvancedFeaturesChange }) {
  const location = useLocation();
  const [context, setContext] = useState("");

  useEffect(() => {
    const path = location.pathname;
    if (path.startsWith("/users/")) {
      const userId = path.split("/")[2];
      fetchModel(`/user/${userId}`)
        .then((res) => {
          if (res && res.data) {
            setContext(`${res.data.first_name} ${res.data.last_name}`);
          }
        })
        .catch(() => setContext(""));
    } else if (path.startsWith("/photos/")) {
      const userId = path.split("/")[2];
      fetchModel(`/user/${userId}`)
        .then((res) => {
          if (res && res.data) {
            setContext(`Photos of ${res.data.first_name} ${res.data.last_name}`);
          }
        })
        .catch(() => setContext(""));
    } else if (path.startsWith("/comments/")) {
      const userId = path.split("/")[2];
      fetchModel(`/user/${userId}`)
        .then((res) => {
          if (res && res.data) {
            setContext(`Comments by ${res.data.first_name} ${res.data.last_name}`);
          }
        })
        .catch(() => setContext(""));
    } else if (path === "/users") {
      setContext("User List");
    } else {
      setContext("");
    }
  }, [location.pathname]);

  return (
    <AppBar className="topbar-appBar" position="fixed">
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
          <Typography variant="h6" component="div">
            Vũ Quốc Nghĩa - B23DCAT212
          </Typography>
          <FormControlLabel
            control={
              <Checkbox
                checked={advancedFeatures}
                onChange={(e) => onAdvancedFeaturesChange(e.target.checked)}
                sx={{
                  color: "white",
                  "&.Mui-checked": {
                    color: "white",
                  },
                }}
              />
            }
            label="Enable Advanced Features"
            sx={{ color: "white" }}
          />
        </Box>
        <Typography variant="h6" component="div">
          {context}
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;

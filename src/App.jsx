import "./App.css";

import React from "react";
import { Grid, Paper, Typography } from "@mui/material";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import TopBar from "./components/TopBar";
import UserDetail from "./components/UserDetail";
import UserList from "./components/UserList";
import UserPhotos from "./components/UserPhotos";
import UserComments from "./components/UserComments";

function App() {
  return (
    <Router>
      <div>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TopBar />
          </Grid>
          <div className="main-topbar-buffer" />
          <Grid item sm={3}>
            <Paper className="main-grid-item" elevation={2}>
              <UserList />
            </Paper>
          </Grid>
          <Grid item sm={9}>
            <Paper className="main-grid-item" elevation={2}>
              <Routes>
                <Route path="/users/:userId" element={<UserDetail />} />
                <Route path="/photos/:userId" element={<UserPhotos />} />
                <Route path="/comments/:userId" element={<UserComments />} />
                <Route
                  path="/users"
                  element={
                    <Typography variant="body1" sx={{ p: 2 }}>
                      Please select a user from the list on the left.
                    </Typography>
                  }
                />
                <Route
                  path="/"
                  element={
                    <Typography variant="body1" sx={{ p: 2 }}>
                      Welcome to the Photo Sharing App! Please select a user from the list.
                    </Typography>
                  }
                />
              </Routes>
            </Paper>
          </Grid>
        </Grid>
      </div>
    </Router>
  );
}

export default App;

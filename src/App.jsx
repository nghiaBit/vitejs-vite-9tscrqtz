import "./App.css";

import React, { useState } from "react";
import { Grid, Paper, Typography } from "@mui/material";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import TopBar from "./components/TopBar";
import UserDetail from "./components/UserDetail";
import UserList from "./components/UserList";
import UserPhotos from "./components/UserPhotos";
import UserComments from "./components/UserComments";

function App() {
  const [advancedFeatures, setAdvancedFeatures] = useState(false);

  return (
    <Router>
      <div>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TopBar
              advancedFeatures={advancedFeatures}
              onAdvancedFeaturesChange={setAdvancedFeatures}
            />
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
                <Route
                  path="/photos/:userId/:photoIndex"
                  element={<UserPhotos advancedFeatures={advancedFeatures} />}
                />
                <Route
                  path="/photos/:userId"
                  element={<UserPhotos advancedFeatures={advancedFeatures} />}
                />
                <Route
                  path="/comments/:userId"
                  element={<UserComments />}
                />
                <Route
                  path="/users"
                  element={
                    <Typography variant="body1">
                      Please select a user from the list on the left.
                    </Typography>
                  }
                />
                <Route
                  path="/"
                  element={
                    <Typography variant="body1">
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

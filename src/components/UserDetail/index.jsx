import React, { useEffect, useState } from "react";
import { Box, Button, Card, CardContent, Divider, Typography } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import fetchModel from "../../lib/fetchModelData";
import "./styles.css";

function UserDetail() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setError(null);
    setUser(null);
    fetchModel(`/user/${userId}`)
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => {
        setError(err.message || "Failed to load user");
      });
  }, [userId]);

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (!user) {
    return <Typography variant="body1">Loading user details...</Typography>;
  }

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h4" gutterBottom>
          {user.first_name} {user.last_name}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ mb: 1.5 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Occupation:
          </Typography>
          <Typography variant="body1">{user.occupation}</Typography>
        </Box>

        <Box sx={{ mb: 1.5 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Location:
          </Typography>
          <Typography variant="body1">{user.location}</Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Description:
          </Typography>
          <Typography variant="body1">{user.description}</Typography>
        </Box>

        <Button
          variant="contained"
          color="primary"
          component={Link}
          to={`/photos/${user._id}`}
        >
          View Photos
        </Button>
      </CardContent>
    </Card>
  );
}

export default UserDetail;

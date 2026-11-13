import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardActionArea,
  Divider,
  Typography,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import fetchModel, { SERVER_URL } from "../../lib/fetchModelData";
import "./styles.css";

function formatDateTime(isoString) {
  if (!isoString) return "";
  const date = new Date(isoString);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function UserComments() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setError(null);
    fetchModel(`/user/${userId}`)
      .then((res) => setUser(res.data))
      .catch((err) => console.error(err));

    fetchModel(`/commentsOfUser/${userId}`)
      .then((res) => {
        setComments(res.data || []);
      })
      .catch((err) => {
        setError(err.message || "Failed to load comments");
      });
  }, [userId]);

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
        {user ? `Comments by ${user.first_name} ${user.last_name}` : "User Comments"}
      </Typography>

      <Divider sx={{ mb: 3 }} />

      {comments.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          This user has not posted any comments yet.
        </Typography>
      ) : (
        comments.map((item) => (
          <Card
            key={item._id}
            variant="outlined"
            sx={{
              mb: 2,
              transition: "box-shadow 0.2s ease",
              "&:hover": { boxShadow: 3 },
            }}
          >
            <CardActionArea
              onClick={() => navigate(`/photos/${item.photo_owner_id}`)}
              sx={{ p: 1.5 }}
            >
              <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                <Box
                  component="img"
                  src={`${SERVER_URL}/images/${item.file_name}`}
                  alt="Photo thumbnail"
                  onError={(e) => {
                    if (!e.target.src.endsWith(`/images/${item.file_name}`)) {
                      e.target.src = `/images/${item.file_name}`;
                    }
                  }}
                  sx={{
                    width: 90,
                    height: 70,
                    objectFit: "cover",
                    borderRadius: 1,
                    border: "1px solid #ddd",
                    flexShrink: 0,
                  }}
                />
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="body1" sx={{ fontWeight: 500, mb: 0.5 }}>
                    "{item.comment}"
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Posted on: {formatDateTime(item.date_time)}
                  </Typography>
                </Box>
              </Box>
            </CardActionArea>
          </Card>
        ))
      )}
    </Box>
  );
}

export default UserComments;

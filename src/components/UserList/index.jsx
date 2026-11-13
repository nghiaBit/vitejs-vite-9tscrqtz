import React, { useEffect, useState } from "react";
import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import fetchModel from "../../lib/fetchModelData";
import "./styles.css";

function UserList() {
  const [users, setUsers] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    fetchModel("/user/list")
      .then((res) => {
        setUsers(res.data || []);
      })
      .catch((err) => {
        console.error("Error loading user list:", err);
      });
  }, []);

  return (
    <List component="nav" disablePadding>
      {users.map((user) => {
        const isSelected =
          location.pathname.startsWith(`/users/${user._id}`) ||
          location.pathname.startsWith(`/photos/${user._id}`) ||
          location.pathname.startsWith(`/comments/${user._id}`);

        return (
          <React.Fragment key={user._id}>
            <ListItem
              disablePadding
              secondaryAction={
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.8, pr: 1 }}>
                  <Box
                    sx={{
                      bgcolor: "#2e7d32",
                      color: "#fff",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      minWidth: 22,
                      height: 22,
                      px: 0.8,
                      borderRadius: "11px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    title="Photos count"
                  >
                    {user.photo_count || 0}
                  </Box>
                  <Box
                    component="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      navigate(`/comments/${user._id}`);
                    }}
                    sx={{
                      bgcolor: "#d32f2f",
                      color: "#fff",
                      border: "none",
                      outline: "none",
                      cursor: "pointer",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      minWidth: 22,
                      height: 22,
                      px: 0.8,
                      borderRadius: "11px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "transform 0.15s ease",
                      "&:hover": {
                        transform: "scale(1.1)",
                        bgcolor: "#b71c1c",
                      },
                    }}
                    title="Comments count - Click to view comments"
                  >
                    {user.comment_count || 0}
                  </Box>
                </Box>
              }
            >
              <ListItemButton
                component={Link}
                to={`/users/${user._id}`}
                selected={isSelected}
                sx={{ pr: 9 }}
              >
                <ListItemText primary={`${user.first_name} ${user.last_name}`} />
              </ListItemButton>
            </ListItem>
            <Divider />
          </React.Fragment>
        );
      })}
    </List>
  );
}

export default UserList;

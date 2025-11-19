// frontend/src/pages/DashboardPage.tsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext.tsx";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Button,
  Typography,
  Paper,
  Avatar,
  Divider,
  CircularProgress,
  Alert,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Badge,
  keyframes,
} from "@mui/material";

import ChatIcon from "@mui/icons-material/Chat";
import EventNoteIcon from "@mui/icons-material/EventNote";
import HistoryIcon from "@mui/icons-material/History";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

import CreateChatDialog from "../components/CreateChatDialog.tsx";
import api from "../api";

// ─────────────────────────────────────
// ANIMATIONS
// ─────────────────────────────────────
const float = keyframes`
  0% { transform: translateY(0px); opacity: .7; }
  50% { transform: translateY(-18px); opacity: 1; }
  100% { transform: translateY(0px); opacity: .7; }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const glowPulse = keyframes`
  0% { box-shadow: 0 0 15px rgba(139,92,246,.3); }
  50% { box-shadow: 0 0 28px rgba(139,92,246,.7); }
  100% { box-shadow: 0 0 15px rgba(139,92,246,.3); }
`;

const blobAnim = keyframes`
  0% { transform: translate(-25px,0) scale(1); }
  50% { transform: translate(30px,-35px) scale(1.2); }
  100% { transform: translate(-25px,0) scale(1); }
`;

// ─────────────────────────────────────
// CHAT LIST COMPONENT
// ─────────────────────────────────────
const ChatListDisplay = ({ chats, categoryTitle, onChatClick }) => (
  <Box sx={{ width: "100%", height: "100%", p: 4, animation: `${fadeIn} .5s ease` }}>
    <Typography
      variant="h5"
      sx={{
        mb: 3,
        fontWeight: 700,
        color: "#E5E7EB",
        textShadow: "0 0 10px rgba(255,255,255,0.2)",
      }}
    >
      {categoryTitle}
    </Typography>

    <List sx={{ width: "100%", overflowY: "auto" }}>
      {chats.map((chat) => (
        <ListItemButton
          key={chat.id}
          onClick={() => onChatClick(chat.id)}
          sx={{
            mb: 2,
            borderRadius: "14px",
            background: "rgba(255,255,255,0.07)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "white",
            px: 3,
            py: 2,
            transition: "all .25s",
            animation: `${fadeIn} .4s ease`,
            "&:hover": {
              background: "rgba(255,255,255,0.14)",
              transform: "translateY(-4px)",
              boxShadow: "0 10px 28px rgba(139,92,246,.4)",
            },
          }}
        >
          <ListItemText
            primary={chat.name}
            primaryTypographyProps={{
              sx: { fontSize: "1.1rem", fontWeight: 600, color: "#fff" },
            }}
            secondary={`By ${chat.creator_username} • ${new Date(chat.created_at).toLocaleString()}`}
            secondaryTypographyProps={{
              sx: { color: "#A1A1AA", fontSize: ".85rem" },
            }}
          />
        </ListItemButton>
      ))}
    </List>
  </Box>
);

// ─────────────────────────────────────
// DASHBOARD PAGE
// ─────────────────────────────────────
function DashboardPage() {
  const { currentUser, logout, loading } = useAuth();
  const navigate = useNavigate();

  const [activeChats, setActiveChats] = useState([]);
  const [scheduledChats, setScheduledChats] = useState([]);
  const [previousChats, setPreviousChats] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("home");
  const [openCreateChatDialog, setOpenCreateChatDialog] = useState(false);
  const [fetchingChats, setFetchingChats] = useState(true);
  const [chatsError, setChatsError] = useState("");

  const fetchChats = async () => {
    setFetchingChats(true);
    try {
      const res = await api.get("/chats/my");
      const data = res.data;

      const now = new Date();

      setActiveChats(
        data.filter(
          (c) =>
            now >= new Date(c.start_time || c.created_at) &&
            now < new Date(c.end_time)
        )
      );
      setScheduledChats(
        data.filter((c) => now < new Date(c.start_time || c.created_at))
      );
      setPreviousChats(data.filter((c) => now >= new Date(c.end_time)));
    } catch (err) {
      setChatsError("Failed to load chats.");
    }
    setFetchingChats(false);
  };

  useEffect(() => {
    if (currentUser) fetchChats();
  }, [currentUser]);

  if (!loading && !currentUser) {
    navigate("/login");
    return null;
  }

  const userName = currentUser?.displayName || "User";

  // ───────────────────────────
  // HOME SCREEN CONTENT
  // ───────────────────────────
  const renderHome = () => (
    <Box
      sx={{
        flex: 1,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        color: "white",
        position: "relative",
        animation: `${fadeIn} .6s ease`,
      }}
    >
      <Box
        sx={{
          position: "absolute",
          width: 420,
          height: 420,
          borderRadius: "50%",
          background: "radial-gradient(circle, #a78bfa55, #4f46e500)",
          filter: "blur(80px)",
          animation: `${blobAnim} 12s infinite ease`,
          zIndex: 0,
        }}
      />

      <Typography
        variant="h3"
        sx={{
          fontWeight: 800,
          mb: 4,
          background: "linear-gradient(90deg,#a78bfa,#c084fc,#a78bfa)",
          WebkitBackgroundClip: "text",
          color: "transparent",
          textShadow: "0 0 25px rgba(168,85,247,0.6)",
          animation: `${fadeIn} 1s ease`,
          zIndex: 2,
        }}
      >
        Welcome to ConvoSphere, {userName}
      </Typography>

      <Button
        variant="contained"
        startIcon={<AddCircleOutlineIcon />}
        onClick={() => setOpenCreateChatDialog(true)}
        sx={{
          px: 8,
          py: 2,
          borderRadius: "999px",
          fontWeight: 700,
          fontSize: "1.1rem",
          letterSpacing: ".5px",
          background: "linear-gradient(90deg,#7c3aed,#8b5cf6,#6366f1)",
          animation: `${glowPulse} 3s infinite ease-in-out`,
          "&:hover": {
            transform: "translateY(-3px)",
            boxShadow: "0 0 40px rgba(139,92,246,.9)",
          },
          zIndex: 2,
        }}
      >
        CREATE CHAT
      </Button>
    </Box>
  );

  // ───────────────────────────
  // CATEGORY CONTENT
  // ───────────────────────────
  const renderContent = () => {
    if (fetchingChats)
      return (
        <Box
          sx={{
            flex: 1,
            minHeight: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress color="inherit" />
        </Box>
      );

    if (chatsError)
      return (
        <Alert severity="error" sx={{ mt: 4 }}>
          {chatsError}
        </Alert>
      );

    if (selectedCategory === "home") return renderHome();

    const map = {
      active: activeChats,
      scheduled: scheduledChats,
      previous: previousChats,
    };

    return (
      <ChatListDisplay
        chats={map[selectedCategory]}
        categoryTitle={
          selectedCategory === "active"
            ? "Active Chats"
            : selectedCategory === "scheduled"
            ? "Scheduled Chats"
            : "Previous Chats"
        }
        onChatClick={(id) => navigate(`/chat/${id}`)}
      />
    );
  };

  // ───────────────────────────
  // PAGE LAYOUT
  // ───────────────────────────
  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        background: "linear-gradient(150deg,#0f172a,#111827,#1e1b4b)",
        color: "white",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Floating particles */}
      {[...Array(22)].map((_, i) => (
        <Box
          key={i}
          sx={{
            position: "absolute",
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "rgba(168,85,247,.5)",
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animation: `${float} ${6 + Math.random() * 7}s infinite ease`,
            filter: "blur(3px)",
          }}
        />
      ))}

      {/* SIDEBAR */}
      <Paper
        elevation={12}
        sx={{
          width: 260,
          bgcolor: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(20px)",
          borderRight: "1px solid rgba(255,255,255,.12)",
          p: 3,
          display: "flex",
          flexDirection: "column",
          animation: `${fadeIn} .7s ease`,
        }}
      >
        {/* Profile */}
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Avatar
            src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
            alt="User Avatar"
            sx={{
              width: 110,
              height: 110,
              mx: "auto",
              mb: 1,
              border: "3px solid rgba(255,255,255,0.25)",
              boxShadow: "0 4px 14px rgba(0,0,0,0.4)",
              backgroundColor: "#1e293b",
            }}
          />

          <Typography
            sx={{
              mt: 1,
              fontSize: "1.45rem",
              fontWeight: 700,
              color: "#fff",
              letterSpacing: "0.5px",
            }}
          >
            {userName}
          </Typography>
        </Box>

        <Divider sx={{ my: 2, borderColor: "rgba(255,255,255,.15)" }} />

        {/* MENU */}
        <List>
          {[ 
            { key: "home", label: "Home", icon: <AddCircleOutlineIcon /> },
            { key: "active", label: "Active Chats", icon: <ChatIcon />, count: activeChats.length },
            { key: "scheduled", label: "Scheduled Chats", icon: <EventNoteIcon />, count: scheduledChats.length },
            { key: "previous", label: "Previous Chats", icon: <HistoryIcon />, count: previousChats.length },
          ].map((item) => (
            <ListItemButton
              key={item.key}
              selected={selectedCategory === item.key}
              onClick={() => setSelectedCategory(item.key)}
              sx={{
                py: 1.5,
                mb: 1,
                borderRadius: "12px",
                color: "white",
                "&.Mui-selected": {
                  background: "rgba(255,255,255,0.18)",
                },
                "&:hover": {
                  background: "rgba(255,255,255,0.12)",
                },
              }}
            >
              <ListItemIcon sx={{ color: "white" }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
              {item.count !== undefined && (
                <Badge badgeContent={item.count} color="primary" />
              )}
            </ListItemButton>
          ))}
        </List>

        {/* LOGOUT */}
        <Button
          variant="contained"
          color="error"
          onClick={logout}
          sx={{
            mt: "auto",
            py: 1.3,
            borderRadius: "12px",
            fontWeight: 600,
          }}
        >
          Logout
        </Button>
      </Paper>

      {/* MAIN CONTENT */}
      <Box
        sx={{
          flexGrow: 1,
          minHeight: "100vh",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          animation: `${fadeIn} .7s ease`,
          position: "relative",
        }}
      >
        {renderContent()}
      </Box>

      {/* CREATE CHAT POPUP */}
      <CreateChatDialog
        open={openCreateChatDialog}
        onClose={() => setOpenCreateChatDialog(false)}
        onChatCreated={fetchChats}
      />
    </Box>
  );
}

export default DashboardPage;

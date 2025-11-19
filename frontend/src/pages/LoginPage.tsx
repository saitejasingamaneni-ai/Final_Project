// frontend/src/pages/LoginPage.tsx
import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext.tsx";
import { useNavigate } from "react-router-dom";

import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Link,
  CircularProgress,
  Alert,
  InputAdornment,
} from "@mui/material";

import EmailIcon from "@mui/icons-material/Email";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";

interface PandaFaceProps {
  isCoveringEyes: boolean;
}

const PandaFace: React.FC<PandaFaceProps> = ({ isCoveringEyes }) => {
  return (
    <Box
      sx={{
        position: "relative",
        width: 130,      // ⬅ FIXED SIZE
        height: 120,     // ⬅ FIXED SIZE
        mx: "auto",
        mb: 2,
      }}
    >
      {/* Head */}
      <Box
        sx={{
          position: "absolute",
          top: 6,
          left: "50%",
          transform: "translateX(-50%)",
          width: 110,
          height: 100,
          borderRadius: "50%",
          backgroundColor: "#fff",
          boxShadow: "0 4px 10px rgba(0,0,0,0.25)",
          zIndex: 2,
        }}
      />

      {/* Ears */}
      <Box
        sx={{
          position: "absolute",
          top: -2,
          left: "50%",
          transform: "translateX(-60px)",
          width: 28,
          height: 28,
          borderRadius: "50%",
          backgroundColor: "#262335",
          zIndex: 1,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          top: -2,
          left: "50%",
          transform: "translateX(32px)",
          width: 28,
          height: 28,
          borderRadius: "50%",
          backgroundColor: "#262335",
          zIndex: 1,
        }}
      />

      {/* Eye patches */}
      {!isCoveringEyes && (
        <>
          <Box
            sx={{
              position: "absolute",
              top: 40,
              left: "50%",
              transform: "translateX(-36px)",
              width: 22,
              height: 30,
              borderRadius: "50%",
              backgroundColor: "#262335",
              zIndex: 3,
            }}
          />
          <Box
            sx={{
              position: "absolute",
              top: 40,
              left: "50%",
              transform: "translateX(14px)",
              width: 22,
              height: 30,
              borderRadius: "50%",
              backgroundColor: "#262335",
              zIndex: 3,
            }}
          />
        </>
      )}

      {/* Eyes */}
      {!isCoveringEyes && (
        <>
          <Box
            sx={{
              position: "absolute",
              top: 52,
              left: "50%",
              transform: "translateX(-27px)",
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: "#fff",
              zIndex: 4,
            }}
          />
          <Box
            sx={{
              position: "absolute",
              top: 52,
              left: "50%",
              transform: "translateX(22px)",
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: "#fff",
              zIndex: 4,
            }}
          />
        </>
      )}

      {/* Nose */}
      <Box
        sx={{
          position: "absolute",
          top: 65,
          left: "50%",
          transform: "translateX(-6px)",
          width: 14,
          height: 10,
          borderRadius: "50%",
          backgroundColor: "#262335",
          zIndex: 4,
        }}
      />

      {/* Smile */}
      <Box
        sx={{
          position: "absolute",
          top: 75,
          left: "50%",
          width: 32,
          height: 18,
          borderBottom: "3px solid #262335",
          borderRadius: "0 0 40px 40px",
          transform: "translateX(-16px)",
          zIndex: 4,
        }}
      />

      {/* Arms */}
      <Box
        sx={{
          position: "absolute",
          top: isCoveringEyes ? 28 : 78,
          left: "50%",
          transform: "translateX(-63px)",
          width: 46,
          height: 52,
          borderRadius: "40px",
          backgroundColor: "#262335",
          transition: "all 0.35s ease",
          zIndex: 5,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          top: isCoveringEyes ? 28 : 78,
          left: "50%",
          transform: "translateX(18px)",
          width: 46,
          height: 52,
          borderRadius: "40px",
          backgroundColor: "#262335",
          transition: "all 0.35s ease",
          zIndex: 5,
        }}
      />

      {/* Paws */}
      <Box
        sx={{
          position: "absolute",
          bottom: -14,
          left: "50%",
          transform: "translateX(-48px)",
          width: 26,
          height: 26,
          borderRadius: "50%",
          backgroundColor: "#262335",
          zIndex: 1,
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 6,
            left: 6,
            width: 14,
            height: 14,
            borderRadius: "50%",
            backgroundColor: "#fff",
          }}
        />
      </Box>
      <Box
        sx={{
          position: "absolute",
          bottom: -14,
          left: "50%",
          transform: "translateX(22px)",
          width: 26,
          height: 26,
          borderRadius: "50%",
          backgroundColor: "#262335",
          zIndex: 1,
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 6,
            left: 6,
            width: 14,
            height: 14,
            borderRadius: "50%",
            backgroundColor: "#fff",
          }}
        />
      </Box>
    </Box>
  );
};

const LoginPage: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const { signup, login } = useAuth();
  const navigate = useNavigate();

  // 🔒 AUTH LOGIC — UNCHANGED
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let user;
      if (isSignUp) {
        user = await signup(email, password, username);
      } else {
        user = await login(email, password);
      }
      if (user) navigate("/dashboard");
    } catch (err: any) {
      if (err.code) {
        if (err.code === "auth/email-already-in-use") {
          setError("Email is already in use.");
        } else if (
          err.code === "auth/invalid-email" ||
          err.code === "auth/user-not-found" ||
          err.code === "auth/wrong-password"
        ) {
          setError("Invalid email or password.");
        } else if (err.code === "auth/weak-password") {
          setError("Password must be at least 6 characters.");
        } else {
          setError(err.message || "Authentication error.");
        }
      } else if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else {
        setError("Unexpected error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        px: 2,
        background:
          "radial-gradient(circle at top left, #7b2ff7 0, #4c6fff 30%, #111827 100%)",
      }}
    >
      <Paper
        elevation={12}
        sx={{
          position: "relative",
          p: 4,
          pt: 5,
          width: "100%",
          maxWidth: 480,
          borderRadius: 6,
          overflow: "visible",
          background: "linear-gradient(180deg, #ffffff, #f8fafc)",
          boxShadow:
            "0 18px 45px rgba(15,23,42,0.32), 0 0 0 1px rgba(148,163,184,0.15)",
        }}
      >
        {/* Panda */}
        <Box
          sx={{
            position: "absolute",
            top: -120, // ⬅ FIXED SO PANDA IS NOT CUT
            left: "50%",
            transform: "translateX(-50%)",
            "@media (max-width: 480px)": {
              transform: "translateX(-50%) scale(0.75)", // Responsive
            },
          }}
        >
          <PandaFace isCoveringEyes={passwordFocused} />
        </Box>

        {/* Branding */}
        <Box sx={{ mt: 9, mb: 2, textAlign: "center" }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              letterSpacing: 0.5,
              background: "linear-gradient(90deg,#4f46e5,#7c3aed)",
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}
          >
            ConvoSphere
          </Typography>

          <Typography
            variant="subtitle1"
            sx={{ color: "#64748b", mt: 1, fontWeight: 500 }}
          >
            {isSignUp ? "Create your account" : "Welcome back to your sphere"}
          </Typography>
        </Box>

        {/* Form */}
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon color="primary" />
                </InputAdornment>
              ),
            }}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
          />

          {isSignUp && (
            <TextField
              margin="normal"
              required
              fullWidth
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon color="primary" />
                  </InputAdornment>
                ),
              }}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
            />
          )}

          <TextField
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={() => setPasswordFocused(true)}
            onBlur={() => setPasswordFocused(false)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon color="primary" />
                </InputAdornment>
              ),
            }}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
          />

          {error && (
            <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              mb: 1,
              py: 1.5,
              borderRadius: 999,
              fontWeight: 700,
              fontSize: 16,
              background:
                "linear-gradient(90deg, #4f46e5 0%, #6366f1 40%, #7c3aed 100%)",
              boxShadow: "0 10px 25px rgba(79,70,229,0.45)",
              "&:hover": {
                background:
                  "linear-gradient(90deg, #4338ca 0%, #4f46e5 40%, #6d28d9 100%)",
                boxShadow: "0 12px 30px rgba(55,48,163,0.55)",
              },
            }}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : isSignUp ? (
              "Sign Up"
            ) : (
              "Login"
            )}
          </Button>
        </Box>

        {/* Switch Form */}
        <Typography
          variant="body2"
          sx={{ textAlign: "center", mt: 2, color: "#475569" }}
        >
          {isSignUp ? "Already have an account?" : "Don’t have an account?"}{" "}
          <Link
            component="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError("");
              setEmail("");
              setPassword("");
              setUsername("");
            }}
            sx={{
              fontWeight: 700,
              color: "#4f46e5",
              textDecoration: "none",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            {isSignUp ? "Login" : "Sign Up"}
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default LoginPage;

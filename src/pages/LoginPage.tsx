"use client";
import { useState, useEffect } from "react";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Box, Button, CircularProgress, Paper, Stack, Typography } from "@mui/material";
import {
  Form,
  Notification,
  required,
  useLogin,
  useNotify,
  useTranslate,
  TextInput,
  PasswordInput,
} from "react-admin";

import { useAppContext } from "../AppContext";
import { getSupportedLoginFlows, isValidBaseUrl } from "../synapse/synapse";
import storage from "../storage";

const LoginPage = () => {
  const login = useLogin();
  const notify = useNotify();
  const { restrictBaseUrl } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [supportPassAuth, setSupportPassAuth] = useState(true);
  const translate = useTranslate();

  const baseUrl =
    typeof restrictBaseUrl === "string"
      ? restrictBaseUrl
      : Array.isArray(restrictBaseUrl) && restrictBaseUrl.length > 0
        ? restrictBaseUrl[0]
        : "";
  const [ssoBaseUrl, setSSOBaseUrl] = useState("");

  const loginToken = /\?loginToken=([a-zA-Z0-9_-]+)/.exec(window.location.href);

  if (loginToken) {
    const ssoToken = loginToken[1];
    window.history.replaceState({}, "", window.location.href.replace(loginToken[0], "#").split("#")[0]);
    const savedBaseUrl = storage.getItem("sso_base_url");
    storage.removeItem("sso_base_url");
    if (savedBaseUrl) {
      const auth = {
        base_url: savedBaseUrl,
        username: null,
        password: null,
        loginToken: ssoToken,
      };
      login(auth).catch(error => {
        alert(
          typeof error === "string"
            ? error
            : typeof error === "undefined" || !error.message
              ? "ra.auth.sign_in_error"
              : error.message
        );
        console.error(error);
      });
    }
  }

  const handleSubmit = (auth: any) => {
    setLoading(true);
    login({ ...auth, base_url: baseUrl }).catch(error => {
      setLoading(false);
      notify(
        typeof error === "string"
          ? error
          : typeof error === "undefined" || !error.message
            ? "ra.auth.sign_in_error"
            : error.message,
        { type: "warning" }
      );
    });
  };

  useEffect(() => {
    if (!isValidBaseUrl(baseUrl)) return;

    getSupportedLoginFlows(baseUrl)
      .then(loginFlows => {
        const supportPass = loginFlows.find((f: any) => f.type === "m.login.password") !== undefined;
        const supportSSO = loginFlows.find((f: any) => f.type === "m.login.sso") !== undefined;
        setSupportPassAuth(supportPass);
        setSSOBaseUrl(supportSSO ? baseUrl : "");
      })
      .catch(() => setSSOBaseUrl(""));
  }, [baseUrl]);

  // سفارشی کردن PasswordInput برای آیکون چشم سمت چپ (راست در LTR) ولی در RTL درست کار کنه
  const CustomPasswordInput = (props: any) => (
    <PasswordInput
      {...props}
      inputProps={{
        style: { textAlign: "right" },
      }}
      sx={{
        mb: 3,
        "& .MuiFormLabel-root": {
          textAlign: "right",
          left: "auto",
          right: "16px",
          transformOrigin: "right",
        },
        "& .MuiInputLabel-shrink": {
          transform: "translate(14px, -9px) scale(0.75)",
        },
        "& .MuiInputBase-root": {
          borderRadius: "16px",
          background: "rgba(255, 255, 255, 0.7)",
          "&:hover": { background: "rgba(255, 255, 255, 0.85)" },
          "&.Mui-focused": { background: "#ffffff", boxShadow: "0 0 0 3px rgba(0, 137, 123, 0.18)" },
        },
      }}
    />
  );

  return (
    <>
      <Form onSubmit={handleSubmit} mode="onTouched">
        <Box
          dir="rtl"
          sx={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            px: 2,
            background: "linear-gradient(180deg, #E0F2F1 0%, #F7F9FC 60%, #FFFFFF 100%)",
          }}
        >
          {/* Background */}
          <Paper
            elevation={0}
            sx={{
              width: "100%",
              maxWidth: 440,
              borderRadius: 4,
              overflow: "hidden",
              backgroundColor: "rgba(255,255,255,0.78)",
              backdropFilter: "blur(14px)",
              border: "1px solid rgba(0,0,0,0.05)",
              boxShadow: "0 24px 80px rgba(0, 0, 0, 0.10)",
            }}
          >
            {/* Glass Card */}
            <Box sx={{ p: 4, textAlign: "center", backgroundColor: "rgba(255,255,255,0.55)" }}>
              {/* Header */}
              <Box
                sx={{
                  width: 84,
                  height: 84,
                  mx: "auto",
                  mb: 2,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "rgba(255,255,255,0.9)",
                  border: "1px solid rgba(0,0,0,0.04)",
                }}
              >
                {loading ? <CircularProgress size={42} thickness={4} /> : <LockOutlinedIcon sx={{ fontSize: 40, color: "primary.main" }} />}
              </Box>

              <Typography variant="h5" sx={{ fontWeight: 800, mb: 1, color: "text.primary" }}>
                {translate("synapseadmin.auth.welcome")}
              </Typography>
              <Typography variant="body1" sx={{ color: "text.secondary" }}>
                به پنل مدیریت خوش آمدید
              </Typography>
            </Box>

            {/* Body */}
            <Box sx={{ px: 4, pb: 4, pt: 3 }}>
              <Stack spacing={2}>
                {/* Username */}
                <TextInput
                  source="username"
                  label="نام کاربری"
                  autoFocus
                  autoComplete="username"
                  disabled={loading || !supportPassAuth}
                  validate={required()}
                  fullWidth
                  placeholder="نام کاربری خود را وارد کنید"
                  sx={{
                    "& .MuiInputBase-input": { textAlign: "right" },
                    "& .MuiFormLabel-root": {
                      textAlign: "right",
                      left: "auto",
                      right: "16px",
                      transformOrigin: "right",
                    },
                    "& .MuiInputLabel-shrink": {
                      transform: "translate(14px, -9px) scale(0.75)",
                    },
                    "& .MuiInputBase-root": {
                      borderRadius: "16px",
                      background: "rgba(255, 255, 255, 0.7)",
                      "&:hover": { background: "rgba(255, 255, 255, 0.85)" },
                      "&.Mui-focused": { background: "#ffffff", boxShadow: "0 0 0 3px rgba(0, 137, 123, 0.18)" },
                    },
                  }}
                />

                {/* Password */}
                <CustomPasswordInput
                  source="password"
                  label="رمز عبور"
                  autoComplete="current-password"
                  disabled={loading || !supportPassAuth}
                  validate={required()}
                  fullWidth
                  placeholder="رمز عبور خود را وارد کنید"
                />

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled={loading || !supportPassAuth}
                  fullWidth
                  sx={{
                    borderRadius: "16px",
                    py: 1.6,
                    fontWeight: 800,
                    boxShadow: "0 10px 24px rgba(0, 105, 92, 0.18)",
                  }}
                >
                  {loading ? <CircularProgress size={26} thickness={5} color="inherit" /> : translate("ra.auth.sign_in")}
                </Button>
              </Stack>
            </Box>
          </Paper>
        </Box>
        <Notification />
      </Form>
    </>
  );
};

export default LoginPage;
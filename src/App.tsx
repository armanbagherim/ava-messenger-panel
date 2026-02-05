import { merge } from "lodash";
import polyglotI18nProvider from "ra-i18n-polyglot";

import { Admin, CustomRoutes, Resource, houseLightTheme } from "react-admin";
import { Route } from "react-router-dom";
import { createTheme, alpha } from "@mui/material/styles";

import { ImportFeature } from "./components/ImportFeature";
import germanMessages from "./i18n/de";
import englishMessages from "./i18n/en";
import frenchMessages from "./i18n/fr";
import italianMessages from "./i18n/it";
import russianMessages from "./i18n/ru";
import chineseMessages from "./i18n/zh";
import farsiMessages from "./i18n/fa";
import LoginPage from "./pages/LoginPage";
import destinations from "./resources/destinations";
import registrationToken from "./resources/registration_tokens";
import reports from "./resources/reports";
// import roomDirectory from "./resources/room_directory";
import rooms from "./resources/rooms";
import userMediaStats from "./resources/user_media_statistics";
import users from "./resources/users";
import uploadPolicy from "./resources/uploadPolicy";
import { groupCreationResource, channelCreationResource } from "./resources/roomCreation";
import {
  broadcastSendResource,
  broadcastBirthdayToggleResource,
  broadcastBirthdayTemplateResource,
  broadcastBirthdayTodayResource,
  broadcastBirthdayRecipientsResource,
  broadcastLogsResource,
  broadcastStatsResource,
} from "./resources/broadcast";
import roles from "./resources/roles";
import authProvider from "./synapse/authProvider";
import dataProvider from "./synapse/dataProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import CustomLayout from "./components/CustomLayout";

// --- I18n Setup ---
const messages = {
  de: germanMessages,
  en: englishMessages,
  fr: frenchMessages,
  it: italianMessages,
  ru: russianMessages,
  zh: chineseMessages,
  fa: farsiMessages,
};

const i18nProvider = polyglotI18nProvider(
  (locale) => (messages[locale] ? merge({}, messages.en, messages[locale]) : messages.en),
  "fa"
);

// --- Theme Setup ---
const theme = createTheme({
  ...houseLightTheme,

  // 1. RTL & Direction Configuration
  direction: 'rtl',

  // 2. Sidebar Configuration
  sidebar: {
    width: 248,
    closedWidth: 64,
  },

  // 3. Color Palette (Professional Teal & Purple Standard)
  palette: {
    primary: {
      main: '#000', // Modern Teal
      light: '#4DB6AC',
      dark: '#00695C',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#486aef', // Soft Purple for accents
      light: '#B39DDB',
      dark: '#2f4dc5ff',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F7F9FC', // Very light blue-grey background
      paper: '#FFFFFF',
    },
    text: {
      primary: '#263238', // Dark Blue-Grey for main text (high contrast)
      secondary: '#546E7A',
    },
    error: {
      main: '#EF5350',
    },
    success: {
      main: '#66BB6A',
    },
  },

  // 4. Component Styling Overrides
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        ".RaListToolbar-root": {
          backgroundColor: "#FFFFFF",
          border: "1px solid #EEEEEE",
          borderRadius: "16px",
          padding: "12px 14px",
          marginBottom: "16px",
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
        },
        ".RaListToolbar-root .RaFilterForm-root": {
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
        },
        ".RaListToolbar-root .RaFilterFormInput-root": {
          margin: 0,
        },
      },
    },

    RaLayout: {
      styleOverrides: {
        root: {
          "& .RaLayout-contentWithSidebar": {
            flexDirection: "row-reverse",
          },
        },
      },
    },

    RaSidebar: {
      defaultProps: {
        anchor: "left",
      },
      styleOverrides: {
        root: {
          "& .MuiPaper-root": {
            borderLeft: "none",
            borderRight: "none",
            borderRadius: "20px",
            margin: "16px",
            height: "calc(100% - 32px)",
            backgroundColor: "#FFFFFF",
            boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
          },
        },
      },
    },

    // --- DataGrid / Table Styling ---
    RaDatagrid: {
      styleOverrides: {
        root: {
          backgroundColor: "#FFFFFF",
          borderRadius: "16px", // More rounded
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)", // Soft diffuse shadow
          border: "1px solid #EEEEEE",
          overflow: "hidden",
          direction: "ltr",
          "& .RaDatagrid-headerCell": {
            backgroundColor: "#FAFAFA",
            color: '#000', // Primary color for headers
            fontWeight: 700,
            fontSize: "0.9rem",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            padding: "20px",
            borderBottom: "2px solid #E0F2F1",
            textAlign: 'left',
            borderRight: "1px solid #ECEFF1",
            "&:last-of-type": {
              borderRight: "none",
            },
          },
          "& .RaDatagrid-row": {
            transition: "background-color 0.2s ease",
          },
          "& .RaDatagrid-row:nth-of-type(odd)": {
            backgroundColor: "#FCFDFE",
          },
          "& .RaDatagrid-row:nth-of-type(even)": {
            backgroundColor: "#FFFFFF",
          },
          "& .RaDatagrid-row:hover": {
            backgroundColor: "#F0FDFC", // Very subtle teal tint on hover
          },
          "& .RaDatagrid-rowCell": {
            padding: "16px 20px",
            borderBottom: "1px solid #F5F5F5",
            textAlign: 'left',
            borderRight: "1px solid #ECEFF1",
            "&:last-of-type": {
              borderRight: "none",
            },
            fontSize: "0.95rem",
            color: "#37474F",
          },
        },
      },
    },

    // --- The "Control Box" Concept for Radios, Switches, Checkboxes ---
    MuiFormGroup: {
      styleOverrides: {
        root: {
          // Targeting the specific wrapper classes used in RA forms
          "&.ra-input": {
            backgroundColor: "#FFFFFF",
            border: "1px solid #E0E0E0",
            borderRadius: "16px",
            padding: "12px", // Spacing inside the box
            boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
            transition: "box-shadow 0.2s, border-color 0.2s",
            "&:hover": {
              borderColor: "#B2DFDB", // Light teal border on hover
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            }
          }
        }
      }
    },

    // Radio Buttons: Clean & Modern
    MuiRadio: {
      styleOverrides: {
        root: {
          color: "#90A4AE",
          padding: "8px",
          "&.Mui-checked": {
            color: "#000", // Teal when active
          },
          "& .MuiSvgIcon-root": {
            fontSize: "1.4rem", // Slightly larger for clickability
          }
        },
      },
    },

    // --- SWITCHES (iOS Style) ---
    MuiSwitch: {
      styleOverrides: {
        root: {
          width: 52, // عرض سوییچ
          height: 28, // ارتفاع سوییچ
          padding: 0,
          display: "flex",
          borderRadius: 28 / 2, // گرد کردن کامل هدر
          overflow: 'hidden', // برای اطمینان از اینکه گوشه‌ها بریده نمی‌شوند
          "& .MuiSwitch-switchBase": {
            padding: 0,
            height: "100%",
            "&.Mui-checked": {
              transform: "translateX(24px)", // جابجایی دایره به سمت راست (در حالت RTL)
              color: "#fff", // رنگ دایره سفید
              "& + .MuiSwitch-track": {
                opacity: 1,
                backgroundColor: "#000", // رنگ پس‌زمینه فعال (سبز دودی)
                borderColor: "#000",
              },
            },
            "&:not(.Mui-checked)": {
              color: "#fff", // رنگ دایره سفید در حالت خاموش
              "& + .MuiSwitch-track": {
                opacity: 1,
                backgroundColor: "#E0E0E0", // رنگ پس‌زمینه خاموش (خاکستری)
                borderColor: "#E0E0E0",
              }
            }
          },
          "& .MuiSwitch-thumb": {
            boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
            width: 24, // سایز دایره (کمی کوچکتر از ارتفاع هدر)
            height: 24,
            borderRadius: "50%", // دایره کامل
            margin: 2, // فاصله از اطراف
          },
          "& .MuiSwitch-track": {
            borderRadius: 28 / 2, // گرد کردن کامل ترک
            border: "1px solid", // برای نمایش حاشیه تمیز
            borderColor: "#E0E0E0",
            boxSizing: "border-box",
          },
        },
      },
    },

    // Checkboxes: Custom Square with rounded corners
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: "#90A4AE",
          borderRadius: 4,
          "&.Mui-checked": {
            color: "#000",
          },
          "&:hover": {
            backgroundColor: alpha("#000", 0.04),
          },
        },
      },
    },

    // --- Sidebar Item Styling ---
    MuiListItemButton: {
      styleOverrides: {
        root: {
          direction: "rtl",
          borderRadius: "12px",
          margin: "4px 12px",
          padding: "12px 16px",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            backgroundColor: alpha("#000", 0.08),
          },
          "& .MuiListItemIcon-root": {
            color: "#78909C",
            minWidth: "44px",
            transition: "color 0.3s",
            order: 0,
            marginLeft: "8px",
            marginRight: 0,
          },
          "& .MuiListItemText-root": {
            order: 1,
            textAlign: "right",
            margin: 0,
          },
          "& .MuiListItemText-primary": {
            fontWeight: 600,
          },
          "&.Mui-selected": {
            backgroundColor: "#000",
            color: "#FFFFFF",
            boxShadow: "0 4px 12px rgba(0, 137, 123, 0.3)",
            "&:hover": {
              backgroundColor: "#00695C",
              filter: "brightness(110%)",
            },
            "& .MuiListItemIcon-root": {
              color: "#FFFFFF",
            },
            "& .MuiListItemText-primary": {
              fontWeight: 800,
            },
          },
        },
      },
    },

    // --- Cards & Paper ---
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          borderRadius: "16px",
          boxShadow: "0 2px 14px rgba(0, 0, 0, 0.03)",
          border: "1px solid rgba(0,0,0,0.02)",
        },
      },
    },

    // --- Buttons ---
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: "8px",
          fontWeight: 600,
          padding: "10px 24px",
          boxShadow: "none",
          "&:hover": {
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            transform: "translateY(-1px)",
          },
          "&.Mui-disabled": {
            opacity: 0.5,
          },
        },
        containedPrimary: {
          background: "linear-gradient(135deg, #000 0%, #00695C 100%)",
          "&.Mui-disabled": {
            background: "linear-gradient(135deg, #000 0%, #00695C 100%)",
            color: "#FFFFFF",
            opacity: 0.5,
          },
        },
      },
    },

    // --- Inputs ---
    MuiFormControl: {
      styleOverrides: {
        root: {
          marginBottom: "16px",
        }
      }
    },
    MuiFilledInput: {
      styleOverrides: {
        root: {
          backgroundColor: "#F5F7FA",
          borderRadius: "8px",
          "&:hover": {
            backgroundColor: "#EEEEEE",
          },
          "&.Mui-focused": {
            backgroundColor: "#FFFFFF",
            boxShadow: "0 0 0 2px #B2DFDB",
          },
        },
      },
    },
  },

  // --- Typography ---
  typography: {
    ...houseLightTheme.typography,
    fontFamily: '"IRANSansX", "Vazirmatn", "Tahoma", sans-serif',
    h4: {
      fontSize: "2rem",
      fontWeight: 700,
      color: '#263238',
      marginBottom: "24px",
    },
    h6: {
      fontWeight: 600,
      color: '#455A64',
      fontSize: "1.1rem",
    },
    body1: {
      direction: 'rtl',
      textAlign: 'right',
      fontSize: "0.95rem",
      lineHeight: 1.6,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
});

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Admin
      disableTelemetry
      requireAuth
      loginPage={LoginPage}
      authProvider={authProvider}
      dataProvider={dataProvider}
      i18nProvider={i18nProvider}
      theme={theme}
      layout={CustomLayout}
    >
      <CustomRoutes>
        <Route path="/import_users" element={<ImportFeature />} />
      </CustomRoutes>
      <Resource {...users} />
      <Resource {...rooms} />
      <Resource {...userMediaStats} />
      <Resource {...reports} />
      {/* <Resource {...roomDirectory} /> */}
      <Resource {...destinations} />
      <Resource {...registrationToken} />
      <Resource {...uploadPolicy} />
      <Resource {...groupCreationResource} />
      <Resource {...channelCreationResource} />
      <Resource {...broadcastSendResource} />
      <Resource {...broadcastBirthdayToggleResource} />
      <Resource {...broadcastBirthdayTemplateResource} />
      <Resource {...broadcastBirthdayTodayResource} />
      <Resource {...broadcastBirthdayRecipientsResource} />
      <Resource {...broadcastLogsResource} />
      <Resource {...broadcastStatsResource} />
      <Resource {...roles} />
      <Resource name="connections" />
      <Resource name="devices" />
      <Resource name="room_members" />
      <Resource name="users_media" />
      <Resource name="joined_rooms" />
      <Resource name="pushers" />
      <Resource name="servernotices" />
      <Resource name="forward_extremities" />
      <Resource name="room_state" />
      <Resource name="destination_rooms" />
    </Admin>
  </QueryClientProvider>
);

export default App;
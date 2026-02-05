import React from "react";

import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { createRoot } from "react-dom/client";
import { prefixer } from "stylis";
import rtlPlugin from "stylis-plugin-rtl";

import App from "./App";
import "./styles/global-font.css";
import { AppContext } from "./AppContext";

const rtlCache = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer],
});

const baseUrl = import.meta.env.BASE_URL;
const configJSON = "config.json";
// if import.meta.env.BASE_URL have a trailing slash, remove it
// load config.json from relative path if import.meta.env.BASE_URL is None or empty
const configJSONUrl = baseUrl ? `${baseUrl.replace(/\/$/, "")}/${configJSON}` : configJSON;

fetch(configJSONUrl)
  .then(res => res.json())
  .then(props =>
    createRoot(document.getElementById("root")).render(
      <React.StrictMode>
        <CacheProvider value={rtlCache}>
          <AppContext.Provider value={props}>
            <App />
          </AppContext.Provider>
        </CacheProvider>
      </React.StrictMode>
    )
  );

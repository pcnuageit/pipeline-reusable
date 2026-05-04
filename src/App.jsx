import { MuiThemeProvider } from "@material-ui/core";
import React from "react";
import MetaTags from "react-meta-tags";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import { APP_CONFIG } from "./constants/config";
import Root from "./pages/Root";
import store from "./store";
import { theme } from "./theme/theme";

const App = () => {
  return (
    <Provider store={store}>
      <MetaTags>
        <title>{APP_CONFIG.name}</title>
        <meta name="description" content={APP_CONFIG.description} />
        <link rel="shortcut icon" href={APP_CONFIG.assets.favicon} />
      </MetaTags>
      <MuiThemeProvider theme={{ ...theme }}>
        <Root />
        <ToastContainer autoClose={3000} />
      </MuiThemeProvider>
    </Provider>
  );
};

export default App;

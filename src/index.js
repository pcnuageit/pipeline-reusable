import { datadogLogs } from "@datadog/browser-logs";
import { datadogRum } from "@datadog/browser-rum";
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { APP_CONFIG } from "./constants/config";

datadogRum.init({
  applicationId: APP_CONFIG.datadog.application_id,
  clientToken: APP_CONFIG.datadog.client_token,
  site: "datadoghq.com",
  //  service: 'my-web-application',
  //  env: 'production',
  //  version: '1.0.0',
  sessionSampleRate: 100,
  sessionReplaySampleRate: 100,
  trackResources: true,
  trackLongTasks: true,
  trackUserInteractions: true,
});

datadogLogs.init({
  clientToken: APP_CONFIG.datadog.client_token,
  site: "datadoghq.com",
  forwardErrorsToLogs: true,
  sessionSampleRate: 100,
});

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

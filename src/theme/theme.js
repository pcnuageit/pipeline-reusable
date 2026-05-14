import { createMuiTheme } from "@material-ui/core";
import { APP_CONFIG } from "../constants/config";

export const theme = createMuiTheme(APP_CONFIG.theme);

export const cssVariables = APP_CONFIG.cssVariables;

import { StrictMode } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import App from "./Chat/Chat";
import Welcome from "./Welcome";
import Login from "./User/Login";
import Logout from "./User/Logout";
import Signup from "./User/Signup";
import UserInfo from "./User/Info";
import Forbidden from "./Error/403";
import NotFound from "./Error/404";

import { ThemeProvider, createTheme } from "@material-ui/core/styles";
import { useSnackbar, SnackbarProvider } from "notistack";
import { blue, teal } from "@material-ui/core/colors";

//useEffect(() => {
if (!localStorage.recentRoom) {
	localStorage.recentRoom = '{"rooms": []}';
}
//setRecentRoom(JSON.parse(localStorage.recentRoom));
//}, [localStorage.recentRoom]);

const prefersDarkMode = window.matchMedia(
	"(prefers-color-scheme: dark)"
).matches;

const theme = createTheme({
	palette: {
		type: prefersDarkMode ? "dark" : "light",
		primary: blue,
		secondary: teal
	}
});

const rootElement = document.getElementById("root");
ReactDOM.render(
	<StrictMode>
		<ThemeProvider theme={theme}>
			<SnackbarProvider maxSnack={5} autoHideDuration={3000}>
				<Router>
					<Switch>
						<Route path="/" exact component={Welcome} />
						<Route path="/user/login" component={Login} />
						<Route path="/user/logout" component={Logout} />
						<Route path="/user/info" component={UserInfo} />
						<Route path="/user/signup" component={Signup} />
						<Route path="/chat/:room" component={App} />
						<Route path="/error/404" component={NotFound} />
						<Route path="/error/403" component={Forbidden} />
						<Route path="*" component={NotFound} />
					</Switch>
				</Router>
			</SnackbarProvider>
		</ThemeProvider>
	</StrictMode>,
	rootElement
);

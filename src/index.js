import { StrictMode } from "react";
import ReactDOM from "react-dom";
import { HashRouter as Router, Route, Switch } from "react-router-dom";

import App from "./App";
import Welcome from "./Welcome";
import Login from "./Login";
import Signup from "./Signup";
import NotFound from "./404";

import { ThemeProvider, createTheme } from "@material-ui/core/styles";
import { blue, teal } from "@material-ui/core/colors";

//useEffect(() => {
if (!localStorage.recentRoom) {
	localStorage.recentRoom = '{"rooms": []}';
}
//setRecentRoom(JSON.parse(localStorage.recentRoom));
//}, [localStorage.recentRoom]);

const theme = createTheme({
	palette: {
		type: "dark",
		primary: blue,
		secondary: teal
	}
});

const rootElement = document.getElementById("root");
ReactDOM.render(
	<StrictMode>
		<ThemeProvider theme={theme}>
			<Router>
				<Switch>
					<Route path="/" exact component={Welcome} />
					<Route path="/user/login" component={Login} />
					<Route path="/user/signup" component={Signup} />
					<Route path="/chat/:room" component={App} />
					<Route path="*" component={NotFound} />
				</Switch>
			</Router>
		</ThemeProvider>
	</StrictMode>,
	rootElement
);

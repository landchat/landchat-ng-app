import lc_config from "./config";
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
	AppBar,
	Toolbar,
	Typography,
	ThemeProvider,
	CssBaseline,
	Container,
	IconButton,
	FormControl,
	TextField,
	Button
} from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import HomeIcon from "@material-ui/icons/Home";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
	root: {
		position: "fixed",
		bottom: theme.spacing(2),
		right: theme.spacing(2)
	},
	menuButton: {
		marginRight: theme.spacing(2)
	},
	title: {
		flexGrow: 1
	},
	link: {
		color: "hsla(0,0%,100%,.87)",
		textDecoration: "none",
		"&:hover": {
			textDecoration: "underline"
		}
	}
}));

export default function Welcome(props) {
	const classes = useStyles();
	const theme = useTheme();

	const [login, setLogin] = useState(0);

	function getCookie(cname) {
		var name = cname + "=";
		var ca = document.cookie.split(";");
		for (var i = 0; i < ca.length; i++) {
			var c = ca[i].trim();
			if (c.indexOf(name) === 0)
				return c.substring(name.length, c.length);
		}
		return "";
	}

	useEffect(() => {
		if (typeof Storage === "undefined") {
			alert(
				"You have to enable Local Storage of your browser to run this application. If you can't do it, please update your browser to Chrome 4.0+, MS Edge 8.0+, Firefox 3.5+, Safari 4.0+ or Opera 11.5+."
			);
			console.error(
				"You have to enable Local Storage of your browser to run this application. If you can't do it, please update your browser to Chrome 4.0+, MS Edge 8.0+, Firefox 3.5+, Safari 4.0+ or Opera 11.5+."
			);
		}
		if (getCookie("lc_debug").indexOf("DEBUG") != -1) {
			setLogin(1);
		}
	});

	return (
		<React.Fragment>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<AppBar position="sticky">
					<Toolbar>
						<IconButton
							edge="start"
							className={classes.menuButton}
							color="inherit"
							aria-label="menu"
							onClick={() => {
								window.location.hash = "/";
							}}
						>
							<HomeIcon />
						</IconButton>
						<Typography variant="h5">{lc_config.title}</Typography>
					</Toolbar>
				</AppBar>
				<Toolbar id="back-to-top-anchor" />
				<Container>
					<Typography variant="h3" component="h1">
						Welcome to LandChat!
					</Typography>
					<br />
					<div id="roomselect">
						<Typography variant="body1" component="p">
							Enter the name of the room you want to join:
						</Typography>
						<br />
						<div>
							<FormControl variant="outlined">
								<TextField
									type="text"
									id="roomselect-input"
									label="Room name"
									name="roomname"
									variant="outlined"
									required
								/>
								<Button
									variant="contained"
									color="primary"
									onClick={function () {
										let roomname =
											document.querySelector(
												"#roomselect-input"
											).value;
										if (roomname !== "") {
											window.location.hash =
												"/chat/" +
												encodeURIComponent(roomname);
											let rrobject = JSON.parse(
												localStorage.recentRoom
											);
											if (rrobject.rooms.length >= 5) {
												rrobject.rooms.shift();
											}
											let date = new Date();
											rrobject.rooms[
												rrobject.rooms.length
											] = {
												name: roomname,
												date:
													/*date.getFullYear() + "-" + */ date.getMonth() +
													1 +
													"-" +
													date.getDate() +
													" " +
													date.getHours() +
													":" +
													date.getMinutes()
											};
											localStorage.recentRoom =
												JSON.stringify(rrobject);
											return false;
										}
									}}
								>
									Join
								</Button>
							</FormControl>
						</div>
					</div>
					<div style={{ display: login ? "none" : "block" }}>
						<br />
						<Typography variant="body1">
							You haven't logged in yet. Please&nbsp;
							<Link to="/user/login" className={classes.link}>
								click here
							</Link>
							&nbsp;to login or sign up first.
							<br />
						</Typography>
					</div>
					<div>
						<br />
						<Typography variant="body2">
							Powered by{" "}
							<a
								href="https://github.com/landchat/landchat-ng-app.git"
								target="_blank"
								className={classes.link}
							>
								LandChat-NG-App
							</a>{" "}
							{lc_config.version}
						</Typography>
					</div>
				</Container>
			</ThemeProvider>
		</React.Fragment>
	);
}

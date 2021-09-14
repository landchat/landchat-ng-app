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
	Drawer,
	ListItemIcon,
	Button,
	List,
	ListItemText,
	ListItem,
	Divider
} from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import MenuIcon from "@material-ui/icons/Menu";
import HomeIcon from "@material-ui/icons/Home";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import ChatIcon from "@material-ui/icons/Chat";
import { Link, useHistory } from "react-router-dom";

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
	},
	appBar: {
		zIndex: theme.zIndex.drawer + 1
	},
	drawer: {
		width: 300,
		flexShrink: 0
	},
	drawerPaper: {
		width: 300
	},
	drawerContainer: {
		overflow: "auto"
	}
}));
function LeftBar(props) {
	const classes = useStyles();
	const history = useHistory();
	const [uname, setUname] = useState("");

	function avatarColor(name) {
		var str = "";
		for (var i = 0; i < name.length; i++) {
			str += parseInt(name[i].charCodeAt(0), 10).toString(16);
		}
		return "#" + str.slice(1, 4);
	}
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
	function getUserName(uid) {
		fetch(lc_config.endpoint + "/user_id2info", {
			method: "POST",
			body: "id=" + encodeURIComponent(uid),
			headers: new Headers({
				"Content-Type": "application/x-www-form-urlencoded"
			})
		})
			.then((res) => res.json())
			.catch((error) => {
				setUname("");
			})
			.then((response) => {
				setUname(", " + response.name);
			});
	}
	useEffect(() => {
		if (getCookie("lc_uid") !== "") {
			getUserName(getCookie("lc_uid"));
		}
	});

	return (
		<React.Fragment>
			<div className={classes.drawerContainer}>
				<List>
					<ListItem
						button
						onClick={() => {
							history.push("/");
						}}
					>
						<ListItemIcon>
							<HomeIcon />
						</ListItemIcon>
						<ListItemText primary="Home" />
					</ListItem>
					<div
						style={{
							display:
								getCookie("lc_uid") === "" ? "block" : "none"
						}}
					>
						<Divider />
						<ListItem
							button
							onClick={() => {
								history.push("/user/login");
							}}
						>
							<ListItemIcon>
								<ExitToAppIcon />
							</ListItemIcon>
							<ListItemText primary="Login" />
						</ListItem>
					</div>
					<div
						style={{
							display:
								getCookie("lc_uid") !== "" ? "block" : "none"
						}}
					>
						<Divider />
						<ListItem
							button
							onClick={() => {
								history.push("/user/info");
							}}
						>
							<ListItemIcon>
								<AccountCircleIcon />
							</ListItemIcon>
							<ListItemText primary="Update profile" />
						</ListItem>
						<ListItem
							button
							onClick={() => {
								history.push("/user/logout");
							}}
						>
							<ListItemIcon>
								<ExitToAppIcon />
							</ListItemIcon>
							<ListItemText primary="Logout" />
						</ListItem>
					</div>
					<Divider />
					<ListItem
						button
						onClick={() => {
							history.push("/chat/welcome");
						}}
					>
						<ListItemIcon>
							<ChatIcon />
						</ListItemIcon>
						<ListItemText primary="Chat" />
					</ListItem>
				</List>
			</div>
		</React.Fragment>
	);
}

export default function Welcome(props) {
	const classes = useStyles();
	const theme = useTheme();
	const history = useHistory();

	const [login, setLogin] = useState(0);
	const [uname, setUname] = useState("");

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

	function getUserName(uid) {
		fetch(lc_config.endpoint + "/user_id2info", {
			method: "POST",
			body: "id=" + encodeURIComponent(uid),
			headers: new Headers({
				"Content-Type": "application/x-www-form-urlencoded"
			})
		})
			.then((res) => res.json())
			.catch((error) => {
				setUname("");
			})
			.then((response) => {
				if ("name" in response) {
					setUname(", " + response.name);
				} else {
					setUname("");
				}
			});
	}
	const [dropen, setDropen] = React.useState(false);
	const handleDrawerOpen = () => {
		setDropen(true);
	};
	const handleDrawerClose = () => {
		setDropen(false);
	};
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
		if (getCookie("lc_uid") !== "") {
			getUserName(getCookie("lc_uid"));
		}
	});

	return (
		<React.Fragment>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<AppBar position="sticky" className={classes.appBar}>
					<Toolbar>
						<IconButton
							edge="start"
							className={classes.menuButton}
							color="inherit"
							aria-label="menu"
							onClick={handleDrawerOpen}
						>
							<MenuIcon />
						</IconButton>
						<Typography variant="h5">{lc_config.title}</Typography>
					</Toolbar>
				</AppBar>
				<Drawer
					className={classes.drawer}
					classes={{ paper: classes.drawerPaper }}
					anchor="left"
					open={dropen}
					onClose={handleDrawerClose}
					onClick={handleDrawerClose}
				>
					<LeftBar />
				</Drawer>
				<Toolbar id="back-to-top-anchor" />
				<Container>
					<Typography variant="body1" component="p">
						Hello{uname}!
					</Typography>
					<Typography variant="h4" component="h1">
						Welcome to LandChat!
					</Typography>
					<br />
					<div id="chat-start">
						<div>
							<FormControl variant="outlined">
								<Button
									variant="contained"
									color="primary"
									onClick={() => {
										history.push("/chat/welcome");
									}}
								>
									Start Chatting
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

import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
	AppBar,
	Toolbar,
	Typography,
	Container,
	Fab,
	useScrollTrigger,
	CssBaseline,
	Zoom,
	IconButton,
	List,
	ListItem,
	ListItemText,
	ListItemAvatar,
	Avatar,
	Divider,
	ThemeProvider,
	LinearProgress,
	TextField,
	Button
} from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import MenuIcon from "@material-ui/icons/Menu";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import swal from "sweetalert";

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
	}
}));

function ChatView(props) {
	const { endpoint, chatroom } = props;
	const [msgs, setMsgs] = useState(JSON.parse("[]"));
	const [load, setLoad] = useState(1);

	function updateMsg(content) {
		try {
			setMsgs(content);
		} catch (e) {
			swal("Oops", "Failed to fetch message.", "error");
		}
		setLoad(0);
	}
	function loadRoom() {
		setLoad(1);
		fetch(endpoint + "viewjson.php", {
			method: "POST",
			body: "room=" + encodeURI(chatroom),
			headers: new Headers({
				"Content-Type": "application/x-www-form-urlencoded"
			})
		})
			.then((res) => res.json())
			.catch((error) => swal("Oops", "Fetch failed: " + error, "error"))
			.then((response) => updateMsg(response))
			.then(
				setTimeout(function () {
					loadRoom();
				}, 5000)
			);
	}

	useEffect(() => {
		loadRoom();
	}, [chatroom]);

	return (
		<div>
			<LinearProgress style={{ display: load ? "block" : "none" }} />
			<List>
				{msgs.map((v, index) => {
					return <MsgView key={index} data={v}></MsgView>;
				})}
			</List>
		</div>
	);
}

function ChatForm(props) {
	const { endpoint, chatroom } = props;
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
	function sendHandler() {
		let msgValue = document.querySelector("#msginput-textarea").value;
		document.querySelector("#msginput-textarea").value = "";
		fetch(endpoint + "addmsg.php", {
			method: "POST",
			body:
				"room=" +
				encodeURI(chatroom) +
				"&id=" +
				encodeURI(getCookie("lc_uid")) +
				"&pwd=" +
				encodeURI(getCookie("lc_passw")) +
				"&app_id=aI5qE5eL0gH1bD1pQ5tC1dC0cD0bF1&msg=" +
				encodeURI(msgValue),
			headers: new Headers({
				"Content-Type": "application/x-www-form-urlencoded"
			})
		})
			.then((res) => res)
			.catch((error) => swal("Oops", "Fetch failed:" + error, "error"));
	}
	function sendKeyHandler(e) {
		if (e.keyCode === 13 && e.ctrlKey) {
			//sendHandler();
		}
	}
	document.addEventListener("keydown", sendKeyHandler);

	return (
		<div>
			<form id="msginput-form">
				<TextField
					id="msginput-textarea"
					label="Input Message"
					placeholder="Press Ctrl+Space to send"
					multiline
					margin="normal"
					fullWidth
					variant="filled"
				/>
				<Button
					variant="contained"
					color="primary"
					onClick={sendHandler}
				>
					Send
				</Button>
			</form>
		</div>
	);
}

function SideView(props) {
	return (
		<List>
			<ListItem>
				<ListItemAvatar>
					<Avatar>
						<AccountCircleIcon />
					</Avatar>
				</ListItemAvatar>
				<ListItemText primary="LandChat" secondary="Jan 9, 2014" />
			</ListItem>
		</List>
	);
}

function MsgView(props) {
	const { data } = props;
	const classes = useStyles();
	return (
		<div>
			<ListItem alignItems="flex-start">
				<ListItemAvatar>
					<Avatar
						alt=""
						src="https://i.loli.net/2020/09/12/Co5Kxh26J9rbW4j.jpg"
					/>
				</ListItemAvatar>
				<ListItemText
					primary={data.uid}
					secondary={
						<React.Fragment>
							<Typography
								component="span"
								variant="body2"
								color="textPrimary"
							>
								{data.content}
								<br />
							</Typography>
							{data.time}
						</React.Fragment>
					}
				/>
			</ListItem>
			<Divider variant="inset" component="li" />
		</div>
	);
}

function ScrollBtn(props) {
	const { children, window, direction } = props;
	const classes = useStyles();
	var tri = useScrollTrigger({
		target: window ? window() : undefined,
		disableHysteresis: true,
		threshold: 350
	});
	if (direction === "back") {
	    tri = !tri;
	}
	const trigger = tri;

	const handleClick = (event) => {
		const anchor = (event.target.ownerDocument || document).querySelector(
			(direction == "back" ? "#top-to-back-anchor" : "#back-to-top-anchor")
		);

		if (anchor) {
			anchor.scrollIntoView({ behavior: "smooth", block: "center" });
		}
	};

	return (
		<Zoom in={trigger}>
			<div
				onClick={handleClick}
				role="presentation"
				className={classes.root}
			>
				{children}
			</div>
		</Zoom>
	);
}

ScrollBtn.propTypes = {
	children: PropTypes.element.isRequired,
	window: PropTypes.func
};

export default function App(props) {
	const classes = useStyles();
	const theme = useTheme();
	useEffect(() => {
		const anchor = document.querySelector(
			"#top-to-back-anchor"
		);

		if (anchor) {
			anchor.scrollIntoView({ behavior: "smooth", block: "center" });
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
						>
							<MenuIcon />
						</IconButton>
						<Typography variant="h5">LandChat 2021</Typography>
					</Toolbar>
				</AppBar>
			    <Toolbar id="back-to-top-anchor" />
				<Container>
					<ChatView {...props} chatroom="" />
					<ChatForm {...props} chatroom="" />
				    <Toolbar id="top-to-back-anchor" />
				</Container>
				<ScrollBtn direction="top" {...props}>
					<Fab
						color="secondary"
						size="small"
						aria-label="scroll back to top"
					>
						<KeyboardArrowUpIcon />
					</Fab>
				</ScrollBtn>
				<ScrollBtn direction="back" {...props}>
					<Fab
						color="secondary"
						size="small"
						aria-label="scroll to bottom"
					>
						<KeyboardArrowDownIcon />
					</Fab>
				</ScrollBtn>
			</ThemeProvider>
		</React.Fragment>
	);
}
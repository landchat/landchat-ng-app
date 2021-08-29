import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
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
	Button,
	Drawer,
	ListItemIcon,
} from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import HomeIcon from "@material-ui/icons/Home";
import MenuIcon from "@material-ui/icons/Menu";
import { SnackbarProvider, useSnackbar } from "notistack";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
	root: {
		display: "flex",
		position: "fixed",
		bottom: theme.spacing(2),
		right: theme.spacing(2),
	},
	menuButton: {
		marginRight: theme.spacing(2),
	},
	title: {
		flexGrow: 1,
	},
	chatForm: {},
	appBar: {
		zIndex: theme.zIndex.drawer + 1,
	},
	drawer: {
		width: 300,
		flexShrink: 0,
	},
	drawerPaper: {
		width: 300,
	},
	drawerContainer: {
		overflow: "auto",
	},
	content: {
		flexGrow: 1,
		padding: theme.spacing(3),
	},
}));

function ChatView(props) {
	const { endpoint, chatroom } = props;
	const [msgs, setMsgs] = useState({ messages: [], timestamp: 0 });
	const [load, setLoad] = useState(0);
	const [timeo, setTimeo] = useState(-1);
	const { enqueueSnackbar } = useSnackbar();

	const handleInform = function (words, variant) {
		enqueueSnackbar(words, { variant });
	};

	function updateMsg(content, firsttime) {
		try {
			//setMsgs(msgs);
			if (content.messages.length > 0) {
			    sessionStorage.lastid = content.messages[content.messages.length-1].msgid;
			}
			if (firsttime) {
			    setMsgs(content);
			} else {
			    setMsgs(function(rmsgs) { rmsgs.messages = rmsgs.messages.concat(content.messages); return rmsgs; });
			}
			if (firsttime !== 0) {
				const anchor = document.querySelector("#top-to-back-anchor");
				if (anchor) {
					anchor.scrollIntoView({ behavior: "smooth", block: "center" });
				}
				handleInform("Welcome to chatroom: " + chatroom, "success");
				if (content.length < 1) {
					handleInform(
						"This chatroom doesn't exist.\nSend a message to create it.",
						"info"
					);
				}
			}
		} catch (e) {
			handleInform("Failed to decode message: " + e, "error");
		}
		setLoad(0);
	}
	function loadRoom(firsttime) {
	    var lastid;
	    if (firsttime || !(sessionStorage.lastid)) {
	        lastid = -1;
	    } else {
	        lastid = sessionStorage.lastid;
	    }
		setLoad(1);
	    
		fetch(endpoint + "/message_view", {
			method: "POST",
			body: "room=" + encodeURIComponent(chatroom) + "&lastid=" + encodeURIComponent(lastid),
			headers: new Headers({
				"Content-Type": "application/x-www-form-urlencoded",
			}),
		})
			.then((res) => res.json())
			.catch((error) => handleInform("Fetch failed: " + error, "error"))
			.then((response) => updateMsg(response, firsttime))
			.then(function () {
				setTimeo(
					setTimeout(function () {
						loadRoom(0);
					}, 2000)
				);
			});
	}

	useEffect(() => {
		if (timeo !== -1) {
			clearTimeout(timeo);
		}
		loadRoom(1);
		let rrobject = JSON.parse(localStorage.recentRoom);
		if (rrobject.rooms.length >= 5) {
			rrobject.rooms.shift();
		}
		let date = new Date();
		rrobject.rooms.unshift({
			name: chatroom,
			date:
				date.getMonth() +
				1 +
				"-" +
				date.getDate() +
				" " +
				date.getHours() +
				":" +
				date.getMinutes(),
		});
		/*
		            				        let rrobject_raw=JSON.parse(localStorage.recentRoom);
		            				        if (rrobject.rooms.length >= 5) {
		            				            rrobject.rooms.shift();
		            				        }
		            				        let date = new Date();
		            				        rrobject_raw.rooms.unshift({"name":roomname, "date":(date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes()});
		            				        var rrobject = {"rooms":[]};
		            				        rrobject.rooms = [];
		            				        for(var i = 0; i < rrobject_raw.rooms.length; i++) {
		            				            let flag = true;
		            				            for(var j = 0; j < rrobject.rooms.length; j++) {
		            				                if (rrobject_raw.rooms[i].name == rrobject.rooms[i].name) {
		            				                    flag = false;
		            				                    break;
		            				                }
		            				            }
		            				            if (flag) {
		            				                rrobject.rooms.push(rrobject_raw.rooms[i]);
		            				            }
		            				        }
		            				        */
		localStorage.recentRoom = JSON.stringify(rrobject);
	}, [chatroom]);

	return (
		<div>
			<List>
				{msgs.messages.map((v, index) => {
					return <MsgView key={v.msgid} data={v}></MsgView>;
				})}
			</List>
			<LinearProgress style={{ display: load ? "none" : "none" }} />
		</div>
	);
}

function ChatForm(props) {
	const { enqueueSnackbar } = useSnackbar();
	const { endpoint, chatroom } = props;
	function getCookie(cname) {
		var name = cname + "=";
		var ca = document.cookie.split(";");
		for (var i = 0; i < ca.length; i++) {
			var c = ca[i].trim();
			if (c.indexOf(name) === 0) return c.substring(name.length, c.length);
		}
		return "";
	}
	const handleInform = function (words, variant) {
		enqueueSnackbar(words, { variant });
	};
	function sendHandler() {
		let msgValue = document.querySelector("#msginput-textarea").value;
		fetch(endpoint + "/message_send", {
			method: "POST",
			body:
				"room=" +
				encodeURIComponent(chatroom) +
				"&id=" +
				encodeURIComponent(getCookie("lc_uid")) +
				"&pwd=" +
				encodeURIComponent(getCookie("lc_passw")) +
				"&app_id=aI5qE5eL0gH1bD1pQ5tC1dC0cD0bF1&msg=" +
				encodeURIComponent(msgValue),
			headers: new Headers({
				"Content-Type": "application/x-www-form-urlencoded",
				Accept: "text/plain",
			}),
		})
			.then((res) => res.text())
			.catch((error) => handleInform("Fetch failed: " + error, "error"))
			.then(function (response) {
				if (response !== "Succeed") {
					handleInform(response, "warning");
				} else {
					handleInform("Message sent", "success");
					document.querySelector("#msginput-textarea").value = "";
				}
			});
	}
	function sendKeyHandler(e) {
		var ev = e || window.event;
		if (ev.keyCode === 13 && ev.ctrlKey) {
			sendHandler();
		}
	}
	document.querySelector("#root").addEventListener("keydown", sendKeyHandler);

	return (
		<div>
			<form id="msginput-form">
				<Typography variant="body1">Send message at chatroom: {chatroom}</Typography>
				<TextField
					id="msginput-textarea"
					label="Input Message"
					placeholder="Press Ctrl+Space to send"
					multiline
					margin="normal"
					fullWidth
					variant="filled"
					maxLength={1500}
				/>
				<Button variant="contained" color="primary" onClick={sendHandler}>
					Send
				</Button>
			</form>
		</div>
	);
}

function MsgView(props) {
	const { data } = props;
	const classes = useStyles();

	function avatarColor(name) {
		var str = "";
		for (var i = 0; i < name.length; i++) {
			str += parseInt(name[i].charCodeAt(0), 10).toString(16);
		}
		return "#" + str.slice(1, 4);
	}
	/*
	useEffect(() => {
	    MathJax.Hub.Queue(["Typeset", MathJax.Hub, ReactDOM.findDOMNode(this)]);
	}, [data.msg]);
	*/

	return (
		<div data-msgid={data.msgid}>
			<ListItem alignItems="flex-start">
				<ListItemAvatar>
					<Avatar src={data.picurl} style={{ backgroundColor: avatarColor(data.name) }}>
						{data.name.substr(0, 2)}
					</Avatar>
				</ListItemAvatar>
				<ListItemText
					primary={data.name}
					secondary={
						<React.Fragment>
							<Typography
								component="span"
								variant="body2"
								color="textPrimary"
								style={{ whiteSpace: "pre-wrap" }}
							>
								{data.content}
								<br />
							</Typography>
							{"Sent on " + data.time + " @ " + data.app}
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
		threshold: 250,
	});
	if (direction === "back") {
		tri = !tri;
	}
	const trigger = tri;

	const handleClick = (event) => {
		const anchor = (event.target.ownerDocument || document).querySelector(
			direction == "back" ? "#top-to-back-anchor" : "#back-to-top-anchor"
		);

		if (anchor) {
			anchor.scrollIntoView({ behavior: "smooth", block: "center" });
		}
	};

	return (
		<Zoom in={trigger}>
			<div onClick={handleClick} role="presentation" className={classes.root}>
				{children}
			</div>
		</Zoom>
	);
}

ScrollBtn.propTypes = {
	children: PropTypes.element.isRequired,
	window: PropTypes.func,
};

function LeftBar(props) {
	const classes = useStyles();

	function avatarColor(name) {
		var str = "";
		for (var i = 0; i < name.length; i++) {
			str += parseInt(name[i].charCodeAt(0), 10).toString(16);
		}
		return "#" + str.slice(1, 4);
	}

	return (
		<React.Fragment>
			<div className={classes.drawerContainer}>
				<List>
					<ListItem
						button
						onClick={() => {
							window.location.hash = "/";
						}}
					>
						<ListItemIcon>
							<HomeIcon />
						</ListItemIcon>
						<ListItemText primary="Home" />
					</ListItem>
					<Divider />
					<ListItem>Recent Rooms</ListItem>
					{JSON.parse(localStorage.recentRoom).rooms.map((v, index) => {
						return (
							<ListItem
								alignItems="flex-start"
								key={index}
								button
								onClick={function () {
									let roomname = v.name;
									if (roomname !== "") {
										window.location.hash =
											"/chat/" + encodeURIComponent(roomname);
										return false;
									}
								}}
							>
								<ListItemAvatar>
									<Avatar style={{ backgroundColor: avatarColor(v.name) }}>
										{v.name.substr(0, 2)}
									</Avatar>
								</ListItemAvatar>
								<ListItemText
									primary={v.name}
									secondary={<React.Fragment>{v.date}</React.Fragment>}
								/>
							</ListItem>
						);
					})}
				</List>
			</div>
		</React.Fragment>
	);
}

export default function App(props) {
	let { room } = props.match.params;
	const classes = useStyles();
	const theme = useTheme();
	
	/*
    if ((getCookie("lc_debug") === "" || getCookie("lc_uid") === "") && window.location.hash != "/login") {
        window.location.hash = "/login";
    }
    */

	const [dropen, setDropen] = React.useState(false);
	const handleDrawerOpen = () => {
		setDropen(true);
	};
	const handleDrawerClose = () => {
		setDropen(false);
	};

	function handleDrop(e) {
		e.preventDefault();
		console.log(e.dataTransfer.files);
		return false;
	}

	useEffect(() => {
		const anchor = document.querySelector("#top-to-back-anchor");

		if (anchor) {
			anchor.scrollIntoView({ behavior: "smooth", block: "center" });
		}
		//document.querySelector("#chatarea").addEventListener("dragover", handleDrop);
	});

	return (
		<React.Fragment>
			<SnackbarProvider maxSnack={5} autoHideDuration={3000}>
				<ThemeProvider theme={theme}>
					<CssBaseline />
					<AppBar position="sticky" className={classes.appBar}>
						<Toolbar>
							<IconButton
								edge="start"
								className={classes.menuButton}
								color="inherit"
								aria-label="Home"
								onClick={handleDrawerOpen}
							>
								<MenuIcon />
							</IconButton>
							<Typography variant="h5">LandChat 2021</Typography>
						</Toolbar>
					</AppBar>
					<Toolbar id="back-to-top-anchor" />
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
					<Container id="chatarea" className={classes.content}>
						<ChatView {...props} endpoint="https://lc.hywiki.xyz/api/v1" chatroom={room} />
						<br />
						<ChatForm
							{...props}
							endpoint="https://lc.hywiki.xyz/api/v1"
							chatroom={room}
							className={classes.chatForm}
						/>
						<Toolbar id="top-to-back-anchor" />
					</Container>
					<ScrollBtn direction="back" {...props}>
						<Fab color="secondary" size="small" aria-label="scroll to bottom">
							<KeyboardArrowDownIcon />
						</Fab>
					</ScrollBtn>
					<ScrollBtn direction="top" {...props}>
						<Fab color="secondary" size="small" aria-label="scroll back to top">
							<KeyboardArrowUpIcon />
						</Fab>
					</ScrollBtn>
				</ThemeProvider>
			</SnackbarProvider>
		</React.Fragment>
	);
}

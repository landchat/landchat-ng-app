import lc_config from "../config";
import React, { useEffect, useState, useRef } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import Latex from "react-latex";
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
	CircularProgress,
	TextField,
	Button,
	Drawer,
	ListItemIcon,
	Modal,
	FormControl,
	Skeleton
} from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import AddCommentIcon from "@material-ui/icons/AddComment";
import HomeIcon from "@material-ui/icons/Home";
import MenuIcon from "@material-ui/icons/Menu";
import BackspaceIcon from "@material-ui/icons/Backspace";
import AddAPhotoIcon from "@material-ui/icons/AddAPhoto";
import { useSnackbar } from "notistack";
import { Link, useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
	root: {
		display: `flex`,
		position: `fixed`,
		bottom: theme.spacing(2),
		right: theme.spacing(2)
	},
	chatWrap: {
		minHeight: `calc(100vh)`
	},
	menuButton: {
		marginRight: theme.spacing(2)
	},
	title: {
		flexGrow: 1
	},
	appBar: {
		zIndex: theme.zIndex.drawer + 1
	},
	chatView: {
		maxHeight: `calc(100vh - 240px)` /*100vh - 64px - 24px - 128px - 24px*/,
		overflowY: `auto`,
		overflowX: `hidden`
	},
	drawer: {
		width: 300,
		flexShrink: 0
	},
	drawerPaper: {
		width: 300
	},
	drawerContainer: {
		overflow: `auto`
	},
	content: {
		flexGrow: 1,
		padding: theme.spacing(3)
	},
	imgModal: {
		position: `absolute`,
		top: `50%`,
		left: `50%`,
		transform: `translate(-50%, -50%)`,
		maxHeight: `calc(75vh)`,
		maxWidth: `calc(75vw)`
	},
	menuTitle: {
		flexGrow: 1
	},
	link: {
		color: `#9e9e9e`,
		textDecoration: "none",
		"&:hover": {
			textDecoration: "underline"
		}
	},
	chatBubble: {
		backdropFilter: `blur(5px)`,
		boxShadow: `0 8px 12px rgba(255,255,255,.3)`,
		background: `rgba(255,255,255,.5)`,
		borderRadius: 4,
		padding: 6
	}
}));

function ChatView(props) {
	const { endpoint, chatroom } = props;
	const classes = useStyles();
	const [msgs, setMsgs] = useState({ messages: [] });
	const [load, setLoad] = useState(0);
	const [timeo, setTimeo] = useState(-1);
	const { enqueueSnackbar } = useSnackbar();

	const handleInform = function (words, variant) {
		enqueueSnackbar(words, { variant });
	};

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

	function updateMsg(content, firsttime) {
		try {
			const chatviewDiv = document.getElementById("chatview");
			let oldSH = chatviewDiv.scrollHeight;
			setMsgs(content);
			if (firsttime) {
				const chatviewDiv = document.getElementById("chatview");
				chatviewDiv.scrollTop = chatviewDiv.scrollHeight;
				handleInform("Welcome to chatroom: " + chatroom, "success");
				if (content.messages.length < 1) {
					handleInform(
						"This chatroom doesn't exist.\nSend a message to create it.",
						"info"
					);
				}
			} else {
				if (chatviewDiv.scrollTop === oldSH) {
					chatviewDiv.scrollTop = chatviewDiv.scrollHeight;
				}
			}
		} catch (e) {
			console.error("Failed to decode message: " + e, "error");
		}
		setLoad(0);
	}
	function loadRoom(firsttime) {
		//alert(JSON.stringify(msgsRef.current));
		var lastid = -1;
		if (firsttime !== 0) {
			setLoad(1);
		}

		fetch(endpoint + "/message_view", {
			method: "POST",
			body:
				"room=" +
				encodeURIComponent(chatroom) +
				"&lastid=" +
				encodeURIComponent(lastid) +
				"&qwq=" +
				encodeURIComponent(getCookie("qwq")),
			headers: new Headers({
				"Content-Type": "application/x-www-form-urlencoded"
			})
		})
			.then((res) => res.json())
			.catch((error) => handleInform("Fetch failed: " + error, "error"))
			.then((response) => updateMsg(response, firsttime))
			.then(function () {
			    setTimeo(
				setTimeout(function () {
					loadRoom(0);
				}, 5000)
				);
			});
	}

	useEffect(() => {
		if (timeo !== -1) {
			clearTimeout(timeo);
		}
		loadRoom(1);
	}, [chatroom]);

	return (
		<div className={classes.chatView} id="chatview">
			<List>
				{msgs.messages.map((v, index) => {
					return <MsgView key={v.msgid} data={v}></MsgView>;
				})}
			</List>
			{/*
			<div>
				<ListItem alignItems="flex-start">
					<ListItemAvatar>
						<Avatar color="secondary">
							
						</Avatar>
					</ListItemAvatar>
			 		<ListItemText
						primary="Loading..."
						secondary={
							<React.Fragment>
								Loading...
							</React.Fragment>
						}
					/>
				</ListItem>
				<Divider variant="inset" component="li" />
			</div>
		    */}
			<LinearProgress style={{ display: load ? "block" : "none" }} />
		</div>
	);
}

function ChatForm(props) {
	const { enqueueSnackbar } = useSnackbar();
	const { endpoint, chatroom } = props;
	const [imgupl, setImgupl] = useState(0);

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
	const handleInform = function (words, variant) {
		enqueueSnackbar(words, { variant });
	};
	function sendHandler() {
		let msgValue = document.querySelector("#msginput-textarea").value;
		let msgData = new FormData();
		msgData.append("room", chatroom);
		msgData.append("id", getCookie("lc_uid"));
		msgData.append("pwd", getCookie("lc_passw"));
		msgData.append("msg", msgValue);
		msgData.append("type", 0);
		msgData.append("app_id", "aI5qE5eL0gH1bD1pQ5tC1dC0cD0bF1");
		fetch(endpoint + "/message_send", {
			method: "POST",
			body: msgData
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
	function sendPicHandler(picurl) {
		let msgData = new FormData();
		msgData.append("room", chatroom);
		msgData.append("id", getCookie("lc_uid"));
		msgData.append("pwd", getCookie("lc_passw"));
		msgData.append("msg", picurl);
		msgData.append("type", 1);
		msgData.append("app_id", "aI5qE5eL0gH1bD1pQ5tC1dC0cD0bF1");
		fetch(endpoint + "/message_send", {
			method: "POST",
			body: msgData
		})
			.then((res) => res.text())
			.catch((error) => handleInform("Fetch failed: " + error, "error"))
			.then(function (response) {
				if (response !== "Succeed") {
					handleInform(response, "warning");
				} else {
					handleInform("Message sent", "success");
				}
			});
	}
	function handlePicUpload() {
		setImgupl(1);
		var imgFiles = document.querySelector("#upload-pic").files;
		var picData = new FormData();
		picData.append("from", lc_config.title);
		picData.append("image", imgFiles[0]);

		fetch("https://pic.hywiki.xyz/api/upload", {
			method: "POST",
			body: picData
		})
			.then((res) => res.json())
			.catch((error) => handleInform("Fetch failed: " + error, "error"))
			.then(function (response) {
				if (response.code / 100 === 2) {
					//handleInform("Image uploaded!", "success");
					sendPicHandler(response.data.url);
				} else {
					handleInform(
						"Image upload failed: " + response.msg,
						"error"
					);
				}
				setImgupl(0);
			});
	}

	return (
		<div
			style={{
				display:
					getCookie("lc_uid") === "" || getCookie("lc_passw") === ""
						? "none"
						: "block"
			}}
		>
			<form id="msginput-form">
				<TextField
					id="msginput-textarea"
					label="Input Message (LaTeX supported)"
					placeholder="Press Ctrl+Enter to send"
					multiline
					margin="normal"
					fullWidth
					variant="filled"
					maxLength={1500}
					onKeyDown={sendKeyHandler}
				/>
				<Button
					variant="contained"
					color="primary"
					onClick={sendHandler}
				>
					Send
				</Button>
				<span style={{ marginLeft: 10, marginRight: 20 }}>
					Chatroom: {chatroom}
				</span>
				<input
					accept="image/*"
					id="upload-pic"
					type="file"
					style={{ display: "none" }}
					onChange={handlePicUpload}
				/>
				<label htmlFor="upload-pic">
					<IconButton
						color="primary"
						aria-label="upload picture"
						component="span"
					>
						<AddAPhotoIcon />
					</IconButton>
				</label>
				<CircularProgress
					size={20}
					style={!imgupl ? { display: "none" } : {}}
				/>
			</form>
		</div>
	);
}

function MsgView(props) {
	const { data } = props;
	const classes = useStyles();
	const [imgview, setImgview] = useState(0);
	const { enqueueSnackbar, closeSnackbar } = useSnackbar();

	const handleInform = function (words, variant) {
		return enqueueSnackbar(words, { variant });
	};
	const handleInformWithAction = function (words, variant, action) {
		return enqueueSnackbar(words, { variant, action });
	};

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

	function renderTextMsg(data) {
		return (
			<>
				<Typography
					component="span"
					variant="body2"
					color="textPrimary"
					style={{ whiteSpace: "pre-wrap" }}
				>
					<Latex>{data.content}</Latex>
					<br />
				</Typography>
			</>
		);
	}

	function renderPicMsg(data) {
		return (
			<React.Fragment>
				<img
					src={data.content}
					height={100}
					alt={data.content}
					style={{ maxHeight: 100 }}
					onClick={() => setImgview(1)}
				/>
				<br />
			</React.Fragment>
		);
	}

	function renderMsg(data) {
		switch (data.type) {
			case 0:
				return renderTextMsg(data);
			case 1:
				return renderPicMsg(data);
			default:
				return <React.Fragment>???</React.Fragment>;
		}
	}

	var closeSBid = -1;

	function handleRecall() {
		var msgid = data.msgid;
		closeSnackbar(closeSBid);
		var rmData = new FormData();
		rmData.append("id", getCookie("lc_uid"));
		rmData.append("pwd", getCookie("lc_passw"));
		rmData.append("msgid", msgid);
		fetch(lc_config.endpoint + "/message_recall", {
			method: "POST",
			body: rmData
		})
			.then((res) => res.json())
			.catch((error) => {
				handleInform("Recall error: " + error, "error");
			})
			.then((response) => {
				if (response.result / 100 === 2) {
					handleInform(response.msg, "success");
				} else {
					handleInform(response.msg, "error");
				}
			});
	}

	function handleRecallBtn() {
		closeSBid = handleInformWithAction(
			"Sure to recall message " + data.msgid + "?",
			"warning",
			<Button onClick={handleRecall}>Yes</Button>
		);
	}

	return (
		<React.Fragment>
			<Modal
				open={imgview}
				onClose={() => setImgview(0)}
				onClick={() => setImgview(0)}
				aria-labelledby={"Image: " + data.content}
				aria-describedby={"Uploaded by: " + data.name}
			>
				<img
					src={data.content}
					alt={data.content}
					className={classes.imgModal}
				/>
			</Modal>
			<div data-msgid={data.msgid}>
				<ListItem alignItems="flex-start">
					<ListItemAvatar>
						<Avatar src={data.picurl} color="secondary">
							{data.name.substr(0, 2)}
						</Avatar>
					</ListItemAvatar>
					<ListItemText
						style={
							getCookie("lc_uid") === data.uid
								? { textAlign: "right" }
								: { textAlign: "left" }
						}
						primary={data.name}
						secondary={
							<React.Fragment>
								{renderMsg(data)}
								{data.time /* + " @ " + data.app*/ + " "}
								<a
									style={
										getCookie("lc_uid") === data.uid
											? {}
											: { display: "none" }
									}
									href="#"
									onClick={handleRecallBtn}
									className={classes.link}
								>
								&nbsp;|&nbsp;<BackspaceIcon style={{ fontSize: 12 }} />
									&nbsp;Recall
								</a>
							</React.Fragment>
						}
					/>
				</ListItem>
				<Divider variant="inset" component="li" />
			</div>
		</React.Fragment>
	);
}

function LeftBar(props) {
	const classes = useStyles();
	const history = useHistory();
	const [uname, setUname] = useState("");
	const [roomall, setRoomall] = useState([]);

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
		fetch(lc_config.endpoint + "/rooms_all", {
			method: "GET"
		})
			.then((res) => res.json())
			.catch((error) => alert("Sidebar failed: " + error, "error"))
			.then((response) => setRoomall(response));
		if (getCookie("lc_uid") !== "") {
			getUserName(getCookie("lc_uid"));
		}
	}, []);

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
					<Divider />
					<ListItem>Hello{uname}!</ListItem>
					<Divider />
					<ListItem>Create/Join a room</ListItem>
					<FormControl variant="outlined" style={{ marginLeft: 15 }}>
						<TextField
							type="text"
							id="roomselect-input"
							label="Room name"
							name="roomname"
							variant="outlined"
							required
							onClick={(e) => {
								e.stopPropagation();
							}}
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
									history.push(
										"/chat/" + encodeURIComponent(roomname)
									);
									return false;
								}
							}}
						>
							Join
						</Button>
					</FormControl>
					<Divider />
					<ListItem>New Rooms</ListItem>
					{roomall.map((v, index) => {
						return (
							<ListItem
								alignItems="flex-start"
								key={v}
								button
								onClick={function () {
									let roomname = v;
									if (roomname !== "") {
										history.push(
											"/chat/" +
												encodeURIComponent(roomname)
										);
										return false;
									}
								}}
							>
								<ListItemAvatar>
									<Avatar color="secondary">
										{v.substr(0, 2)}
									</Avatar>
								</ListItemAvatar>
								<ListItemText primary={v} />
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
		const chatviewDiv = document.getElementById("chatview");
		chatviewDiv.scrollTop = chatviewDiv.scrollHeight;
	});

	return (
		<React.Fragment>
			<ThemeProvider theme={theme}>
				<div className={classes.chatWrap}>
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
							<Typography
								variant="h5"
								className={classes.menuTitle}
							>
								{lc_config.title}
							</Typography>
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
					<Container id="chatarea" className={classes.content}>
						<ChatView
							{...props}
							endpoint={lc_config.endpoint}
							chatroom={room}
						/>
						<ChatForm
							{...props}
							endpoint={lc_config.endpoint}
							chatroom={room}
						/>
					</Container>
				</div>
			</ThemeProvider>
		</React.Fragment>
	);
}

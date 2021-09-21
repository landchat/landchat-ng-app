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
	FormControl
} from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import HomeIcon from "@material-ui/icons/Home";
import MenuIcon from "@material-ui/icons/Menu";
import ImageIcon from "@material-ui/icons/Image";
import { useSnackbar } from "notistack";
import { Link, useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
	root: {
		display: "flex",
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
	chatForm: {},
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
			if (firsttime) {
				setMsgs(content);
			} else {
				setMsgs((rmsgs) => {
					rmsgs.messages = rmsgs.messages.concat(content.messages);
					return rmsgs;
				});
			}
			if (firsttime !== 0) {
				const anchor = document.querySelector("#top-to-back-anchor");
				if (anchor) {
					anchor.scrollIntoView({
						behavior: "smooth",
						block: "center"
					});
				}
				handleInform("Welcome to chatroom: " + chatroom, "success");
				if (content.messages.length < 1) {
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
		//alert(JSON.stringify(msgsRef.current));
		var lastid = -1;
		if (msgsRef.current.messages.length > 0) {
			lastid =
				msgsRef.current.messages[msgsRef.current.messages.length - 1]
					.msgid;
		}
		setLoad(1);

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
				alert(JSON.stringify(msgsRef.current));
				setTimeo(
					setTimeout(function () {
						loadRoom(0);
					}, 3000)
				);
			});
	}

	useEffect(() => {
		if (timeo !== -1) {
			if (clearTimeout(timeo)) {
				alert("Timeout cleared: " + timeo);
			}
		}
		loadRoom(1);
	}, [chatroom]);

	const msgsRef = useRef(msgs);

	useEffect(() => {
		msgsRef.current = msgs;
	}, [msgs]);

	return (
		<div>
			<List>
				{msgs.messages.map((v, index) => {
					return <MsgView key={v.msgid} data={v}></MsgView>;
				})}
			</List>
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
				<Typography variant="body1">
					Send message at chatroom: {chatroom}
				</Typography>
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
						<ImageIcon />
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

	function avatarColor(name) {
		var str = "";
		for (var i = 0; i < name.length; i++) {
			str += parseInt(name[i].charCodeAt(0), 10).toString(16);
		}
		return "#" + str.slice(1, 4);
		/*
		var colorCode = str.slice(1, 4);
		var colorCode_Light = "";
		for (var i = 0; i < colorCode.length; i++) {
		    console.log("ccl: i=" + i + " cc[i]=" + colorCode[i] + " ccl[i]=" + Math.floor(parseInt(colorCode[i].charCodeAt(0), 16)));
		    colorCode_Light += (15 - Math.floor(parseInt(colorCode[i].charCodeAt(0), 16) / 2)).toString(16);
		}
		return "#" + colorCode_Light;
		*/
	}
	/*
	useEffect(() => {
	    MathJax.Hub.Queue(["Typeset", MathJax.Hub, ReactDOM.findDOMNode(this)]);
	}, [data.msg]);
	*/

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
						<Avatar
							src={data.picurl}
							style={{ backgroundColor: avatarColor(data.name) }}
						>
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
								{data.time + " @ " + data.app}
							</React.Fragment>
						}
					/>
				</ListItem>
				<Divider variant="inset" component="li" />
			</div>
		</React.Fragment>
	);
}

function ScrollBtn(props) {
	const { children, window, direction } = props;
	const classes = useStyles();
	var tri = useScrollTrigger({
		target: window ? window() : undefined,
		disableHysteresis: true,
		threshold: 250
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

function LeftBar(props) {
	const classes = useStyles();
	const history = useHistory();
	const [uname, setUname] = useState("");
	const [roomall, setRoomall] = useState([]);

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
		fetch(lc_config.endpoint + "/rooms_all", {
			method: "GET"
		})
			.then((res) => res.json())
			.catch((error) => alert("Sidebar failed: " + error, "error"))
			.then((response) => setRoomall(response));
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
									<Avatar
										style={{
											backgroundColor: avatarColor(v)
										}}
									>
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
		const anchor = document.querySelector("#top-to-back-anchor");

		if (anchor) {
			anchor.scrollIntoView({ behavior: "smooth", block: "center" });
		}
		//document.querySelector("#chatarea").addEventListener("dragover", handleDrop);
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
							aria-label="Home"
							onClick={handleDrawerOpen}
						>
							<MenuIcon />
						</IconButton>
						<Typography variant="h5" className={classes.menuTitle}>
							{lc_config.title}
						</Typography>
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
					<ChatView
						{...props}
						endpoint={lc_config.endpoint}
						chatroom={room}
					/>
					<br />
					<ChatForm
						{...props}
						endpoint={lc_config.endpoint}
						chatroom={room}
						className={classes.chatForm}
					/>
					<Toolbar id="top-to-back-anchor" />
				</Container>
				<ScrollBtn direction="back" {...props}>
					<Fab
						color="secondary"
						size="small"
						aria-label="scroll to bottom"
					>
						<KeyboardArrowDownIcon />
					</Fab>
				</ScrollBtn>
				<ScrollBtn direction="top" {...props}>
					<Fab
						color="secondary"
						size="small"
						aria-label="scroll back to top"
					>
						<KeyboardArrowUpIcon />
					</Fab>
				</ScrollBtn>
			</ThemeProvider>
		</React.Fragment>
	);
}

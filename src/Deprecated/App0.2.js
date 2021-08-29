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
	Button
} from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import HomeIcon from "@material-ui/icons/Home";
import { SnackbarProvider, useSnackbar } from 'notistack';
import {Link} from "react-router-dom";

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
	chatForm: {
	}
}));

function ChatView(props) {
	const { endpoint, chatroom } = props;
	const [ msgs, setMsgs ] = useState({"messages":[],"timestamp":0});
	const [ load, setLoad ] = useState(0);
	const [ timeo, setTimeo ] = useState(-1);
    const { enqueueSnackbar } = useSnackbar();
	
	const handleInform = function (words, variant) {
        enqueueSnackbar(words, { variant });
    };

	function updateMsg(content, firsttime) {
		try {
			setMsgs(content);
			//setMsgs(function(rmsgs) { rmsgs.messages.concat(content.messages); console.log(rmsgs);return rmsgs; });
		    if (firsttime !== 0) {
		        const anchor = document.querySelector(
			        "#top-to-back-anchor"
		        );
		        if (anchor) {
			        anchor.scrollIntoView({ behavior: "smooth", block: "center" });
		        }
			    handleInform("Welcome to chatroom: " + chatroom, "success");
		        if (content.length < 1) {
			        handleInform("This chatroom doesn't exist.\nSend a message to create it.", "info");
		        }
		    }
		} catch (e) {
			handleInform("Failed to decode message: "+e, "error"); 
		}
		setLoad(0);
	}
	function loadRoom(firsttime) {
		setLoad(1);
		fetch(endpoint + "viewjson.php", {
			method: "POST",
			body: "room=" + encodeURIComponent(chatroom) + "&lastid=" + encodeURIComponent(-1),
			headers: new Headers({
				"Content-Type": "application/x-www-form-urlencoded"
			})
		})
			.then((res) => res.json())
			.catch((error) => handleInform("Fetch failed: " + error, "error"))
			.then((response) => updateMsg(response, firsttime))
			.then(
			    function() {
				    setTimeo(setTimeout(function () {
					    loadRoom(0);
				    }, 5000));
			    }
			);
	}
    
	useEffect(() => {
	    if (timeo !== -1) {
	        clearTimeout(timeo);
	    }
	    loadRoom(1);
	}, [chatroom]);
	
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
		fetch(endpoint + "addmsg.php", {
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
				"Accept": "text/plain"
			})
		})
			.then((res) => res.text())
			.catch((error) => handleInform("Fetch failed: " + error, "error"))
			.then(function(response) {
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

function MsgView(props) {
	const { data } = props;
	const classes = useStyles();
	
	function avatarColor(name) {
	    var str ='';
        for(var i=0; i<name.length; i++) {
            str += parseInt(name[i].charCodeAt(0), 10).toString(16);
        }
        return '#' + str.slice(1, 4);
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
					<Avatar
						src={data.picurl}
						style={{backgroundColor: avatarColor(data.name)}}
					>
					{data.name.substr(0,2)}
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
								style={{whiteSpace: 'pre-wrap'}}
							>
								{data.content}
								<br />
							</Typography>
							{"Sent on "+data.time+" @ "+data.app}
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
		threshold: 250
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
	let { room } = props.match.params;
	const classes = useStyles();
	const theme = useTheme();
	
	function handleDrop(e) {
	    e.preventDefault();
	    console.log(e.dataTransfer.files);
	    return false;
	}
	
	useEffect(() => {
		const anchor = document.querySelector(
			"#top-to-back-anchor"
		);

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
				<AppBar position="sticky">
					<Toolbar>
						<IconButton
							edge="start"
							className={classes.menuButton}
							color="inherit"
							aria-label="Home"
							onClick={() => {window.location.hash = "/";}}
						>
							<HomeIcon />
						</IconButton>
						<Typography variant="h5">LandChat 2021</Typography>
					</Toolbar>
				</AppBar>
			    <Toolbar id="back-to-top-anchor" />
				<Container id="chatarea">
					<ChatView {...props} endpoint="https://lc.hywiki.xyz/" chatroom={room} />
					<br/>
					<ChatForm {...props} endpoint="https://lc.hywiki.xyz/" chatroom={room} className={classes.chatForm} />
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
            </SnackbarProvider>
		</React.Fragment>
	);
}
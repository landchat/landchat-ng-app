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
	Button,
} from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import swal from "sweetalert";
import HomeIcon from "@material-ui/icons/Home";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
	root: {
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
	link: {
		color: "hsla(0,0%,100%,.87)",
	},
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
													date.getMinutes(),
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
							You haven't logged in yet. Please{" "}
							<Link to="/login" className={classes.link}>
								click here
							</Link>{" "}
							to login or sign up first.
							<br />
						</Typography>
					</div>
					<div>
						<br />
						<Typography variant="h4" component="h2">
							公告
						</Typography>
						<Typography variant="body1">
						    <br />
							LandChat NG 更新内容
						</Typography>
						<Typography variant="body2">
							版本0.3.0.dev4
							<br />
							<ul>
							    <li>发送图片支持；</li>
							    <li>Ctrl+Enter发送支持；</li>
							    <li>深色模式；</li>
							    <li>消息发送逻辑优化；</li>
							    <li>边栏支持，首页去除最近聊天室；</li>
							    <li>Bug修复。</li>
							</ul>
							下次更新预告: 
							<br />
							<ul>
		    					<li>可以修改密码，昵称，头像；</li>
		    					<li>消息更新间隔缩短到1s；</li>
		    					<li>即将迎来首个稳定版本。</li>
							</ul>
							如果您感兴趣可以试试开发env:&nbsp;
							<a
								href="https://dev.lc.hywiki.xyz/#/"
								className={classes.link}
							>
								https://dev.lc.hywiki.xyz
							</a>
							<br />
							里面你可以实时看到564的开发进展，但加载慢，不稳定，可能随时会挂。
							<br />
							<br />
						</Typography>
					</div>
				</Container>
			</ThemeProvider>
		</React.Fragment>
	);
}

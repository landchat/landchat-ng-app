import lc_config from "../config";
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
	TextField,
	Button
} from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import HomeIcon from "@material-ui/icons/Home";
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
	signupLink: {
		color: "hsla(0,0%,100%,.87)",
		textDecoration: "none",
		"&:hover": {
			textDecoration: "underline"
		}
	}
}));

export default function Login(props) {
	const classes = useStyles();
	const theme = useTheme();
	const history = useHistory();

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

	if (getCookie("lc_passw") !== "" && getCookie("lc_uid") !== "") {
		history.push("/");
	}

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
								history.push("/");
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
						Login
					</Typography>
					<form
						noValidate
						autoComplete="off"
						action={lc_config.endpoint + "/user_login"}
						method="post"
					>
						<br />
						<TextField
							type="text"
							id="login-user"
							label="User name or User ID"
							name="usr"
							variant="outlined"
							required
						/>
						<br />
						<br />
						<TextField
							type="password"
							id="login-pswd"
							label="Password"
							name="pwd"
							variant="outlined"
							required
						/>
						<br />
						<br />
						<Button
							id="login-btn"
							variant="contained"
							color="primary"
							type="submit"
						>
							Login
						</Button>
					</form>
					<br />
					<Typography component="p">
						If you don't have an account, please&nbsp;
						<Link to="/user/signup" className={classes.signupLink}>
							click here
						</Link>
						&nbsp;to sign up.
					</Typography>
				</Container>
			</ThemeProvider>
		</React.Fragment>
	);
}

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
	TextField,
	Button,
	Stepper,
	Step,
	StepLabel
} from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import HomeIcon from "@material-ui/icons/Home";
import { Link, useHistory } from "react-router-dom";
import { useSnackbar } from "notistack";

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

export default function Signup(props) {
	const classes = useStyles();
	const theme = useTheme();
	const history = useHistory();
	const [activeStep, setActiveStep] = useState(0);
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

	function handleSignup() {
		let suData = new FormData();
		suData.append("id", document.querySelector("#signup-id").value);
		suData.append("pwd", document.querySelector("#signup-pswd").value);
		suData.append("pwd2", document.querySelector("#signup-pswd2").value);
		suData.append("email", document.querySelector("#signup-email").value);
		suData.append("picurl", document.querySelector("#signup-url").value);
		suData.append("name", document.querySelector("#signup-username").value);
		fetch(lc_config.endpoint + "/user_signup", {
			method: "POST",
			body: suData
		})
			.then((res) => res.text())
			.catch((error) => handleInform("Sign up failed: " + error, "error"))
			.then((response) => {
				if (response === "Succeed") {
					handleInform(
						"You've already created an account! Login to start chatting.",
						"success"
					);
				} else {
					handleInform("SignupError: " + response, "error");
				}
			});
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
						Create your account
					</Typography>
					<br />
					<form
						id="signup-form"
						noValidate
						autoComplete="off"
						action="#"
						method="get"
						onSubmit={(e) => e.preventDefault()}
					>
						<div>
							<TextField
								type="number"
								id="signup-id"
								label="User ID"
								name="id"
								variant="standard"
								placeholder="Number only, 5-6 digits"
								required
							/>
							&nbsp;&nbsp;&nbsp;&nbsp;
							<TextField
								type="text"
								id="signup-username"
								label="Your name"
								name="name"
								variant="standard"
								placeholder="It'll be shown to others"
								required
							/>
							<br />
							<br />
							<TextField
								type="email"
								id="signup-email"
								label="Your email"
								name="email"
								variant="standard"
								placeholder="It's secret"
								required
							/>
							<br />
							<br />
							<TextField
								type="password"
								id="signup-pswd"
								label="Set Password"
								name="pwd"
								variant="standard"
								placeholder="Let it be hard to guess"
								required
							/>
							&nbsp;&nbsp;&nbsp;&nbsp;
							<TextField
								type="password"
								id="signup-pswd2"
								label="Repeat password"
								name="pwd2"
								variant="standard"
								placeholder="Type it again"
								required
							/>
							<br />
							<br />
							<TextField
								type="url"
								id="signup-url"
								label="Your Avatar (Optional)"
								name="picurl"
								variant="standard"
								placeholder="URL, Optional"
							/>
							<br />
							<br />
							<Button
								id="signup-btn"
								variant="contained"
								color="primary"
								type="submit"
								onClick={handleSignup}
							>
								Sign up
							</Button>
						</div>
					</form>
				</Container>
			</ThemeProvider>
		</React.Fragment>
	);
}

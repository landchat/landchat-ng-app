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
	Button,
	InputLabel,
	Select,
	FormControl,
	MenuItem,
	FormHelperText
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
	}
}));

export default function UserInfo(props) {
	const classes = useStyles();
	const theme = useTheme();
	const history = useHistory();
	const { enqueueSnackbar } = useSnackbar();
	const [changeValue, setChangeValue] = useState();

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

	function handleUserInfoChange() {
		let ciData = new FormData();
		ciData.append("key", changeValue);
		ciData.append("value", document.querySelector("#changeto-input").value);
		ciData.append("id", getCookie("lc_uid"));
		ciData.append("pwd", getCookie("lc_passw"));
		fetch(lc_config.endpoint + "/user_changeinfo", {
			method: "POST",
			body: ciData
		})
			.then((res) => res.json())
			.catch((error) => handleInform("Change failed: " + error, "error"))
			.then((response) => {
				if (response.status / 100 === 2) {
					handleInform(response.msg, "success");
				} else {
					handleInform("Change Error: " + response.msg, "error");
				}
			});
	}

	if (getCookie("lc_passw") === "" || getCookie("lc_uid") === "") {
		history.push("/error/403");
	}

	const handleSelectChange = (event) => {
		setChangeValue(event.target.value);
	};

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
						Update your information
					</Typography>
					<br />
					<FormControl
						id="userinfo-form"
						noValidate
						autoComplete="off"
						onSubmit={(e) => e.preventDefault()}
					>
						<div>
							<InputLabel id="changewhat-label">
								Change what?
							</InputLabel>
							<Select
								labelId="changewhat-label"
								id="changewhat-select"
								required
								style={{ minWidth: 200 }}
								value={changeValue}
								onChange={handleSelectChange}
							>
								<MenuItem value="id">
									Your user ID (Re-login required)
								</MenuItem>
								<MenuItem value="name">Your name</MenuItem>
								<MenuItem value="email">
									Your e-mail address
								</MenuItem>
								<MenuItem value="picurl">
									Your avatar URL
								</MenuItem>
							</Select>
							<FormHelperText>
								Select the information you want to update above
							</FormHelperText>
							<br />
							<br />
							<TextField
								type="url"
								id="changeto-input"
								label="Change it to..."
								name="value"
								variant="standard"
								placeholder="Input what do you want to change it to"
							/>
							<br />
							<br />
							<Button
								id="change-btn"
								variant="contained"
								color="primary"
								type="submit"
								onClick={handleUserInfoChange}
							>
								Update
							</Button>
						</div>
					</FormControl>
				</Container>
			</ThemeProvider>
		</React.Fragment>
	);
}

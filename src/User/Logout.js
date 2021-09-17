import lc_config from "../config";
import React, { useEffect } from "react";
import {
	AppBar,
	Toolbar,
	Typography,
	ThemeProvider,
	CssBaseline,
	Container,
	IconButton
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
	backLink: {
		color: "hsla(0,0%,100%,.87)",
		textDecoration: "none",
		"&:hover": {
			textDecoration: "underline"
		}
	}
}));

export default function Logout(props) {
	const classes = useStyles();
	const theme = useTheme();
	const history = useHistory();
	
	function setCookie(cname,cvalue,exdays) {
        var d = new Date();
        d.setTime(d.getTime()+(exdays*24*60*60*1000));
        var expires = "expires="+d.toGMTString();
        document.cookie = cname + "=" + cvalue + "; " + expires;
    }
	
	useEffect(() => {
	    setCookie("lc_debug", "", 0);
	    setCookie("lc_uid", "", 0);
	    setCookie("lc_passw", "", 0);
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
						Logout
					</Typography>
					<Typography variant="body1">
						<br />
						You are logged out.
						<br />
						<Link to="/" className={classes.backLink}>
							Go back to Homepage.
						</Link>
					</Typography>
				</Container>
			</ThemeProvider>
		</React.Fragment>
	);
}

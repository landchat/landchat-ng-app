import lc_config from "./config";
import React from "react";
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
import { Link } from "react-router-dom";

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

export default function NotFound(props) {
	const classes = useStyles();
	const theme = useTheme();
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
						404 Not Found
					</Typography>
					<Typography variant="p">
						Uh oh..
						<br />
						We cannot find the page you want.
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

import React, { useEffect, useState } from "react";
import ReactDOM from 'react-dom';
import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import InputBase from '@material-ui/core/InputBase';
import Paper from '@material-ui/core/Paper';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Link from '@material-ui/core/Link';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    header: {
        background: 'rgb(50,50,50)'
    },
    logo: {
        height: 40,
        width: 40,
        margin: 15,
        [theme.breakpoints.down('xs')]: {
            margin: 5
        }
    },
    title: {
        color: 'white',
        margin: 15,
        [theme.breakpoints.down('xs')]: {
            display: 'none'
        }
    },
    search: {
        color: 'white',
        padding: 5,
        paddingLeft: 15,
        paddingRight: 15
    },
    searchContainer: {
        margin: 15,
        background: 'rgb(17,24,43)',
        borderRadius: 20,
        [theme.breakpoints.down('xs')]: {
            margin: 10
        }
    },
    menubar: {
        "& .MuiPaper-root": {
            backgroundColor: "rgb(17,24,43)",
            color: 'white'
        }
    },
    login: {
        margin: 20,
        fontWeight: "bolder",
        [theme.breakpoints.down('sm')]: {
          padding: 5,
        },
      },
}));

export default function Header(props) {
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = useState(null);

  function showMenu(e) {
      setAnchorEl(e.currentTarget);
  }

  function closeMenu() {
      setAnchorEl(null);
  }

  return (
    <AppBar position="static" className={classes.header}>
        <Toolbar>
            <Link href="/">
                <Avatar alt="CryptoTSEC" src="/logo512.png" className={classes.logo} />
            </Link>
            <Typography variant="h5" gutterBottom className={classes.title}>CryptoTSEC</Typography>
            <div style={{flexGrow: 1}}></div>
            <Button variant="contained" href="/new" className={classes.login}>New</Button>
            <Avatar alt="User Avatar" src={"https://avatars.dicebear.com/api/male/"+Math.random()+".png"} className={classes.logo} onClick={showMenu} />
            <Menu id="menu-appbar" onClose={closeMenu} anchorEl={anchorEl} getContentAnchorEl={null} anchorOrigin={{ vertical: "bottom", horizontal: "center" }} transformOrigin={{ vertical: "top", horizontal: "center" }} open={Boolean(anchorEl)} className={classes.menubar} >
                <MenuItem onClick={() => window.location.href="/create"}>Create Wallet</MenuItem>
                <MenuItem>Log out</MenuItem>
            </Menu>
        </Toolbar>
    </AppBar>
  );
}
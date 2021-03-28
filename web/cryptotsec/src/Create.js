import React, { useEffect, useState } from "react";
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import { makeStyles } from '@material-ui/core/styles';
import elliptic from 'elliptic';

const useStyles = makeStyles((theme) => ({
    body: {
        width: '100%'
    },
    sidebar: {
        paddingTop: 20,
        paddingLeft: 20,
        [theme.breakpoints.down('xs')]: {
            display: 'flex',
            flexDirection: 'row',
        }
    },
    ask: {
        background: '#26a69a',
        color: 'white',
        textShadow: '1px 0 white',
        letterSpacing: 3,
        fontWeight: 700,
        "&:hover": {
            background: '#26a69a'
        }
    },
    link: {
        textDecoration: 'none',
        color: 'black',
        "&:hover": {
            textDecoration: 'none'
        }
    },
    post: {
        background: '#26a69a',
        color: 'white',
        textShadow: '1px 0 white',
        letterSpacing: 3,
        fontWeight: 700,
        margin: 20,
        "&:hover": {
            background: '#26a69a'
        }
    },
    question: {
        border: 'none',
        margin: 0,
        background: '#121212',
        color: 'white',
        padding: 15,
        width: "100%",
        "&:focus": {
            outline: 'none'
        }
    },
    tags: {
        border: '2px solid #999999',
        fontWeight: 900,
        margin: 5,
        padding: 0
    },
    container: {
        margin: 20,
        width: '100%',
        backgroundColor: "#121212"
    },
    heading: {
        color: "white"
    }
}));

export default function Create() {
    const classes = useStyles();

    const [privatekey, setprivatekey] = useState(localStorage.getItem("private") || "");
    const [publickey, setpublickey] = useState(localStorage.getItem("public") || "");

    function generate() {
        var EC = elliptic.ec;
        var ec = new EC('secp256k1');
        var key = ec.genKeyPair();
        setpublickey(key.getPublic('hex'));
        setprivatekey(key.getPrivate('hex'));
        localStorage.setItem("public",key.getPublic('hex'));
        localStorage.setItem("private",key.getPrivate('hex'));
    }
  
    return (
        <Grid container xs={10} className={classes.container}>
            <Grid item xs>
                <Typography variant="h4" gutterBottom className={classes.heading}>Create Transaction</Typography>
                <Paper elevation={3} variant="outlined" className={classes.container}>
                    <Typography variant="h6" gutterBottom className={classes.heading}>Public Key</Typography>
                    <Paper elevation={3} variant="outlined" style={{ margin: 20, maxWidth: 400 }}>
                        <InputBase value={publickey} className={classes.question} placeholder="Publlic Key" />
                    </Paper>
                    <Typography variant="h6" gutterBottom className={classes.heading}>Private Key</Typography>
                    <Paper elevation={3} variant="outlined" style={{ margin: 20, maxWidth: 400 }}>
                        <InputBase value={privatekey} className={classes.question} placeholder="Private Key" />
                    </Paper>
                    <Button className={classes.post} onClick={generate}>Generate</Button>
                </Paper>
            </Grid>
        </Grid>
    );
}
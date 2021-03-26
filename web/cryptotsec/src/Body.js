import React, { useEffect, useState } from "react";
import ReactDOM from 'react-dom';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { makeStyles } from '@material-ui/core/styles';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";

import BlockChain from './BlockChain';
import Create from './Create';
import New from './New';
import firebase from './firebase';

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
    }
}));

export default function Body() {
  const classes = useStyles();

  return (
    <Grid container spacing={0} className={classes.body}>
        <Grid item xs={10}>
            <Router>
                <Switch>
                    <Route path="/new" component={New} />
                    <Route path="/create" component={Create} />
                    <Route path="/" component={BlockChain} />
                </Switch>
            </Router>
        </Grid>
    </Grid>
  );
}
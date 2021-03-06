import React, { useEffect, useState } from "react";
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";

import Mine from './Mine';
import Create from './Create';
import New from './New';

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
                    <Route path="/" component={Mine} />
                </Switch>
            </Router>
        </Grid>
    </Grid>
  );
}
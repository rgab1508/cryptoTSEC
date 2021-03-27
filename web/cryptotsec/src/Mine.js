import React, { useEffect, useState } from "react";
import ReactDOM from 'react-dom';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Toolbar from '@material-ui/core/Toolbar';
import InputBase from '@material-ui/core/InputBase';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { makeStyles } from '@material-ui/core/styles';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";

import firebase from './firebase';
import Transaction from './Transaction';
import BlockChain from './BlockChain';

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
    heading: {
        color: "white",
        marginTop: 30,
        marginLeft: 30
    },
    pool: {
        backgroundColor: "rgb(30,30,30)",
        left: 60,
        color: "white"
    },
    mine: {
        margin: 20,
        fontWeight: "bolder"
    },
    question: {
        border: 'none',
        margin: 0,
        color: 'white',
        padding: 5,
        width: "100%",
        display: "block",
        "&:focus": {
            outline: 'none'
        }
    }
}));

export default function Mine() {
  const classes = useStyles();

  const [pool,setpool] = useState([]);
  const [blocks,setblocks] = useState([]);

  function broadcast(blocks) {
    firebase.database().ref("crypto/blockchain").set(blocks);
  }

  function mine() {
    var newPool = [...pool, new Transaction(0,localStorage.getItem("public") || "",100,"",localStorage.getItem("public") || "")];
    var mineBlocks = new BlockChain();
    mineBlocks.addBlock(newPool,localStorage.getItem("public") || "");
    broadcast(mineBlocks.export());
  }

  useEffect(() => {
      var bc = new BlockChain();
      if (localStorage.getItem("blockchain")) {
          var localblocks = JSON.parse(localStorage.getItem("blockchain"));
          bc.import(localblocks);
          setblocks(bc.export())
      }

      firebase.database().ref("crypto/pool").on("value",snapshot => {
          var transactions = Object.values(snapshot.val());
          transactions = transactions.filter(t => {
              var validator = new Transaction(t.sender_address,t.reciever_address,t.amount,t.signature);
              return validator.isValid();
          });
          console.log(transactions);
          setpool(transactions);
      });
      firebase.database().ref("crypto/blockchain").on("value",snapshot => {
          var newBlocks = new BlockChain();
          newBlocks.import(Object.values(snapshot.val() || []));
          console.log(newBlocks,newBlocks.isValid());
      });
  },[]);

  return (
    <div>
        <Grid container spacing={0} className={classes.body}>
            <Grid item xs={10}>
                <Toolbar>
                    <Typography variant="h4" gutterBottom className={classes.heading}>Transaction Pool</Typography>
                    <div style={{flexGrow: 1}}></div>
                    <Button variant="contained" onClick={mine} className={classes.mine}>Mine</Button>
                </Toolbar>
            </Grid>
        </Grid>
        <Grid container spacing={0} className={classes.body}>
            <Grid item xs={10}>
                {pool.map((transaction,i) => (
                    <Accordion className={classes.pool}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon style={{ color: "white" }}/>} aria-controls="panel1bh-content" id="panel1bh-header">
                            <Typography className={classes.secondaryHeading}>Tansaction {i+1}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography variant="h6" gutterBottom>Sender's Address:</Typography>
                        </AccordionDetails>
                        <AccordionDetails>
                            <InputBase value={transaction.sender_address} className={classes.question} />
                        </AccordionDetails>
                        <AccordionDetails>
                            <Typography variant="h6" gutterBottom>Reciever's Address:</Typography>
                        </AccordionDetails>
                        <AccordionDetails>
                            <InputBase value={transaction.reciever_address} className={classes.question} />
                        </AccordionDetails>
                        <AccordionDetails>
                            <Typography variant="h6" gutterBottom>Amount:</Typography>
                        </AccordionDetails>
                        <AccordionDetails>
                            <InputBase value={transaction.amount} className={classes.question} />
                        </AccordionDetails>
                        <AccordionDetails>
                            <Typography variant="h6" gutterBottom>Signature:</Typography>
                        </AccordionDetails>
                        <AccordionDetails>
                            <InputBase value={transaction.signature} className={classes.question} />
                        </AccordionDetails>
                    </Accordion>
                ))}
            </Grid>
        </Grid>
        <Grid container spacing={0} className={classes.body}>
            <Grid item xs={10}>
                <Toolbar>
                    <Typography variant="h4" gutterBottom className={classes.heading}>BlockChain</Typography>
                </Toolbar>
            </Grid>
        </Grid>
    </div>
  );
}
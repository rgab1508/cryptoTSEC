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
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import { makeStyles } from '@material-ui/core/styles';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";

import createTransaction from './createTransaction';

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
    },
    process: {
        backgroundColor: "rgb(30,30,30)",
        color: "white",
        "& .MuiTypography-root": {
            color: "white"
        },
        "& .MuiSvgIcon-root": {
            color: "white"
        }
    }
}));

export default function Mine() {
  const classes = useStyles();

  const [pool,setpool] = useState([]);
  const [blocks,setblocks] = useState([]);
  const [privatekey, setprivatekey] = useState(localStorage.getItem("private") || "");
  const [step,setstep] = useState(null);

  function broadcast(blocks) {
    firebase.database().ref("crypto/blockchain").set(blocks);
  }

  function show() {
      setstep(0);
      setTimeout(() => setstep(1),5000);
  }

  function mine() {
    show();
    var { sign, hash } = createTransaction(localStorage.getItem("public") || "",0,1,privatekey);
    var newPool = [...pool, new Transaction(localStorage.getItem("public") || "",0,1,sign,localStorage.getItem("public") || ""), new Transaction(0,localStorage.getItem("public") || "",100,"",localStorage.getItem("public") || "")];
    var mineBlocks = new BlockChain();
    mineBlocks.import(blocks);
    mineBlocks.addBlock(newPool,localStorage.getItem("public") || "");
    firebase.database().ref("crypto/pool").set([]);
    broadcast(mineBlocks.export());
    console.log(mineBlocks.export());
  }

  useEffect(() => {
      var bc = new BlockChain();
      if (localStorage.getItem("blockchain")) {
          var localblocks = JSON.parse(localStorage.getItem("blockchain"));
          bc.import(localblocks);
          setblocks(bc.export());
      }

      firebase.database().ref("crypto/pool").on("value",snapshot => {
          var transactions = Object.values(snapshot.val() || []);
          transactions = transactions.filter(t => {
              var validator = new Transaction(t.sender_address,t.reciever_address,t.amount,t.signature);
              return validator.isValid();
          });
          setpool(transactions);
      });
      firebase.database().ref("crypto/blockchain").on("value",snapshot => {
          var newBlocks = new BlockChain();
          newBlocks.import(Object.values(snapshot.val() || []));
          if (newBlocks.export().length > blocks.length) {
              localStorage.setItem("blockchain",JSON.stringify(newBlocks.export()));
              setblocks(newBlocks.export());
          }
          console.log(newBlocks.export(),newBlocks.isValid());
      });
  },[]);

  function tui(transaction, i, flag) {
    return (<Accordion className={classes.pool} style={{ backgroundColor: flag?"rgb(25,25,25)":"rgb(30,30,30)" }}>
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
    </Accordion>);
  }

  return (
    <div>
        <Grid container spacing={0} className={classes.body}>
            <Grid item xs={10}>
                <Toolbar>
                    <Typography variant="h4" gutterBottom className={classes.heading}>Transaction Pool</Typography>
                    <div style={{flexGrow: 1}}></div>
                    <Button variant="contained" disabled={pool.length==0} onClick={mine} className={classes.mine}>Mine</Button>
                </Toolbar>
            </Grid>
        </Grid>
        <Grid container spacing={0} className={classes.body}>
            <Grid item xs = {12}>
                {pool.map(tui)}
            </Grid>
            <Grid item xs={12} style={{ padding: 60 }}>
                <Stepper activeStep={step} orientation="vertical" className={classes.process}>
                    <Step key="one" onClick={() => setstep(0)}>
                        <StepLabel classes={{ root: classes.process }}>Proof-of-work:</StepLabel>
                        <StepContent>
                            The transaction pool is added to a new block and prrof-of-work algorithm is applied till the hash of block has a certain number of zeroes in the beginning.
                        </StepContent>
                    </Step>
                    <Step key="two" onClick={() => setstep(1)}>
                        <StepLabel classes={{ root: classes.process }}>Mining Fees and Mining Reward:</StepLabel>
                        <StepContent>
                            The transaction fees of 1 is deduced from miner and a mining reward of 100 is given to the miner.
                        </StepContent>
                    </Step>
                </Stepper>
            </Grid>
        </Grid>
        <Grid container spacing={0} className={classes.body}>
            <Grid item xs={10}>
                <Toolbar>
                    <Typography variant="h4" gutterBottom className={classes.heading}>BlockChain</Typography>
                </Toolbar>
            </Grid>
        </Grid>
        <Grid container spacing={0} className={classes.body}>
            <Grid item xs={10}>
                {blocks.map(block => (
                    <Accordion className={classes.pool}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon style={{ color: "white" }}/>} aria-controls="panel1bh-content" id="panel1bh-header">
                            <Typography className={classes.secondaryHeading}>Block {block.index} {block.index==0?"(Genesis Block)":""}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography variant="h6" gutterBottom>Timestamp:</Typography>
                        </AccordionDetails>
                        <AccordionDetails>
                            {block.timestamp}
                        </AccordionDetails>
                        <AccordionDetails>
                            <Typography variant="h6" gutterBottom>Hash:</Typography>
                        </AccordionDetails>
                        <AccordionDetails>
                            <InputBase value={block.hash} className={classes.question} />
                        </AccordionDetails>
                        <AccordionDetails>
                            <Typography variant="h6" gutterBottom>Previous Hash::</Typography>
                        </AccordionDetails>
                        <AccordionDetails>
                            <InputBase value={block.prevHash} className={classes.question} />
                        </AccordionDetails>
                        <AccordionDetails>
                            <Typography variant="h6" gutterBottom>Nonce:</Typography>
                        </AccordionDetails>
                        <AccordionDetails>
                            <InputBase value={block.nonce} className={classes.question} />
                        </AccordionDetails>
                        <AccordionDetails>
                            <Typography variant="h6" gutterBottom>Mined By:</Typography>
                        </AccordionDetails>
                        <AccordionDetails>
                            <InputBase value={block.mined_by} className={classes.question} />
                        </AccordionDetails>
                        <AccordionDetails>
                            <Typography variant="h6" gutterBottom>Data:</Typography>
                        </AccordionDetails>
                        {block.data!=0?block.data.map((transaction,i) => (
                            <AccordionDetails>
                                {tui(transaction,i,true)}
                            </AccordionDetails>
                        )):(
                            <AccordionDetails>
                                {block.data}
                            </AccordionDetails>
                        )}
                    </Accordion>
                ))}
            </Grid>
        </Grid>
    </div>
  );
}
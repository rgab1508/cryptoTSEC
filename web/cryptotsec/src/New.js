import React, { useEffect, useState } from "react";
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import { makeStyles } from '@material-ui/core/styles';
import createTransaction from './createTransaction';

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

export default function New() {
    const classes = useStyles();

    useEffect(() => {
        if (!localStorage.getItem("private")) window.location.href="/create";
    },[]);

    const [privatekey, setprivatekey] = useState(localStorage.getItem("private") || "");
    const [rec, setrec] = useState("");
    const [send,setsend] = useState(localStorage.getItem("public") || "");
    const [amount,setAmount] = useState(0);
    const [step,setstep] = useState(null);
    const [hash,sethash] = useState("");
    const [sign,setsign] = useState("");

    function show() {
        var { sign, hash } = createTransaction(send,rec,amount,privatekey);
        setsign(sign);
        sethash(hash);
        setstep(0);
        setTimeout(() => setstep(1),3000);
        setTimeout(() => setstep(2),6000);
        setTimeout(() => setstep(3),9000);
    }

    return (
        <div>
            <Grid container xs={12} className={classes.container}>
                <Grid item xs={window.screen.width>600?7:12}>
                    <Typography variant="h4" gutterBottom className={classes.heading}>Generate Keys</Typography>
                    <Paper elevation={3} variant="outlined" className={classes.container}>
                        <Typography variant="h6" gutterBottom className={classes.heading}>Reciever's Address:</Typography>
                        <Paper elevation={3} variant="outlined" style={{ margin: 20, maxWidth: 400 }}>
                            <InputBase className={classes.question} onChange={(e) => setrec(e.target.value)} placeholder="Publlic Key" />
                        </Paper>
                        <Typography variant="h6" gutterBottom className={classes.heading}>Your Private Key:</Typography>
                        <Paper elevation={3} variant="outlined" style={{ margin: 20, maxWidth: 400 }}>
                            <InputBase value={privatekey} className={classes.question} placeholder="Private Key" inputProps={{ readOnly: true }} />
                        </Paper>
                        <Typography variant="h6" gutterBottom className={classes.heading}>Amount:</Typography>
                        <Paper elevation={3} variant="outlined" style={{ margin: 20, maxWidth: 400 }}>
                            <InputBase type="number" onChange={(e) => setAmount(parseInt(e.target.value))} className={classes.question} placeholder="Amount" />
                        </Paper>
                        <Button className={classes.post} onClick={show}>CREATE TRANSACTION</Button>
                    </Paper>
                </Grid>
                <Grid xs>
                    <Typography variant="h4" gutterBottom className={classes.heading}>TRANSACTION PROCESS</Typography>
                    <Stepper activeStep={step} orientation="vertical" className={classes.process}>
                        <Step key="one" onClick={() => setstep(0)}>
                            <StepLabel classes={{ root: classes.process }}>Encoding Data:</StepLabel>
                            <StepContent>
                                The transaction data has to be encoded to calculate the hash properly.
                                Encoded string will be Sender's Address + Reciever's Address + Amount
                                <InputBase value={send+rec+amount} className={classes.question} />
                            </StepContent>
                        </Step>
                        <Step key="two" onClick={() => setstep(1)}>
                            <StepLabel classes={{ root: classes.process }}>Hashing The Data:</StepLabel>
                            <StepContent>
                                Next step is to hash the data, we will hash the encoded transaction details using SHA256.
                                The hash will be as follows:
                                <InputBase value={hash} className={classes.question} />
                            </StepContent>
                        </Step>
                        <Step key="three" onClick={() => setstep(2)}>
                            <StepLabel classes={{ root: classes.process }}>Signing Transaction:</StepLabel>
                            <StepContent>
                                This step involves signing the hash of the transaction details. This step is very important as it ensures the transaction was created by user trying to send money.
                                The signature will be as follows.
                                <InputBase value={sign} className={classes.question} />
                            </StepContent>
                        </Step>
                        <Step key="four" onClick={() => setstep(3)}>
                            <StepLabel classes={{ root: classes.process }}>Broadcast to other nodes:</StepLabel>
                            <StepContent>
                                This step involves broadcasting our transaction to other nodes so that they can update their transaction pool.
                            </StepContent>
                        </Step>
                    </Stepper>
                </Grid>
            </Grid>
        </div>
    );
}
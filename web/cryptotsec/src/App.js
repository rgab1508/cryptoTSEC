import React, { useEffect, useState } from "react";
import ReactDOM from 'react-dom';
import { makeStyles } from '@material-ui/core/styles';

import Header from './Header';
import Body from './Body';

const useStyles = makeStyles((theme) => ({

}));

export default function App() {
  const classes = useStyles();

  return (
    <div>
      <Header />
      <Body />
    </div>
    );
}
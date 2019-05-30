import React, { Component } from 'react';
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@material-ui/core';

import { withStyles } from '@material-ui/core/styles';
import withRoot from '../withRoot';
import Dropzone from 'react-dropzone';


import Vis from '../components/Vis';
import {bukdata} from '../dataset/buks';

/**
 * Injected styles for this component
 */
const styles = theme => ({
  typography: {
    useNextVariants: true,
  },
  root: {
    'textAlign': 'center',
    'paddingTop': theme.spacing.unit,
    'margin-left': '1%',
    'width': '98%'
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },
  dropzone: {
    display: 'inline-flex'
  },
  overlayStyle: {
    zIndex: 9999,
    position: 'absolute',
    top: 0,
    left: 0,
    height: "99vh",
    width: "100vw",
    backgroundColor: '#000b',
    textAlgin: 'center',
    animation: `mui-ripple-pulsate 1000ms ${theme.transitions.easing.easeInOut} 200ms infinite`,
  },
  main: {
    overflow: 'hidden'
  },
  textStyle: {
    paddingTop: "50vh",
    fontSize: 30,
    color: '#fff',
  },
  fullscreen: {
    height: "99vh",
    width: "99vw",
  },
  '@keyframes mui-ripple-pulsate': {
    '0%': {
      opacity: 1,
    },
    '50%': {
      opacity: 0.8,
    },
    '100%': {
      opacity: 1,
    },
  },
});

class Index extends Component {
  constructor(props) {
    super(props);

    // Initial component state
    this.state = {
      data: [],
      height: 600,
      width: 1400,
      files: [],
      data: null,
      vistype: 1
    };
  }

  getChartSettings(){
    return {
      width: this.state.width,
      height: this.state.height,
      vistype: this.state.vistype
    }
  }

  generateData(event){

    const view = event.target.result
      .split("\n")
      .filter(d => d.indexOf(":",15) > -1)
      .map(d => d.split(/[-,|:]+/))
      .map(d => {
        return {
          date: d[0],
          time: (d[1] + ":" + d[2]).trim(),
          user: d[3].trim(),
          message: d[4].substr(1)
        };
      });

    this.setState({
      data: view
    });
  }

  onDrop(files) {
    let fr = new FileReader();
    fr.onload = (e) => this.generateData(e);

    this.setState({
      files: files,
      data: []
    }, () => fr.readAsText(files[0]));
  }


  renderDropzone(){
    const { classes } = this.props;
    return (
        <Dropzone
          onDrop={this.onDrop.bind(this)}
          className={classes.dropzone}>
        { this.state.files.length === 0 ?
          <p>Click here to choose your WhatsApp Chat here.</p>
          :
          <ul>
            {this.state.files.map(f =>
              <li key={f.name}>{f.name} - {f.size} bytes</li>)}
          </ul>
        }
        </Dropzone>
      );
  }

  /**
   * The main render function of this component
   */
  render() {
    const { data } = this.state;
    const { classes } = this.props;

    const chartsettubgs = this.getChartSettings();

    return (
      <div>
        <Dropzone noClick disableClick onDrop={this.onDrop.bind(this)} className={classes.fullscreen}>
          {({getRootProps, getInputProps, isDragActive}) => (
            <div className={classes.root}>
              { isDragActive && 
                <div className={classes.overlayStyle}>
                  <Typography variant="h4" className={classes.textStyle}>
                    Drop your File here
                  </Typography>
                </div>
              }
              <React.Fragment>
                <img src='BUK.jpg' alt="Logo"/>
                <Typography variant="h4">
                  BUK
                </Typography>
                {this.renderDropzone()}
                {this.renderVisTypeSelection()}
              </React.Fragment>
              <Vis data={data ? data : bukdata} settings={chartsettubgs} />
            </div>
          )}
        </Dropzone>
      </div>
    );
  }

  renderVisTypeSelection(){
    const { vistype } = this.state;
    const { classes } = this.props;
    return (
      <FormControl className={classes.formControl}>
        <InputLabel htmlFor="age-simple">Vis Type</InputLabel>
        <Select
          value={vistype}
          onChange={e => this.setState({vistype: e.target.value})}
          inputProps={{
            name: 'age',
            id: 'age-simple',
          }}
        >
          <MenuItem value={1}>Correct BUK</MenuItem>
          <MenuItem value={2}>Timescale</MenuItem>
          <MenuItem value={3}>Amount</MenuItem>
          <MenuItem value={4}>Earliest BUKer</MenuItem>
        </Select>
      </FormControl>
      );
  }
}

export default withRoot(withStyles(styles)(Index));

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

import Vis from '../components/Vis';

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
});

class MainPage extends Component {
  constructor(props) {
    super(props);

    // Initial component state
    this.state = {
      data: [],
      loading: true,
      height: 600,
      width: 1400
    };
  }

  componentDidMount(){
    this.setState({loading: false, data: [1,2,3,4,5]});
  }

  getChartSettings(){
    return {
      width: this.state.width,
      height: this.state.height
    }
  }

  /**
   * The main render function of this component
   */
  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        {this.renderHeader()}
        {this.renderChartConfig()}
        {this.renderVisualization()}
      </div>
    );
  }

  renderVisualization(){
    if(!this.state.data || this.state.data.length === 0)
        return <div>No Data</div>;

    return <Vis data={this.state.data} settings={this.getChartSettings()} />;
  }

  /**
   * Renders the configuration for the chart
   */
  renderChartConfig(){
    const { classes } = this.props;
    return <div>

        <FormControl className={classes.formControl}>
          <TextField
            id="height"
            label="Height"
            value={this.state.height}
            onChange={(d) => this.setState({'height': d.target.value})}
            type="number"
            inputProps={{step: 50}}
          />
        </FormControl>

        <FormControl className={classes.formControl}>
          <TextField
            id="width"
            label="Width"
            value={this.state.width}
            onChange={(d) => this.setState({'width': d.target.value})}
            type="number"
            inputProps={{step: 50}}
          />
        </FormControl>

        </div>;
  }

  /**
   * Renders the page title 
   */
  renderHeader() {
    return (
      <React.Fragment>
        <Typography variant="h4">
          VisBarebones
        </Typography>
      </React.Fragment>
    )
  }

}

export default withRoot(withStyles(styles)(MainPage));

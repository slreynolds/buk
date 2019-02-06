import React, { Component } from 'react';
import VisImpl from './VisImpl';

/**
 * React-Wrapper around a D3 component
 */
export default class SightsVis extends Component {
    constructor(props) {
        super(props);
        this.container = null;
    }

    componentDidMount() {
        this._chart = new VisImpl(this.container, this.props.data, this.props.settings, this.props.selection);
    }

    componentDidUpdate() {
        this._chart.updateChart(this.props.data, this.props.settings, this.props.selection);
    }

    render() {
        return (
            <div ref={inst => {
                this.container = inst
            }} />
        );
    }
}
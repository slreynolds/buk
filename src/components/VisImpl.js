import * as d3 from 'd3';

export default class SightsVisImpl {
    constructor(node, data, settings, selection) {
        this.node = node;
        this.settings = Object.assign(this.getDefaultSettings(), settings);
        this.data = this.formatData(data);
        this.selection = selection;

        this.init();
        this.render();
    }

    updateChart(data, settings, selection) {
        this.settings = Object.assign(this.getDefaultSettings(), settings);
        this.data = this.formatData(data);
        this.selection = selection;

        this.update();
        this.render();
    }

    getDefaultSettings(){
        return {
            width: 800,
            height: 500,
        }
    }

    formatData(rawData){
        console.log("we got some sweet data: ", rawData);

        return rawData;
    }

    /**
     * Setup all static chart settings here
     */
    init() {
        // create new svg elements
        this.svg = d3.select(this.node).append('svg')
            .attr('class', 'chart')
            .attr('width', this.settings.width)
            .attr('height', this.settings.height);

        this.content = this.svg.append('g')
            .attr('class', 'content');
    }

    update() {
        // update new svg elements
        this.svg
            .attr('width', this.settings.width)
            .attr('height', this.settings.height);
    }

    renderContent(node, data) {
        let t = this.getTransition();

        let dataJoin = node.selectAll(".data")
            .data(data);

        // Enter
        let dataEnter = dataJoin.enter()
            .append("g")
            .attr("class", "data")
            .attr('transform', (d) => 'translate(' + [d*100, 100] + ')');

        dataEnter.append("circle").attr("class", "graphic");

        // Update + Enter
        dataEnter
            .merge(dataJoin)
            .transition(t)
            .attr('transform', (d,i) => 'translate(' + [d*100, 100] + ')');


        dataEnter
            .merge(dataJoin)
            .select(".graphic")
            .attr("fill", (d,i) => this.calculateColor(i))
            .attr("r", (d) => 100)
            .attr("stroke-width", "0.15px")
            .attr("stroke", "black");

        // Exit
        dataJoin.exit()
            .remove();
    }

    getTransition(){
        return d3.transition().delay(0).duration(250).ease(d3.easeLinear);
    }

    calculateColor(d){
        return d3.interpolateViridis(d/this.data.length);
    }

    render() {
        this.renderContent(this.content, this.data);
    }
}
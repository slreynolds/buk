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
//{date: '11/16/18', time: '09:53', user: 'Steven', message: 'BUK'},

    formatData(rawData){
        console.log("we got some sweet data: ", rawData);
        this.timeWeek = d3.timeMonday;
        this.countDay = d => (d.getDay() + 6) % 7;
        this.format = d3.format("+.2%");
        this.formatDay = d => "MTWTFSS"[d.getDay()];
        this.formatMonth = d3.timeFormat("%b");
        this.color = d3.scaleSequential(d3.interpolatePuRd).domain([0, 6]);
        this.dayOfTimeColor = d3.scaleSequential(d3.interpolateRdBu).domain([0, 1440]);

        this.cellSize = 17;
        this.formatDate = d3.utcParse("%m/%d/%y");
        this.timeParse = d3.utcParse("%H:%M");
        this.toGermanTime = d => new Date(d).getDay() + "." + new Date(d).getMonth() + "." + new Date(d).getFullYear();

        rawData.forEach(d => {
            d.parsedDate = this.formatDate(d.date);
        });

        return rawData;
    }

    /**
     * Setup all static chart settings here
     */
    init() {
        // create new svg elements
        this.svg = d3.select(this.node).append('svg')
            .attr('class', 'chart')
            .style("font", "10px sans-serif")
            .style("width", "100%")
            .style("height", 155 * 3);

        this.node = this.svg.append('g')
            .attr('class', 'node');
    }

    // copied a lot from https://beta.observablehq.com/@mbostock/d3-calendar-view
    renderYears(data, node){
        let t = this.getTransition();
        let height = this.cellSize * 9;

        const days = d3.nest()
            .key(d => d.parsedDate)
            .entries(data);

        const years = d3.nest()
            .key(d => new Date(d.key).getFullYear())
            .entries(days)
            .reverse();

            console.log(years);
        const year = node.selectAll("g")
            .data(years)
            .join("g")
            .attr("transform", (d, i) => `translate(40,${height * i + this.cellSize * 1.5})`);

        year.append("text")
            .attr("x", -5)
            .attr("y", -5)
            .attr("font-weight", "bold")
            .attr("text-anchor", "end")
            .text(d => d.key);

        year.append("g")
            .attr("text-anchor", "end")
            .selectAll("text")
            .data(d3.range(7).map(i => new Date(1995, 0, i)))
            .join("text")
            .attr("x", -5)
            .attr("y", d => (this.countDay(d) + 0.5) * this.cellSize)
            .attr("dy", "0.31em")
            .text(this.formatDay);

        year.append("g")
            .selectAll("rect")
            .data(d => d.values)
            .join("rect")
            .attr("width", this.cellSize - 1)
            .attr("height", this.cellSize - 1)
            .attr("x", d => this.timeWeek.count(d3.timeYear(new Date(d.key)), new Date(d.key)) * this.cellSize + 0.5 + new Date(d.key).getMonth()*10)
            .attr("y", d => this.countDay(new Date(d.key)) * this.cellSize + 0.5)
            .attr("fill", d => this.getColorOfAverageTime(d))
            .append("title")
            .text(d => `${d.key}: ${d.values.length}`);

        const month = year.append("g")
            .selectAll("g")
            .data(d => d3.timeMonths(d3.timeMonth(new Date(d.values[0].key)), new Date(d.values[d.values.length - 1].key)))
            .join("g");

        month.append("text")
            .attr("x", d => this.timeWeek.count(d3.timeYear(d), this.timeWeek.ceil(d)) * this.cellSize + 2)
            .attr("y", -5)
            .text(this.formatMonth);
    }

    // copied a lot from https://beta.observablehq.com/@mbostock/d3-calendar-view
    renderFirstPersonBUKed(data, node){
        let t = this.getTransition();
        let height = this.cellSize * 9;

        const days = d3.nest()
            .key(d => d.parsedDate)
            .entries(data);

        const years = d3.nest()
            .key(d => new Date(d.key).getFullYear())
            .entries(days)
            .reverse();

            console.log(years);

        const year = node.selectAll("g")
            .data(years)
            .join("g")
            .attr("transform", (d, i) => `translate(40,${height * i + this.cellSize * 1.5})`);

        year.append("text")
            .attr("x", -5)
            .attr("y", -5)
            .attr("font-weight", "bold")
            .attr("text-anchor", "end")
            .text(d => d.key);

        year.append("g")
            .attr("text-anchor", "end")
            .selectAll("text")
            .data(d3.range(7).map(i => new Date(1995, 0, i)))
            .join("text")
            .attr("x", -5)
            .attr("y", d => (this.countDay(d) + 0.5) * this.cellSize)
            .attr("dy", "0.31em")
            .text(this.formatDay);

        year.append("g")
            .selectAll("image")
            .data(d => d.values)
            .join("image")
            .attr("width", this.cellSize - 1)
            .attr("height", this.cellSize - 1)
            .attr("x", d => this.timeWeek.count(d3.timeYear(new Date(d.key)), new Date(d.key)) * this.cellSize + 0.5)
            .attr("y", d => this.countDay(new Date(d.key)) * this.cellSize + 0.5)
            .attr("xlink:href", d => "")
            .append("title")
            .text(d => `${d.key}: ${d.values.length} - ${d.values[0].user}`);

        const month = year.append("g")
            .selectAll("g")
            .data(d => d3.timeMonths(d3.timeMonth(new Date(d.values[0].key)), new Date(d.values[d.values.length - 1].key)))
            .join("g");

        month.append("text")
            .attr("x", d => this.timeWeek.count(d3.timeYear(d), this.timeWeek.ceil(d)) * this.cellSize + 2)
            .attr("y", -5)
            .text(this.formatMonth);
    }

    getColorOfBUKCount(d){
        return this.color(d.values.length);
    }

    getColorOfAverageTime(d){
        if(d.values.length != 3)
            return "white";

        let time = new Date((this.timeParse(d.values[0].time).getTime() +
                    this.timeParse(d.values[1].time).getTime() +
                    this.timeParse(d.values[2].time).getTime())/3);

        return this.dayOfTimeColor(time.getHours()*60 + time.getMinutes());
    }

    getColorIfCorrectBUK(d){
        return (d.values.length === 3 &&
                d.values[0].message === "BUK" &&
                d.values[1].message === "BUK" &&
                d.values[2].message === "BUK") ? "green" : "red";
    }

    getImageHref(d){
        return d.values[0] ? d.values[0].user + ".jpg" : "";
    }

    getTransition(){
        return d3.transition().delay(0).duration(250).ease(d3.easeLinear);
    }

    calculateColor(d){
        return d3.interpolateViridis(d/this.data.length);
    }

    render() {
        this.renderYears(this.data, this.node);
        //this.renderFirstPersonBUKed(this.data, this.node);
    }
}
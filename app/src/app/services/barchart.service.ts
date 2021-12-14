import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import * as d3 from "d3";

@Injectable({
  providedIn: 'root'
})
export class BarchartService {

  constructor(private dataService: DataService) { }

  /**
   * Creates a d3 svg barchart
   * @param inputData 
   */
  async makeBarChart(inputData: any) {
    var groupSizes: any = []
    var keys: any = []
    inputData.forEach((value: any) => {
      groupSizes.push(value.value)
      keys.push(value.key)
    })

    // set the dimensions and margins of the graph
    var margin = { top: 40, right: 0, bottom: 0, left: 40 },
      width = 460 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

    var svg_id = "#" + this.dataService.barChartId

    // append the svg object to the body of the page
    var svg = d3.select(svg_id)
      .append("svg")
      .style("left", "100px")



    await this.dataService.sleep(50)
    var width = Number(d3.select(svg_id).style('width').slice(0, -2));
    var height = ((d3 as any).select("." + this.dataService.barChartId).node().getBoundingClientRect().height * 0.30)

    var svgGroup = svg
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")

    // Add Y axis scale
    var x: any = d3.scaleBand()
      .range([margin.left, width])
      .domain(keys)

    var yDomain: any

    var yAxisTicks: any
    if (groupSizes[0].toString().length > 1) {
      yDomain = 1
      yAxisTicks = [0.25, 0.5, 0.75, 1]
    } else {
      yDomain = Math.max(...groupSizes)

      yAxisTicks = groupSizes.sort((n1: any, n2: any) => n1 - n2)
    }

    // Add Y axis scale
    var y = d3.scaleLinear()
      .domain([0, yDomain])
      .range([height, margin.top]);

    var barWidth = 30

    var xAxis = svgGroup.append("g")
      .selectAll("xAxis")
      .data(inputData)
      .enter()


    xAxis.append("rect")
      .attr("x", function (d: any) { return x(d.key) + margin.left })
      .attr("y", height)
      .attr("width", 1)
      .attr("height", 5)
      .attr("fill", "black")

    xAxis
      .append("text")
      .text(function (d: any, i: any) { return d.key })
      .attr("x", function (d: any) { return x(d.key) + margin.left })
      .attr("y", height + 20)
      .attr("font-size", "0.8vw")
      .style("text-anchor", "middle");

    var yAxis = svgGroup.append("g")
      .selectAll("yAxis")
      .data(yAxisTicks)
      .enter()

    yAxis.append("rect")
      .attr("x", margin.left - 5)
      .attr("y", function (d: any) { return y(d) })
      .attr("width", 5)
      .attr("height", 1)
      .attr("fill", "black")

    yAxis
      .append("text")
      .text(function (d: any) { return Math.round(d * 100) / 100 })
      .attr("x", function (d: any) {
        if (d.toString().length == 1) { return margin.left - 20 }
        else { return margin.left - 30 }
      })
      .attr("y", function (d: any) { return y(d) + 4 })
      .attr("font-size", "0.8vw")

    svgGroup.append('line')
      .style("stroke", "black")
      .style("stroke-width", 1)
      .attr("x1", margin.left)
      .attr("y1", height)
      .attr("x2", width - margin.left)
      .attr("y2", height);

    svgGroup.append('line')
      .style("stroke", "black")
      .style("stroke-width", 1)
      .attr("x1", margin.left)
      .attr("y1", margin.top)
      .attr("x2", margin.left)
      .attr("y2", height);

    svgGroup
      .append("text")
      .text("Class distributions")
      .attr("x", width / 2)
      .attr("y", height + 45)
      .attr("font-size", "1vw")
      .style("text-anchor", "middle");

    svgGroup
      .append("text")
      .text("Values")
      .attr("x", height / 2)
      .attr("y", 0)
      .attr("font-size", "1vw")
      .style("text-anchor", "middle")
      .attr("transform", "translate(0 0)rotate(90)")

    svgGroup.selectAll("bars")
      .data(inputData)
      .enter()
      .append("rect")
      .attr("id", "rectBar")
      .attr("fill", "#69b3a2")
      .attr("height", function (d: any) { return height - y(d.value) })
      .attr("width", barWidth)
      .attr("x", function (d: any) { return x(d.key) + margin.left - (barWidth / 2) })
      .attr("y", function (d: any) { return y(d.value) })
  }

  /**
   * Updates a Barchart 
   * @param aggregationLevel: Dropdown value for barchart aggregation level (Sum, Mean, etc.)
   * @param predictionInfo: Input data for the chart update
   */
  updateBarChart(aggregationLevel: any, predictionInfo: any) {
    d3.select("#" + this.dataService.barChartId).html("")
    var inputData: any
    if (aggregationLevel == "Mean of confindence") {
      inputData = d3.rollup(predictionInfo, v => d3.mean(v, (d: any) => d.Confidence), (d: any) => d.ClassName)
    } else {
      inputData = d3.group(predictionInfo, (d: any) => d.ClassName)
    }
    var newData: any = []
    inputData.forEach((value: any, key: string) => {
      if (Number(value)) {
        newData.push({ "key": key, "value": value })
      } else {
        newData.push({ "key": key, "value": Number(value.length) })
      }
    });
    this.makeBarChart(newData)
  }


}

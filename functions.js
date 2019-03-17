if (typeof module === "object") {
  let Person = require("./util/Person.js");
  let ChocolateCompany = require("./util/ChocolateCompany.js");
}

// Util functions
function extendParams(params, defaults) {
  let result = {};
  if (typeof defaults === "object")
    Object.getOwnPropertyNames(defaults).forEach(prop => {
      result[prop] = defaults[prop];
    });
  if (typeof params === "object")
    Object.getOwnPropertyNames(params).forEach(prop => {
      result[prop] = params[prop];
    });
  return result;
}

function zip(a, b) {
  return a.map(function(e, i) {
    return [e, b[i]];
  });
}

var defaultColorArray = [
  "rgb(255, 99, 132)",
  "rgb(255, 159, 64)",
  "rgb(255, 205, 86)",
  "rgb(75, 192, 192)",
  "rgb(54, 162, 235)",
  "rgb(153, 102, 255)"
];

function getRandomColor(color) {
  return defaultColorArray[
    Math.floor(Math.random() * defaultColorArray.length)
  ];
}

// Functions
const NuFunctions = {
  addElement: function(elem, arr) {
    return {
      run: () => {
        arr.push(elem);
        return arr;
      },
      menuDoc: `addElement()`,
      displayDoc: `addElement(3, [1,2,3])`,
      doc: `addElement(<i>elem</i>, <i>arr</i>): Add the element <i>elem</i> to the array <i>arr</i>`,
      contextualDoc: `Add ${elem} to ${JSON.stringify(arr)}`
    };
  },

  clear: function() {
    return {
      dirty: true,
      run: () => {
        if (this.drawingLayer) this.drawingLayer.clear();
        if (this.output) this.output.children("*:not(svg)").remove();
      },
      menuDoc: `clear()`,
      displayDoc: `clear()`,
      doc: `clear(): clear all output`,
      contextualDoc: `Clear output`
    };
  },

  display: function(captureData) {
    return {
      dirty: true,
      run: () => {
        let domNode = $(`<div class="telescope-image"></div>`);
        this.output.append(domNode);
        let t = new Telescope();
        t.display(domNode[0], captureData);
      },
      menuDoc: `display()`,
      displayDoc: `display({})`,
      doc: `display(<i>telescopeData</i>): display a telescope capture`,
      contextualDoc: `Display a telescope capture`
    };
  },

  drawBoxPlot: function(min, q1, median, q3, max) {
    return {
      dirty: true,
      run: () => {
        let domNode = $('<div class="box-plot"></div>');
        this.output.append(domNode);
        let width = Math.min(300, this.output.width() - 25);
        let height = 50;
        let barHeight = height - 20;
        let midHeight = barHeight / 2;
        let paper = Raphael(domNode[0], width + 20, height);
        let range = max - min;
        let minStop = 10;
        let q1Stop = minStop + Math.floor(width * (q1 - min) / range);
        let medianStop = minStop + Math.floor(width * (median - min) / range);
        let q3Stop = minStop + Math.floor(width * (q3 - min) / range);
        let maxStop = minStop + Math.floor(width);
        let stops = [minStop, q1Stop, medianStop, q3Stop, maxStop];
        let horizontalLines = paper.path(
          `M${minStop},${midHeight}L${maxStop},${midHeight}M${q1Stop},2L${q3Stop},2M${q1Stop},${barHeight}L${q3Stop},${barHeight}`
        );
        horizontalLines.attr({ stroke: "#000", "stroke-width": 2 });
        stops.forEach(stop => {
          let c = paper.path(`M${stop},2L${stop},${barHeight}`);
          c.attr({ stroke: "#000", "stroke-width": 2 });
        });
        let values = [min, q1, median, q3, max];
        values.forEach((val, i) => {
          let t = paper.text(stops[i], barHeight + 10, val);
        });
      },
      menuDoc: `drawBoxPlot()`,
      displayDoc: `drawBoxPlot(10,30,40,50,60)`,
      contextualDoc: `Create a box plot with the minimum ${min}, 1st quartile ${q1}, median ${median}, 3rd quartile ${q3}, and maximum ${max}`,
      doc: `drawBoxPlot(<i>min</i>,<i>q1</i>,<i>median</i>, <i>q3</i>, <i>max</i>): Create a box plot with the provided min, 1st quartile, median, 3rd quartile, and max values.`
    };
  },
  //
  // drawCircle: function(params) {
  //   let options = { x: 250, y: 50, r: 10, fill: "#f00", stroke: "#000" };
  //   options = extendParams(params, options);
  //   return {
  //     dirty: true,
  //     run: () => {
  //       let circle = this.drawingLayer.circle(options.x, options.y, options.r);
  //       circle.attr("fill", options.fill);
  //       circle.attr("stroke", options.stroke);
  //     },
  //     menuDoc: `drawCircle()`,
  //     displayDoc: `drawCircle({x: ${options.x}, y: ${options.y}, r:${options.r}, fill:'${options.fill}', stroke:'${options.stroke}'})`,
  //     doc: `drawCircle({x, y, r, fill, stroke}): Draw circle with specified properties`,
  //     contextualDoc: `Draw Circle at (${options.x}, ${options.y}) with radius ${options.r}, fill color ${options.fill}, and stroke color ${options.stroke}`
  //   };
  // },
  drawHistogram: function(vals, bin) {
    return {
      dirty: true,
      run: () => {
        let labels = [];
        vals = vals.sort((a, b) => a - b);
        let series = [[]];
        for (let i = vals[0]; i <= vals[vals.length - 1]; i += bin) {
          let upper = i + bin;
          labels.push(i + "-" + (upper % 1 === 0 ? upper - 1 : upper));
          series[0].push(0);
        }
        vals.forEach(function(v) {
          let b = Math.floor((v - vals[0]) / bin);
          series[0][b]++;
        });

        let domNode = $('<div class="ct-chart"></div>');
        this.output.append(domNode);
        let data = {
          labels,
          series
        };
        let width = this.output.width();
        let barWidth = (width - 65) / labels.length;
        let options = {
          width: width,
          height: "200px",
          axisY: {
            onlyInteger: true
          },
          classNames: {
            bar: `ct-bar ct-bar-${i}`
          }
        };
        let chart = Chartist.Bar(domNode, data, options);
        chart.on("draw", () => {
          $(`.ct-bar-${i}`).css({ "stroke-width": barWidth + "px" });
        });
      },
      menuDoc: `drawHistogram()`,
      displayDoc: `drawHistogram([1,1,1,2,3,4,5,7,7,7], 2)`,
      contextualDoc: `Create a histogram graph with the provided data, with ${bin} as the bin size`,
      doc: `drawHistogram(<i>vals</i>,<i>bin</i>): Create a histogram with the provided data and the specified size of <i>bin</i>`
    };
  },
  //
  // drawRectangle: function(params) {
  //   let options = { x: 50, y: 50, w: 10, h: 10, fill: "#f00", stroke: "#000" };
  //   options = extendParams(params, options);
  //   return {
  //     dirty: true,
  //     run: () => {
  //       let rectangle = this.drawingLayer.rect(
  //         options.x,
  //         options.y,
  //         options.w,
  //         options.h
  //       );
  //       rectangle.attr("fill", options.fill);
  //       rectangle.attr("stroke", options.stroke);
  //     },
  //     menuDoc: `drawRectangle()`,
  //     displayDoc: `drawRectangle({x: ${options.x}, y: ${options.y}, w: ${options.w}, h: ${options.h}, fill: '${options.fill}', stroke: '${options.stroke}'})`,
  //     doc: `drawRectangle({x, y, width, height, fill, stroke}): Draw rectangle with specified properties`,
  //     contextualDoc: `Draw a ${options.w}x${options.h} Rectangle at (${options.x}, ${options.y}), with fill color ${options.fill} and stroke color ${options.stroke}`
  //   };
  // },

  drawStemplot: function(vals) {
    return {
      dirty: true,
      run: () => {
        vals = vals.sort((a, b) => a - b);
        let stringVals = vals.map(v => v.toString());
        let stems = _.range(
          Math.floor(vals[0] / 10.0),
          Math.floor(vals[vals.length - 1] / 10.0) + 1
        );
        let leaves = stems.map(stem => {
          if (stem === 0) return stringVals.filter(v => v.length === 1);
          return stringVals
            .filter(v => v.substring(0, v.length - 1) === stem.toString())
            .map(v => v[v.length - 1]);
        });
        console.log(leaves);
        let output = "<table class='stemplot'>";
        stems.forEach((stem, i) => {
          output =
            output +
            "<tr><td>" +
            stem +
            "</td><td>" +
            leaves[i].join(" ") +
            "</td></tr>";
        });
        output = output + "</table>";
        this.output.append(output);
      },
      menuDoc: `drawStemplot()`,
      displayDoc: `drawStemplot([10,10,11,12,23,24,35,47,48,48], 2)`,
      contextualDoc: `Create a stem-and-leaf plot with the provided data`,
      doc: `drawStemplot(<i>vals</i>): Create a stem-and-leaf plot with the provided data`
    };
  },

  getChocolateCompany: function() {
    return {
      run: () => {
        return new ChocolateCompany();
      },
      menuDoc: "getChocolateCompany()",
      displayDoc: "getChocolateCompany()",
      doc: `getChocolateCompany(): Returns a fresh new Chocolate Company Simulator`,
      contextualDoc: `Return a new Chocolate Company Simulator`
    };
  },

  getData: function(name) {
    return {
      run: () => {
        return NuData[name];
      },
      menuDoc: `getData()`,
      displayDoc: `getData('Integers from 1 to 10')`,
      doc: `getData(name): Find and return the data associated with <i>name</i>`,
      contextualDoc: `Return the ${name} dataset`
    };
  },
  getLeaf: function(num) {
    return {
      run: () => {
        if (num % 1 !== 0) return "Sorry, this only works on integers!";
        if (num < 0) {
          num = -1 * num;
        }
        return num - 10 * Math.floor(num / 10);
      },
      menuDoc: `getLeaf()`,
      displayDoc: `getLeaf(104)`,
      doc: `getLeaf(num): Return the leaf of the number <i>num</i>`,
      contextualDoc: `Return the leaf of ${num}`
    };
  },

  getRandomColor: function(shadeOf) {
    return {
      run: () => {
        if (shadeOf) return randomColor({ hue: shadeOf });
        return randomColor();
      },
      menuDoc: `getRandomColor()`,
      displayDoc: `getRandomColor()`,
      doc: `Return a random color, as a hex string`,
      contextualDoc: shadeOf
        ? `Return a random shade of ${shadeOf}, as a hex string`
        : `Return a random color, as a hex string`
    };
  },

  getRandomPerson: function() {
    return {
      run: () => {
        return new Person();
      },
      menuDoc: "getRandomPerson()",
      displayDoc: "getRandomPerson()",
      doc: `getRandomPerson(): Return a random Person`,
      contextualDoc: `Return a random person`
    };
  },

  getRandomInteger: function(min, max) {
    return {
      run: () => {
        return Math.floor(Math.random() * (max - min + 1) + min);
      },
      menuDoc: "getRandomInteger()",
      displayDoc: "getRandomInteger(0, 10)",
      doc: `getRandomInteger(<i>min</i>,<i>max</i>): Return a random integer between <i>min</i> and <i>max</i>, inclusive`,
      contextualDoc: `Return a random integer that is either ${min}, ${max}, or some number in between`
    };
  },
  getSize: function() {
    return {
      dirty: true,
      run: () => {
        return { w: this.output.width(), h: this.output.height() };
      },
      menuDoc: `getSize()`,
      displayDoc: `getSize()`,
      doc: `getSize(): Return the dimensions of the output area`,
      contextualDoc: `Return the dimensions of the output area`
    };
  },
  getStem: function(num) {
    return {
      run: () => {
        if (num % 1 !== 0) return "Sorry, this only works on integers!";
        let negative = "";
        if (num < 0) {
          negative = "-";
          num = -1 * num;
        }
        return negative + Math.floor(num / 10);
      },
      menuDoc: `getStem()`,
      displayDoc: `getStem(104)`,
      doc: `getStem(num): Return the stem of the number <i>num</i>`,
      contextualDoc: `Return the stem of ${num}`
    };
  },
  getSubarray: function(data, start, end) {
    return {
      run: () => {
        return data.slice(Math.max(0, start), end + 1);
      },
      menuDoc: `getSubarray()`,
      displayDoc: `getSubarray([1, 2, 3, 4], 0, 1)`,
      contextualDoc: `Return an array that's the part of ${data} starting at index ${start} and ending at index ${end}`,
      doc: `getSubarray(<i>data, start, end</i>): Return the part of data that starts at index start and ends at index end`
    };
  },
  inArray: function(val, arr) {
    return {
      run: () => {
        return arr.indexOf(val) > -1;
      },
      menuDoc: `inArray()`,
      displayDoc: `inArray(2,[1,2,3])`,
      doc: `inArray(<i>val, arr</i>): Returns true if <i>val</i> is in <i> arr </i>, and false otherwise.`,
      contextualDoc: `Returns true if ${val} is in ${JSON.stringify(arr)}`
    };
  },
  isEven: function(number) {
    return {
      run: () => {
        return number % 2 === 0;
      },
      menuDoc: `isEven()`,
      displayDoc: `isEven(2)`,
      doc: `isEven(): Returns whether the number is even or not`,
      contextualDoc: `Return whether ${number}$ is even or not`
    };
  },

  size: function(arr) {
    return {
      run: () => {
        return arr.length;
      },
      menuDoc: `size()`,
      displayDoc: `size([1,2,3])`,
      doc: `size(arr): Return the size of the array <i> arr </i>`,
      contextualDoc: `Return the size of [${arr ? arr.toString() : ""}]`
    };
  },
  print: function(text) {
    let docRepresentation = "";
    if (text === undefined) {
      text = "<br />";
      docRepresentation = "a newline";
    } else if (text.constructor === Person || text.dataType === "person") {
      text = new Person(text);
      docRepresentation = text.toString();
      text = text.toID();
    } else if (
      text.constructor === RoastingData ||
      text.dataType === "roastingData"
    ) {
      text = new RoastingData([text.reviews, text.comment]).toString();
      docRepresentation = text;
    } else {
      docRepresentation = `the string '${text}'`;
    }
    return {
      dirty: true,
      run: () => {
        this.output.append(`<div>${text}</div>`);
      },
      menuDoc: `print()`,
      displayDoc: `print("Hello, World!")`,
      doc: `print(<i>text</i>): prints out <i>text</i> followed by a newline`,
      contextualDoc: `Print out ${docRepresentation} then go to the next line`
    };
  },
  max: function(x, y) {
    return {
      run: () => {
        return Math.max(x, y);
      },
      menuDoc: `max()`,
      displayDoc: `max(1,2)`,
      contextualDoc: `Return the max of ${x} and ${y}.`,
      doc: `max(<i>x,y</i>): Return the max of x and y.`
    };
  },
  min: function(x, y) {
    return {
      run: () => {
        return Math.min(x, y);
      },
      menuDoc: `min()`,
      displayDoc: `min(1,2)`,
      contextualDoc: `Return the min of ${x} and ${y}`,
      doc: `min(<i>x,y</i>): Return the min of x and y.`
    };
  },
  showBarChart: function(labels, data, opts) {
    return {
      dirty: true,
      run: () => {
        let domNode = $(
          '<canvas class="ct-barchart" id = "chartjs-barchart-${i}"></canvas>'
        );

        this.output.append(domNode);
        var colors, xAxisTitle, yAxisTitle, title;

        if (opts) {
          colors = opts.color || getRandomColor();
          xAxisTitle = opts.xAxis || false;
          yAxisTitle = opts.yAxis || false;
          title = opts.title || false;
        } else {
          colors = getRandomColor();
        }

        new Chart(domNode[0], {
          type: "bar",
          data: {
            labels,
            datasets: [
              {
                data,
                backgroundColor: colors
              }
            ]
          },
          options: {
            legend: {
              display: false
            },
            title: {
              display: title,
              text: title
            },
            scales: {
              xAxes: [
                {
                  scaleLabel: {
                    display: xAxisTitle,
                    labelString: xAxisTitle
                  }
                }
              ],
              yAxes: [
                {
                  scaleLabel: {
                    display: yAxisTitle,
                    labelString: yAxisTitle
                  },
                  ticks: {
                    beginAtZero: true
                  }
                }
              ]
            }
          }
        });
      },
      menuDoc: `showBarChart()`,
      displayDoc: `showBarChart(["Jan", "Feb", "March"], [121, 232, 111], {title : "My Chart"})`,
      contextualDoc: `Create a bar graph`,
      doc: `showBarChart(<i>labels</i>,<i>data</i>,<i>options</i>): Create a bar chart with provided data.`
    };
  },
  showGraph: function(data) {
    return {
      dirty: true,
      run: () => {
        let domNode = $(
          '<canvas class="ct-chart" id = "chartjs-chart-${i}"></canvas>'
        );
        this.output.append(domNode);
        if (data.dataType === "roastingData") {
          new Chart(domNode[0], {
            type: "bar",
            data: {
              labels: data.labels,
              datasets: [
                {
                  label: "# of Ratings",
                  data: data.reviews,
                  backgroundColor: [
                    "rgba(255, 99, 132, 0.2)",
                    "rgba(255, 153, 0, 0.2)",
                    "rgba(255, 206, 86, 0.2)",
                    "rgba(75, 192, 192, 0.2)",
                    "rgba(153, 102, 255, 0.2)",
                    "rgba(54, 162, 235, 0.2)"
                  ],
                  borderColor: [
                    "rgba(255,99,132,1)",
                    "rgba(255, 153, 0, 1)",
                    "rgba(255, 206, 86, 1)",
                    "rgba(75, 192, 192, 1)",
                    "rgba(153, 102, 255, 1)",
                    "rgba(54, 162, 235, 1)"
                  ],
                  borderWidth: 1
                }
              ]
            },
            options: {
              title: {
                display: true,
                text: "Chocolate Ratings"
              },
              scales: {
                yAxes: [
                  {
                    ticks: {
                      beginAtZero: true
                    }
                  }
                ],
                xAxes: [
                  {
                    scaleLabel: {
                      display: true,
                      labelString: "Rating"
                    }
                  }
                ]
              }
            }
          });
        }
      },
      menuDoc: `showGraph()`,
      displayDoc: `showGraph()`,
      contextualDoc: `Create a graph with provided data`,
      doc: `showGraph(<i>data</i>): Create a pre-determined graph with provided data.`
    };
  },
  showLineGraph: function(labels, data, opts) {
    return {
      dirty: true,
      run: () => {
        let domNode = $(
          '<canvas class="ct-linegraph" id = "chartjs-linegraph-${i}"></canvas>'
        );
        this.output.append(domNode);
        var colors, xAxisTitle, yAxisTitle, title;

        if (opts) {
          colors = opts.color || getRandomColor();
          xAxisTitle = opts.xAxis || false;
          yAxisTitle = opts.yAxis || false;
          title = opts.title || false;
        } else {
          colors = getRandomColor();
        }

        new Chart(domNode[0], {
          type: "line",
          data: {
            labels,
            datasets: [
              {
                data,
                fill: false,
                backgroundColor: colors,
                borderColor: colors
              }
            ]
          },
          options: {
            legend: {
              display: false
            },
            title: {
              display: title,
              text: title
            },
            scales: {
              xAxes: [
                {
                  scaleLabel: {
                    display: xAxisTitle,
                    labelString: xAxisTitle
                  }
                }
              ],
              yAxes: [
                {
                  scaleLabel: {
                    display: yAxisTitle,
                    labelString: yAxisTitle
                  },
                  ticks: {
                    beginAtZero: true
                  }
                }
              ]
            }
          }
        });
      },
      menuDoc: `showLineGraph()`,
      displayDoc: `showLineGraph(["Jan", "Feb", "March"], [121, 232, 111], {title : "My Line Chart"})`,
      contextualDoc: `Create a line graph`,
      doc: `showLineGraph(<i>labels</i>,<i>data</i>,<i>options</i>): Create a bar chart with provided data.`
    };
  },
  showPieChart: function(labels, data, opts) {
    return {
      dirty: true,
      run: () => {
        let domNode = $(
          '<canvas class="ct-piechart" id = "chartjs-piechart-${i}"></canvas>'
        );
        this.output.append(domNode);
        var colors, title;

        if (opts) {
          colors =
            opts.color ||
            data.map((x, i) => {
              return defaultColorArray[i % 6];
            });
          title = opts.title || false;
        } else {
          colors = data.map((x, i) => {
            return defaultColorArray[i % 6];
          });
        }

        new Chart(domNode[0], {
          type: "pie",
          data: {
            labels,
            datasets: [
              {
                data,
                backgroundColor: colors
              }
            ]
          },
          options: {
            title: {
              display: title,
              text: title
            },
            animation: {
              animateRotate: false
            }
          }
        });
      },
      menuDoc: `showPieChart()`,
      displayDoc: `showPieChart(["Jan", "Feb", "March"], [121, 232, 111], {title : "My Pie Chart"})`,
      contextualDoc: `Create a pie chart`,
      doc: `showLineGraph(<i>labels</i>,<i>data</i>,<i>options</i>): Create a pie chart with provided data.`
    };
  },
  showTable: function(data, y, xVar, yVar) {
    xVar = xVar || "x";
    yVar = yVar || "y";
    if (y) {
      data = zip(data, y).map(item => {
        return {
          [xVar]: item[0],
          [yVar]: item[1]
        };
      });
    }
    return {
      dirty: true,
      run: () => {
        let head = "";
        let rows = data;
        if (data[0] === Object(data[0])) {
          let keys = Object.getOwnPropertyNames(data[0]);
          head = "<thead>";
          keys.forEach(k => {
            head = head + `<td>${k}</td>`;
          });
          head = head + "</thead>";
          rows = data.map(datum => {
            let row = "<tr>";
            keys.forEach(k => {
              row = row + `<td>${datum[k]}</td>`;
            });
            row = row + "</tr>";
            return row;
          });
        } else {
          head = "";
          rows = data.map(datum => {
            return `<td>${datum}</td>`;
          });
        }
        this.output.append(
          `<table class="table-striped table-bordered table-condensed">${head}${rows.join("")}</table>`
        );
      },
      menuDoc: `showTable()`,
      displayDoc: `showTable([1,2,3], [2,4,6], 'Number', 'Number Doubled')`,
      contextualDoc: `Display arrays as a data table.`,
      doc: `showTable(<i>x</i>, <i>y</i>, <i>xHead</i>, <i>yHead</i>): display <i>x</i> and <i>y</i> as a data table, with headings <i>xHead</i> and <i>yHead</i>.`
    };
  },
  sort: function(data) {
    return {
      run: () => {
        return [...data].sort(function(a, b) {
          return a - b;
        });
      },
      menuDoc: `sort()`,
      displayDoc: `sort([3,2,1,4])`,
      doc: `sort(${data})`,
      contextualDoc: `sort(<i>data</i>): sorts <i>data</i> in ascending order`
    };
  },
  // startLoop: function(loop) {
  //     return {
  //         dirty: true,
  //         run: () => {
  //             if (this.animationFrame !== 0) window.cancelAnimationFrame(this.animationFrame);
  //             let loopBody = (tick) => {
  //                 loop(tick);
  //                 if (this.animationFrame !== 0) {
  //                     this.animationFrame = window.requestAnimationFrame(loopBody);
  //                 }
  //             };
  //             this.animationFrame = window.requestAnimationFrame(loopBody);
  //         },
  //         menuDoc: `startLoop()`,
  //         displayDoc: `startLoop()`,
  //         doc: `startLoop(loop): Start an infinite animation loop of the provided function`,
  //         contextualDoc: `Start an infinite animation loop of the provided function`
  //     };
  // },
  //
  // stopLoop: function() {
  //     return {
  //         dirty: true,
  //         run: () => {
  //             if (this.animationFrame !== 0) {
  //                 window.cancelAnimationFrame(this.animationFrame);
  //                 this.animationFrame = 0;
  //             }
  //         },
  //         menuDoc: `stopLoop()`,
  //         displayDoc: `stopLoop()`,
  //         doc: `stopLoop(): Stop the currently running animation loop`,
  //         contextualDoc: `Stop the currently running animation loop`,
  //     };
  // },
  sum: function(data) {
    return {
      run: () => {
        let total = 0;
        for (let i = 0; i < data.length; i += 1) {
          total += data[i];
        }
        return total;
      },
      menuDoc: `sum()`,
      displayDoc: `sum([1,2,3,4,5])`,
      doc: `sum(<i>array</i>): returns the sum of the values in an array`,
      contextualDoc: `Return the sum of ${data}`
    };
  }
};

if (typeof module === "object") {
  module.exports = {
    NuFunctions: NuFunctions
  };
}

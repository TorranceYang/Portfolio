class Roaster {
  constructor(r) {
    if (r) {
      Object.getOwnPropertyNames(r).forEach(prop => {
        this[prop] = r[prop];
      });
      return;
    }
    this.reviews = [0, 0, 0, 0, 0];
    this.comment = "You haven't roasted the beans yet!";
    this.roastingData = null;
  }

  //Lanczos method to approximate Gamma
  gamma(z) {
    var g = 7;
    var C = [
      0.99999999999980993,
      676.5203681218851,
      -1259.1392167224028,
      771.32342877765313,
      -176.61502916214059,
      12.507343278686905,
      -0.13857109526572012,
      9.9843695780195716e-6,
      1.5056327351493116e-7
    ];

    if (z < 0.5) {
      return Math.PI / (Math.sin(Math.PI * z) * this.gamma(1 - z));
    } else {
      z -= 1;

      var x = C[0];
      for (var i = 1; i < g + 2; i++)
        x += C[i] / (z + i);

      var t = z + g + 0.5;
      return Math.sqrt(2 * Math.PI) * Math.pow(t, z + 0.5) * Math.exp(-t) * x;
    }
  }

  betaFunction(x, y) {
    return this.gamma(x) * this.gamma(y) / this.gamma(x + y);
  }

  betaPDF(x, a, b) {
    return (
      Math.pow(x, a - 1) * Math.pow(1 - x, b - 1) / this.betaFunction(a, b)
    );
  }

  roastBeans(temperature, time) {
    if (temperature < 70 || time < 15) {
      this.reviews = [500, 0, 0, 0, 0];
      this.comment =
        "The beans come out severly undercooked. Everyone hates your chocolate.";
      return;
    }
    if (temperature >= 130 || time >= 69) {
      this.reviews = [500, 0, 0, 0, 0];
      this.comment =
        "The beans come out burned and unpleasant to eat. Nobody likes your chocolate.";
      return;
    }

    var distribution = [
      [[5, 2], [0.5, 0.5], [1.5, 1.5]],
      [[2, 2], [4, 3], [0.2, 0.2]],
      [[2, 5], [2, 5], [1, 4]]
    ];

    this.reviews = this.generateDistribution(
      distribution[Math.floor((temperature - 70) / 20)][
        Math.floor((time - 15) / 18)
      ],
      temperature,
      time
    );

    this.comment = [
      [
        "The beans come out with a strong sweet, caramel aroma",
        "The beans come out extra sweet",
        "The beans come out with a strong chocolately aroma"
      ],
      [
        "The beans come out looking extra bright",
        "The beans come out with an extra chocolately flavor",
        "The beans come out bitter"
      ],
      [
        "The beans come out dry",
        "The beans come out with a toasted flavor",
        "The beans come out with a strong burnt aroma"
      ]
    ][Math.floor((temperature - 70) / 20)][Math.floor((time - 15) / 18)];
  }

  generateDistribution(shape, temperature, time) {
    var points = [];
    var sum = 0;

    //Forced variance
    var start =
      0.05 + ((temperature - 15) % 18 - 9 + ((time - 70) % 20 - 10)) * 0.001;
    var diff = (1 - 2 * start) / 4;

    for (var i = 0; i < 5; i++) {
      points[i] = this.betaPDF(i * diff + start, shape[0], shape[1]);
      sum += points[i];
    }

    var jankRounding = 0;
    for (var i = 0; i < points.length; i++) {
      if (i === points.length - 1) {
        points[i] = 500 - jankRounding;
      } else {
        points[i] = Math.floor(points[i] / sum * 500);
        jankRounding += points[i];
      }
    }

    //Manually adjusting polarization
    if (shape[0] === 5 && shape[1] == 2) {
      points[0] = Math.floor(
        (points[1] + points[2] + points[3] + points[4]) / 4
      );
      points[1] = Math.floor(points[1] / 4);
      points[2] = Math.floor(points[2] / 4);
      points[3] = Math.floor(points[3] / 4);
      points[4] = 500 - points[0] - points[1] - points[2] - points[3];
    }
    if (shape[0] === 2 && shape[1] == 5) {
      points[4] = Math.floor(
        (points[0] + points[1] + points[2] + points[3]) / 4
      );
      points[1] = Math.floor(points[1] / 4);
      points[2] = Math.floor(points[2] / 4);
      points[3] = Math.floor(points[3] / 4);
      points[0] = 500 - points[1] - points[2] - points[3] - points[4];
    }
    return points;
  }

  getRoastingData() {
    if (!this.roastingData) {
      this.roastingData = new RoastingData([this.reviews, this.comment]);
    }
    return this.roastingData;
  }
}

//Not really useful, but could be expanded
class RoastingData {
  constructor(rd) {
    if (rd) {
      this.reviews = rd[0];
      this.comment = rd[1];
    } else {
      this.reviews = [0, 0, 0, 0, 0];
      this.comment = "You haven't roasted the beans yet!";
    }
    this.dataType = "roastingData";
    this.labels = ["1 Star", "2 Stars", "3 Stars", "4 Stars", "5 Stars"];
  }

  toString() {
    return `<div class="roasting"> ${this.comment} <br /> <br /> Reviews = [ ${this.reviews} ] </div>`;
  }
}

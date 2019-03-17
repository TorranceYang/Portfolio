class ChocolateCompany {
  constructor(c) {
    if (c && c.dataType === "chocolatecompany") {
      Object.getOwnPropertyNames(c).forEach(prop => {
        switch (c[prop] && c[prop].dataType) {
          case "beans":
            this[prop] = new Beans(c[prop]);
            break;
          case "farm":
            this[prop] = new Farm(c[prop]);
            break;
          case "kitchen":
            this[prop] = new Kitchen(c[prop]);
            break;
          case "roaster":
            this[prop] = new Roaster(c[prop]);
            break;
          case "toppings":
            this[prop] = new Toppings(c[prop]);
            break;
          case "packaging":
            this[prop] = new Packaging(c[prop]);
            break;
          default:
            this[prop] = c[prop];
            break;
        }
      });

      return;
    }

    //Setup
    this.dataType = "chocolatecompany";
    this.startingMoney = 10000000;

    //Company Properties
    this.money = this.startingMoney;
    this.name = null;
    this.profit = 0;
    this.shipping = null;
    this.stage = "farming";

    //TODO
    this.criticScore = 0;
    this.greenScore = 0;
    this.worker = null;

    //Internal Objects
    this.beans = new Beans();
    this.farm = new Farm();
    this.kitchen = new Kitchen();
    this.roaster = new Roaster();
    this.toppings = new Toppings();
    this.packaging = new Packaging();
  }

  display(domElement) {
    switch (this.stage) {
      case "farming":
        this.farm.display(domElement, this.name);
        break;
      case "fermenting":
        this.beans.display(domElement, this.beans.kind);
        break;
      case "mixing":
        this.kitchen.display(domElement);
        break;
      case "toppings":
        this.toppings.display(domElement);
        break;
      case "packaging":
        this.packaging.display(
          domElement,
          this.name,
          this.getChocolateType(),
          this.getToppingDescriptions()
        );
        break;
    }
  }

  getMoney() {
    return this.money;
  }

  getMoneySpent() {
    return this.startingMoney - this.money;
  }

  hire(type, hours) {
    var workerTypes = ["A", "B", "C", "D"];
    var pph = [35, 42, 50, 60];
    var wage = [5.5, 6.25, 7.75, 9.25];
    var workerIndex = workerTypes.indexOf(type);
    if (workerIndex < 0) throw new Error("Please select a valid worker");
    this.money -= wage[workerIndex] * hours;
    if (this.money < 0)
      throw new Error("You don't have enough money to make this purchase");
  }

  setName(name) {
    this.name = name;
  }

  setShipping(shipping) {
    this.shipping = shipping;
  }

  status() {
    if (this.stage === "fermenting") {
      return this.beans.status();
    }
  }

  wait(waitTime, units) {
    if (this.stage === "farming") {
      this.waitFarm(waitTime, units);
    }
    if (this.stage === "fermenting") {
      this.waitFerment(waitTime, units);
    }
  }

  /*Beans*/

  harvestBeans() {
    this.stage = "fermenting";
  }

  waitFerment(time, units) {
    this.beans.wait(this.farm.getCrop(), time, units);
  }

  /*Farm*/

  buyAcres(numberOfAcres) {
    if (this.money - numberOfAcres * 10000 < 0)
      throw new Error("You don't have enough money to make this purchase");

    this.farm.buyAcres(numberOfAcres);
    this.money -= numberOfAcres;
  }

  getAcres() {
    return this.farm.getAcres();
  }

  getPods() {
    return this.farm.getPods();
  }

  getTrees() {
    return this.farm.getTrees();
  }

  plant(numberOfTrees) {
    if (this.money - numberOfTrees * 50 < 0)
      throw new Error("You don't have enough money to make this purchase");
    this.farm.plant(numberOfTrees);
    this.money -= numberOfTrees * this.getAcres() * 50;
  }

  setCrop(crop) {
    this.farm.setCrop(crop);
  }

  setLocation(location) {
    this.farm.setLocation(location);
  }

  setShadeGrown(choice) {
    this.farm.setShadeGrown(choice);
  }

  spray(treat) {
    this.farm.spray(treat);
  }

  waitFarm(waitTime, units) {
    this.farm.waitFarm(waitTime, units);
  }

  /*Kitchen*/

  getChocolateType() {
    return this.kitchen.getChocolateType();
  }

  setIngredients(cocoaButter, cocoaMass, milk, sugar) {
    this.stage = "mixing";
    this.kitchen.setIngredients(cocoaButter, cocoaMass, milk, sugar);
  }

  /*Roaster */

  getRoastingData() {
    return this.roaster.getRoastingData();
  }

  roastBeans(temperature, time) {
    this.roaster.roastBeans(temperature, time);
  }

  /*Toppings*/

  addToppings(toppings) {
    this.stage = "toppings";
    this.toppings.setChocolateType(this.getChocolateType());
    this.toppings.addToppings(toppings);
  }

  getToppings() {
    return this.toppings.getToppings();
  }

  getToppingDescriptions() {
    return this.toppings.getToppingDescriptions();
  }

  /*Packaging*/

  setBackgroundColor(color) {
    this.stage = "packaging";
    this.packaging.setBackgroundColor(color);
  }

  setFontColor(color) {
    this.stage = "packaging";
    this.packaging.setFontColor(color);
  }

  setHighlightColor(color) {
    this.stage = "packaging";
    this.packaging.setHighlightColor(color);
  }
}

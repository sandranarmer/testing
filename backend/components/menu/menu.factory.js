// menu.factory.js

class MenuItem {
  constructor(name, price, description) {
    // Ensure the MenuItem class cannot be instantiated directly
    if (this.constructor === MenuItem) {
      throw new Error("Abstract class MenuItem cannot be instantiated directly.");
    }
    this.name = name;
    this.price = price;
    this.description = description;
  }

  display() {
    return `${this.name} - $${this.price}: ${this.description}`;
  }
}

class Beverage extends MenuItem {
  constructor(name, price, description, size) {
    super(name, price, description);
    this.size = size;
    this.type = 'beverage';
  }

  display() {
    return `${super.display()} (Size: ${this.size})`;
  }
}

class Dessert extends MenuItem {
  constructor(name, price, description, calories) {
    super(name, price, description);
    this.calories = calories;
    this.type = 'dessert';
  }

  display() {
    return `${super.display()} (Calories: ${this.calories})`;
  }
}

class MainCourse extends MenuItem {
  constructor(name, price, description, servingSize) {
    super(name, price, description);
    this.servingSize = servingSize;
    this.type = 'maincourse';
  }

  display() {
    return `${super.display()} (Serving Size: ${this.servingSize})`;
  }
}

class MenuItemFactory {
  static createMenuItem(type, name, price, description, extraProperty) {
    // Ensure valid menu item type and create the appropriate instance
    switch (type.toLowerCase()) {
      case "beverage":
        return new Beverage(name, price, description, extraProperty); // Size for beverages
      case "dessert":
        return new Dessert(name, price, description, extraProperty); // Calories for desserts
      case "maincourse":
        return new MainCourse(name, price, description, extraProperty); // Serving size for main courses
      default:
        throw new Error(`Menu item type '${type}' is not recognized.`);
    }
  }
}

module.exports.MenuItemFactory = MenuItemFactory;

export function NumToMeat(num) {
    let meat;
  
    switch (num) {
      case 0:
        meat = "Hotdog";
        break;
      case 1:
        meat = "Hamburger";
        break;
      case 2:
        meat = "Turkey Burger";
        break;
      case 3:
        meat = "Veggie Burger";
        break;
      case 4:
        meat = "Special";
        break;
      default:
        meat = "Unknown";
        break;
    }
  
    return meat;
  }
  
  export function NumToDoneness(num) {
    let doneness;
  
    switch (num) {
      case 1:
        doneness = "Rare";
        break;
      case 2:
        doneness = "Medium Rare";
        break;
      case 3:
        doneness = "Medium";
        break;
      case 4:
        doneness = "Medium Well";
        break;
      case 5:
        doneness = "Well Done";
        break;
      case 6:
        doneness = "Special";
        break;
      default:
        doneness = "Unknown";
        break;
    }
  
    return doneness;
  }
  
  export function DonenessToNum(doneness) {
    let num;
  
    switch (doneness) {
      case "Rare":
        num = 1;
        break;
      case "Medium Rare":
        num = 2;
        break;
      case "Medium":
        num = 3;
        break;
      case "Medium Well":
        num = 4;
        break;
      case "Well Done":
        num = 5;
        break;
      default:
        num = 6;
        break;
    }
  
    return num;
  }
  
  export function NumToType(num) {
    let type;
  
    switch (num) {
      case 1:
        type = "Normal";
        break;
      case 2:
        type = "Hot Link";
        break;
      case 3:
        type = "Sausage";
        break;
      case 4:
        type = "Special";
        break;
      default:
        type = "Unknown";
        break;
    }
  
    return type;
  }
  
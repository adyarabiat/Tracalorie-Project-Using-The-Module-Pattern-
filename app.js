// We are going to make controllers to our app:
// 1.Item Controller
// 2.UI Controller
// 3.App Controller

// ***********************************************************************************

// Item Controller
const ItemCtrl = (function () {
  // Constructure

  const Item = function (id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  };

  // Data Structure /State9
  const data = {
    items: [],
    currentItem: null,
    totalCaloriesL: 0,
  };

  return {
    getItems: () => {
      return data.items;
    },

    addItem: (name, calories) => {
      //  Create ID
      let ID;
      if (data.items.length > 0) {
        ID = data.items[data.items.length - 1].id + 1; //To add on the Id
      } else {
        ID = 0;
      }

      // Calories to number
      calories = parseInt(calories);

      // Create new Item
      newItem = new Item(ID, name, calories);

      // Add to items array

      data.items.push(newItem);
      return newItem;
    },
    getItemByID: (actualID) => {
      let found = null;
      data.items.forEach((item) => {
        if (item.id === actualID) {
          //We use == not === becouse when we split it give us the item and the number as string so the solution for this either use this == so it is not strict or use parseInt when we define the id  actualID = idArr[1]
          found = item;
        }
      });
      return found;
    },
    updateItem: (name, calories) => {
      // Callories to number
      calories = parseInt(calories);

      let found = null;
      data.items.forEach((item) => {
        if (item.id === data.currentItem.id) {
          item.name = name;
          item.calories = calories;
          found = item;
        }
      });
      return found;
    },
    deleteItem: (id) => {
      // Get Id
      const ids = data.items.map((item) => {
        //So same like forEach but it return somthing
        return item.id;
      });
      // Get index
      const index = ids.indexOf(id);

      // Remove item
      data.items.splice(index, 1);
    },

    setCurrentItem: (item) => {
      data.currentItem = item;
    },
    getTotalCalories: () => {
      let total = 0;
      data.items.forEach((item) => {
        total += item.calories;
      });
      data.totalCaloriesL = total; //So this the total in the data Object

      return data.totalCaloriesL;
    },
    getCurrentItem: () => {
      return data.currentItem;
    },
    clearAllITems: () => {
      data.items = [];
    },

    logData: () => {
      return data;
    },
  };
})();

// ***********************************************************************************

// UI Controller
const UICtrl = (function () {
  return {
    showItems: (items) => {
      let ui = "";
      items.forEach((item) => {
        ui += ` <li class="collection-item" id="item-${item.id}">
        <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
        <a href="#" class="secondary-content">
          <i class="edit-item fa fa-pencil"></i>
        </a>
      </li>`;
      });

      document.querySelector("#item-list").innerHTML = ui;
    },
    addListItem: (item) => {
      // Create it here
      const li = document.createElement("li");
      // Add class
      li.className = "collection-item";
      // Add ID
      li.id = `item-${item.id}`;
      // Add HTML
      li.innerHTML = ` <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
      <a href="#" class="secondary-content">
        <i class="edit-item fa fa-pencil"></i>
      </a>`;
      // Insert item
      document
        .querySelector("#item-list")
        .insertAdjacentElement("beforeend", li);
    },
    clearInput: () => {
      document.querySelector("#item-name").value = "";
      document.querySelector("#item-calories").value = "";
    },
    addItemToForm: () => {
      document.querySelector(
        "#item-name"
      ).value = ItemCtrl.getCurrentItem().name;
      document.querySelector(
        "#item-calories"
      ).value = ItemCtrl.getCurrentItem().calories;
      document.querySelector(".update-btn").style.display = "inline";
      document.querySelector(".delete-btn").style.display = "inline";
      document.querySelector(".back-btn").style.display = "inline";
      document.querySelector(".add-btn").style.display = "none";
    },
    getItemsInput: () => {
      return {
        name: document.querySelector("#item-name").value,
        calories: document.querySelector("#item-calories").value,
      };
    },
    updateListItem: (item) => {
      let listItem = document.querySelectorAll("#item-list li"); //It will give me Node list

      // Convert Node list into array
      listItem = Array.from(listItem);

      listItem.forEach((list) => {
        const itemID = list.getAttribute("id"); //To get the id

        if (itemID === `item-${item.id}`) {
          document.querySelector(
            `#${itemID}`
          ).innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
          <a href="#" class="secondary-content">
            <i class="edit-item fa fa-pencil"></i>
          </a>`;
        }
      });
    },
    deleteItem: (id) => {
      const itemID = `#item-${id}`;
      const item = document.querySelector(itemID);
      item.remove();
    },
    showTotalCalories: (total) => {
      document.querySelector(".total-calories").innerHTML = total;
    },
    clearEditState: () => {
      UICtrl.clearInput();
      document.querySelector(".update-btn").style.display = "none";
      document.querySelector(".delete-btn").style.display = "none";
      document.querySelector(".back-btn").style.display = "none";
      document.querySelector(".add-btn").style.display = "inline";
    },
    removeItems: () => {
      let listItems = document.querySelectorAll("#item-list");
      // Turn node list t array

      listItems = Array.from(listItems);
      listItems.forEach((item) => {
        item.remove();
      });
    },
  };
})();

// ***********************************************************************************

// App Controller
// So here We will control both the UI and Item Controllers

const AppCtrl = (function (ItemCtrl, UICtrl) {
  // Events
  const LoadEventListeners = () => {
    // add item event
    document.querySelector(".add-btn").addEventListener("click", itemAddSubmit);

    //Disable submit on enter
    document.addEventListener("keypress", (e) => {
      if (e.keyCode === 13 || e.which === 13) {
        e.preventDefault();
        return false;
      }
    });

    // Edit Event
    document.querySelector("#item-list").addEventListener("click", edit);

    // Update item Event
    document.querySelector(".update-btn").addEventListener("click", update);

    // Delete btn Event
    document
      .querySelector(".delete-btn")
      .addEventListener("click", itemDeleteSubmit);

    // Back Btn Event
    document
      .querySelector(".back-btn")
      .addEventListener("click", UICtrl.clearEditState);

    // Clear All Btn Event
    document.querySelector(".clear-btn").addEventListener("click", clearItems);
  };

  // itemAddSubmit
  const itemAddSubmit = (e) => {
    const input = UICtrl.getItemsInput();
    if (input.name !== " " && input.calories !== " ") {
      // Add item
      const newItem = ItemCtrl.addItem(input.name, input.calories);

      // Add item to the UI list
      UICtrl.addListItem(newItem);

      // Get Total Calories
      const totalCalories = ItemCtrl.getTotalCalories();

      // Add total Calories to UI
      UICtrl.showTotalCalories(totalCalories);

      // Clear Input
      UICtrl.clearInput(input.name, input.name);
    }
    e.preventDefault();
  };
  const edit = (e) => {
    if (e.target.parentElement.className === "secondary-content") {
      // Get List item id
      const id = e.target.parentElement.parentElement.id;

      // Break into array
      const idArr = id.split("-"); //so it split a string into an array of substrings, and returns the new array, so from this 'item-0' to ['item','0']

      // Get the ID from the array
      const actualID = parseInt(idArr[1]); //So we get the actuall number from the array

      //Get item
      const itemToEdit = ItemCtrl.getItemByID(actualID);

      // Set current Item
      ItemCtrl.setCurrentItem(itemToEdit);

      // Add item to the form
      UICtrl.addItemToForm();
    }

    e.preventDefault();
  };
  const update = (e) => {
    // Get item input
    const input = UICtrl.getItemsInput();

    // update item
    const itemUpdate = ItemCtrl.updateItem(input.name, input.calories);

    UICtrl.updateListItem(itemUpdate);

    // Get Total Calories
    const totalCalories = ItemCtrl.getTotalCalories();

    // Add total Calories to UI
    UICtrl.showTotalCalories(totalCalories);

    UICtrl.clearInput();

    e.preventDefault();
  };

  // Delete Btn
  const itemDeleteSubmit = (e) => {
    // Get current Item
    const currentItem = ItemCtrl.getCurrentItem();

    // Delete from data structure
    ItemCtrl.deleteItem(currentItem.id);

    // Detete from UI
    UICtrl.deleteItem(currentItem.id);
    // Now we need to clear the state and update the total Calories

    // Get Total Calories
    const totalCalories = ItemCtrl.getTotalCalories();

    // Add total Calories to UI
    UICtrl.showTotalCalories(totalCalories);

    UICtrl.clearInput();
    e.preventDefault();
  };

  const clearItems = () => {
    // Delete All items
    ItemCtrl.clearAllITems();

    // Update the UI
    UICtrl.removeItems();

    // Get Total Calories
    const totalCalories = ItemCtrl.getTotalCalories();

    // Add total Calories to UI
    UICtrl.showTotalCalories(totalCalories);

    UICtrl.clearInput();
  };

  return {
    init: () => {
      // Edite state
      UICtrl.clearEditState();

      // Fetch items from data structure
      const items = ItemCtrl.getItems();
      UICtrl.showItems(items);

      // Load Events
      LoadEventListeners();
    },
  };
})(ItemCtrl, UICtrl);

AppCtrl.init();

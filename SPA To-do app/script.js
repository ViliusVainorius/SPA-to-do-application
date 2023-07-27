const taskList = document.getElementById("taskList");
const taskDescription = document.getElementById("taskDescription");
const taskDeadline = document.getElementById("taskDeadline");
const sortOrder = document.getElementById("sortOrder");

// Function to add a new item
function addItem() {
  const description = taskDescription.value.trim();
  const deadline = taskDeadline.value.trim();

  if (!description) {
    alert("Description is required.");
    return;
  }

  const newItem = {
    description: description,
    deadline: deadline ? new Date(deadline).getTime() : null,
    completed: false,
    timestamp: Date.now(),
  };

  const items = getItemsFromSessionStorage();
  items.push(newItem);
  saveItemsToSessionStorage(items);
  displayItems(items);
  taskDescription.value = "";
  taskDeadline.value = "";
}

// Function to get items from sessionStorage
function getItemsFromSessionStorage() {
  return JSON.parse(sessionStorage.getItem("items") || "[]");
}

// Function to save items to sessionStorage
function saveItemsToSessionStorage(items) {
  sessionStorage.setItem("items", JSON.stringify(items));
}

// Function to delete an item from the list
function deleteItem(index) {
  const items = getItemsFromSessionStorage();
  items.splice(index, 1);
  saveItemsToSessionStorage(items);
  displayItems(items);
}

// Function to mark an item as completed
function toggleCompleted(index) {
  const items = getItemsFromSessionStorage();
  items[index].completed = !items[index].completed;
  saveItemsToSessionStorage(items);
  displayItems(items);
}

// Function to display items in the list
function displayItems(items) {
  taskList.innerHTML = "";

  items.sort((a, b) => {
    if (sortOrder.value === "deadline") {
      return a.deadline - b.deadline;
    } else if (sortOrder.value === "completed") {
      return b.completed - a.completed || a.timestamp - b.timestamp;
    } else {
      return b.timestamp - a.timestamp;
    }
  });

  saveItemsToSessionStorage(items); //Setting items to sort them in SessionStorage as well

  items.forEach((item, index) => {
    const listItem = document.createElement("li");
    listItem.innerHTML = `
      <span class="checkbox" onclick="toggleCompleted(${index})">${item.completed ? '&#9745;' : '&#9744;'}</span>
      <span class="${item.completed ? 'done' : ''}">${item.description}</span>
      <span>${item.deadline ? getTimeLeft(item.deadline) : ''}</span>
      <span class="delete-btn" onclick="showConfirmPopup(${index})">&#10005;</span>
    `;
    taskList.appendChild(listItem);
  });
}

// Function to calculate time left until the deadline
function getTimeLeft(deadline) {
  const now = Date.now();
  const timeLeft = deadline - now;

  if (timeLeft <= 0) {
    return 'Expired';
  }

  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));

  return `${days}d ${hours}h ${minutes}m`;
}

// Function to show confirm popup before deleting an item
function showConfirmPopup(index) {
  const shouldDelete = confirm("Are you sure you want to delete this item?");
  if (shouldDelete) {
    deleteItem(index);
  }
}

// Function to sort items based on the selected sorting order
function sortItems() {
  const items = getItemsFromSessionStorage();
  displayItems(items);
}

function startingItems(){

  const items = getItemsFromSessionStorage();
  if(sessionStorage.length == 0){

    const newItem1 = {
      description: "task 1 to-do",
      deadline: new Date("August 31, 2023 00:00:00").getTime(),
      completed: false,
      timestamp: Date.now(),
    };

    const newItem2 = {
      description: "task 2 to-do",
      deadline: new Date("September 1, 2023 00:00:00").getTime(),
      completed: false,
      timestamp: Date.now(),
    };

    const newItem3 = {
      description: "task 3 to-do",
      deadline: new Date("September 3, 2023 00:00:00").getTime(),
      completed: false,
      timestamp: Date.now(),
    };

    items.push(newItem1);
    items.push(newItem2);
    items.push(newItem3);
  }
  saveItemsToSessionStorage(items);  
}

function init() {
  startingItems();
  const items = getItemsFromSessionStorage();
  displayItems(items);
}

init();

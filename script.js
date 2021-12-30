const addBtns = document.querySelectorAll(".add-btn:not(.solid)");
const saveItemBtns = document.querySelectorAll(".solid");
const addItemContainers = document.querySelectorAll(".add-container");
const addItems = document.querySelectorAll(".add-item");
// Item Lists
const listColumns = document.querySelectorAll(".drag-item-list");
const backlogList = document.getElementById("backlog-list");
const progressList = document.getElementById("progress-list");
const completeList = document.getElementById("complete-list");
const onHoldList = document.getElementById("on-hold-list");

// Items
let updatedOnLoad = false;
// Initialize Arrays
let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];
let listArrays = [];
let columnList = [];
// Drag Functionality
let draggedItem;
let currentColumn;
let dragging = false;

// Get Arrays from localStorage if available, set default values if not
function getSavedColumns() {
  if (localStorage.getItem("backlogItems")) {
    backlogListArray = JSON.parse(localStorage.backlogItems);
    progressListArray = JSON.parse(localStorage.progressItems);
    completeListArray = JSON.parse(localStorage.completeItems);
    onHoldListArray = JSON.parse(localStorage.onHoldItems);
  } else {
    backlogListArray = [
      "try to write something to backlog",
      "getting start to use this ticktick app to record things that you plan to do",
      "you can add new item or edit the exist item",
      "you can move items to different states (for example, you can move items from the backlog to the Progress status list)."
    ];
    progressListArray = [];
    completeListArray = [];
    onHoldListArray = [];
  }
}

// Set localStorage Arrays
function updateSavedColumns() {
  listArrays = [
    backlogListArray,
    progressListArray,
    completeListArray,
    onHoldListArray,
  ];
  const arrayNames = [
    "backlogItems",
    "progressItems",
    "completeItems",
    "onHoldItems",
  ];
  listArrays.forEach((array, index) => {
    localStorage.setItem(`${arrayNames[index]}`, JSON.stringify(array));
  });
}

//Filter arrays to remove empty items
const filterArray = (array) => {
  return array.filter((item) => item !== null);
};

// Create DOM Elements for each list item
function createItemEl(columnEl, column, item, index) {
  // List Item
  const listEl = document.createElement("li");
  listEl.classList.add("drag-item");
  listEl.textContent = item;
  listEl.setAttribute("ondragstart", "drag(event)");
  listEl.draggable = true;
  listEl.contentEditable = true;
  listEl.id = index;
  listEl.setAttribute("onfocusout", `updateItem(${index},${column})`);

  //Append
  columnEl.appendChild(listEl);
}

// Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
function updateDOM() {
  // Check localStorage once
  if (updatedOnLoad == false) {
    getSavedColumns();
  }
  // Backlog Column
  backlogList.textContent = "";
  backlogListArray.forEach((backlogItem, index) => {
    createItemEl(backlogList, 0, backlogItem, index);
  });
  backlogListArray = filterArray(backlogListArray);
  // Progress Column
  progressList.textContent = "";
  progressListArray.forEach((progressItem, index) => {
    createItemEl(progressList, 1, progressItem, index);
  });
  progressListArray = filterArray(progressListArray);
  // Complete Column
  completeList.textContent = "";
  completeListArray.forEach((completeItem, index) => {
    createItemEl(completeList, 2, completeItem, index);
  });
  completeListArray = filterArray(completeListArray);
  // On Hold Column
  onHoldList.textContent = "";
  onHoldListArray.forEach((onHoldItem, index) => {
    createItemEl(onHoldList, 3, onHoldItem, index);
  });
  onHoldListArray = filterArray(onHoldListArray);

  // Run getSavedColumns only once, Update Local Storage
  updatedOnLoad = true;
  updateSavedColumns();
}

//updateItem -delete if necessary or update item value
const updateItem = (index, column) => {
  if (dragging === false) {
    if (listColumns[column].children[index].textContent === "") {
      delete listArrays[column][index];
    } else {
      listArrays[column][index] =
        listColumns[column].children[index].textContent;
    }
    updateDOM();
  }
};

//show add item input box

const showInputBox = (column) => {
  addBtns[column].style.visibility = "hidden";
  saveItemBtns[column].style.display = "flex";
  addItemContainers[column].style.display = "flex";
};

//Add to Column list, reset textbox

const addToColumn = (column) => {
  if (!addItems[column].textContent == "") {
    listArrays[column].push(addItems[column].textContent);
  }
};

//hide item input box

const hideInputBox = (column) => {
  addBtns[column].style.visibility = "visible";
  saveItemBtns[column].style.display = "none";
  addItemContainers[column].style.display = "none";
  addToColumn(column);
  updateDOM();
};

// Allow arrays to reflect Drag and Drop items
const rebuildArrays = () => {
  backlogListArray = Array.from(backlogList.children).map((i) => i.textContent);
  progressListArray = Array.from(progressList.children).map(
    (i) => i.textContent
  );
  completeListArray = Array.from(completeList.children).map(
    (i) => i.textContent
  );
  onHoldListArray = Array.from(onHoldList.children).map((i) => i.textContent);

  console.log(listArrays);
  updateDOM();
};

//When Item starts dragging
const drag = (e) => {
  draggedItem = e.target;
  dragging = true;
};

//Column Allows for Item to Drop
const allowDrop = (e) => {
  e.preventDefault();
};

//When item enters column area

const dragEnter = (column) => {
  listColumns[column].classList.add("over");
  currentColumn = column;
};

//Dropping Item in Column
const drop = (e) => {
  e.preventDefault();
  // remove bg padding
  listColumns.forEach((i) => {
    i.classList.remove("over");
  });
  // Add item to target column
  listColumns[currentColumn].appendChild(draggedItem);
  //dragging complete
  dragging = false;

  rebuildArrays();
};

// On Load
updateDOM();

"use strict";

let currentList = true;

let toNotDoList = [];
let notDoneList = [];
let tempImg;

const container = document.querySelector('#list');
container.addEventListener('click', function(e) {
    if (e.target.classList.contains('delete-btn')) {
        removeListItem(e.target)
    }
});

const itemText = document.querySelector('#list');
container.addEventListener('click', function(e) {
    if (e.target.classList.contains('list-item-text')) {
        addToNotDoneList(e.target)
    }
});

const imgPath = document.querySelector('input[type=file]').files[0];
const reader = new FileReader();

function toggleList() {
    currentList = !currentList;
    console.log(currentList)
    if (currentList) {
        renderToNotDoList();
    } else {
        renderNotDoneList();
    }
}

function renderNotDoneList() {
    document.getElementById("form").classList.add("hide");
    let list = document.getElementsByClassName("list-container")[0];
    list.classList.add("not-done");
    list.classList.remove("to-not-do");

    document.getElementById("list-title").innerHTML = "Not Done";

    let items = document.getElementsByClassName("list-item");

    for (var i = items.length - 1; i >= 0; i--) {
        items[i].parentNode.removeChild(items[i]);
    }

    notDoneList = initializeLists("notDoneList")
    if (notDoneList)
        iterateThroughLists(notDoneList, "not-done")
}

function renderToNotDoList() {
    document.getElementById("form").classList.remove("hide");
    let list = document.getElementsByClassName("list-container")[0];
    list.classList.add("to-not-do");
    list.classList.remove("not-done");

    document.getElementById("list-title").innerHTML = "To Not Do";

    let items = document.getElementsByClassName("list-item");

    for (var i = items.length - 1; i >= 0; i--) {
        items[i].parentNode.removeChild(items[i]);
    }

    toNotDoList = initializeLists("toNotDoList")
    if (toNotDoList)
        iterateThroughLists(toNotDoList, "to-not-do")
}

function addToNotDoneList(ele) {
    notDoneList.push({ text: ele.innerHTML, image: "" })
    removeListItem(ele)
    if (window.localStorage.getItem("notDoneList"))
        window.localStorage.removeItem("notDoneList");
    window.localStorage.setItem("notDoneList", JSON.stringify(notDoneList));
}


async function addToNotToDoList(event) {
    event.preventDefault();
    let img = "";
    if (document.getElementById("to-do-text").value == "")
        return;
    if (document.getElementById("image").files && document.getElementById("image").files[0]) {
        img = await toBase64(document.getElementById("image").files[0])
    }
    const formText = document.getElementById("to-do-text").value;
    toNotDoList.push({ text: formText, image: img })
    buildListItem(formText, img, toNotDoList.length - 1, "to-not-do")

    if (window.localStorage.getItem("toNotDoList"))
        window.localStorage.removeItem("toNotDoList");
    window.localStorage.setItem("toNotDoList", JSON.stringify(toNotDoList));

    document.getElementById("to-do-text").value = "";
    document.getElementById("image").value = "";
}

function buildListItem(text, img, id, listName) {
    const decorativeTape = document.createElement("div");
    decorativeTape.classList.add("top-tape");

    const listItem = document.createElement("li");
    listItem.classList.add("list-item");

    const contentDiv = document.createElement("div");
    const contentText = document.createTextNode(text);
    contentDiv.classList.add("list-item-text");
    contentDiv.setAttribute("id", `text-${id}`);

    contentDiv.appendChild(contentText);
    listItem.appendChild(decorativeTape);
    listItem.appendChild(contentDiv);

    if (listName === "to-not-do") {
        const deleteDiv = document.createElement("div");
        deleteDiv.classList.add("delete");

        const deleteButton = document.createElement("button");
        const deleteButtonTxt = document.createTextNode("x");
        deleteButton.classList.add("delete-btn");
        deleteButton.setAttribute("id", `btn-${id}`);

        const markComplete = document.createElement("div");
        const markCompleteText = document.createTextNode("NOT DONE");
        markComplete.classList.add("list-item-mark");
        markComplete.appendChild(markCompleteText);

        deleteButton.appendChild(deleteButtonTxt);
        deleteDiv.appendChild(deleteButton);
        listItem.appendChild(markComplete);
        listItem.appendChild(deleteDiv);
    }

    if (img) {
        const imageDiv = document.createElement("div");
        const image = document.createElement("img");
        image.setAttribute('crossOrigin', 'anonymous');

        image.src = img
        imageDiv.appendChild(image);
        imageDiv.classList.add("image");
        listItem.appendChild(imageDiv);
    }

    listItem.setAttribute("id", `item-${id}`);

    const list = document.getElementById("list");
    list.appendChild(listItem);
}


function removeListItem(btn) {
    let id = btn.id.split('-')[1];
    document.getElementById(`item-${id}`).remove();
    toNotDoList.splice(id, 1)
    if (window.localStorage.getItem("toNotDoList"))
        window.localStorage.removeItem("toNotDoList");
    window.localStorage.setItem("toNotDoList", JSON.stringify(toNotDoList));
}

function initializeLists(listName) {
    if (window.localStorage.getItem(listName) === null) {
        return [];

    } else {
        return JSON.parse(window.localStorage.getItem(listName));
    }
}

function iterateThroughLists(list, listName) {
    for (let pos = 0; pos < list.length; pos++) {
        buildListItem(list[pos]["text"], list[pos]["image"], pos, listName)
    }
}

document.addEventListener("DOMContentLoaded", function() {
    toNotDoList = initializeLists("toNotDoList")
    notDoneList = initializeLists("notDoneList")
    console.log(notDoneList)
    iterateThroughLists(toNotDoList, "to-not-do")
});

const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});
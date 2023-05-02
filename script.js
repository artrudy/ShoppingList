const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const clearBtn = document.getElementById('clear');
const itemFilter = document.getElementById('filter');
const formBtn = itemForm.querySelector('button')
let isEditMode = false;


function displayItems(){
    const itemsFromStorage = getItemFromStorage();
    itemsFromStorage.forEach(item => addItemtoDOM(item));
    checkUI()
}



function onAddItemSubmit(e){
    e.preventDefault();

    const newItem = itemInput.value;

//validate input
    if (newItem === ''){
        alert('Please add an item');
        return;
    }    

    //Check for edit mode
    if(isEditMode){
        const iteToEdit = itemList.querySelector('.edit-mode');
        removeItemFromStorage(iteToEdit.textContent);
        iteToEdit.classList.remove('edit-mode');
        iteToEdit.remove();
        isEditMode = false;
    }



    //Create item DOM element
    addItemtoDOM(newItem)

    //Add item to Local storage
    addItemToStorage(newItem)


    checkUI();

    itemInput.value = '';
}

function addItemtoDOM(item){
    //Create list item
    const li = document.createElement('li');
    li.appendChild(document.createTextNode(item));

    const button = createButton('remove-item btn-link text-red');
    li.appendChild(button);


    //Add li to the DOM
    itemList.appendChild(li);
}

function addItemToStorage(item){
    const itemsFromStorage = getItemFromStorage();

    if(localStorage.getItem('items') === null){
        itemsFromStorage = [];
    } else {
        itemsFromStorage = JSON.parse(localStorage.getItem('items'))
    }
    //add new item to array
    itemsFromStorage.push(item)

    //Convert to JSON string and set to LocalStorage
    localStorage.setItem('items', JSON.stringify(itemsFromStorage))

}

function createButton(classes){
    const button = document.createElement('button');
    button.className = classes;
    const icon = createIcon('fa-solid fa-xmark');
    button.appendChild(icon)
    return button;
}

function createIcon (classes){
    const icon = document.createElement('i');
    icon.className = classes;
    return icon;
}

function getItemFromStorage(){
    let itemsFromStorage;

    if(localStorage.getItem('items') === null){
        itemsFromStorage = [];
    } else {
        itemsFromStorage = JSON.parse(localStorage.getItem('items'))
    }
    return itemsFromStorage;
}

function onClickItem(e){
    if (e.target.parentElement.classList.contains('remove-item')){
        removeItem(e.target.parentElement.parentElement)
    } else {
        setItemToEdit(e.target);
    }
}


function setItemToEdit(item){
    isEditMode = true;

    itemList.querySelectorAll('li')
    .forEach((i) => i.classList.remove('edit-mode'));


    item.classList.add('edit-mode');
    formBtn.innerHTML = '<i class="fa-solid fa-pen" ></i> Update  Item';
    formBtn.style.backgroundColor = '#228B22'
    itemInput.value = item.textContent;
}

function removeItem(e){   
    if (confirm('Are your sure?')){
        //Remove item from DOM
        item.remove();
    }
    //remove item from storage
    removeItemFromStorage(item.textContent)

    checkUI();
}

function removeItemFromStorage(item) {
    let itemsFromStorage = getItemFromStorage();

    //filter out items to be removed
    itemsFromStorage = itemsFromStorage.filter((i) => i !== item);

    //re-set item to localStorage

    localStorage.setItem('items', JSON.stringify(itemsFromStorage))
    

}


function clearItems(){
    itemList.innerHTML = ''
    // while(itemList.firstChild){
    //     itemList.replaceChild(itemList.firstChild);
    // }

    //clear from localSrorage
    localStorage.removeItem('items')
    checkUI();
}

function filterItems(e){
    const items = itemList.querySelectorAll('li')
    const text = e.target.value.toLowerCase();

    items.forEach((item) => {
        const itemName = item.firstChild.textContent.toLowerCase();

        if(itemName.indexOf(text) != -1){
            item.style.display =  'flex'
        } else {
            item.style.display = 'none'
        }

        console.log(itemName)
    })


}

function checkUI(){
    const items = itemList.querySelectorAll('li');

    if (items.length === 0){
        clearBtn.style.display = 'none';
        itemFilter.style.display = 'none';
    } else {
        clearBtn.style.display = 'block';
        itemFilter.style.display = 'block';
    }

    formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
    formBtn.style.backgroundColor = '#333'

    isEditMode = false;
}

// initialize app
function init(){

//Event listener

itemForm.addEventListener('submit', onAddItemSubmit);
itemList.addEventListener('click', onClickItem);
clearBtn.addEventListener('click', clearItems);
itemFilter.addEventListener('input', filterItems);
document.addEventListener('DOMContentLoaded', displayItems);


checkUI();
}
init();

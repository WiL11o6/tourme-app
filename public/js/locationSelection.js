fetch("../json/items.json")
.then(function(response) {
    return response.json();
})
.then(function(data) {
    localStorage.setItem("products", JSON.stringify(data));
    if (!localStorage.getItem("schedule")) {
        localStorage.setItem("schedule", "[]");
    }
})
.catch(function(error) {
    console.error("Error fetching data: ", error)
})

//Setting global variables

let products = JSON.parse(localStorage.getItem("products"));
let schedule = JSON.parse(localStorage.getItem("schedule"));

function addItemToSchedule(productId) {
    let product = products.find(function(product) {
        return product.id == productId;
    });

    if(schedule.length == 0) {
        schedule.push(product);
    } else {
        let res = schedule.find(element => element.id == productId);
        if (res === undefined) {
            schedule.push(product);
        }
    }
    localStorage.setItem("schedule", JSON.stringify(schedule));
}
addItemToSchedule(1);
addItemToSchedule(2);
addItemToSchedule(3);

function removeItemFromSchedule(productId) {
    let temp = schedule.filter(item => item.id != productId);
    localStorage.setItem("schedule", JSON.stringify(temp));
}

removeItemFromSchedule(3);










if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready)
} else {
    ready()
}

function ready() {
    var removeScheduleItemButtons = document.getElementsByClassName('btn-danger')
    count = 0;
    for (var i = 0; i < removeScheduleItemButtons.length; i++) {
        var button = removeScheduleItemButtons[i]
        button.addEventListener('click', removeScheduleItem)
        count =+ 1;
    }


    var addToScheduleButtons = document.getElementsByClassName('addtocart')
    for (var i = 0; i < addToScheduleButtons.length; i++) {
        var button = addToScheduleButtons[i]
        button.addEventListener('click', addToScheduleClicked)
    }

}


function removeScheduleItem(event) {
    var buttonClicked = event.target
    buttonClicked.parentElement.parentElement.remove()
    updateScheduleTotal()
}

function addToScheduleClicked(event) {
    var button = event.target
    var scheduleItem = button.parentElement.parentElement
    /* This one works for packageConformation.html
    var title = button.parentElement.parentElement.getElementsByClassName('shop-item-title')[0].innerText
    */
    var title = button.parentElement.parentElement.parentElement.getElementsByClassName('schedule-item-title')[0].innerText
    var imageSrc = scheduleItem.getElementsByClassName('schedule-item-image')[0].src
    var id = scheduleItem.dataset.itemId
    addItemToSchedule(title, imageSrc, id)
    updateCartTotal()
}

function addItemToSchedule(title, imageSrc, id) {
    var scheduleRow = document.createElement('div')
    scheduleRow.classList.add('schedule-row')
    scheduleRow.dataset.itemId = id
    var scheduleItems = document.getElementsByClassName('schedule-items')[0]
    var scheduleItemNames = scheduleItems.getElementsByClassName('schedule-item-title')
    for (var i = 0; i < scheduleItemNames.length; i++) {
        if (scheduleItemNames[i].innerText == title) {
            alert('This item is already added to the schedule')
            return
        }
    }
    var scheduleRowContents = `
        <div class="schedule-item schedule-column">
            <img class="schedule-item-image" src="${imageSrc}" width="100" height="100">
            <span class="schedule-item-title">${title}</span>
        </div>
        <div class="schedule-column">
            <button class="btn btn-danger" type="button">REMOVE</button>
        </div>`
    scheduleRow.innerHTML = scheduleRowContents
    scheduleItems.append(scheduleRow)
    scheduleRow.getElementsByClassName('btn-danger')[0].addEventListener('click', removeScheduleItem)
}




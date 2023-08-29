fetch("../json/items.json")
.then(function(response) {
    return response.json();
})
.then(function(data) {
    localStorage.setItem("products", JSON.stringify(data));
    if (!localStorage.getItem("cart")) {
        localStorage.setItem("cart", "[]");
    }
})
.catch(function(error) {
    console.error("Error fetching data: ", error)
});

//Setting global variables
function CartManager() {
let products = JSON.parse(localStorage.getItem("products"));
let cart = JSON.parse(localStorage.getItem("cart"));

function addItemToCart(productId) {
    let product = products.find(function(product) {
        return product.id == productId;
    });

    if(cart.length == 0) {
        cart.push(product);
    } else {
        let res = cart.find(element => element.id == productId);
        if (res === undefined) {
            cart.push(product);
        }
    }
    localStorage.setItem("cart", JSON.stringify(cart));
}

function removeItemFromCart(productId) {
    let temp = cart.find(item => item.id != productId);
    localStorage.setItem("cart", JSON.stringify(temp));
}

function updateQuantity(productId, quantity) {
    for (let product of cart) {
        if (product.id == productId) {
            product.quantity = quantity;
        }
    }
    localStorage.setItem("cart", JSON.stringify(cart));
}

function getTotal() {
    let temp = cart.map(function(item) {
        return parseFloat(item.price * item.quantity);
    });

    let sum = temp.reduce(function(prev, next) {
        return prev + next;
    }, 0);
    return sum.toFixed(2);
 }

 return {
    addItemToCart,
    removeItemFromCart,
    updateQuantity,
    getTotal
 };
}

const cartManager = CartManager();

cartManager.addItemToCart(1);
cartManager.addItemToCart(2);
cartManager.addItemToCart(3);
cartManager.removeItemFromCart(3);
cartManager.updateQuantity(2, 8);
console.log(cartManager.getTotal());


const data0 = localStorage.getItem("cart");
console.log("data : ", JSON.parse(data0)[1].name);
//var title = document.getElementById('shop-item-title');
//title.innerHTML = JSON.parse(data0)[1].name;

fetch("../json/items.json")
    .then(function(response) {
        return response.json();
    })
    .then(function (data) {
        for (var i = 0; i <data.length; i++) {
            if (JSON.parse(data0)[2].id == data[i].id ) {
                document.getElementById("shop-item-title").innerHTML +=
                data[i].name;
            }
        }
    })



    function appendData(data) {
        for( var i = 0; i < data.length; i++) {
            var title = document.getElementById('shop-item-title');
            title.innerText=  data[i].name;
            console.log("Hello: " + data[i].name)
            
        }
    }



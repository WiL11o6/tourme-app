if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready)
} else {
    ready()
}

function ready() {
    var removeCartItemButtons = document.getElementsByClassName('btn-danger')
    count = 0;
    for (var i = 0; i < removeCartItemButtons.length; i++) {
        var button = removeCartItemButtons[i]
        button.addEventListener('click', removeCartItem)
        count =+ 1;
    }

    var addToCartButtons = document.getElementsByClassName('shop-item-button')
    for (var i = 0; i < addToCartButtons.length; i++) {
        var button = addToCartButtons[i]
        button.addEventListener('click', addToCartClicked)
    }

    document.getElementsByClassName('btn-purchase')[0].addEventListener('click', purchaseClicked)
}

 var stripleHandler = StripeCheckout.configure({
    key: stripePublicKey,
    locale: 'auto',
    token: function(token) {
        var items = []
        var cartItemContainer = document.getElementsByClassName('cart-item')[0]
        var cartRows = cartItemContainer.getElementsByClassName('cart-row')
        for (var i = 0; i < cartRows.length; i++) {
            var cartRow = cartRows[i]
            var quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0]
            var quantity = quantityElement.value
            var id = cartRow.dataset.itemId
            items.push({
                id: id,
                quantity: quantity
            })
        }
        fetch('/purchase', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                stripeTokenId: token.id,
                items: items
            })
        }).then(function(res) {
            return res.json()
        }).then(function(data) {
            alert(data.message)

            var cartItems = document.getElementsByClassName('cart-items')[0]
            while (cartItems.hasChildNodes()) {
                    cartItems.removeChild(cartItems.firstChild)
                }
            updateCartTotal()

        }).catch(function(error) {
            console.error(error)
        })
    }
})


function purchaseClicked() {
    var priceElement = document.getElementsByClassName('cart-total-price')[0]
    var price = parseFloat(priceElement.innerHTML.replace('$', '')) * 100

    stripleHandler.open({
        amount: price
    })
}

function removeCartItem(event) {
    var buttonClicked = event.target
    buttonClicked.parentElement.parentElement.remove()
    updateCartTotal()
}

function addToCartClicked(event) {
    var button = event.target
    var shopItem = button.parentElement.parentElement
    /* This one works for packageConformation.html
    var title = button.parentElement.parentElement.getElementsByClassName('shop-item-title')[0].innerText
    */
    var title = button.parentElement.parentElement.parentElement.getElementsByClassName('shop-item-title')[0].innerText
    var price = shopItem.getElementsByClassName('shop-item-price')[0].innerText
    var imageSrc = shopItem.getElementsByClassName('shop-item-image')[0].src
    var id = shopItem.dataset.itemId
    addItemToCart(title, price, imageSrc, id)
    updateCartTotal()
}

function addItemToCart(title, price, imageSrc, id) {
    var cartRow = document.createElement('div')
    cartRow.classList.add('cart-row')
    cartRow.dataset.itemId = id
    var cartItems = document.getElementsByClassName('cart-items')[0]
    var cartItemNames = cartItems.getElementsByClassName('cart-item-title')
    for (var i = 0; i < cartItemNames.length; i++) {
        if (cartItemNames[i].innerText == title) {
            alert('This item is already added to the cart')
            return
        }
    }
    var cartRowContents = `
        <div class="cart-item cart-column">
            <img class="cart-item-image" src="${imageSrc}" width="100" height="100">
            <span class="cart-item-title">${title}</span>
        </div>
        <span class="cart-price cart-column">${price}</span>
        <div class="cart-quantity cart-column">
            <button class="btn btn-danger" type="button">REMOVE</button>
        </div>`
    cartRow.innerHTML = cartRowContents
    cartItems.append(cartRow)
    cartRow.getElementsByClassName('btn-danger')[0].addEventListener('click', removeCartItem)
}

function updateCartTotal() {
    var cartItemContainer = document.getElementsByClassName('cart-items')[0]
    var cartRows = cartItemContainer.getElementsByClassName('cart-row')
    var total = 0
    for (var i = 0; i < cartRows.length; i++) {
        var cartRow = cartRows[i]
        var priceElement = cartRow.getElementsByClassName('cart-price')[0]
        var price = parseFloat(priceElement.innerText.replace('$', ''))
        total = total + price
    }
    total = Math.round(total * 100) / 100
    document.getElementsByClassName('cart-total-price')[0].innerText = '$' + total
}


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


const product = [
    {
        id: 0,
        image: 'gg.jpg',
        title: 'Z Flip Foldable Mobile',
        price: 120,
    },

    {
        id: 1,
        image: 'gg.jpg',
        title: 'iPhone 25',
        price: 999,
    },
    {
        id: 2,
        image: 'gg.jpg',
        title: 'Samsung galaxy',
        price: 1999,
    },
    {
        id: 3,
        image: 'gg.jpg',
        title: 'Hat',
        price: 299,
    }

];

const categories = [...new Set(product.map((item) => {

return item}))]
let i=0;
document.getElementById('root').innerHTML = categories.map((item) => {
    var {image, title, price} = item;
    return (
        `<div class='box'>
              <div class='img-box'>
                 <img class='images' src=${image}></img>
               </div>

                 <div class='bottom'>
                 <p>${price}</p>
                 <h2>$ ${price}.00</h2>` +
                 "<button onclick='addtocart("+(i++)+")'>Add to cart</button>"+
                 `</div>
                 </div>`
    )
}).join('')
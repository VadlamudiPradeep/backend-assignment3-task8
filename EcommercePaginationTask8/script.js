const cart_items = document.querySelector("#cart .cart-items");
const parentContainer = document.getElementById("EcommerceContainer");
const products=document.getElementById('Products')
const qty=document.querySelector('.cart-number')
const toast=document.getElementById('notification-container')
const cart=document.getElementById('cart')
const seeCart=document.getElementById('open-cart')
const closeCart=document.getElementById('cancel')
const items=document.getElementsByClassName('cart')
const pages=document.getElementById('pages-button')

//Event Listeners
pages.addEventListener('click', showProducts);
//cart.addEventListener('click' ,showCartProducts)
products.addEventListener('click', loadCart)


// from old .js
parentContainer.addEventListener("click", (e) => {
  // DOM element with className == "shop-item-button"
if (e.target.className == "shop-item-button") {
  const id = e.target.parentNode.parentNode.id;
  const name = document.querySelector(`#${id} h3`).innerText;
  const img_src = document.querySelector(`#${id} img`).src;
  const price = e.target.parentNode.firstElementChild.firstElementChild.innerText;
    
  let total_cart_price = document.querySelector("#total-value").innerText;  // id -> #total-value
  // if item is already in your cart show a alert "This item is already added to the cart"
  if (document.querySelector(`#in-cart-${id}`)) {
    alert("This item is already added to the cart");
    return;
  }

  document.querySelector(".cart-number").innerText = parseInt(document.querySelector(".cart-number").innerText) + 1;  // class='cart-number'
  const cart_item = document.createElement("div");
  cart_item.classList.add("cart-row");
  cart_item.setAttribute("id", `in-cart-${id}`);
  total_cart_price = parseFloat(total_cart_price) + parseFloat(price);
  total_cart_price = total_cart_price.toFixed(2);
  document.querySelector("#total-value").innerText = `${total_cart_price}`;
  cart_item.innerHTML = `
      <span class='cart-item cart-column'>
      <img class='cart-img' src="${img_src}" alt="">
          <span>${name}</span>
  </span>
  <span class='cart-price cart-column'>${price}</span>
  <span class='cart-quantity cart-column'>
      <input type="text" value="1">
      <button>REMOVE</button>
  </span>`;
  cart_items.appendChild(cart_item);

  const container = document.getElementById("notification-container");
  const notification = document.createElement("div");
  notification.classList.add("notification");
  notification.innerHTML = `<h4>Your Product : <span>${name}</span> is added to the cart<h4>`;
  container.appendChild(notification);
  setTimeout(() => {
    notification.remove();
  }, 2500);
}
if (e.target.className == "cart-btn-bottom" || e.target.className == "cart-bottom" || e.target.className == "cart-holder") {
  // update here for Task - 13 -> Show the Cart
  const cartContainer = document.getElementById('cart');
  cartContainer.innerHTML = ''
  getCartDetails()
  // document.querySelector("#cart").style = "display:block;";
}
if (e.target.className == "cancel") {
  document.querySelector("#cart").style = "display:none;";
}
if (e.target.className == "purchase-btn") {
  if (parseInt(document.querySelector(".cart-number").innerText) === 0) {
    alert("You have Nothing in Cart , Add some products to purchase !");
    return;
  }
  alert("Thanks for the purchase");
  cart_items.innerHTML = "";
  document.querySelector(".cart-number").innerText = 0;
  document.querySelector("#total-value").innerText = `0`;
}

if (e.target.innerText == "REMOVE") {
  let total_cart_price = document.querySelector("#total-value").innerText;
  total_cart_price = parseFloat(total_cart_price).toFixed(2) - parseFloat(document.querySelector(`#${e.target.parentNode.parentNode.id} .cart-price`).innerText).toFixed(2);
  document.querySelector(".cart-number").innerText = parseInt(document.querySelector(".cart-number").innerText) - 1;
  document.querySelector("#total-value").innerText = `${total_cart_price.toFixed(2)}`;
  e.target.parentNode.parentNode.remove();
}
});
// till from old .js

// window.addEventListener('DOMContentLoaded', ()=>{
//   axios.get('http://localhost:3000/products')
//   .then((data)=>{
//       console.log(data);
//       if(data.request.status === 200){
//           const products = data.data.products;
//           var parentSection = document.getElementById('Products');
//          products.forEach((product) => {
//               var productHtml =`
//               <div>
//               <h1>${product.title}</h1>
//               <img src=${product.imageUrl}></img>
//               <button onClick='addToCart(${product.id})'>Add To Cart </button>
//               </div>
//               `
//               parentSection.innerHTML = parentSection.innerHTML + productHtml
//           });
//       }
//   })
// });
window.addEventListener("DOMContentLoaded", () => {
  console.log("loaded");
  loadCart
  showProducts()
 // showCartProducts();
});

function addToCart(productId) {
  // productId -> get product id from frontend. (controllers/shop.js -> postCart)
  axios.post('http://localhost:3000/cart',{productId : productId})
  .then(response => {
    // console.log(response)
    if(response.status === 200) {
      nofityUsers(response.data.message);
    } else {
      throw new ErrorEvent();
    }
  })
  .catch(err => {
    console.log(err)
    nofityUsers(err.data.message);
  })
}

function nofityUsers(message) {
  const container = document.getElementById("notification-container");
    const notification = document.createElement("div");
    notification.classList.add("notification");
    notification.innerHTML = `<h4>${message}<h4>`;
    container.appendChild(notification);
    setTimeout(() => {
      notification.remove();
    }, 2500);
}

function getCartDetails(){
  axios.get('http://localhost:3000/cart')
  .then(response => {

    if(response.status === 200){
      response.data.products.forEach(product => {
        const cartContainer = document.getElementById('cart');
        cartContainer.innerHTML += `<li>${product.title} - ${product.price} - ${product.cartItem.quantity}`
      })
      document.querySelector("#cart").style = "display:block;";
    } else {
      throw new ErrorEvent('Something went wrong')
    }
    console.log(response)
  })
  .catch(error => {
    // console.log(error)
    nofityUsers(error);
  })
}

// Show Products
function showProducts(e){
  let pageNo;
  try {
      pageNo=e.target.id
  }
  catch(err){
      pageNo=1
  }
  axios({
      method: 'get',
      url: `http://localhost:3000/pagination/${pageNo}`
  }).then(response=>{
      products.innerHTML=""
      pages.innerHTML=""
      response.data.products.map(product=>{
          let div=document.createElement('div')
          div.classList.add('product')
          let h3=document.createElement('h3')
          h3.innerHTML=product.title
          let img=document.createElement('img')
          img.src=product.imageUrl
          let subdiv=document.createElement('div')
          subdiv.classList.add('product-details')
          let p=document.createElement('p')
          p.innerHTML=`₹ ${product.price}`
          let button=document.createElement('button')
          button.id=product.id
          button.innerHTML="ADD TO CART"
          subdiv.appendChild(p)
          subdiv.appendChild(button)
          div.appendChild(h3)
          div.appendChild(img)
          div.appendChild(subdiv)
          products.appendChild(div)
      })

      if (response.data.lastPage>=2){
          if(response.data.currentPage==response.data.lastPage){
              let cur_btn=document.createElement('button')
              cur_btn.innerHTML=1
              cur_btn.id=1
              pages.appendChild(cur_btn)
          }
  
          if(response.data.hasPreviousPage){
              let cur_btn=document.createElement('button')
              cur_btn.innerHTML=response.data.previousPage
              cur_btn.id=response.data.previousPage
              pages.appendChild(cur_btn)
          }
          if(response.data.currentPage){
              let cur_btn=document.createElement('button')
              cur_btn.classList.add('active')
              cur_btn.innerHTML=response.data.currentPage
              cur_btn.id=response.data.currentPage
              pages.appendChild(cur_btn)
          }
          if(response.data.hasNextPage){
              let cur_btn=document.createElement('button')
              cur_btn.innerHTML=response.data.nextPage
              cur_btn.id=response.data.nextPage
              pages.appendChild(cur_btn)
          }
          if(response.data.currentPage==1){
              let cur_btn=document.createElement('button')
              cur_btn.innerHTML=response.data.lastPage
              cur_btn.id=response.data.lastPage
              pages.appendChild(cur_btn)
          }
      }

  }).catch(err=>console.log(err))
}
// Show Cart
function loadCart(e){
  let pageNo;
  try {
      pageNo=e.target.id
  }
  catch(err){
      pageNo=1
  }

  axios({
      method: 'get',
      url: `http://localhost:3000/pagination/${pageNo}`
  }).then(response => {
      console.log(response)
      qty.innerHTML=response.data.totalItems
      items.innerHTML=""
      pages.innerHTML=""
      response.data.products.forEach(item=>{
        let h2 = document.createElement('h2');
        h2.innerHTML = "CART"
        let li=document.createElement('li')
          li.classList.add('item')
          let img=document.createElement('img')
          img.src=item.imageUrl
          let p1=document.createElement('p')
          p1.innerHTML=item.title
          let p2=document.createElement('p')
          p2.innerHTML=item.price
          let qty=document.createElement('input')
          qty.classList.add('qty')
          qty.type="number"
          qty.value="1"
          let button=document.createElement('button')
          button.id=item.id
          button.innerHTML="REMOVE"
          li.appendChild(h2);
          li.appendChild(img)
          li.appendChild(p1)
          li.appendChild(p2)
          li.appendChild(qty)
          li.appendChild(button)

          items.appendChild(li);
          document.body.appendChild(items)

      })
   

      // Pagination Buttons for Cart
      let div=document.createElement('div')
      div.innerHTML=""
      div.classList.add('pages-container')
      if(response.data.lastPage==2){
          if(response.data.hasPreviousPage){
              let cur_btn=document.createElement('button')
              cur_btn.innerHTML=response.data.previousPage
              cur_btn.id=response.data.previousPage
              cur_btn.classList.add('cart-pages')
              div.appendChild(cur_btn);
             
          }
          if(response.data.currentPage){
              let cur_btn2=document.createElement('button')
              cur_btn2.innerHTML=response.data.currentPage
              cur_btn2.id=response.data.currentPage
              cur_btn2.classList.add('cart-pages-active')
              div.appendChild(cur_btn2);
              
          }
          if(response.data.hasNextPage){
              let cur_btn2=document.createElement('button')
              cur_btn2.innerHTML=response.data.nextPage
              cur_btn2.id=response.data.nextPage
              cur_btn2.classList.add('cart-pages')
              div.appendChild(cur_btn2);
            
          }
  
        items.appendChild(div)
      }
      else if(response.data.lastPage>2){
          if(response.data.currentPage==response.data.lastPage){
              let cur_btn=document.createElement('button')
              cur_btn.innerHTML=1
              cur_btn.id=1
              cur_btn.classList.add('cart-pages')
              div.appendChild(cur_btn);
              
          }
          if(response.data.hasPreviousPage){
              let cur_btn=document.createElement('button')
              cur_btn.innerHTML=response.data.previousPage
              cur_btn.id=response.data.previousPage
              cur_btn.classList.add('cart-pages')
              div.appendChild(cur_btn);
              
          }
          if(response.data.currentPage){
              let cur_btn2=document.createElement('button')
              cur_btn2.innerHTML=response.data.currentPage
              cur_btn2.id=response.data.currentPage
              cur_btn2.classList.add('cart-pages-active')
              div.appendChild(cur_btn2);
              
          }
          if(response.data.hasNextPage){
              let cur_btn2=document.createElement('button')
              cur_btn2.innerHTML=response.data.nextPage
              cur_btn2.id=response.data.nextPage
              cur_btn2.classList.add('cart-pages')
              div.appendChild(cur_btn2);
            
          }
          if(response.data.lastPage!==response.data.currentPage && !response.data.hasNextPage){
              let cur_btn2=document.createElement('button')
              cur_btn2.innerHTML=response.data.lastPage
              cur_btn2.id=response.data.lastPage
              cur_btn2.classList.add('cart-pages')
              div.appendChild(cur_btn2);
             
          }
          if(response.data.currentPage==1){
              let cur_btn2=document.createElement('button')
              cur_btn2.innerHTML=response.data.lastPage
              cur_btn2.id=response.data.lastPage
              cur_btn2.classList.add('cart-pages')
              div.appendChild(cur_btn2);
             
          }
          items.innerHTML += div;
      }

      let p=document.createElement('p')
      p.classList.add('total')
      p.innerHTML="Total "
      let total=document.createElement('span')
      total.id="total"
      totalPrice=response.data.totalPrice
      total.innerHTML=`₹ ${parseFloat(response.data.totalPrice).toFixed(2)}`
      p.appendChild(total)
      items.appendChild(p);
      let button=document.createElement('button')
      button.classList.add('purchase')
      button.innerHTML="ORDER NOW"
      items.appendChild(button);

      // const order=document.querySelector('.purchase')
      // order.addEventListener('click', createOrder)
  })
   .catch(err=>console.log(err))
   //.then(()=>{
  //   const cart_pages=document.querySelector('.pages-container')
  //   cart_pages.addEventListener('click', loadCart)
  // })
}


'use strict';

let possessedMoney = 25000;
let insertMoney = 0;
let totalPrice;
let totalQty;
let cart = [];

const productArr = [
  { icon: 'lemon', name: '레모네이드', qty: 5, price: 1800 },
  { icon: 'apple-whole', name: '사과주스', qty: 5, price: 2000 },
  { icon: 'carrot', name: '당근주스', qty: 5, price: 2000 },
  { icon: 'bottle-water', name: '생수', qty: 5, price: 1000 },
  { icon: 'wheat-awn', name: '보리차', qty: 5, price: 1300 },
  { icon: 'seedling', name: '녹차', qty: 5, price: 1500 },
];

const products = document.getElementById('products');
const possession = document.querySelector('#possessed-money > span');
const remainingAmount = document.querySelector('#remaining-amount > span');
const cartList = document.getElementById('cart-list');
const cartCost = document.querySelector('#cart-cost > span');
const purchaseList = document.getElementById('purchase-list');

possession.innerHTML = possessedMoney;
remainingAmount.innerHTML = insertMoney;

// 음료수 출력
productArr.forEach((item) => {
  products.innerHTML += `
    <div class="product-item bg">
      <i class="fa-solid fa-${item.icon}"></i>
      <p class="product-name">${item.name}</p>
      <p class="product-qty">수량 : <span>${item.qty}</span>개</p>
      <button class="btn product-btn" data-product="${item.icon}" data-price="${item.price}">${item.price}원</button>
    </div>
  `;
});

// 자판기에 돈 추가하기
function addCash(cash) {
  if (possessedMoney == 0 || possessedMoney < cash) {
    alert('소지금보다 투입금액이 큽니다!');
    return false;
  } else {
    possession.innerHTML = possessedMoney -= cash;
    remainingAmount.innerHTML = insertMoney += cash;
  }
}

// 거스름돈 받기
function getChange() {
  possession.innerHTML = possessedMoney += insertMoney;
  insertMoney = 0;
  remainingAmount.innerHTML = insertMoney;
}

// 각 제품들의 버튼 관리
const productBtn = document.querySelectorAll('.product-btn');

productBtn.forEach((e) => {
  let countQty = 0;
  const productQty = e.previousElementSibling;
  const productQtyChild = productQty.firstElementChild;
  e.addEventListener('click', function () {
    const product = e.getAttribute('data-product');
    const price = parseInt(e.getAttribute('data-price'));

    const productObj = productArr.find((item) => item.icon === product);

    if (productObj.qty > 0) {
      countQty++;
      if (productObj.qty > countQty) {
        productQtyChild.innerHTML = productObj.qty - countQty;
        addCart(productObj, price);
      } else if (productObj.qty == countQty) {
        productQty.innerHTML = '품절';
      }
    } else {
      alert('품절된 상품입니다.');
      return false;
    }
  });
});

// 제품 이름 가져오기
function getProductName(product) {
  switch (product) {
    case 'lemon':
      return '레모네이드';
    case 'apple-whole':
      return '사과주스';
    case 'carrot':
      return '당근주스';
    case 'bottle-water':
      return '생수';
    case 'wheat-awn':
      return '보리차';
    case 'seedling':
      return '녹차';
    default:
      return '알 수 없는 제품';
  }
}

// 장바구니에 선택한 제품 추가
function addCart(product, price) {
  const cartItem = cart.find((item) => item.icon === product.icon);

  if (cartItem) {
    cartItem.qty++;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  console.log('product', product);
  console.log('cart', cart);
  product.qty--;
  cartUpdate();
}

// 장바구니 목록 업데이트
function cartUpdate() {
  cartList.innerHTML = '';
  totalPrice = 0;
  totalQty = 0;
  cart.forEach((item, idx) => {
    console.log(idx);
    cartList.insertAdjacentHTML(
      'beforeend',
      `
        <li class="cart-item" data-index="${idx}">
          <div class="cart-content">
            <i class="fa-solid fa-${item.icon}"></i>
            <p class="cart-name">${item.name}</p>
          </div>
          <div class="cart-modify">
            <button class="btn plus-btn">+</button>
            <div class="cart-qty">${item.qty}</div>
            <button class="btn minus-btn">-</button>
            <button class="btn delete-item">삭제</button>
          </div>
        </li>
      `
    );
    totalPrice += item.price * item.qty;
    totalQty += item.qty;
  });
  cartList.scrollTop = cartList.offsetHeight;
  cartList.nextElementSibling.firstElementChild.innerHTML = totalPrice;
}

// 구매 목록 업데이트
function purchaseUpdate() {
  if (insertMoney < totalPrice) {
    alert('남은 금액보다 장바구니 금액이 큽니다.');
    return false;
  } else {
    cart.forEach((item) => {
      purchaseList.insertAdjacentHTML(
        'beforeend',
        `
          <li class="purchase-item">
            <div class="purchase-content">
              <i class="fa-solid fa-${item.icon}"></i>
              <p class="purchase-name">${item.name}</p>
            </div>
            <div class="purchase-qty"><span>${item.qty}</span>개</div>
          </li>
        `
      );
    });

    remainingAmount.innerHTML = insertMoney -= totalPrice;
    cartList.innerHTML = '<li>물품을 추가해 주세요.</li>';
    cart = [];
    totalPrice = 0;
    cartList.nextElementSibling.firstElementChild.innerHTML = totalPrice;
  }
}

// 장바구니 안에 있는 버튼 기능 추가
cartList.addEventListener('click', (event) => {
  const liEl = event.target.closest('li.cart-item');

  if (!liEl) return;
  const idx = parseInt(liEl.dataset.index);

  if (event.target.classList.contains('plus-btn')) {
    updateQty(idx, 1);
  } else if (event.target.classList.contains('minus-btn')) {
    updateQty(idx, -1);
  } else if (event.target.classList.contains('delete-item')) {
    removeItem(idx);
  }
});

function updateQty(index, change) {
  const item = cart[index];
  const product = productArr.find((product) => product.icon === item.icon);

  if (change > 0 && product.qty > 0) {
    item.qty += change;
    product.qty -= change;
  } else if (change < 0 && item.qty > 0) {
    item.qty += change;
    product.qty -= change;
  }

  if (item.qty <= 0) {
    cart.splice(index, 1);
  }

  cartUpdate();
  updateProductQtyDisplay(item.icon, product.qty);
}

function removeItem(index) {
  const item = cart[index];
  const product = productArr.find((product) => product.icon === item.icon);

  console.log(item);

  product.qty += item.qty;

  cart.splice(index, 1);

  cartUpdate();
  updateProductQtyDisplay(item.icon, product.qty);
}

function updateProductQtyDisplay(productIcon, qty) {
  const productItem = products
    .querySelector(`.product-btn[data-product="${productIcon}"]`)
    .closest('.product-item');

  const productQty = productItem.querySelector('.product-qty');
  productQty.innerHTML = `수량 : <span>${qty}</span>개`;

  console.log(productQty);
}

cartUpdate();

'use strict';

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

let possessedMoney = 25000;
let insertMoney = 0;
let cartArr = [];
let totalPrice;

possession.innerHTML = possessedMoney;
remainingAmount.innerHTML = insertMoney;

// 음료수 출력

productArr.forEach((item) => {
  products.innerHTML += `
      <div class="product-item bg">
        <i class="fa-solid fa-${item.icon}"></i>
        <p class="product-name">${item.name}</p>
        <p class="product-qty">수량 : ${item.qty}개</p>
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

const productBtns = document.querySelectorAll('.product-btn');

productBtns.forEach((btn) => {
  const productQty = btn.previousElementSibling;

  // 각 제품을 클릭하면 장바구니에 들어간다.
  btn.addEventListener('click', function () {
    const productName = btn.getAttribute('data-product');
    // const price = parseInt(btn.getAttribute('data-price'));

    const productObj = productArr.find((item) => item.icon === productName);

    if (productObj.qty > 0) {
      // => 제품을 클릭한 횟수 만큼 수량이 차감된다.
      let calc = productObj.qty - 1;
      productObj.qty = calc;
      productQty.innerHTML = `수량 : ${calc}개`;

      // => 장바구니에 들어간 제품의 갯수만큼 금액이 합산된다.

      // => 수량이 0개가 되면 '품절'된다.
      if (productObj.qty == 0) {
        productQty.innerHTML = '품절';
      }
    } else {
      alert('품절된 상품입니다.');
      return false;
    }
    console.log('productObj: ', productObj);
    addCart(productObj);
  });
});

function addCart(product) {
  const cartItem = cartArr.find((item) => item.icon === product.icon);

  if (cartItem) {
    cartItem.qty++;
  } else {
    cartArr.push({ ...product, qty: 1 });
  }
  // console.log('cartArr: ', cartArr);
  // console.log('cartItem: ', cartItem);
  cartUpdate();
}

function cartUpdate() {
  cartList.innerHTML = '';
  totalPrice = 0;
  cartArr.forEach((item, idx) => {
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

    // console.log('item.qty: ', item.qty);
    totalPrice += item.price * item.qty;
  });
  cartList.scrollTop = cartList.offsetHeight;
  cartCost.innerHTML = totalPrice;
}

// 장바구니 안에서 버튼을 조작할 수 있다.
// => +버튼은 장바구니에 있는 수량이 증가하고, 음료수 부분에서의 수량은 감소한다.
// => -버튼은 장바구니에 있는 수량이 감소하고, 음료수 부분에서의 수량은 증가한다.
// => 삭제 버튼을 누르면 장바구니에 들어간 제품이 삭제되고, 음료수 부분의 수량이 원래대로 돌아간다.
// => +버튼을 눌러서 음료수 수량이 0개가 되면 '품절'된다.
// => -버튼을 눌러서 장바구니 안에서의 수량이 0개가 되면 장바구니 목록에서 삭제된다.
cartList.addEventListener('click', (e) => {
  // console.log(e.target);
  const liEl = e.target.closest('li.cart-item');

  if (!liEl) return;

  const idx = parseInt(liEl.dataset.index);

  const plusBtn = e.target.classList.contains('plus-btn');
  const minusBtn = e.target.classList.contains('minus-btn');
  const deleteBtn = e.target.classList.contains('delete-btn');

  if (plusBtn) {
    console.log(plusBtn);
    updateCart(idx, 1);
  }

  // console.log(idx);
});

function updateCart(idx, change) {
  const item = cartArr[idx];
  const product = productArr.find((product) => product.icon === item.icon);

  if (change > 0 && product.qty > 0) {
    item.qty += 1;
    product.qty -= 1;
    console.log('item++ : ', item);
    console.log('product-- : ', product);
  }
  cartUpdate();
}

// 구매 버튼을 누르면
// => 장바구니 목록에 있던 아이템들이 구매 목록으로 넘어간다.
// => 장바구니 목록은 비워지고 남은 금액에서 합계금액을 뺀다.
function purchaseUpdate() {
  if (insertMoney < totalPrice) {
    alert('남은 금액보다 장바구니 금액이 큽니다.');
    return false;
  } else {
    cartArr.forEach((item) => {
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
    cartArr = [];
    totalPrice = 0;
    cartCost.innerHTML = totalPrice;
  }
}

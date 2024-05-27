'use strict';

let totalCash = 10000;
let insertCash = 0;
let totalQty = 5;
let totalPrice;
let cart = [];

const productBtn = document.querySelectorAll('.item-btn');

// 금액
const cashInHand = document.querySelector('.cash-in-hand span');
const remainingCash = document.querySelector('.remaining-amount span');
cashInHand.innerHTML = `${totalCash}원`;

const cartList = document.querySelector('.cart-list ul');
// 구매목록
const purchaseList = document.querySelector('.purchase-list ul');

// 장바구니 목록 수정
function changeQty(product, amount) {
  const item = cart.find((item) => item.product === product);

  console.log(currQty);

  if (item) {
    item.qty += amount;
    if (item.qty <= 0) {
      removeItem(product);
    }
    listIntegration(product, item.qty);
    cartUpdate();
  }
}

function removeItem(product) {
  const itemIdx = cart.findIndex((item) => item.product === product);

  if (itemIdx !== -1) {
    cart.splice(itemIdx, 1);
    cartUpdate();
  }
}

// 장바구니 목록 업데이트 연동....
function listIntegration(product, qty) {
  productBtn.forEach((e) => {
    const prod = e.getAttribute('data-product');
    if (prod === product) {
      const currQty = e.previousElementSibling;
      currQty.innerHTML = qty <= 0 ? '품절' : `수량 : ${qty}`;
    }
  });
}

// 장바구니 목록 업데이트
function cartUpdate() {
  cartList.innerHTML = '';
  totalPrice = 0;
  cart.forEach((item) => {
    const list = document.createElement('li');
    list.classList.add('item', 'before');
    list.innerHTML += `
      <i class="fa-solid fa-${item.product}"></i>
      <p>${item.name}</p>
      <span>${item.price * item.qty}원</span>
      <div class="btn-wrap">
        <button 
          class="btn qty-btn cart-btn" 
          data-action="increase"
          data-product="${item.product}">+</button>
        <span>${item.qty}</span>
        <button 
          class="btn qty-btn cart-btn" 
          data-action="decrease"
          data-product="${item.product}">-</button>
        <button 
          class="btn cart-btn" 
          data-action="remove"
          data-product="${item.product}">삭제</button>
      </div>
    `;
    totalPrice += item.price * item.qty;
    cartList.append(list);
  });

  cartList.nextElementSibling.innerHTML = `합계 ${totalPrice}원`;

  console.log(cart);
}

// 장바구니 물품 수정
// const productUpdate = document.querySelectorAll('.cart-btn');
function cartBtns(e) {
  if (!e.target.matches('button[data-action]')) return;

  let action = e.target.getAttribute('data-action');
  let product = e.target.getAttribute('data-product');

  if (action === 'increase') {
    changeQty(product, 1);
  } else if (action === 'decrease') {
    changeQty(product, -1);
  } else if (action === 'remove') {
    removeItem(product);
  }
}

// 장바구니 버튼 이벤트 핸들러
cartList.addEventListener('click', function (e) {
  cartBtns(e);
});

// 구매 목록 업데이트
function purchaseUpdate() {
  if (insertCash < totalPrice) {
    alert('남은 금액보다 장바구니 금액이 큽니다.');
    return false;
  } else {
    // purchaseList.innerHTML = '';
    cart.forEach((item) => {
      const list = document.createElement('li');
      list.classList.add('item', 'after');
      list.innerHTML += `
        <i class="fa-solid fa-${item.product}"></i>
        <p>${item.name}</p>
        <span>${item.qty}개</span>
      `;
      purchaseList.append(list);
    });
    remainingCash.innerHTML = `${(insertCash -= totalPrice)}원`;

    cartList.innerHTML = '물품을 추가해 주세요!';
    cart = [];
    totalPrice = 0;
    cartList.nextElementSibling.innerHTML = `합계 ${totalPrice}원`;
  }
}

// 자판기에 돈 추가
function addCash(cash) {
  if (totalCash == 0) {
    alert('소지금보다 투입금액이 큽니다!');
    return false;
  } else if (totalCash < cash) {
    alert('소지금보다 투입금액이 큽니다!');
    return false;
  } else {
    cashInHand.innerHTML = `${(totalCash -= cash)}원`;
    remainingCash.innerHTML = `${(insertCash += cash)}원`;
  }
}

// 거스름돈 받기
function getChange() {
  cashInHand.innerHTML = `${(totalCash += insertCash)}원`;
  insertCash = 0;
  remainingCash.innerHTML = '0원';
}

// 각 제품 이름 받아오기
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

// 음료수를 클릭하면 장바구니에 들어감
function addCart(product, price) {
  const addItem = cart.find((item) => item.product === product);
  if (addItem) {
    addItem.qty++;
  } else {
    cart.push({
      product,
      name: getProductName(product),
      price,
      qty: 1,
    });
  }

  cartUpdate();
}

// 각 제품들의 버튼 관리
productBtn.forEach((e) => {
  const productQty = e.previousElementSibling;
  let countQty = 0;
  e.addEventListener('click', function () {
    countQty++;
    const product = e.getAttribute('data-product');
    const price = parseInt(e.getAttribute('data-price'));

    if (totalQty > countQty) {
      productQty.innerHTML = `수량 : ${totalQty - countQty}개`;
    } else if (totalQty == countQty) {
      productQty.innerHTML = `품절`;
    } else {
      alert('품절된 상품입니다.');
      return false;
    }

    addCart(product, price);
  });
});

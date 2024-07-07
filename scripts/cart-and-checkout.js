let orderSuccessMessage = document.getElementById("orderSuccessMessage");

let products = localStorage.getItem("cartItems");

if (products) {
    products = JSON.parse(products);
} else {
    products = [];
}

//--------------------------

document.addEventListener('DOMContentLoaded', LoadCartProducts(products));

function LoadCartProducts(products) {
    const cartContainer = document.getElementById('cart-container');
    let emptyCartMessage = document.getElementById('emptyCartMessage');
    // Function to render products in the cart
    const renderCartItems = () => {
        cartContainer.innerHTML = "";
        if (products.length === 0) {
            emptyCartMessage.style.display = 'block';
        } else {
            emptyCartMessage.style.display = 'none';
        }
        products.forEach(product => {
            const cartItem = document.createElement('div');
            cartItem.className = 'row cart-item';
            cartItem.dataset.price = product.price;

            cartItem.innerHTML = `
                            <div class="col-lg-3 col-md-4 col-sm-6 mb-4 mb-lg-0">
                <div class="bg-image ripple rounded" data-mdb-ripple-color="light">
                    <img class="productImg w-100" src="${product.img}" alt="${product.name}" style="max-height: 180px; object-fit: cover;">
                    <a href="#!">
                        <div class="mask" style="background-color: rgba(251, 251, 251, 0.2)"></div>
                    </a>
                </div>
            </div>

            <div class="col-lg-5 col-md-8 col-sm-6 mb-4 mb-lg-0">
                <p class="productName">${product.name}</p>
                <p class="productCategory">Category: ${product.category}</p>
                <p class="productDiscount">${product.onSale ? `Discount: ${product.discount}%` : '<br/>'}</p>
                <p class="data-price">Price: $${product.price}</p>

                <button type="button" class="btn btn-primary btn-sm me-1 mb-2 remove-item" data-product-id="${product.id}" data-mdb-tooltip-init title="Remove item">
                    <i class="fas fa-trash"></i> Remove
                </button>
            </div>

            <div class="col-lg-4 col-md-12 mb-4 mb-lg-0">
                <div class="d-flex mb-4" style="max-width: 300px">
                    <button class="btn btn-primary px-3 me-2 btn-minus">
                        <i class="fas fa-minus"></i> 
                    </button>
                    <div data-mdb-input-init class="form-outline">
                        <input min="1" name="quantity" value="1" type="number" class="form-controls quantity" disabled/>
                    </div>
                    <button class="btn btn-primary px-3 ms-2 btn-plus">
                        <i class="fas fa-plus"></i> 
                    </button>
                </div>
                <p class="text-start text-md-center item-total-price">$${product.onSale ? (product.price * (100 - product.discount) / 100) : product.price}</p>
            </div>

            
            `;

            cartContainer.appendChild(cartItem);
        });
        addEventListeners();
        updateTotalPrice();
    };

    const discountRate = 0.1; // 10% discount

    const updateTotalPrice = () => {
        const cartItems = document.querySelectorAll('.cart-item');
        let totalPrice = 0;

        cartItems.forEach(item => {
            const quantity = parseInt(item.querySelector('.quantity').value);
            const price = parseFloat(item.dataset.price);
            const itemTotalPrice = quantity * price;
            item.querySelector('.item-total-price').textContent = `$${itemTotalPrice.toFixed(2)}`;
            totalPrice += itemTotalPrice;
        });

        const discount = totalPrice * discountRate;
        const totalAmount = totalPrice - discount;

        document.getElementById('total-price').textContent = `$${totalPrice.toFixed(2)}`;
        document.getElementById('total-amount').textContent = `$${totalAmount.toFixed(2)}`;
    };

    const addEventListeners = () => {
        document.querySelectorAll('.btn-plus').forEach(btn => {
            btn.addEventListener('click', function () {
                const quantityInput = this.closest('.d-flex').querySelector('.quantity');
                quantityInput.stepUp();
                updateTotalPrice();
            });
        });

        document.querySelectorAll('.btn-minus').forEach(btn => {
            btn.addEventListener('click', function () {
                const quantityInput = this.closest('.d-flex').querySelector('.quantity');
                quantityInput.stepDown();
                updateTotalPrice();
            });
        });

        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', function () {
                const productId = this.getAttribute("data-product-id");
                //this.closest('.cart-item').remove();
                removeProductFromCart(productId);
                updateTotalPrice();
            });
        });


    };

    renderCartItems(products);


    //CHECKOUT


   

};


document.addEventListener('DOMContentLoaded', function () {
    const onDelivery = document.getElementById('onDelivery');
    const cardMethod = document.getElementById('cardMethod');
    const cardInformationSection = document.getElementById('cardInformationSection');

    function toggleCardInformation() {
        if (cardMethod.checked) {
            cardInformationSection.style.display = 'block';
        } else {
            cardInformationSection.style.display = 'none';
        }
    }

    // Add event listeners to radio buttons
    onDelivery.addEventListener('change', toggleCardInformation);
    cardMethod.addEventListener('change', toggleCardInformation);

    // Initial check to set the correct state
    toggleCardInformation();


    const orderForm = document.getElementById('orderForm');
const modal = document.getElementById('exampleModalCenter');
const btnCheckout = document.getElementById("goToCheckout");
const checkoutAlert = document.getElementById("checkoutAlert");
const totalAmountElement = document.getElementById("total-amount");

btnCheckout.addEventListener("click", function(){ 
    const totalAmount = parseFloat(totalAmountElement.textContent.substring(1));
    clearTimeout(checkoutAlert.timeout);
    checkoutAlert.style.display = 'block';
    console.log(totalAmount);
    if(totalAmount <= 0){
        checkoutAlert.innerText = "Your cart is empty. Add items to cart!";
        setTimeout(function() {
            checkoutAlert.style.display = 'none'; // Hide the alert after 5 seconds
        }, 3000);
    }else {
        modal.show();
        checkoutAlert.innerText = "";
    }
});


    orderForm.addEventListener('submit', function (e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        if (orderForm.checkValidity()) {
            //alert('The order is successfully submitted.');
            orderSuccessMessage.innerText = "The order is successfully submitted.";
            setTimeout(() => {
                orderSuccessMessage.innerHTML = "";
            }, 4000);
            localStorage.setItem("cartItems", JSON.stringify([]));
            let jsondata = localStorage.getItem("cartItems");
            products = JSON.parse(jsondata);
            LoadCartProducts(products);
            modal.hide();
        } else {
            // Highlight the fields with errors
            orderForm.reportValidity();
            alert('Your cart is empty! Add products to submit your order!');
        }
    });


function removeProductFromCart(productId) {
    products = products.filter(product => product.id !== productId);
    localStorage.setItem("cartItems", JSON.stringify(products));
    LoadCartProducts(products);
}


});


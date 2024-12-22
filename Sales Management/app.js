const selectProductCategory = document.getElementById("select-product-category")
const ordersTableBody = document.getElementById("orders-table-body");
const orderSearchButton = document.getElementById("search-button-orders");
const orderClearButton = document.getElementById("search-clear-button");
const addOrderButton = document.getElementById("add-order-button");
const sectionLogOrder = document.getElementById("section-log-new-order");
const formLogOrder = document.getElementById("form-log-order");
const sectionUpdateOrderStatus = document.getElementById("section-update-order-status");
const updateOrderStatusForm = document.getElementById("form-update-order-status");

//sayfa yüklendiğinde local storage'dan veri alma
document.addEventListener("DOMContentLoaded", () => {
    window.orders.forEach((order,index) => addOrderToTable(order,index));
    window.categories.forEach(category =>{
        const option = document.createElement("option");
        option.value = category.name;
        option.textContent = `${category.name}`;
        selectProductCategory.appendChild(option);
    })
});

//id lerin benzersizliği
function isIdUnique(id, itemList) {
    return !itemList.some(item => item.id === id);
}

//id önerisi
function suggestUniqueId(itemList) {
    let suggestedId;
    do {
        suggestedId = Math.floor(Math.random() * 10000);
    } while (!isIdUnique(suggestedId, itemList));
    return suggestedId;
}

//order'ları tabloya ekleme fonksiyonu
function addOrderToTable(order, index) {
    const row = document.createElement('tr');

    row.innerHTML = `
        <td>${order.id}</td>
        <td>${order.customerName}</td>
        <td>${order.customerContactNumber}</td>
        <td>${order.shippingLocation}</td>
        <td>${order.date}</td>
        <td>${order.productCategory}</td>
        <td>${order.quantityOrdered}</td>
        <td>${order.totalPrice}</td>
        <td>${order.status}</td>
        <td>
            <button class="general-button" id="update-order-status-button" data-index="${index}">Update Order Status</button>
        </td>
    `;
    ordersTableBody.appendChild(row);

    row.querySelector("#update-order-status-button").addEventListener("click", () =>{
        const selectedOrder = window.orders[index];
        
        sectionUpdateOrderStatus.style.display = "block";

        document.querySelector(`input[name="update-order-status"][value="${selectedOrder.status}"]`).checked = true;
        updateOrderStatusForm.setAttribute("data-index",index);
    });
};

//search butonu
orderSearchButton.addEventListener("click", () => {
    const searchValue = document.getElementById("search-bar-order").value.toLowerCase();
    const filteredOrders = window.orders.filter(order => {
        return(order.status.toLowerCase().includes(searchValue) ||
        order.customerName.toLowerCase().includes(searchValue) ||
        order.productCategory.toLowerCase().includes(searchValue)
    )});
    ordersTableBody.innerHTML = "";
    filteredOrders.forEach(order => {
        addOrderToTable(order)
    });
});

//clear butonu
orderClearButton.addEventListener("click", () => {
    ordersTableBody.innerHTML = "";
    window.orders.forEach((order, index) => addOrderToTable(order, index));
    document.getElementById("search-bar-order").value = "";
} )

//log order butonu kontrolü
addOrderButton.addEventListener("click", () => {
    sectionLogOrder.style.display = "block";
    formLogOrder.addEventListener('submit', (event) => {
        event.preventDefault();
    
        // İnputları toplama
        const id = document.getElementById('order-id').value;

        if(!isIdUnique(id,window.orders)){
            const suggestedId = suggestUniqueId(window.orders);
            alert(`The ID that you entered is not unique. You can use this suggested ID: ${suggestedId}`);
            return;
        }

        const customerName = document.getElementById('customer-name').value;
        const customerContactNumber = document.getElementById("customer-contact-number").value;
        const shippingLocation = document.getElementById('shipping-location').value;
        const date = document.getElementById('order-date').value;
        const productCategory = document.getElementById('select-product-category').value;
        const quantityOrdered = document.getElementById("quantity-ordered").value;
        const status = document.querySelector('input[name="order-status"]:checked').value;
    
        // Yeni order verisinin objesinin oluşturulması
        const selectedCategoryIndex = findCategory(productCategory);
        const selectedCategory = window.categories[selectedCategoryIndex];
        unitPrice = selectedCategory.price;
        const totalPrice = unitPrice*quantityOrdered;

        const newOrder = {id, customerName, customerContactNumber, shippingLocation, date, productCategory, quantityOrdered, totalPrice, status};

        addOrder(newOrder);
        
        newStockLevel = selectedCategory.stockLevel - quantityOrdered;

        const updatedCategory = {
            id:selectedCategory.id,
            name:selectedCategory.name,
            weight:selectedCategory.weight,
            price:selectedCategory.price,
            marketDemand:selectedCategory.marketDemand,
            stockLevel: newStockLevel,
            restockAlert:selectedCategory.restockAlert,
        }

        window.categories[selectedCategoryIndex] = updatedCategory;
        localStorage.setItem("categories", JSON.stringify(window.categories));

        formLogOrder.reset();
        sectionLogOrder.style.display = "none";
    });
})

//yeni order ekleme fonksiyonu
function addOrder(newOrder){
    window.orders.push(newOrder);
    localStorage.setItem('orders', JSON.stringify(window.orders));
    addOrderToTable(newOrder, window.orders.length - 1);

}

function findCategory(categoryName){
    index = 0;
    window.categories.forEach(category => {
        if(category.name === categoryName){
            index = window.categories.indexOf(category);
            return;
        }else{}
    });
    return index;
}

//order status update formu kontrolü
updateOrderStatusForm.addEventListener("submit", function (event){
    event.preventDefault();

    const index = updateOrderStatusForm.getAttribute("data-index");

    const updatedOrder = window.orders[index];
    updatedOrder.status = document.querySelector('input[name="update-order-status"]:checked').value;

    window.orders[index] = updatedOrder;
    localStorage.setItem("orders", JSON.stringify(window.orders));
    const row = ordersTableBody.rows[index];
    row.cells[8].textContent = updatedOrder.status;

    updateOrderStatusForm.reset();
    sectionUpdateOrderStatus.style.display = "none";
});
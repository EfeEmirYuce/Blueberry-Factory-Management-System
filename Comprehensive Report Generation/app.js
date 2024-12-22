const netProfit = document.getElementById("net-profit");
const soldCategory = document.getElementById("sold-category");
const stockCategory = document.getElementById("stock-category");

function calculateTotalIncome(){
    totalIncome = 0;
    window.orders.forEach(order => {
        totalIncome = totalIncome + parseInt(order.totalPrice);
    });
    return totalIncome;
}

function calculateTotalExpense(){
    totalExpense = 0;
    window.purchases.forEach(purchase => {
        totalExpense = totalExpense + parseInt(purchase.totalCost);
    });
    return totalExpense;
}

const taxRate = 0.08;

function calculateNetIncome(){
    return calculateTotalIncome()*taxRate;
}

function calculateNetProfit(){
    return (calculateNetIncome() - calculateTotalExpense());
}

netProfit.innerHTML = `
    <p>Total Income: ${calculateTotalIncome()}$</p>
    <p>Total Expense: ${calculateTotalExpense()}$</p>
    <p>Tax Rate For Sales: %${taxRate*100}</p>
    <p>Net Income: ${calculateNetIncome()}$</p>
    <p>Net Profit: ${calculateNetProfit()}$</p>
`

function calculateSoldProductPerCategory(categoryName){
    soldProductPerCategory = 0;
    window.orders.forEach(order => {
        if(order.productCategory === categoryName){
            soldProductPerCategory = soldProductPerCategory + parseInt(order.quantityOrdered);
        }
    })
    return soldProductPerCategory;
}

function calculateRemainingStockPerCategory(categoryName){
    remainingStockPerCategory = 0;
    window.categories.forEach(category => {
        if(category.name === categoryName){
            remainingStockPerCategory = remainingStockPerCategory + parseInt(category.stockLevel);
        }
    });
    return remainingStockPerCategory;
}

window.categories.forEach(category => {
    const row = document.createElement("p")
    row.innerHTML = `<p>Category ${category.name}: ${calculateSoldProductPerCategory(category.name)} sold</p>`
    soldCategory.appendChild(row);
});

window.categories.forEach(category => {
    const row = document.createElement("p")
    row.innerHTML = `<p>Category ${category.name}: ${calculateRemainingStockPerCategory(category.name)} remaining</p>`
    stockCategory.appendChild(row);
});
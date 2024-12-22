const netProfit = document.getElementById("net-profit");
const soldCategory = document.getElementById("sold-category");
const stockCategory = document.getElementById("stock-category");

document.getElementById("generate-time-period-summary").addEventListener("click", () => {
    const startDate = document.getElementById("start-date-summary").value;
    const endDate = document.getElementById("end-date-summary").value;

    function filterOrders(startDate, endDate){
        
    }

    function calculateTotalIncome(startDate, endDate){
        totalIncome = 0;
        const filteredOrders = window.orders.filter(order => {
            const orderDate = new Date(order.date);
            return orderDate >= new Date(startDate) && orderDate <= new Date(endDate);
        });
        totalIncome = filteredOrders.reduce((sum, order) => sum + parseFloat(order.totalPrice), 0);
        return totalIncome;
    }

    function calculateTotalExpense(){   
        totalExpense = 0;
        const filteredPurchases = window.purchases.filter(purchase => {
            const purchaseDate = new Date(purchase.dateOfPurchase);
            return purchaseDate >= new Date(startDate) && purchaseDate <= new Date(endDate);
        });
        totalExpense = filteredPurchases.reduce((sum, purchase) => sum + parseFloat(purchase.totalCost), 0);
        return totalIncome;
    }

    const taxRate = 0.08;

    function calculateNetIncome(){
        return calculateTotalIncome(startDate, endDate) - calculateTotalIncome(startDate, endDate)*taxRate;
    }

    function calculateNetProfit(){
        return (calculateNetIncome() - calculateTotalExpense(startDate, endDate));
    }

    netProfit.innerHTML = `
        <p>Total Income: ${calculateTotalIncome(startDate, endDate)}$</p>
        <p>Total Expense: ${calculateTotalExpense(startDate, endDate)}$</p>
        <p>Tax Rate For Sales: %${taxRate*100}</p>
        <p>Net Income: ${calculateNetIncome()}$</p>
        <p>Net Profit: ${calculateNetProfit()}$</p>
    `

    function calculateSoldProductPerCategory(categoryName, startDate, endDate){
        soldProductPerCategory = 0;
        const filteredOrders = window.orders.filter(order => {
            const orderDate = new Date(order.date);
            return orderDate >= new Date(startDate) && orderDate <= new Date(endDate) 
            && order.productCategory === categoryName;
        });
        soldProductPerCategory = filteredOrders.reduce((sum, order) => sum + parseFloat(order.quantityOrdered), 0);
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
        row.innerHTML = `<p>Category ${category.name}: ${calculateSoldProductPerCategory(category.name, startDate, endDate)} sold</p>`
        soldCategory.appendChild(row);
    });

    window.categories.forEach(category => {
        const row = document.createElement("p")
        row.innerHTML = `<p>Category ${category.name}: ${calculateRemainingStockPerCategory(category.name)} remaining</p>`
        stockCategory.appendChild(row);
    });
});
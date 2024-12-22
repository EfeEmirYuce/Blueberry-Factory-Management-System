const netProfit = document.getElementById("net-profit");

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
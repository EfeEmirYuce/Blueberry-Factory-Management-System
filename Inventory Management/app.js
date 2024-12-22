const inventoryMonitorTableBody = document.getElementById("inventory-monitor-tablebody");

document.addEventListener("DOMContentLoaded", () => {
    window.inventory.forEach(item => {item.reorderLevel = reorderLevel(item.quantityAvailable)});
    window.inventory.forEach((item,index) => {addInventoryToTable(item,index)});
});

function addInventoryToTable(item,index){
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${item.id}</td>
        <td>${item.category}</td>
        <td>${item.quantityAvailable}</td>
        <td>${item.reorderLevel}</td>
        <td>${item.restockDate}</td>
        <td>${item.storageLocation}</td>
    `;
    inventoryMonitorTableBody.appendChild(row);
}

function reorderLevel(stock){
    if(stock < 50){
        return "Critical low";
    }else if (stock < 100){
        return "Low";
    }else{
        return "Fine";
    }
}
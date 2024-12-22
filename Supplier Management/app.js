const farmersTableBody = document.getElementById('farmers-table-body');
const addFarmerForm = document.getElementById("form-add-farmer");
const sectionAddFarmer = document.getElementById("section-add-new-farmer");
const addFarmerButton = document.getElementById("add-farmer-button");
const sectionUpdateFarmer = document.getElementById("section-update-farmer");
const updateFarmerForm = document.getElementById("form-update-farmer");
const farmerSearchButton = document.getElementById("search-button-farmers");
const farmerClearButton = document.getElementById("search-clear-button");

const purchasesTableBody = document.getElementById("purchases-table-body");
const logPurchaseButton = document.getElementById("log-new-purchase-button");
const sectionLogPurchase = document.getElementById("section-log-new-purchase");
const logPurchaseForm = document.getElementById("form-log-purchase");
const farmerSelect = document.getElementById("select-farmer-id");

//sayfa yüklendiğinde local storagedaki verileri alma
document.addEventListener('DOMContentLoaded', () => {
    window.farmers.forEach((farmer, index) => addFarmerToTable(farmer, index));
    window.purchases.forEach((purchase, index) => addPurchaseToTable(purchase, index));
    window.farmers.forEach(farmer => {
        const option = document.createElement('option');
        option.value = farmer.id;
        option.textContent = `${farmer.id} - ${farmer.name}`;
        farmerSelect.appendChild(option);
    });
});

function updateFarmerSelect(newFarmer){
    const option = document.createElement('option');
    option.value = newFarmer.id;
    option.textContent = `${newFarmer.id} - ${newFarmer.name}`;
    farmerSelect.appendChild(option);
}

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

//farmer'ları tabloya ekleme fonksiyonu
function addFarmerToTable(farmer, index) {
    const row = document.createElement('tr');

    row.innerHTML = `
        <td>${farmer.id}</td>
        <td>${farmer.name}</td>
        <td>${farmer.contactDetails}</td>
        <td>${farmer.location}</td>
        <td>
            <button class="general-button" id="update-button" data-index="${index}">Update</button>
            <button class="general-button" id="delete-button" data-index="${index}">Delete</button>
        </td>
    `;
    farmersTableBody.appendChild(row);

    // farmers sayfasındaki update butonu kontrolü
    row.querySelector('#update-button').addEventListener('click', () => {
        const selectedFarmer = window.farmers[index];
        // Update kısmını görünür yapma
        sectionUpdateFarmer.style.display = 'block';

        document.getElementById('update-farmer-id').value = selectedFarmer.id;
        document.getElementById('update-farmer-name').value = selectedFarmer.name;
        document.getElementById('update-contact-details').value = selectedFarmer.contactDetails;
        document.getElementById('update-location').value = selectedFarmer.location;
        
        // Update formunun index'inin tutulması
        updateFarmerForm.setAttribute('data-index', index);
    });

    // farmers sayfasındaki delete butonunun kontrolü
    row.querySelector('#delete-button').addEventListener('click', () => {
        // Seçilen farmer'ın silinmesi
        window.farmers.splice(index, 1);
        // Local Storage'ın düzenlenmesi
        localStorage.setItem('farmers', JSON.stringify(window.farmers));
        // Silinen farmer'ın tablodan çıkarılması
        row.remove();
    });
}

//search butonu
farmerSearchButton.addEventListener("click", () => {
    const searchValue = document.getElementById("search-bar-farmers").value.toLowerCase();
    const filteredFarmers = window.farmers.filter(farmer => {
        return(farmer.name.toLowerCase().includes(searchValue) ||
        farmer.location.toLowerCase().includes(searchValue)
    )});
    farmersTableBody.innerHTML = "";
    filteredFarmers.forEach(farmer => {
        addFarmerToTable(farmer)
    });
});

//clear butonu
farmerClearButton.addEventListener("click", () => {
    farmersTableBody.innerHTML = "";
    window.farmers.forEach((farmer, index) => addFarmerToTable(farmer, index));
    document.getElementById("search-bar-farmers").value = "";
} )

//farmers için update formunun kontrolü
updateFarmerForm.addEventListener('submit', function (event) {
    event.preventDefault();

    // Değiştirilmek istenen farmerın index'i
    const index = updateFarmerForm.getAttribute('data-index');

    // Değiştirilmek istenen bilgiler
    const updatedFarmer = {
        id: document.getElementById('update-farmer-id').value,
        name: document.getElementById('update-farmer-name').value,
        contactDetails: document.getElementById("update-contact-details").value,
        location: document.getElementById('update-location').value
    };

    // Bilgileri güncelleme
    window.farmers[index] = updatedFarmer;
    localStorage.setItem('farmers', JSON.stringify(window.farmers));
    const row = farmersTableBody.rows[index];
    row.cells[0].textContent = updatedFarmer.id;
    row.cells[1].textContent = updatedFarmer.name;
    row.cells[2].textContent = updatedFarmer.contactDetails;
    row.cells[3].textContent = updatedFarmer.location;

    updateFarmerForm.reset();
    sectionUpdateFarmer.style.display = 'none';
});

//add farmer butonu kontrolü
addFarmerButton.addEventListener("click", () => {
    sectionAddFarmer.style.display = "block";
    addFarmerForm.addEventListener('submit', (event) => {
        event.preventDefault();
    
        // İnputları toplama
        const id = document.getElementById('farmer-id').value;
        const name = document.getElementById('farmer-name').value;
        const contactDetails = document.getElementById("contact-details").value;
        const location = document.getElementById('farmer-location').value;
    
        // Yeni farmer verisinin objesinin oluşturulması
        const newFarmer = {id, name, contactDetails, location };

        addFarmer(newFarmer);
        updateFarmerSelect(newFarmer);
        
        addFarmerForm.reset();
        sectionAddFarmer.style.display = "none";
    });
})

//yeni farmer ekleme fonksiyonu
function addFarmer(newFarmer){
    window.farmers.push(newFarmer);
    localStorage.setItem('farmers', JSON.stringify(window.farmers));
    addFarmerToTable(newFarmer, window.farmers.length - 1);

}

//export butonu
function exportToCSV() {
    const csvRows = [];
  
    const headers = ["Farmer ID", "Farmer Name", "Contact Details", "Location"];
    csvRows.push(headers.join(","));
  
    window.farmers.forEach(farmer => {
      const row = [farmer.id, farmer.name, farmer.contactDetails, farmer.location];
      csvRows.push(row.join(","));
    });
  
    const csvData = csvRows.join("\n");
    const blob = new Blob([csvData], { type: "text/csv" });
  
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "farmers_report.csv";
    link.click();
}

//purchase'ları tabloya ekleme fonksiyonu
function addPurchaseToTable(purchase, index) {
    const row = document.createElement('tr');

    row.innerHTML = `
        <td>${purchase.id}</td>
        <td>${purchase.farmer}</td>
        <td>${purchase.dateOfPurchase}</td>
        <td>${purchase.quantityPurchased}</td>
        <td>${purchase.pricePerKilogram}</td>
        <td>${purchase.totalCost}</td>
        <td>
            <button class="general-button" id="delete-button" data-index="${index}">Delete</button>
        </td>
    `;
    purchasesTableBody.appendChild(row);

    row.querySelector('#delete-button').addEventListener('click', () => {
        window.purchases.splice(index, 1);
        localStorage.setItem('purchases', JSON.stringify(window.purchases));
        row.remove();
    });
}

//log purchase butonu kontrolü
logPurchaseButton.addEventListener("click", () => {
    sectionLogPurchase.style.display = "block";
    logPurchaseForm.addEventListener('submit', (event) => {
        event.preventDefault();
    
        // İnputları toplama
        const id = document.getElementById('purchase-id').value;

        //ID kontrolü
        if(!isIdUnique(id,window.purchases)){
            const suggestedId = suggestUniqueId(window.purchases);
            alert(`The ID that you entered is not unique. You can use this suggested ID: ${suggestedId}`);
            return;
        }

        const farmer = document.getElementById('select-farmer-id').value;
        const dateOfPurchase = document.getElementById("date-of-purchase").value;
        const quantityPurchased = document.getElementById("quantity-purchased").value;
        const pricePerKilogram = document.getElementById('price-per-kilogram').value;
        const totalCost = quantityPurchased*pricePerKilogram;
    
        // Yeni purchase verisinin objesinin oluşturulması
        const newPurchase = {id, farmer, dateOfPurchase, quantityPurchased, pricePerKilogram, totalCost};

        addPurchase(newPurchase);
        
        window.blueberries = window.blueberries + parseInt(newPurchase.quantityPurchased);
        localStorage.setItem("blueberries", window.blueberries);

        logPurchaseForm.reset();
        sectionLogPurchase.style.display = "none";
    });
})

//yeni purchase ekleme fonksiyonu
function addPurchase(newPurchase){
    window.purchases.push(newPurchase);
    localStorage.setItem('purchases', JSON.stringify(window.purchases));
    addPurchaseToTable(newPurchase, window.purchases.length - 1);

}

//sort by date butonu
document.getElementById('sort-by-date-button').addEventListener('click', () => {
    const sorted = sortItems(window.purchases, 'dateOfPurchase', 'asc');
    updateTable(sorted);
});

//sort by farmer butonu
document.getElementById('sort-by-farmer-button').addEventListener('click', () => {
    const sorted = sortItems(window.purchases, 'farmer', 'asc');
    updateTable(sorted);
});

//sort by amount butonu
document.getElementById('sort-by-amount-button').addEventListener('click', () => {
    const sorted = sortItems(window.purchases, 'quantityPurchased', 'asc');
    updateTable(sorted);
});

//sıralamayı sıfırlama
document.getElementById("clear-purchase-table-button").addEventListener("click", () =>{
    purchasesTableBody.innerHTML = "";
    window.purchases.forEach((purchase, index) => addPurchaseToTable(purchase, index));
});

//sort fonksiyonu
function sortItems(itemList, key, order = 'asc') {
    return itemList.sort((a, b) => {
        if (key === 'date') {
            const dateA = new Date(a[key]);
            const dateB = new Date(b[key]);
            return order === 'asc' ? dateA - dateB : dateB - dateA;
        } else if (key === 'amount') {
            const amountA = parseFloat(a[key]);
            const amountB = parseFloat(b[key]);
            return order === 'asc' ? amountA - amountB : amountB - amountA;
        } else {
            const valueA = a[key].toString().toLowerCase();
            const valueB = b[key].toString().toLowerCase();
            if (valueA < valueB) return order === 'asc' ? -1 : 1;
            if (valueA > valueB) return order === 'asc' ? 1 : -1;
            return 0;
        }
    });
}

//sıralamayı tabloya aktarma fonksiyonu
function updateTable(sortedItems) {
    purchasesTableBody.innerHTML = '';
    sortedItems.forEach((item, index) => {
        addPurchaseToTable(item,index);
    });
}

//farmer bazında purchase özeti
function generateFarmerSummary(farmer) {
    const farmerPurchases = window.purchases.filter(purchase => purchase.farmer === farmer);

    const totalQuantity = farmerPurchases.reduce((sum, purchase) => sum + parseFloat(purchase.quantityPurchased), 0);
    const totalCost = farmerPurchases.reduce((sum, purchase) => sum + parseFloat(purchase.totalCost), 0);

    return {
        farmer,
        totalQuantity,
        totalCost,
        purchases: farmerPurchases
    };
}

//date bazında purchase özeti
function generateTimePeriodSummary(startDate, endDate) {
    // Filter purchases within the date range
    const filteredPurchases = window.purchases.filter(purchase => {
        const purchaseDate = new Date(purchase.dateOfPurchase);
        return purchaseDate >= new Date(startDate) && purchaseDate <= new Date(endDate);
    });

    // Summarize the data
    const totalQuantity = filteredPurchases.reduce((sum, purchase) => sum + parseFloat(purchase.quantityPurchased), 0);
    const totalCost = filteredPurchases.reduce((sum, purchase) => sum + parseFloat(purchase.totalCost), 0);

    return {
        startDate,
        endDate,
        totalQuantity,
        totalCost,
        purchases: filteredPurchases
    };
}

// farmer özeti
document.getElementById('generate-farmer-summary').addEventListener('click', () => {
    const farmer = document.getElementById('farmer-id-summary').value;
    const summary = generateFarmerSummary(farmer);

    displaySummary(summary, `Summary for Farmer ${farmer}`);
});

// date özeti
document.getElementById('generate-time-period-summary').addEventListener('click', () => {
    const startDate = document.getElementById('start-date-summary').value;
    const endDate = document.getElementById('end-date-summary').value;
    const summary = generateTimePeriodSummary(startDate, endDate);

    displaySummary(summary, `Summary for ${startDate} to ${endDate}`);
});

//özeti tabloya aktarma fonksiyonu
function displaySummary(summary, title) {
    const outputDiv = document.getElementById('summary-output');
    outputDiv.innerHTML = `
        <h3>${title}</h3>
        <p>Total Quantity: ${summary.totalQuantity}</p>
        <p>Total Cost: ${summary.totalCost}</p>
        <h4>Purchases:</h4>
        <ul>
            ${summary.purchases.map(purchase => `
                <li>
                    ID: ${purchase.id}, Date: ${purchase.dateOfPurchase}, 
                    Quantity: ${purchase.quantityPurchased}, Total Cost: ${purchase.totalCost}
                </li>`).join('')}
        </ul>
    `;
}

//date bazında harcama hesabı
function calculateExpensesForPeriod(startDate, endDate) {
    const filteredPurchases = window.purchases.filter(purchase => {
        const purchaseDate = new Date(purchase.dateOfPurchase);
        return purchaseDate >= new Date(startDate) && purchaseDate <= new Date(endDate);
    });

    const totalExpense = filteredPurchases.reduce((sum, purchase) => sum + parseFloat(purchase.totalCost), 0);

    return {
        startDate,
        endDate,
        totalExpense,
        purchases: filteredPurchases
    };
}

//harcama hesabı butonu kontrolü
document.getElementById('calculate-expenses').addEventListener('click', () => {
    const startDate = document.getElementById('start-date-expense').value;
    const endDate = document.getElementById('end-date-expense').value;

    const expenseSummary = calculateExpensesForPeriod(startDate, endDate);
    displayExpenseReport(expenseSummary);
});

//hesaplama sonucunu ekrana aktarma
function displayExpenseReport(expenseSummary) {
    const outputDiv = document.getElementById('expense-output');
    const { startDate, endDate, totalExpense, purchases } = expenseSummary;

    outputDiv.innerHTML = `
        <h3>Expense Report</h3>
        <p>Time Period: ${startDate} to ${endDate}</p>
        <p>Total Expense: ${totalExpense.toFixed(2)}</p>
        <h4>Purchases:</h4>
        <ul>
            ${purchases.map(purchase => `
                <li>
                    ID: ${purchase.id}, Date: ${purchase.dateOfPurchase}, 
                    Cost: ${purchase.totalCost}
                </li>`).join('')}
        </ul>
    `;
}

const categoriesTableBody = document.getElementById("product-categorization-table-body");
const editCategoryForm = document.getElementById("form-edit-category");
const sectionEditCategory = document.getElementById("section-edit-category");
const inventoryTableBody = document.getElementById("inventory-categories-table-body");
const formPackage = document.getElementById("form-package");
const categoryDropdown = document.getElementById("category-dropdown");
const blueberryQuantity = document.getElementById("blueberry-quantity");

//sayfa yüklendiğinde kategori bilgilerini alır
document.addEventListener("DOMContentLoaded", () => {
    window.categories.forEach((category) => {category.price = pricingStructure(category.weight, category.marketDemand)});
    window.categories.forEach((category, index) => { addCategoryToTable(category,index)});
    window.categories.forEach((category) => {category.restockAlert = restockAlert(category.stockLevel)});
    window.categories.forEach((category, index) => { addInventoryToTable(category,index)});
});

//fiyatlandırma politikası
function pricingStructure(weight, marketDemand){
    let price = weight/10
    price = price - (weight/1000)**2;
    if(marketDemand === "high"){
        price = price*1.1;
    }else if(marketDemand === "low"){
        price = price*0.9;
    }
    return price;
}

//kategorileri tabloya ekleme
function addCategoryToTable(category, index) {
    const row = document.createElement('tr');

    row.innerHTML = `
        <td>${category.name}</td>
        <td>${category.price}</td>
        <td>${category.weight}</td>
        <td>${category.marketDemand}</td>
        <td>
            <button class="general-button" id="details-button" data-index="${index}">Details</button>
        </td>
        <td>
            <button class="general-button" id="edit-button" data-index="${index}">Edit</button>
        </td>
    `;
    categoriesTableBody.appendChild(row);

    row.querySelector("#details-button").addEventListener("click",() =>{
        const selectedCategory = window.categories[index];
        displayPricingStructure(selectedCategory);
    })
    row.querySelector("#edit-button").addEventListener("click", () =>{
        const selectedCategory = window.categories[index];
        sectionEditCategory.style.display = "block";

        document.getElementById("edit-category-weight").value = selectedCategory.weight;
        document.querySelector(`input[name="edit-category-market-demand"][value="${selectedCategory.marketDemand}"]`).checked = true;
        editCategoryForm.setAttribute("data-index",index);
    });
}

//kategori edit formu kontrolü
editCategoryForm.addEventListener("submit", function (event){
    event.preventDefault();

    const index = editCategoryForm.getAttribute("data-index");

    const editedCategory = window.categories[index];
    editedCategory.weight = document.getElementById("edit-category-weight").value;
    editedCategory.marketDemand = document.querySelector('input[name="edit-category-market-demand"]:checked').value;

    window.categories[index] = editedCategory;
    localStorage.setItem("categories", JSON.stringify(window.categories));
    const row = categoriesTableBody.rows[index];
    row.cells[2].textContent = editedCategory.weight;
    row.cells[3].textContent = editedCategory.marketDemand;

    editCategoryForm.reset();
    sectionEditCategory.style.display = "none";
});

//dinamik fiyatlandırma politikası gösterimi
function displayPricingStructure(category){
    const outputDiv = document.getElementById("pricing-structure");
    outputDiv.innerHTML = `
        <h3>Pricing Structure for category ${category.name}</h3>
        <p>Base price per gram is 0.1$</p>
        <p>Category ${category.name} is ${category.weight} grams</p>
        <p>Base price : ${category.weight}*0.1 = ${category.weight*0.1}$</p>
        <p>Higher discount for bigger package(higher weight): Base price - (weight/1000)**2</p>
        <p>Discounted price: ${category.weight*0.1} - (${category.weight}/1000)**2 = ${category.weight*0.1-category.weight/1000**2}$</p>
        <p>Higher demand => higher price:</p>
        <p>İf demand is high price*1.1</p>
        <p>İf demand is low price*0.9</p>
        <p>Category ${category.name} has ${category.marketDemand} demand</p>
        <p>Final price for category ${category.name}: ${category.price}</p>
    `;
}

//stok kontrolü
function restockAlert(stockLevel){
    if (stockLevel < 5){
        return "Stock level is critical low";
    }else if(stockLevel < 10){
        return "Stock level is low";
    }else{
        return "Stock level is fine";
    }
}

//stok ekstra uyarı kontrolü
function inventoryReport(stockLevel, marketDemand){
    if(stockLevel < 5 && marketDemand === "high"){
        return "This category has a high market demand but you are very low on stock."
    }else{
        return "";
    }
}

// Dinamik olarak seçenekleri oluştur ve dropdown'a ekle
window.categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category.name;
    option.textContent = `${category.name}`;
    categoryDropdown.appendChild(option);
});

function findCategoryByName(name){
    selectedCategory = window.categories[0];
    window.categories.forEach(category =>{
        if(category.name === name){
            selectedCategory = category;
        }else{}
    })
    return selectedCategory;
}

//kategorileri tabloya ekleme
function addInventoryToTable(category, index) {
    const row = document.createElement('tr');

    row.innerHTML = `
        <td>${category.name}</td>
        <td>${category.weight}</td>
        <td>${category.stockLevel}</td>
        <td>${category.restockAlert}</td>
        <td style="color: red;">${inventoryReport(category.stockLevel,category.marketDemand)}</td>
    `;
    inventoryTableBody.appendChild(row);
    blueberryQuantity.innerHTML = "Blueberry Stock Quantity(not categorized/packaged): "+ window.blueberries +"kg"
}

formPackage.addEventListener("submit", (event) =>{
    event.preventDefault();
    const categoryName = document.getElementById("category-dropdown").value;
    const quantity = parseInt(document.getElementById("quantity").value);
    selectedCategory = findCategoryByName(categoryName);
    newStockLevel = selectedCategory.stockLevel + quantity;

    const updatedCategory = {
        id:selectedCategory.id,
        name:selectedCategory.name,
        weight:selectedCategory.weight,
        price:selectedCategory.price,
        marketDemand:selectedCategory.marketDemand,
        stockLevel: newStockLevel,
        restockAlert:selectedCategory.restockAlert,
    }

    window.categories[findCategory(categoryName)] = updatedCategory;
    localStorage.setItem("categories", JSON.stringify(window.categories));

    window.blueberries = window.blueberries - parseInt(selectedCategory.weight*quantity/1000);
    localStorage.setItem("blueberries", window.blueberries);
    
    inventoryTableBody.innerHTML = "";

    window.categories.forEach((category, index) => { addInventoryToTable(category,index)});
});

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
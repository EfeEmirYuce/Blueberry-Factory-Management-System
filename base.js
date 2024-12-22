const sideBarButtons = document.querySelectorAll(".side-bar button");

//sidebar butonlarının dinamik çalışması
sideBarButtons.forEach(button => {
    button.addEventListener("click", () => {
        const targetSection = button.getAttribute("section");

        document.querySelectorAll(".section").forEach(section => {
            section.style.display = "none";
        });
        document.getElementById(targetSection).style.display = "block";

        sideBarButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
    });
});

window.farmers = JSON.parse(localStorage.getItem('farmers')) || [];

window.purchases = JSON.parse(localStorage.getItem("purchases")) || [];

if (!localStorage.getItem("categories")) {
    const predefinedCategories = [
        { id: 1, name: "Small", weight: 100, price: 10, marketDemand: "high", stockLevel: 5, restockAlert: "" },
        { id: 2, name: "Medium", weight: 250, price: 25, marketDemand: "low", stockLevel: 5, restockAlert: "" },
        { id: 3, name: "Large", weight: 500, price: 50, marketDemand: "low", stockLevel: 5, restockAlert: "" },
        { id: 4, name: "Extra Large", weight: 1000, price: 100, marketDemand: "medium", stockLevel: 5, restockAlert: "" },
        { id: 5, name: "Family Pack", weight: 2000, price: 200, marketDemand: "high", stockLevel: 5, restockAlert: "" },
        { id: 6, name: "Bulk Pack", weight: 5000, price: 500, marketDemand: "medium", stockLevel: 5, restockAlert: "" },
    ];

    localStorage.setItem("categories", JSON.stringify(predefinedCategories));
};
window.categories = JSON.parse(localStorage.getItem("categories"));

if (!localStorage.getItem("blueberries")) {
    localStorage.setItem("blueberries", 1000);
}
window.blueberries = parseInt(localStorage.getItem("blueberries"), 10);

window.orders = JSON.parse(localStorage.getItem('orders')) || [];

if (!localStorage.getItem("inventory")) {
    const predefinedInventory = [
        { id: 1, category: "Fresh", quantityAvailable: window.blueberries/3, reorderLevel: "", restockDate: "", storageLocation: "İzmir"},
        { id: 2, category: "Frozen", quantityAvailable: window.blueberries/3, reorderLevel: "", restockDate: "", storageLocation: "Muğla"},
        { id: 3, category: "Organic", quantityAvailable: window.blueberries/3, reorderLevel: "", restockDate: "", storageLocation: "Aydın"},
    ];

    localStorage.setItem("inventory", JSON.stringify(predefinedInventory));
};
window.inventory = JSON.parse(localStorage.getItem("inventory"));

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

window.categories = JSON.parse(localStorage.getItem("categories")) || [];

const predefinedCategories = [
    { id: 1, name: "Small", weight: 100 , price:10 , marketDemand:"high", stockLevel:0, restockAlert:""},
    { id: 2, name: "Medium", weight: 250 , price:25, marketDemand:"low", stockLevel:0, restockAlert:""},
    { id: 3, name: "Large", weight: 500 , price:50, marketDemand:"low", stockLevel:0, restockAlert:""},
    { id: 4, name: "Extra Large", weight: 1000 , price:100, marketDemand:"medium", stockLevel:0, restockAlert:""},
    { id: 5, name: "Family Pack", weight: 2000 , price:200, marketDemand:"high", stockLevel:0, restockAlert:""},
    { id: 6, name: "Bulk Pack", weight: 5000 , price:500, marketDemand:"medium", stockLevel:0, restockAlert:""},
];

window.categories = predefinedCategories;
localStorage.setItem("categories", JSON.stringify(predefinedCategories));

window.blueberries = 1000;


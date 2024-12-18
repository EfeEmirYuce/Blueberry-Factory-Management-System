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
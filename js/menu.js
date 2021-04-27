const btnMenu = document.querySelector("#btn-menu");
console.log(btnMenu);
const menu = document.querySelector("#menu");
console.log(menu);


const navMenu = document.querySelector("#nav-menu");

btnMenu.addEventListener("click", function () {
    navMenu.classList.toggle("ocultarContainerMenu");
    menu.classList.toggle("ocultar");

});




//Desplegar productos
const subMenuBtn = document.querySelectorAll(".container-submenu__btn");
console.log(subMenuBtn);
for (let i = 0; i < subMenuBtn.length; i++) {
    subMenuBtn[i].addEventListener("click", function () {
        if (window.innerWidth < 1024) {
            const subMenu = this.nextElementSibling;
            console.log(subMenu);
            const height = subMenu.scrollHeight;
            if (subMenu.classList.contains("desplegar")) {
                subMenu.classList.remove("desplegar");
                subMenu.removeAttribute("style");
            } else {
                subMenu.classList.add("desplegar");
                subMenu.style.height = height + "px";
            }
        }
    });
}

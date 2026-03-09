function carregarNavbar(){

let caminho = ""

if(window.location.pathname.includes("/pages/")){
caminho = "../components/navbar.html"
}else{
caminho = "components/navbar.html"
}

fetch(caminho)
.then(res => res.text())
.then(data => {

document.getElementById("navbar").innerHTML = data

// reinicia componentes do bootstrap
setTimeout(() => {

const togglers = document.querySelectorAll('.navbar-toggler')

togglers.forEach(btn => {

btn.addEventListener('click', () => {

const target = btn.getAttribute("data-bs-target")
const menu = document.querySelector(target)

menu.classList.toggle("show")

})

})

},100)

})

}

carregarNavbar()
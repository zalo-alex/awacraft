const interface = document.getElementById("interface")

const registerUsername = document.getElementById("register-username")
const registerPassword = document.getElementById("register-password")
const registerResult = document.getElementById("register-result")

const loginUsername = document.getElementById("login-username")
const loginPassword = document.getElementById("login-password")
const loginResult = document.getElementById("login-result")

function playSingleplayer() {
    interface.style.display = "none"
}

function showPage(id) {
    document.querySelector(".page.show").classList.remove("show")
    document.getElementById(`page-${id}`).classList.add("show")
}

async function register() {
    let username = registerUsername.value
    let password = registerPassword.value 

    let res = await fetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({
            username: username,
            password: password
        }),
        headers: {
            "Content-Type": "application/json"
        }
    })
    let data = await res.json()
    registerResult.textContent = data.message
}

async function login() {
    let username = loginUsername.value
    let password = loginPassword.value 

    let res = await fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({
            username: username,
            password: password
        }),
        headers: {
            "Content-Type": "application/json"
        }
    })
    let data = await res.json()
    loginResult.textContent = data.message
}
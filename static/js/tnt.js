const tnt = document.getElementById("tnt")
let tntClicked = 0

tnt.addEventListener("click", () => {
    if (tnt.classList.contains("activated")) {
        return
    }

    tntClicked++

    if (tntClicked >= 5) {
        tnt.classList.add("boom")

        for (let i = 0; i < 30; i++) {
            setTimeout(() => {
                let top = Math.random() * 300 - 150
                let left = Math.random() * 300 - 150
                let scale = (Math.random()) + 1
                let particle = document.createElement("div")
                particle.classList.add("particle")
                particle.style = `--top: ${top}px; --left: ${left}px; --scale: ${scale}`
                tnt.appendChild(particle)
                
                setTimeout(() => {
                    particle.remove()
                }, 600)
            }, 10*i)
        }

        setTimeout(() => {
            tnt.classList.remove("boom")
            tntClicked = 0
        }, 5000)

        return
    }

    tnt.classList.add("activated")

    setTimeout(() => {
        tnt.classList.remove("activated")
    }, 500)
})
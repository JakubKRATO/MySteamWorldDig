document.addEventListener("DOMContentLoaded",() => {
    document.querySelector("form").addEventListener("submit", async (e) => {
        e.preventDefault()
        let data = {
            nick: document.querySelector("input").value,
            password: document.querySelectorAll("input")[1].value
        }
        const result = await fetch("/register", {
            method: "POST",
            headers: { "Content-type" : "application/json" },
            body: JSON.stringify(data)
        });
        console.log(data, result.body)
        const res = await result.json();
        if (res.status == "ok") {
            window.location.href = "/login"
        } else if (res.status == "duplicite") {
            document.querySelector("input").style.outline = "2px solid red";
            alert("Použivatel s tymto menom už existuje!")
        }
    });
});
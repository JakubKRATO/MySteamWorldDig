document.addEventListener("DOMContentLoaded",() => {
    document.querySelector("form").addEventListener("submit", async (e) => {
        e.preventDefault()
        let data = {
            nick: document.querySelector("input").value,
            password: document.querySelectorAll("input")[1].value
        }
        const result = await fetch("/login", {
            method: "POST",
            headers: { "Content-type" : "application/json" },
            body: JSON.stringify(data)
        });
        const res = await result.json();
        if (res.status == "ok") {
            window.location.href = "/"
        } else if (res.status == "wrong password") {
            document.querySelectorAll("input")[1].style.outline = "2px solid red";
            alert("Wrong password!")
        } else if (res.status == "no account") {
            document.querySelector("input").style.outline = "2px solid red";
            alert("Account with that nickame does NOT exist!")
        }
    });
});
document.addEventListener("DOMContentLoaded", () => {
    const buttons = document.querySelectorAll(".change")
    var changing = false

    Array.from(buttons).forEach(button => {
        button.addEventListener("click", async () => {
            if (changing == true) return
            changing = true

            let name = button.attributes["data-name"].value

            const result = await fetch("/selectSkin", {
                method: "POST",
                headers: {"Content-type" : "application/json"},
                body: JSON.stringify({name: name})
            });
            const data = await result.json()

            if (data["message"] == "ok" && name == "ultimate") localStorage.clear()
            window.location.reload()
        });
    });
});
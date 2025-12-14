document.addEventListener("DOMContentLoaded", () => {
    const buttons = document.querySelectorAll(".change")
    var changing = false

    Array.from(buttons).forEach(button => {
        button.addEventListener("click", async () => {
            if (changing == true) return
            changing = true

            let name = button.attributes["data-name"].value

            await fetch("/selectSkin", {
                method: "POST",
                headers: {"Content-type" : "application/json"},
                body: JSON.stringify({name: name})
            });

            window.location.reload()
        });
    });
});
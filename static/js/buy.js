document.addEventListener("DOMContentLoaded", () => {
    const buyButtons = document.querySelectorAll(".buy")

    Array.from(buyButtons).forEach(button => {
        button.addEventListener("click", async () => {
            let id = button.attributes["data-id"].value
            button.disabled = true
            console.log(id)
            const result = await fetch("/buySkin", {
                method: "POST",
                headers: {"Content-type" : "application/json"},
                body: JSON.stringify({id: id})
            });
            const data = await result.json()

            if (data["message"] == "ok") window.location.reload()
            
            if (data["message"] == "brokie") alert("You are too poor")
        });
    });
});
var got = {
    time: false,
    cash: false,
    money: false
}
var data = {
    time: null,
    cash: null,
    tnt: null
}
document.addEventListener("DOMContentLoaded",() => {
    const menu = document.querySelector(".leaderboards-menu")
    Array.from(menu.children).forEach(element => {
        element.addEventListener("click", async () => {
            Array.from(menu.children).forEach(li => {
                li.className = ""
            });
            element.className = "active"
            let string = element.innerHTML.toLowerCase()

            if (!got[element.innerHTML.toLowerCase()]) {
                const result = await fetch("/get-leaderboards", {
                    method: "POST",
                    headers: {"Content-type" : "application/json"},
                    body: JSON.stringify({"type" : string})
                })
                data[string] = await result.json()
            }
            render(data[string])
        });
    });
});
const render = (data) => {
    count = 1
    document.querySelector("tbody").innerHTML = ''

    for (let row of data) {
        let tr = document.createElement("tr");
        let place = document.createElement("td");

        place.innerHTML = count;
        tr.appendChild(place)
        count++;

        for (let cell of row) {
            let td = document.createElement("td");
            td.innerHTML = cell;
            tr.appendChild(td);
        }
        document.querySelector("tbody").appendChild(tr);
    }
};
const calcTime = (time) => {
    time = parseInt(time)
    minutes = time / 1000
};
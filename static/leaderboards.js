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
            document.querySelector("tbody").innerHTML = ''
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
                console.log("Got data from server...");
            }
            if (string == "wins") {
                document.querySelector("table").innerHTML = winsTable
            } else {
                document.querySelector("table").innerHTML = normalTable
            }
            render(data[string], string)
        });
    });
});
const render = (data, string) => {
    var count = 1
    document.querySelector("tbody").innerHTML = ''
    for (let row of data) {
        var index = 0
        let tr = document.createElement("tr");
        let place = document.createElement("td");

        place.innerHTML = count;
        tr.appendChild(place)
        count++;

        for (let cell of row) {
            let td = document.createElement("td");
            switch (index) {
                case 0:
                    let a = `<a href="/profile/${cell}" target="_blank">${cell}</a>`
                    td.innerHTML = a
                    break;
                case 1:
                    if (string == "wins") {
                        td.innerHTML = cell;
                        break;
                    }
                    td.innerHTML = calcTime(cell)
                    break;
                case 4:
                    let raw = new Date(cell)
                    let formatted = raw.toLocaleString("sk-Sk", {
                        dateStyle: "short",
                        timeStyle: "short"
                    })
                    td.innerHTML = formatted
                    break;
                default:
                    td.innerHTML = cell
            }
            tr.appendChild(td);
            index++;
        }
        document.querySelector("tbody").appendChild(tr);
    }
};
const calcTime = (time) => {
    const totalSeconds = time / 1000

    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor(totalSeconds / 60 % 60)
    const seconds = Math.floor(totalSeconds % 60)
    
    if (hours > 0) {
        return `${hours}h ${minutes}m ${seconds}s`
    } else if (minutes > 0) {
        return `${minutes}m ${seconds}s`
    }
    return `${seconds}s`
};
const main = async () => {
    const ans = await fetch("/get-leaderboards", {
        method: "POST",
        headers: {"Content-type" : "application/json"},
        body: JSON.stringify({"type" : "time"})
    })
    data["time"] = await ans.json()
    render(data["time"])
};
main();

const normalTable = `<thead>
        <tr>
            <th>#</th>
            <th>Name</th>
            <th>Time</th>
            <th>Money</th>
            <th>TNT</th>
            <th>Timestamp</th>
        </tr>
    </thead>
    <tbody>
        
    </tbody>`
const winsTable = `<thead>
        <tr>
            <th>#</th>
            <th>Name</th>
            <th>Wins</th>
        </tr>
    </thead>
    <tbody>
        
    </tbody>`
var dx = ""
document.addEventListener('DOMContentLoaded', () => {
var x = document.getElementsByClassName("search-box")[0]
var y = document.getElementsByClassName("search-label")[0]
var z = document.getElementsByClassName("search-num")[0]
x.addEventListener("focus", () => y.classList.add("focus"), true)
//x.addEventListener("blur", () => y.classList.remove("focus"), true)

x.onkeydown = e => {
    if (e.keyCode == 13) {
        axios.get("https://sayori.xyz/search/" + x.value)
        .then(r => {
            dx = r.data
            updateResults()
        })
    }
}

z.addEventListener("change", () => updateResults())

function updateResults() {
    var data = new DOMParser().parseFromString(dx, "text/html");
    var aucs = data.getElementsByClassName("s-item")
    var flex = document.getElementsByClassName("auc-flex-main")[0]
    var aucv = document.getElementById("0")
    var aucvs = document.getElementsByClassName("auc-auctionview")

    for (var i = aucvs.length - 1; i > 0; i--) aucvs[i].remove()
    for (var i = 1; i <= z.value - 1; i++) flex.appendChild(aucv.cloneNode(true))
    
    var etitles = data.getElementsByClassName("s-item__title")
    var esubtitles = data.getElementsByClassName("s-item__subtitle")
    var edelivery = data.getElementsByClassName("s-item__delivery-options")
    var eprice = data.getElementsByClassName("s-item__price")
    var etypes = data.getElementsByClassName("s-item__purchase-options")
    let w = 0;
    for (let o of aucvs) {
        let child = o.children
        console.log(etitles)
        child.namedItem("th").children.namedItem("t").innerHTML = etitles[w].innerHTML
        child.namedItem("th").children.namedItem("t2").innerHTML = esubtitles[w].innerHTML
        child.namedItem("sh").children.namedItem("s").innerHTML = ""
        child.namedItem("sh").children.namedItem("st").innerHTML = etypes[w].innerHTML
        child.namedItem("ph").children.namedItem("p").innerHTML = eprice[w].innerHTML
        child.namedItem("ph").children.namedItem("d").innerHTML = edelivery[w].innerHTML
        w++
    }
}
})
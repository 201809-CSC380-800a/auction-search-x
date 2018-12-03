var dx = {}
document.addEventListener('DOMContentLoaded', () => {
var x = document.getElementsByClassName("search-box")[0]
var y = document.getElementsByClassName("search-label")[0]
var z = document.getElementsByClassName("search-num")[0]
x.addEventListener("focus", () => y.classList.add("focus"), true)
//x.addEventListener("blur", () => y.classList.remove("focus"), true)

let aucTypeEnum = {
    FIXED_PRICE: 'Buy It Now',
    AUCTION: 'Auction'
}

x.onkeydown = e => {
    if (e.keyCode == 13) {
        axios.get(`https://sayori.xyz/api_j/buy/browse/v1/item_summary/search?q=${x.value}&limit=100&fieldgroups=FULL`, {
            headers: {
                'X-EBAY-C-ENDUSERCTX': 'contextualLocation=country=US,zip=13126',
                'Authorization': 'Bearer ' + getCookie('access_token')
            }
        })
        .then(r => {
            dx = r.data
            console.log(dx)
            updateResults()
        })
        .catch(e => {throw e})
    }
}

z.addEventListener("change", () => updateResults())

function getRefinements() {
    return null
}

function updateResults() {
    let flex = document.getElementsByClassName("auc-flex-main")[0]
    let auc = document.getElementsByClassName("auc-auctionview")

    for (let i = auc.length - 1; i > 0; i--) auc[i].remove()
    for (let i in [...Array(z.value - 1).keys()]) flex.appendChild(auc[0].cloneNode(true))
    
    let w = 0;
    for (let item of dx.itemSummaries) {
        let c = auc[w++].children
        c.namedItem("th").children.namedItem("t").innerHTML = item.title
        c.namedItem("th").children.namedItem("t2").innerHTML = item.condition
        c.namedItem("sh").children.namedItem("s").innerHTML = item.seller.username
        c.namedItem("sh").children.namedItem("st").innerHTML = aucTypeEnum[item.buyingOptions[0]]
        c.namedItem("ph").children.namedItem("p").innerHTML = '$' + item.price.value
        c.namedItem("ph").children.namedItem("d").innerHTML = item.shippingOptions[0].shippingCost.value == '0.00' ? 'Free Shipping' : `$${item.shippingOptions[0].shippingCost.value} Shipping`
    }
}
})
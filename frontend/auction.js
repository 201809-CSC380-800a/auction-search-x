var ignoredIds = []
var watchedIds = []
var dx = {}
var x
var y
var z

var aucTypeEnum = {
    FIXED_PRICE: 'Buy It Now',
    AUCTION: 'Auction'
}

function updateIgnoreList() {
    $.ajax({
        type: 'POST',
        url: 'mysql.php',
        dataType: 'json',
        data: {sql: `SELECT * FROM ignored_auctions WHERE customer_id="${getCookie('user-customer_id')}";`},
        success: o => {
            o.forEach(e => ignoredIds.push(e.auction_uuid))
        }
    })
}

function updateWatchList() {
    $.ajax({
        type: 'POST',
        url: 'mysql.php',
        dataType: 'json',
        data: {sql: `SELECT * FROM local_watched_auctions WHERE customer_id="${getCookie('user-customer_id')}";`},
        success: o => {
            o.forEach(e => watchedIds.push(e.auction_uuid))
        }
    })
}

document.addEventListener('DOMContentLoaded', () => {
x = document.getElementsByClassName("search-box")[0]
y = document.getElementsByClassName("search-label")[0]
z = document.getElementsByClassName("search-num")[0]
x.addEventListener("focus", () => y.classList.add("focus"), true)
//x.addEventListener("blur", () => y.classList.remove("focus"), true)



eBayRequest('GetMyeBayBuying', {sendSessionID: false, extraXML: `
    <UserDefinedLists>
        <Include>true</Include>
        <IncludeItemCount>true</IncludeItemCount>
        <IncludeListContents>true</IncludeListContents>
    </UserDefinedLists>`}).then(r => {
        let data = xmlToJson(r.data)
        watchedIds = data.GetMyeBayBuyingResponse.UserDefinedList.ItemArray.Item.map(e => e.ItemID['#text'])
}).then(() => {
    updateWatchList()
    updateIgnoreList()
})

x.onkeydown = e => {
    if (e.keyCode == 13) {
        let auca = document.getElementsByClassName("auc-auctionview")[0]
        auca.children.namedItem("th").children.namedItem("t").innerHTML = 'Loading search results...'
        auca.children.namedItem("th").children.namedItem("t2").innerHTML = ''
        auca.children.namedItem("sh").children.namedItem("s").innerHTML = ''
        auca.children.namedItem("sh").children.namedItem("st").innerHTML = ''
        auca.children.namedItem("ph").children.namedItem("p").innerHTML = ''
        auca.children.namedItem("ph").children.namedItem("d").innerHTML = ''
        axios.get(`https://sayori.xyz/api_j/buy/browse/v1/item_summary/search?q=${x.value}&limit=100&fieldgroups=FULL`, {
            headers: {
                'X-EBAY-C-ENDUSERCTX': 'contextualLocation=country=US,zip=13126',
                'Authorization': 'Bearer ' + getCookie('access_token')
            }
        })
        .then(r => {
            dx = r.data
            z.max = dx.total > 100 ? 100 : dx.total
            if (z.value > z.max) z.value = z.max
            console.log(dx)
            for (let e of document.getElementsByClassName('auc-button-holder')) e.style.visibility = 'visible'
            updateResults()
        })
        .catch(e => {throw e})
    }
}





z.onkeydown = e => {if (e.keyCode == 13 && z.value > z.max) z.value = z.max}

z.addEventListener("change", () => updateResults())





})

function getRefinements() {
    return null
}


function updateResults() {
    let flex = document.getElementsByClassName("auc-flex-main")[0]
    let auc = document.getElementsByClassName("auc-auctionview")
    
    for (let i = (dx.total >= 100 ? 100 : dx.total) - 1; i >= 0; i--) {
        if (ignoredIds.includes(dx.itemSummaries[i].itemId.split('|')[1])) {
            dx.itemSummaries.splice(i, 1)
            dx.total--
        }
    }
    
    if (dx.total == 0) {
        z.value = 1
        z.max = 1
        auc[0].children.namedItem("th").children.namedItem("t").innerHTML = 'No results found.'
        auc[0].children.namedItem("th").children.namedItem("t2").innerHTML = ''
        auc[0].children.namedItem("sh").children.namedItem("s").innerHTML = ''
        auc[0].children.namedItem("sh").children.namedItem("st").innerHTML = ''
        auc[0].children.namedItem("ph").children.namedItem("p").innerHTML = ''
        auc[0].children.namedItem("ph").children.namedItem("d").innerHTML = ''
    }
    for (let i = auc.length - 1; i > 0; i--) auc[i].remove()
    for (let i in [...Array(z.value - 1).keys()]) flex.appendChild(auc[0].cloneNode(true))
    
    let w = 0;
    if (dx.total > 0) {
        for (let item of dx.itemSummaries) {
            if (w >= z.value) break;
            let c = auc[w++].children
            c.namedItem("th").children.namedItem("t").innerHTML = `<a href="${item.itemWebUrl}" class="auc-auctionlink">${item.title}</a>`
            c.namedItem("th").children.namedItem("t2").innerHTML = item.condition
            c.namedItem("sh").children.namedItem("s").innerHTML = item.seller.username
            c.namedItem("sh").children.namedItem("st").innerHTML = aucTypeEnum[item.buyingOptions[0]]
            c.namedItem("ph").children.namedItem("p").innerHTML = '$' + item.price.value
            if (item.hasOwnProperty('shippingOptions') && item.shippingOptions.length > 0)
                c.namedItem("ph").children.namedItem("d").innerHTML = item.shippingOptions[0].shippingCost.value == '0.00' ? 'Free Shipping' : `$${item.shippingOptions[0].shippingCost.value} Shipping`
            else
                c.namedItem("ph").children.namedItem("d").innerHTML = 'Local Pickup Only'
            c.namedItem("b").children.namedItem("bw").setAttribute('onclick', `addToWatchList(${item.itemId.split('|')[1]},'${item.itemId}')`)
            c.namedItem("b").children.namedItem("bw").firstElementChild.setAttribute('id', `${item.itemId.split('|')[1]}-watch`)
            if (watchedIds.includes(item.itemId.split('|')[1].toString())) {
                c.namedItem("b").children.namedItem("bw").classList.add('clickdd')
                c.namedItem("b").children.namedItem("bw").firstElementChild.innerHTML = `✅`
            }
            else {
                c.namedItem("b").children.namedItem("bw").classList.remove('clickdd')
                c.namedItem("b").children.namedItem("bw").firstElementChild.innerHTML = `➕`
            }
            c.namedItem("b").children.namedItem("bi").setAttribute('onclick', `addToIgnoreList(${item.itemId.split('|')[1]},'${item.itemId}')`)
            c.namedItem("b").children.namedItem("bi").firstElementChild.setAttribute('id', `${item.itemId.split('|')[1]}-ignore`)
        }
    }
}

function addToWatchList(uuid, fullId) {
    if (!watchedIds.includes(uuid.toString())) {
        $.ajax({
            type: 'POST',
            url: 'mysql.php',
            dataType: 'json',
            data: {sql: `INSERT INTO local_watched_auctions (customer_id, auction_uuid, full_uuid) VALUES (${getCookie('user-customer_id')}, ${uuid}, "${fullId}");`},
            success: o => {
                document.getElementById(`${uuid}-watch`).innerHTML = `✅`
                document.getElementById(`${uuid}-watch`).parentElement.classList.add('clickdd')
                watchedIds.push(uuid.toString())
            }
        })
    }
    else {
        $.ajax({
            type: 'POST',
            url: 'mysql.php',
            dataType: 'json',
            data: {sql: `DELETE FROM local_watched_auctions WHERE customer_id=${getCookie('user-customer_id')} AND auction_uuid=${uuid};`},
            success: o => {
                document.getElementById(`${uuid}-watch`).innerHTML = `➕`
                document.getElementById(`${uuid}-watch`).parentElement.classList.remove('clickdd')
                watchedIds = watchedIds.filter(v => v != uuid.toString())
            }
        })
    }
}

function addToIgnoreList(uuid, fullId) {
    $.ajax({
        type: 'POST',
        url: 'mysql.php',
        dataType: 'json',
        data: {sql: `INSERT INTO ignored_auctions (customer_id, auction_uuid, full_uuid) VALUES (${getCookie('user-customer_id')}, ${uuid}, "${fullId}");`},
        success: o => {
            document.getElementById(`${uuid}-ignore`).innerHTML = `✅`
            document.getElementById(`${uuid}-ignore`).parentElement.classList.add('clickdd')
            ignoredIds.push(uuid.toString())
            document.getElementById(`${uuid}-ignore`).parentElement.parentElement.parentElement.classList.add('fadeout')
            setTimeout(() => updateResults(), 1000)
        }
    })
}
var ignoredIds = []
var watchedIds = []
var current = 'w'
document.addEventListener('DOMContentLoaded', () => {

document.getElementById('ebayProfLink').setAttribute('href', 'https://feedback.sandbox.ebay.com/ws/eBayISAPI.dll?ViewFeedback2&userid=' + getCookie('userID'))

changeToWatchList()
$.ajax({
    type: 'POST',
    url: 'mysql.php',
    dataType: 'json',
    data: {sql: `SELECT * FROM customers_information WHERE username="${getCookie('user-username')}";`},
    success: o => {
        document.getElementById('fullname').innerHTML = o[0].first_name + ' ' + o[0].last_name
        document.getElementById('ebayusername').innerHTML = getCookie('userID')
        document.getElementById('searchxusername').innerHTML = getCookie('user-username')
    }
})
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
})

var aucTypeEnum = {
    FIXED_PRICE: 'Buy It Now',
    AUCTION: 'Auction'
}

function changeToWatchList() {
    current = 'w'
    document.getElementsByClassName('profile-watch-button')[0].classList.add('profile-active-button')
    document.getElementsByClassName('profile-ignore-button')[0].classList.remove('profile-active-button')
    let flex = document.getElementsByClassName('auc-flex-main')[0]
    let auc = document.getElementsByClassName('auc-auctionview')

    let aucTypeEnum = {
        AdType: 'Advertisement / Soliciting',
        Auction: 'Auction',
        Chinese: 'Single-Quantity',
        CustomCode: 'CUSTOM CODE INTERNAL USE ONLY',
        FixedPriceOnly: 'Buy It Now Only',
        LeadGeneration: 'Advertisement / Soliciting',
        PersonalOffer: 'Second Chance Personal Auction',
        Unknown: 'Unknown Type'
    }

    for (var i = auc.length - 1; i > 0; i--) auc[i].remove()
    auc[0].classList.remove('fadeout')
    
    auc[0].children.namedItem('th').children.namedItem('t').innerHTML = 'Loading Watch List...'
    auc[0].children.namedItem('th').children.namedItem('t2').innerHTML = ''
    auc[0].children.namedItem('sh').children.namedItem('s').innerHTML = ''
    auc[0].children.namedItem('sh').children.namedItem('st').innerHTML = ''
    auc[0].children.namedItem('ph').children.namedItem('p').innerHTML = ''
    auc[0].children.namedItem('ph').children.namedItem('d').innerHTML = ''

    eBayRequest('GetMyeBayBuying', {sendSessionID: false, extraXML: `
    <UserDefinedLists>
        <Include>true</Include>
        <IncludeItemCount>true</IncludeItemCount>
        <IncludeListContents>true</IncludeListContents>
    </UserDefinedLists>`})
    .then(r => {
        $.ajax({
            type: 'POST',
            url: 'mysql.php',
            dataType: 'json',
            data: {sql: `SELECT * FROM ignored_auctions WHERE customer_id="${getCookie('user-customer_id')}";`},
            success: o => {
                let data = xmlToJson(r.data)
                let ignores = o.map(e => e.auction_uuid.toString())
                data.GetMyeBayBuyingResponse.UserDefinedList.ItemArray.Item = data.GetMyeBayBuyingResponse.UserDefinedList.ItemArray.Item.filter(e => !ignores.includes(e.ItemID['#text']))
                console.log(data)
                let itemCount = data.GetMyeBayBuyingResponse.UserDefinedList.ItemArray.Item.length
                for (let i in [...Array(itemCount - 1).keys()]) flex.appendChild(auc[0].cloneNode(true))
                let i = 0;
                if (itemCount == 0) auc[0].children.namedItem('th').children.namedItem('t').innerHTML = 'You have no watched auctions.'
                else for (let e of document.getElementsByClassName('auc-button-holder')) e.style.visibility = 'visible'
                for (let item of data.GetMyeBayBuyingResponse.UserDefinedList.ItemArray.Item) {
                    let c = auc[i++].children
                    c.namedItem('th').children.namedItem('t').innerHTML = item.Title['#text']
                    c.namedItem('th').children.namedItem('t2').innerHTML = item['SubTitle'] ? item.SubTitle['#text'] : ''
                    c.namedItem('sh').children.namedItem('s').innerHTML = item.Seller.UserID['#text']
                    c.namedItem('sh').children.namedItem('st').innerHTML = aucTypeEnum[item.ListingType['#text']] || 'Buy It Now'
                    c.namedItem('ph').children.namedItem('p').innerHTML = '$' + Number(item.SellingStatus.CurrentPrice['#text']).toFixed(2)
                    c.namedItem('ph').children.namedItem('d').innerHTML = item.ShippingDetails.ShippingServiceOptions.ShippingServiceCost['#text'] == '0.0' ? 'Free Shipping' : `$${Number(item.ShippingDetails.ShippingServiceOptions.ShippingServiceCost['#text']).toFixed(2)} ${item.ShippingDetails.ShippingType['#text']} Shipping`
                    c.namedItem('im').children.namedItem('pk').src = item.hasOwnProperty('PictureDetails') ? item.PictureDetails.GalleryURL['#text'] : 'https://secureir.ebaystatic.com/pictures/aw/pics/stockimage1.jpg'
                    c.namedItem("b").children.namedItem("bw").setAttribute('onclick', `addToWatchList(${item.ItemID['#text']},'v1|${item.ItemID['#text']}|0')`)
                    c.namedItem("b").children.namedItem("bw").firstElementChild.setAttribute('id', `${item.ItemID['#text']}-watch`)
                    c.namedItem("b").children.namedItem("bw").classList.add('clickdd')
                    c.namedItem("b").children.namedItem("bw").firstElementChild.innerHTML = `✅`
                    c.namedItem("b").children.namedItem("bi").setAttribute('onclick', `addToIgnoreList(${item.ItemID['#text']},'v1|${item.ItemID['#text']}|0')`)
                    c.namedItem("b").children.namedItem("bi").firstElementChild.setAttribute('id', `${item.ItemID['#text']}-ignore`)
                    c.namedItem("b").children.namedItem("bi").classList.remove('clickdd')
                    c.namedItem("b").children.namedItem("bi").firstElementChild.innerHTML = `🚫`
                }
            }
        })
    })    
}

function changeToIgnoreList() {
    current = 'i'
    document.getElementsByClassName('profile-watch-button')[0].classList.remove('profile-active-button')
    document.getElementsByClassName('profile-ignore-button')[0].classList.add('profile-active-button')

    let flex = document.getElementsByClassName('auc-flex-main')[0]
    let auc = document.getElementsByClassName('auc-auctionview')

    for (var i = auc.length - 1; i > 0; i--) auc[i].remove()
    auc[0].classList.remove('fadeout')
    
    auc[0].children.namedItem('th').children.namedItem('t').innerHTML = 'Loading Ignore List...'
    auc[0].children.namedItem('th').children.namedItem('t2').innerHTML = ''
    auc[0].children.namedItem('sh').children.namedItem('s').innerHTML = ''
    auc[0].children.namedItem('sh').children.namedItem('st').innerHTML = ''
    auc[0].children.namedItem('ph').children.namedItem('p').innerHTML = ''
    auc[0].children.namedItem('ph').children.namedItem('d').innerHTML = ''

    $.ajax({
        type: 'POST',
        url: 'mysql.php',
        dataType: 'json',
        data: {sql: `SELECT * FROM ignored_auctions WHERE customer_id="${getCookie('user-customer_id')}";`},
        success: o => {
            let promises = []
            for (let item of o) {
                promises.push(axios.get(`https://api.sandbox.ebay.com/buy/browse/v1/item/${item.full_uuid}`, {
                    headers: {
                        'X-EBAY-C-ENDUSERCTX': 'contextualLocation=country=US,zip=13126',
                        'Authorization': 'Bearer ' + getCookie('access_token')
                    }
                }))
            }
            Promise.all(promises).then(r => {
                for (let i = 0; i < r.length - 1; i++) flex.appendChild(auc[0].cloneNode(true))
                let items = r.map(e => e.data)
                console.log(r)
                if (items.length == 0) auc[0].children.namedItem('th').children.namedItem('t').innerHTML = 'You have no ignored auctions.'
                else for (let e of document.getElementsByClassName('auc-button-holder')) e.style.visibility = 'visible'
                let i = 0;
                for (let item of items) {
                    let c = auc[i++].children
                    c.namedItem("th").children.namedItem("t").innerHTML = `<a href="${item.itemWebUrl}" class="auc-auctionlink">${item.title}</a>`
                    c.namedItem("th").children.namedItem("t2").innerHTML = item.condition
                    c.namedItem("sh").children.namedItem("s").innerHTML = item.seller.username
                    c.namedItem("sh").children.namedItem("st").innerHTML = aucTypeEnum[item.buyingOptions[0]]
                    c.namedItem("ph").children.namedItem("p").innerHTML = '$' + item.price.value
                    if (item.hasOwnProperty('shippingOptions') && item.shippingOptions.length > 0)
                        c.namedItem("ph").children.namedItem("d").innerHTML = item.shippingOptions[0].shippingCost.value == '0.00' ? 'Free Shipping' : `$${item.shippingOptions[0].shippingCost.value} Shipping`
                    else
                        c.namedItem("ph").children.namedItem("d").innerHTML = 'Local Pickup Only'
                    c.namedItem('im').children.namedItem('pk').src = item.hasOwnProperty('PictureDetails') ? item.PictureDetails.GalleryURL['#text'] : 'https://secureir.ebaystatic.com/pictures/aw/pics/stockimage1.jpg'
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
                    c.namedItem("b").children.namedItem("bi").classList.add('clickdd')
                    c.namedItem("b").children.namedItem("bi").firstElementChild.innerHTML = `❌`
                    
                }
            })
        }
    })
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
    if (!ignoredIds.includes(uuid.toString())) {
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
                setTimeout(() => current == 'w' ? changeToWatchList() : changeToIgnoreList(), 1000)
            }
        })
    }
    else {
        $.ajax({
            type: 'POST',
            url: 'mysql.php',
            dataType: 'json',
            data: {sql: `DELETE FROM ignored_auctions WHERE customer_id=${getCookie('user-customer_id')} AND auction_uuid=${uuid};`},
            success: o => {
                document.getElementById(`${uuid}-ignore`).innerHTML = `🚫`
                document.getElementById(`${uuid}-ignore`).parentElement.classList.remove('clickdd')
                ignoredIds = ignoredIds.filter(v => v != uuid.toString())
                document.getElementById(`${uuid}-ignore`).parentElement.parentElement.parentElement.classList.add('fadeout')
                setTimeout(() => changeToIgnoreList(), 1000)
            }
        })
    }
}

function clearIgnoreList() {
    if (confirm('Are you sure you wish to clear your entire ignored auctions list? This action is irreversible. Your watched auctions will not be cleared.')) {
        $.ajax({
            type: 'POST',
            url: 'mysql.php',
            dataType: 'json',
            data: {sql: `DELETE FROM ignored_auctions WHERE customer_id=${getCookie('user-customer_id')};`},
            success: o => changeToIgnoreList()
        })
    }
}

function deleteAccountLikeForReal() {
    if (confirm('Are you sure you want to completely delete your searchX account? This action is irreversible. Your eBay account will not be deleted.')) {
        $.ajax({
            type: 'POST',
            url: 'mysql.php',
            dataType: 'json',
            data: {sql: `DELETE FROM ignored_auctions WHERE customer_id=${getCookie('user-customer_id')};
                         DELETE FROM local_watched_auctions WHERE customer_id=${getCookie('user-customer_id')};
                         DELETE FROM customers_information WHERE customer_id=${getCookie('user-customer_id')};`},
            success: o => window.location.href = 'https://sayori.xyz/test/auction-search-x/frontend/index.html'
        })
    }
}
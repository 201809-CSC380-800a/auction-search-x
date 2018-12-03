document.addEventListener('DOMContentLoaded', () => {

document.getElementById('fullname').innerHTML = getCookie('user-firstname') + ' ' + getCookie('user-lastname')
document.getElementById('ebayusername').innerHTML = getCookie('userID')
document.getElementById('searchxusername').innerHTML = getCookie('user-username')
document.getElementById('ebayProfLink').setAttribute('href', 'https://feedback.sandbox.ebay.com/ws/eBayISAPI.dll?ViewFeedback2&userid=' + getCookie('userID'))

changeToWatchList()

})

function changeToWatchList() {
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
    </UserDefinedLists>`}).then(r => {
        console.log(r)
        let data = xmlToJson(r.data)
        console.log(data)
        let itemCount = parseInt(data.GetMyeBayBuyingResponse.UserDefinedList.ItemCount['#text'])
        for (let i in [...Array(itemCount - 1).keys()]) flex.appendChild(auc[0].cloneNode(true))
        let i = 0;
        for (let item of data.GetMyeBayBuyingResponse.UserDefinedList.ItemArray.Item) {
            let c = auc[i++].children
            c.namedItem('th').children.namedItem('t').innerHTML = item.Title['#text']
            c.namedItem('th').children.namedItem('t2').innerHTML = item['SubTitle'] ? item.SubTitle['#text'] : ''
            c.namedItem('sh').children.namedItem('s').innerHTML = item.Seller.UserID['#text']
            c.namedItem('sh').children.namedItem('st').innerHTML = aucTypeEnum[item.ListingType['#text']] || 'Buy It Now'
            c.namedItem('ph').children.namedItem('p').innerHTML = '$' + item.SellingStatus.CurrentPrice['#text']
            c.namedItem('ph').children.namedItem('d').innerHTML = item.ShippingDetails.ShippingServiceOptions.ShippingServiceCost['#text'] == '0.0' ? 'Free Shipping' : `${item.ShippingDetails.ShippingType['#text']} Shipping - $${item.ShippingDetails.ShippingServiceOptions.ShippingServiceCost['#text']}`
        }
    })
}

function changeToIgnoreList() {
    document.getElementsByClassName('profile-watch-button')[0].classList.remove('profile-active-button')
    document.getElementsByClassName('profile-ignore-button')[0].classList.add('profile-active-button')

    let flex = document.getElementsByClassName('auc-flex-main')[0]
    let auc = document.getElementsByClassName('auc-auctionview')

    for (var i = auc.length - 1; i > 0; i--) auc[i].remove()
    
    auc[0].children.namedItem('th').children.namedItem('t').innerHTML = 'Loading Ignore List...'
    auc[0].children.namedItem('th').children.namedItem('t2').innerHTML = '(not implemented yet)'
    auc[0].children.namedItem('sh').children.namedItem('s').innerHTML = ''
    auc[0].children.namedItem('sh').children.namedItem('st').innerHTML = ''
    auc[0].children.namedItem('ph').children.namedItem('p').innerHTML = ''
    auc[0].children.namedItem('ph').children.namedItem('d').innerHTML = ''
}
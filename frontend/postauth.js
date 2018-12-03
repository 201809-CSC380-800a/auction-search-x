function fetchToken() {
    return eBayRequest("FetchToken", {sendCredentials: false})
}

function confirmIdentity() {
    return eBayRequest("ConfirmIdentity")
}

document.addEventListener('DOMContentLoaded', () => {
axios.post('https://sayori.xyz/api_j/identity/v1/oauth2/token?grant_type=client_credentials&redirect_uri=Anthony_Levine-AnthonyL-Auctio-xbaca&scope=https://api.ebay.com/oauth/api_scope', 
    null, {
        headers:{
        'Authorization': `Basic ${window.btoa('AnthonyL-Auctionx-SBX-a7f4c67ed-79b83e10:SBX-7f4c67edd28f-d05b-4ac0-89c4-ad90')}`,
        'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
.then(r => setCookie('access_token', r.data.access_token, 1))
.catch(e => {throw e})
document.querySelector('#auth-fullname').innerHTML = getCookie('user-firstname') + ' ' + getCookie('user-lastname')
fetchToken().then(response => {
    const regex = /(?<=<eBayAuthToken>)(.*)(?=<\/eBayAuthToken>)/gm
    setCookie("eBayAuthToken", regex.exec(response.data)[0], 1)
    document.querySelector("#auth-token").innerHTML = getCookie("eBayAuthToken")
    confirmIdentity().then(response => {
        const regex = /(?<=<UserID>)(.*)(?=<\/UserID>)/gm
        setCookie("userID", regex.exec(response.data)[0], 1)
        document.querySelector("#auth-name").innerHTML = getCookie("userID")
    })
    .catch(e => {throw e})
})
.catch(e => {throw e})



document.querySelector("#auth-sessionid").innerHTML = getCookie("SessionID")
})


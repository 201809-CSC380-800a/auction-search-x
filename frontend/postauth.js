function fetchToken() {
    let xmls = `<?xml version="1.0" encoding="utf-8"?>\
                <FetchTokenRequest xmlns="urn:ebay:apis:eBLBaseComponents">\
                <SessionID>${getCookie("SessionID")}</SessionID>\
                </FetchTokenRequest>`

    return axios.post("https://sayori.xyz/api/",
        xmls,
        {headers: {
            "X-EBAY-API-APP-NAME": "AnthonyL-Auctionx-SBX-a7f4c67ed-79b83e10",
            "X-EBAY-API-DEV-NAME": "010f48a4-bf28-47af-894e-eeb35d5f68be",
            "X-EBAY-API-CERT-NAME": "SBX-7f4c67edd28f-d05b-4ac0-89c4-ad90",
            "X-EBAY-API-SITEID": "0",
            "X-EBAY-API-COMPATIBILITY-LEVEL": "1081",
            "Content-Type": "text/xml",

            "X-EBAY-API-CALL-NAME": "FetchToken"
        }
    })
}

function confirmIdentity() {
    let xmls = `<?xml version="1.0" encoding="utf-8"?>\
                <ConfirmIdentityRequest xmlns="urn:ebay:apis:eBLBaseComponents">\
                <SessionID>${getCookie("SessionID")}</SessionID>\
                <RequesterCredentials>\
                    <eBayAuthToken>${getCookie("eBayAuthToken")}</eBayAuthToken>\
                </RequesterCredentials>\
                </ConfirmIdentityRequest>`

    return axios.post("https://sayori.xyz/api/",
        xmls,
        {headers: {
            "X-EBAY-API-APP-NAME": "AnthonyL-Auctionx-SBX-a7f4c67ed-79b83e10",
            "X-EBAY-API-DEV-NAME": "010f48a4-bf28-47af-894e-eeb35d5f68be",
            "X-EBAY-API-CERT-NAME": "SBX-7f4c67edd28f-d05b-4ac0-89c4-ad90",
            "X-EBAY-API-SITEID": "0",
            "X-EBAY-API-COMPATIBILITY-LEVEL": "1081",
            "Content-Type": "text/xml",

            "X-EBAY-API-CALL-NAME": "ConfirmIdentity"
        }
    })
}

document.addEventListener('DOMContentLoaded', () => {
fetchToken().then(response => {
    const regex = /(?<=<eBayAuthToken>)(.*)(?=<\/eBayAuthToken>)/gm
    setCookie("eBayAuthToken", regex.exec(response.data)[0], 1)
})
confirmIdentity().then(response => {
    const regex = /(?<=<UserID>)(.*)(?=<\/UserID>)/gm
    setCookie("userID", regex.exec(response.data)[0], 1)
})
document.querySelector("#auth-name").innerHTML = getCookie("userID")
document.querySelector("#auth-sessionid").innerHTML = getCookie("SessionID")
document.querySelector("#auth-token").innerHTML = getCookie("eBayAuthToken")

})
const runame = "Anthony_Levine-AnthonyL-Auctio-plpgzby"

function getSessionID() {
    let xmls = '<?xml version="1.0" encoding="utf-8"?>\
                <GetSessionIDRequest xmlns="urn:ebay:apis:eBLBaseComponents">\
                <RuName>Anthony_Levine-AnthonyL-Auctio-plpgzby</RuName>\
                </GetSessionIDRequest>'

    return axios.post("https://sayori.xyz/api/",
        xmls,
        {headers: {
            "X-EBAY-API-APP-NAME": "AnthonyL-Auctionx-SBX-a7f4c67ed-79b83e10",
            "X-EBAY-API-DEV-NAME": "010f48a4-bf28-47af-894e-eeb35d5f68be",
            "X-EBAY-API-CERT-NAME": "SBX-7f4c67edd28f-d05b-4ac0-89c4-ad90",
            "X-EBAY-API-SITEID": "0",
            "X-EBAY-API-COMPATIBILITY-LEVEL": "1081",
            "Content-Type": "text/xml",

            "X-EBAY-API-CALL-NAME": "GetSessionID"
        }
    })
}

function redirectToLogin() {
    getSessionID().then(response => {
        const regex = /(?<=<SessionID>)(.*)(?=<\/SessionID>)/gm
        window.location.href = `https://signin.sandbox.ebay.com/ws/eBayISAPI.dll?SignIn&RuName=Anthony_Levine-AnthonyL-Auctio-plpgzby&SessID=${regex.exec(response.data)[0]}`
    })
}
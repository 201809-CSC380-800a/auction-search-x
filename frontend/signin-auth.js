function getSessionID() {
    return eBayRequest("GetSessionID", {
            sendSessionID: false,
            sendCredentials: false,
            extraXML: "<RuName>Anthony_Levine-AnthonyL-Auctio-xbaca</RuName>"
        })
}

function redirectToLogin() {
    getSessionID().then(response => {
        const regex = /(?<=<SessionID>)(.*)(?=<\/SessionID>)/gm
        setCookie("SessionID", regex.exec(response.data)[0], 1)
        window.location.href = `https://signin.sandbox.ebay.com/ws/eBayISAPI.dll?SignIn&runame=Anthony_Levine-AnthonyL-Auctio-xbaca&SessID=${getCookie("SessionID")}`
    })
}
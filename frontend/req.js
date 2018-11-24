function eBayRequest(callName, options = {}, axiosOptions = {}) {
    let def = {
        sendSessionID: true,
        sendCredentials: true,
        extraXML: null,
        extraHeaders: null,
        ...options
    }
    let xmls = `<?xml version="1.0" encoding="utf-8"?>\
                <${callName}Request xmlns="urn:ebay:apis:eBLBaseComponents">\
                ${def["sendSessionID"] ? "<SessionID>" + getCookie("SessionID") + "</SessionID>\n" : ""}
                ${def["sendCredentials"] ? "<RequesterCredentials>\
                    <eBayAuthToken>" + getCookie("eBayAuthToken") + "</eBayAuthToken>\
                </RequesterCredentials>\n" : ""}
                ${def["extraXML"] == null ? "" : def["extraXML"] + "\n"}
                </${callName}Request>`
    let heads = {
        "X-EBAY-API-APP-NAME": "AnthonyL-Auctionx-SBX-a7f4c67ed-79b83e10",
        "X-EBAY-API-DEV-NAME": "010f48a4-bf28-47af-894e-eeb35d5f68be",
        "X-EBAY-API-CERT-NAME": "SBX-7f4c67edd28f-d05b-4ac0-89c4-ad90",
        "X-EBAY-API-SITEID": "0",
        "X-EBAY-API-COMPATIBILITY-LEVEL": "1081",
        "Content-Type": "text/xml",
        "X-EBAY-API-CALL-NAME": callName,
        ...def["extraHeaders"]
    }
    return axios.post("https://sayori.xyz/api/", xmls, {headers: heads, ...axiosOptions})
}
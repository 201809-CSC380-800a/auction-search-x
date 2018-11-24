function eBayRequest(callName, options = {}, axiosOptions = {}) {
    /**
     * Send a request to the eBay API.
     *
     * @param {string}  callName  The name of the API call: in the API reference, this is X-EBAY-API-CALL-NAME.
     * @param {Object}  [options]                      Options that change what information should be sent in the call.
     * @param {boolean} [options.sendSessionID=true]   Include <SessionID> field in the call's XML payload. Fetched from cookies. Usually required.
     * @param {boolean} [options.sendCredentials=true] Include <RequesterCredentials><eBayAuthToken> field inthe call's XML payload. Fetched from cookies. Often required.
     * @param {string}  [options.extraXML]             Other fields to include at the end of the XML payload. Be careful to format these correctly yourself.
     * @param {string}  [options.extraHeaders]         Other fields to include in the header of the call. In the API reference, these begin with X-EBAY-API-.
     * @param {Object}  [axiosOptions] Any additional options you wish to pass to the axios call config. Check the axios reference.
     * 
     * @returns {Promise} The response from the server.
     */
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
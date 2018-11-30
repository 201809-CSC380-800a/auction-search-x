function fetchToken() {
    return eBayRequest("FetchToken", {sendCredentials: false})
}

function confirmIdentity() {
    return eBayRequest("ConfirmIdentity")
}

document.addEventListener('DOMContentLoaded', () => {
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
})
document.querySelector("#auth-sessionid").innerHTML = getCookie("SessionID")
})


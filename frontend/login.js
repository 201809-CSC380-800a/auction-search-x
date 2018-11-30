document.addEventListener('DOMContentLoaded', () => {
var box = document.getElementsByClassName('log-box')

//for (let v of box) v.addEventListener('focus', () => document.getElementsByClassName(v.id)[0].classList.add('log-focus'), true)

document.getElementById('log-flabel').addEventListener('focus', () => document.getElementsByClassName('log-flabel')[0].classList.add('log-focus'), true)
document.getElementById('log-llabel').addEventListener('focus', () => document.getElementsByClassName('log-llabel')[0].classList.add('log-focus'), true)
var ul = document.getElementsByClassName('log-ulabel')[0]
document.getElementById('log-ulabel').addEventListener('focus', () => {
  ul.classList.add('log-focus')
  setTimeout(() => ul.innerHTML = 'Username - <xr>Do not use your eBay username</xr>', 250)}, true)
var pl = document.getElementsByClassName('log-plabel')[0]
document.getElementById('log-plabel').addEventListener('focus', () => {
  pl.classList.add('log-focus')
  setTimeout(() => pl.innerHTML = 'Password - <xr>Do not use your eBay password</xr>', 250)}, true)

  document.getElementsByClassName('log-status')[0].innerHTML = getCookie('return-error')
})

function login() {
    let uv = document.getElementById('log-ulabel').value
    let pv = document.getElementById('log-plabel').value
    if (uv == '')
        setCookie('return-error', 'Error: Username required to login')
    else if (pv == '')
        setCookie('return-error', 'Error: Password required to login')
    else if (getCookie('user-username') == uv && getCookie('user-password') == md5(pv+uv+'searchX')) {
        setCookie('return-error', '', 1)
        window.location.href = 'https://sayori.xyz/test/auction-search-x/frontend/search.html'
    }
    else {
        setCookie('return-error', 'Error: Username or password incorrect', 1)
        window.location.href = 'https://sayori.xyz/test/auction-search-x/frontend/authaccepted.html'
    }
}

function register() {
    let fv = document.getElementById('log-flabel').value
    let lv = document.getElementById('log-llabel').value
    let uv = document.getElementById('log-ulabel').value
    let pv = document.getElementById('log-plabel').value
    if (getCookie('user-username') != '' && getCookie('user-username') == uv)
        setCookie('return-error', 'Error: User already exists')
    else if (fv == '')
        setCookie('return-error', 'Error: First name required to register')
    else if (lv == '')
        setCookie('return-error', 'Error: Last name required to register')
    else if (uv == '')
        setCookie('return-error', 'Error: Username required to register')
    else if (pv == '')
        setCookie('return-error', 'Error: Password required to register')
    else {
        setCookie('user-username', uv, 1)
        setCookie('user-password', md5(pv+uv+'searchX'), 1)
        setCookie('user-firstname', fv, 1)
        setCookie('user-lastname', lv, 1)
        setCookie('return-error', '', 1)
    }
    window.location.href = `https://sayori.xyz/test/auction-search-x/frontend/${getCookie('return-error') == '' ? 'search' : 'authaccepted'}.html`
}
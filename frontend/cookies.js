function setCookie(a, b, c) {
    var d = new Date()
    d.setTime(d.getTime()+(c*86400000))
    document.cookie = `${a}=${b};expires=${d.toUTCString()};path=/`
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
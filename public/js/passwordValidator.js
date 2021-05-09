function validator() {
    let p = document.getElementById("password").value;
    let cp = document.getElementById("confirm").value;
    if (p.length < 8) {
        document.getElementById('message').innerHTML = "**password must contain 8 characters";
        return false;
    }
    if (!p.match(/[a-z]/g)) {
        document.getElementById('message').innerHTML = "**password must contain one lowercase letter";
        return false;
    }
    if (!p.match(/[A-Z]/g)) {
        document.getElementById('message').innerHTML = "**password must contain one Uppercase letter";
        return false;
    }
    if (!p.match(/[0-9]/g)) {
        document.getElementById('message').innerHTML = "**password must contain one Number";
        return false;
    }
    if (!p.match(/[^a-zA-Z\d]/g)) {
        document.getElementById('message').innerHTML = "**password must contain one special character";
        return false;
    }
    if (p != cp) {
        document.getElementById('message').innerHTML = "**passwords do not match";
        return false;
    }
}
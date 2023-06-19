const allowNotAuthenticated = (req, resp, next) => {
    if (req.session.user) {
        resp.send({ msg: 'user already authenticated', error: false });
    } else {
        next();
    }
}

const allowLogged = (req, resp, next) => {
    if (req.session.user) {
        next();
    } else {
        resp.send({ msg: 'user not logged', error: true });
    }
}

const allowAdmin = (req, resp, next) => {

    //console.log("Richiesta ADMIN ricevuta dall'utente", req.session.user);
    if (req.session.user.level == "admin") {
        next();
    } else {
        resp.send({ msg: 'permission denied', error: true });
    }
}

exports.allowNotAuthenticated = allowNotAuthenticated;
exports.allowLogged = allowLogged;
exports.allowAdmin = allowAdmin;
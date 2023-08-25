// verifica se l'utente non ha già ha fatto accesso, altrimenti procede
const allowNotAuthenticated = (req, resp, next) => {
    if (req.session.user) {
        resp.send({ msg: 'user already authenticated', error: false });
    } else {
        next();
    }
}
// verifica se l'utente ha già fatto accesso in tal caso procede, altrimenti restituisce un messaggio di errore
const allowLogged = (req, resp, next) => {
    if (req.session.user) {
        next();
    } else {
        resp.send({ msg: 'user not logged', error: true });
    }
}
// verifica se l'utente ha i privilegi di amministratore in tal caso procede, altrimenti restituisce un messaggio di errore
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
const express = require("express");
const router = express.Router();
const UserModel = require('../models/user');
const { allowNotAuthenticated, allowLogged, allowAdmin } = require("../middlewares/user_middlewares");
const crypto = require("node:crypto");

router.post("/register", allowNotAuthenticated, (req, resp) => {
    const { username, password, email } = req.body;
    UserModel.exists({ username: username, email: email }).then((user) => {
        if (user) {
            resp.send({ msg: 'user exists', error: true });
        } else {
            const newUser = new UserModel();
            newUser.username = username;
            newUser.password = crypto.createHash("sha256").update(password).digest("hex");
            newUser.email = email;
            newUser.save();
            resp.send({ msg: 'user registered', error: false });
        }
    }).catch((err) => {
        resp.send({ msg: err, error: true });
    });
})
router.post("/login", allowNotAuthenticated, (req, resp) => {
    const { email, password } = req.body;
    UserModel.findOne({ email: email, password: crypto.createHash("sha256").update(password).digest("hex") }).then((user) => {
        if (user) {
            req.session.user = user;
            req.session.save((err) => {
                console.log(err);
                resp.send({ msg: 'user logged', error: false });
            })
        } else {
            resp.send({ msg: 'user not found', error: true });
        }
    }).catch((err) => {
        resp.send({ msg: err, error: true });
    });
})

router.get("/", allowLogged, allowAdmin, (req, resp) => {
    UserModel.aggregate([
        {
            $match: {}
        },
        {
            $project: {
                password: 0,
                __v: 0,
            }
        },
        {
            $project: {
                "Username":"$username",
                "Email":"$email",
                "Level":"$level",
            }
        }
    ]).then((users) => {
        if (users) {

            resp.status(200).send({ users: users, msg: 'users found', error: false });
        } else {
            resp.status(404).send({ users: null, msg: 'users not found', error: true });
        }
    }).catch((err) => {
        console.log(err);
        resp.status(404).send({ users: null, msg: 'users not found', error: true });
    })
})

router.all("/logout", (req, resp) => {
    req.session.destroy((err) => {
        console.log(err);
        resp.session = null;
        resp.send({ msg: "logged out", error: false });
    });
})

router.get("/me", allowLogged, (req, resp) => {

    let data = req.session.user;
    delete data.password;


    resp.send({ msg: "", data: data, error: false })
})

router.get("/:idUser", allowLogged, allowAdmin, (req, resp) => {
    const { idUser } = req.params;
    UserModel.findOne({ _id: idUser}).then((user) => {
        if (user) {
            delete user.password;
            resp.send({ user: user , error: false });
        } else {
            resp.send({ msg: 'user not found', error: true });
        }
    }).catch((err) => {
        resp.send({ msg: err, error: true });
    });

})

router.put("/password", allowLogged, (req, resp) => {
    // ricevo i campi dal payload del client
    const { newPassword, repeatNewPassword } = req.body;
    if (newPassword != repeatNewPassword) {
        resp.send({ msg: "password are not same", error: true })
        return;
    }

    UserModel.findOne({ _id: req.session.user._id}).then((user) => {
        if (user) {
            user.password = crypto.createHash("sha256").update(newPassword).digest("hex");
            user.save();
            req.session.user = user;
            req.session.save((err) => {
                console.log(err);
                resp.send({ msg: 'password changed', error: false });
            })
        } else {
            resp.send({ msg: 'password not changed', error: true });
        }
    }).catch((err) => {
        resp.send({ msg: err, error: true });
    });
})

router.put("/:idUser/role", allowLogged, allowAdmin, (req, resp) => {
    const { idUser } = req.params;
    const { newRole } = req.body;
    UserModel.findOne({ _id: idUser}).then((user) => {
        if (user) {
            user.level = newRole;
            user.save();
            resp.send({ msg: "role updated" , error: false });
        } else {
            resp.send({ msg: 'user not found', error: true });
        }
    }).catch((err) => {
        resp.send({ msg: err, error: true });
    });

})

module.exports = router;
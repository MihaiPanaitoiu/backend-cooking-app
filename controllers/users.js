const User = require('../models/user');

module.exports.renderRegister = (req, res) => {
    res.render('users/register');
}

module.exports.register = async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            res.redirect('/recipes');
        })
    } catch (e) {
        res.redirect('register');
    }
}

module.exports.login = (req, res) => {
//    console.log(req, 'request login');
    const redirectUrl = req.session.returnTo || '/recipes';
    delete req.session.returnTo;
    res.status(200);
    res.send(req.user._id);
}

module.exports.logout = (req, res) => {
//    req.logout();
     req.session.destroy();
//    res.send('loged out');
}

module.exports.getUserData = async (req, res) => {
    const user = await User.findById(req.params.id);
    res.send(user);
}
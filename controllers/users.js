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
        req.flash('error', e.message);
        res.redirect('register');
    }
}

module.exports.login = (req, res) => {
    console.log(req.body, 'request login');
    const redirectUrl = req.session.returnTo || '/recipes';
    delete req.session.returnTo;
    res.send(req.session)
}

module.exports.logout = (req, res) => {
    req.logout();
    // req.session.destroy();
    res.redirect('/recipes');
}
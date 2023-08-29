module.exports = {
    isLoggedIn : function(req, res, next) {
        if(req.session.userName){
            next();
        } else {
            res.redirect('/login');
        }
    }
}
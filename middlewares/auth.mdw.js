module.exports = function restrict(req, res, next) {
    if (!req.session.isAuthenticated) {
        return res.redirect(`/account/login?retUrl=${req.originalUrl}`);
        // chú ý dấu ``
        //đá về trang login kèm địa chỉ trước đó ng ta truy cập, 
        //nếu k (xxx > login > post login thì đc trước đó là login)
    }
    next();
}
//nếu thêm trường quyền hạn thì thêm 1 function y như trên nhưng biến tấu thêm thôi
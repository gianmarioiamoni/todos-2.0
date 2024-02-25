// Middleware to verify if the user is authenticated
export const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login'); // redirect to login if the user is not authenticated
}

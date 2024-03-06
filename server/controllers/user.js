import User from "../models/user.js";

export const renderRegister = (req, res) => {
    // res.render("users/register")
    console.log("show registration page");
    return;
}

export const register = async (req, res, next) => {
    const { email, username, password } = req.body;
    const user = new User({
        username,
        email
    });
    try {
        const registeredUser = await User.register(user, password);

        // call login() method by Passport to start a login session
        // you don't have to login after register
        req.login(registeredUser, (err) => {
            if (err)
                return next(err);

            // login success
            return res.send({
                success: true,
                message: "Welcome to Todos 2.0",
                user: registeredUser,
                redirect: "/dashboard"
                //   cookies: req.cookies
            });
        })
    } catch (err) {
        return res.send({
            success: false,
            message: "error in register",
            user: null,
            redirect: "/register"
            //   cookies: req.cookies
        });

    }

}

export const renderLogin = (req, res) => {
    // res.render("users/login");
    console.log("render login");
    // return;
}

export const login = async (req, res) => {
    // we are successfully authenticated (due to middleware in route)

    await User.findByIdAndUpdate(req.user.id, { isCurrentUser: true });

    console.log("success", "Welcome back!");

    // Now we can use res.locals.returnTo to redirect the user after login
    // thanks to the storeReturnTo middleware function
    const redirectUrl = res.locals.returnTo || "/dashboard";
    // res.redirect(redirectUrl);
    return res.send({
        success: true,
        message: "Welcome back",
        user: req.user,
        redirect: "/dashboard"
        //   cookies: req.cookies
    });

}

export const loginSuccess = async (req, res) => {
    console.log("--- get(/login/success) - req.user = ", req.user)
    console.log("--- get(/login/success) - req.isAuthenticated() = ", req.isAuthenticated())
    console.log
    if (req.user != null) {
        res.send({
            success: true,
            message: "User already authenticated",
            user: req.user,
            redirect: "/dashboard"
        });
    } else {
        res.send({
            success: false,
            message: "User not authenticated",
            user: null,
            redirect: "/login"
        });
    }
}

export const getCurrentUser = async (req, res) => {
    console.log("--- get(/currentUser) - req.user = ", req.user)
    console.log("--- get(/currentUser) - req.session = ", req.session)
    // User.findOne({username: req.user.username})
    // if user === null -> null
    // user.isCurrentUser -> user
    // -> null
    if (req.user == null) {
        return res.send({
            success: false,
            message: "User not authenticated",
            user: null,
            redirect: "/login"
        });
    }
    
    const currentUser = await User.findOne({ $and: [{ _id: req.user.id }, {isCurrentUser: true } ]});
    console.log("--- get(/currentUser) - currentUser = ", currentUser)

    if (currentUser) {
        res.send({
            success: true,
            message: "User already authenticated",
            user: req.user,
            redirect: "/dashboard"
        });
    } else {

        res.send({
            success: false,
            message: "User not authenticated",
            user: null,
            redirect: "/login"
        });
    }

    // if (req.user != null) {
    //     res.send({
    //         success: true,
    //         message: "User already authenticated",
    //         user: req.user,
    //         redirect: "/dashboard"
    //     });
    // } else {
    //     res.send({
    //         success: false,
    //         message: "User not authenticated",
    //         user: null,
    //         redirect: "/login"
    //     });
    // }
}

export const logout = async (req, res, next) => {

    // if (req.user != null) {
    //     await User.findByIdAndUpdate(req.user.id, { isCurrentUser: false });
    // }
    req.logout(function (err) {
        if (err) {
            console.log("err")
            // return next(err);
            res.send({
                success: false,
                message: "Error in logout",
                user: null,
                redirect: "/dashboard"
            });
            
        }
        console.log("logout() - req.session = ", req.session)
        req.session.passport = {}
        
        // console.log("**** logout() - req.user = ", req.user)
        // console.log("**** logout() - req.isAuthenticated() = ", req.isAuthenticated())
        res.send({
            success: true,
            message: "Goodbye",
            user: null,
            redirect: "/"
        });
    });
}

export const resetUser = async (req, res) => {
    console.log("resetUser() - req.body = ", req.body)
    await User.findByIdAndUpdate(req.body.id, { isCurrentUser: false });
    return res.send("user reset")
}



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

export const logout = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            console.log("err")
            return next(err);
        }
        return res.send({
            success: true,
            message: "Goodbye",
            user: null,
            redirect: "/"
        });
    });
}



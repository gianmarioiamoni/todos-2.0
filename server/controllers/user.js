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
                //   cookies: req.cookies
            });
        })
    } catch (err) {
        return res.send({
            success: false,
            message: "error in login",
            user: null,
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

    req.flash("success", "Welcome back!");

    // Now we can use res.locals.returnTo to redirect the user after login
    // thanks to the storeReturnTo middleware function
    const redirectUrl = res.locals.returnTo || "/dashboard";
    // res.redirect(redirectUrl);
    return res.send({
        success: true,
        message: "Welcome back",
        user: req.user,
        //   cookies: req.cookies
    });

}

export const logout = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
        return res.send({
            success: false,
            message: "Goodbye",
            //   cookies: req.cookies
        });
    });

}



// module.exports.renderChangePassword = (req, res) => {
//     res.render("users/changePassword");
// }

// module.exports.changePassword = async (req, res) => {

//     if (typeof req.user === 'undefined') {
//         return res.redirect('/login');
//     }

//     const { oldPassword, newPassword, confirmPassword } = req.body;

//     try {
//         if (newPassword !== confirmPassword) {
//             throw new Error("New Password and Confirm Password don't match");
//         }

//         const user = await User.findOne({ username: req.user.username });

//         await user.changePassword(oldPassword, newPassword);

//         req.flash('success', 'Password Changed Successfully');
//         res.redirect('/campgrounds')

//         console.log(oldPassword, " ", newPassword, " ", confirmPassword);
//     } catch (err) {
//         req.flash("error", err.message);
//         return res.redirect("/changePassword");
//     }

// }


import User from "../models/user.js";


export const register = async (req, res, next) => {
    const { email, username, password } = req.body;

    try {

        const user = new User({
            username,
            email
        });

        const registeredUser = await User.register(user, password);
        console.log("register() - registereduser = ", registeredUser)

        // await User.updateOne({ username: registeredUser.username }, { isCurrentUser: true })
        await User.updateOne({ username: registeredUser.username })

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

export const login = async (req, res) => {
    // we are successfully authenticated (due to middleware in route)

    // await User.findByIdAndUpdate(req.user.id, { isCurrentUser: true });
    await User.findByIdAndUpdate(req.user.id);

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

// export const getCurrentUser = async (req, res) => {
//     if (req.user == null) {
//         return res.send({
//             success: false,
//             message: "User not authenticated",
//             user: null,
//             redirect: "/login"
//         });
//     }
    
//     // const currentUser = await User.findOne({ $and: [{ _id: req.user.id }, {isCurrentUser: true } ]});
//     const currentUser = await User.findOne({ $and: [{ _id: req.user.id }]});

//     if (currentUser) {
//         res.send({
//             success: true,
//             message: "User already authenticated",
//             user: req.user,
//             redirect: "/dashboard"
//         });
//     } else {

//         res.send({
//             success: false,
//             message: "User not authenticated",
//             user: null,
//             redirect: "/login"
//         });
//     }

// }

export const logout = async (req, res, next) => {

    req.logout(function (err) {
        if (err) {
            res.send({
                success: false,
                message: "Error in logout",
                user: null,
                redirect: "/dashboard"
            });
            
        }
        req.session.passport = {}
        
        res.send({
            success: true,
            message: "Goodbye",
            user: null,
            redirect: "/"
        });
    });
}

export const resetUser = async (req, res) => {
    // await User.findByIdAndUpdate(req.body.id, { isCurrentUser: false });
    await User.findByIdAndUpdate(req.body.id);
}



class AuthController{
    static async login(req, res, next){
        try{
            const {username, password} = req.body;
            req.session.loggedIn = true;
            console.log(username, password);
            // res.setHeader('Set-Cookie', 'token=abc123; HttpOnly');
            res.status(200).json({message: "Login successful"});
        }catch(err){
            console.log(err);
            res.status(500).json({message: "Internal Server Error"});
        }
    }
}

export default AuthController;
import User from '../models/user.model.js';

const signUp = async(req, res) => {
    try {
        const {name, email, password} = req.body;
        const existingUser = await User.findOne({email});
        if(existingUser) {
           return res.status(400).json({
                message: "User already exists"
          });
        }

        const newUser = await User({
            name: name,
            email: email,
            password: password
        });
        
        await newUser.save();
        res.status(201).json({
            message: "User created successsfully", 
            user: newUser
        }); 
    } catch (error) {        
        console.error('Failed to create user:', error.message)
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
}

const login = async(req, res) => {
    try {
        const {password, email} = req.body;
         
        if(!email || !password) {
            return res.status(400)
            .json({message: "Email and password are required"});
        }

        const existingUser = await User.findOne({email}).select('+password');
        if(!existingUser || !(await existingUser.comparePassword(password) )) {
            return res.status(401).json({
                message: "Invalid credentials"
          });
        }

        res.status(201).json(existingUser);
    } catch (error) {
        console.error(error.message)
        res.status(500).json({
            message: "Internal server error",
            error: error.message
      });
    }
}
const logout = async(req, res) => {
    try { 
        const { email } = req.body;
        if(!email) {
            return res.status(400).json({
                message: "Email is required"
          });
        }
        
        const user = await User.findOne({ email: email });
        if(!user) {
            return res.status(404).json({
                message: "User not found"
          });
        }
        
        user.isLoggedIn = false;
        await user.save();
        res.status(204).json({
            message: "User logged out successfully",
        });
    } catch (error) {
        console.error('Failed to logout user:', error.message)
        res.status(500).json({
            message: "Internal server error",
            error: error.message
      });
    }
}

export {login, logout, signUp};
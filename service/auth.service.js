import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
import generateTokenAndSetCookie from "../utils/generateToken.js"

export const signup = async (req, res) => {
    try{

        const {name, email, password} = req.body;

        const user = await User.findOne({ email });

        if(user){
            return res.status(400).json({error: "User already exist Please Login"});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });

        if(newUser){
            generateTokenAndSetCookie(newUser._id, res);
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
            });
        }else{
            res.status(400).json({error: "Invalid User Data"});
        }
        
    } catch(error) {
        res.status(500).json({error: "Internal Server Error"});
    }
};


export const login = async(req,res) => {

    try{
        const{email, password} = req.body;
        const user = await User.findOne({email});
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

        if(!user || !isPasswordCorrect){
            return res.status(400).json({error: "Invalid username or password"});
        }

        generateTokenAndSetCookie(user._id, res);

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
        });

    } catch (error){
        res.status(500).json({error: "Internal Server Error"});
    }
};


export const logout = (req, res) => {
    try{
        res.cookie("jwt", "", {
            maxAge: 0,
			httpOnly: true,
			sameSite: "none",
			secure: true
        });
        res.status(200).json({ message: "Logged out successfully" });
    }catch(error){
        res.status(500).json({error: "Internal Server Error"});
    }
};
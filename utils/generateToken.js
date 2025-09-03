import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (userId, res) => {
	const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
		expiresIn: "5m",
	});

	res.cookie("jwt", token, {
		maxAge: 5 * 60 * 1000, // MS
		httpOnly: true, // prevent XSS attacks cross-site scripting attacks
		sameSite: "none", // Allow cross-site requests
		secure: true, // Required for sameSite: "none"
	});
};

export default generateTokenAndSetCookie;
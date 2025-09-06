import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (userId, res) => {
	const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
		expiresIn: "1hr",
	});

	res.cookie("jwt", token, {
		maxAge: 60 * 60 * 1000, // MS
		httpOnly: true, // prevent XSS attacks cross-site scripting attacks
		sameSite: "none", // Allow cross-site requests
		secure: true, // Required for sameSite: "none"
	});
};

export default generateTokenAndSetCookie;
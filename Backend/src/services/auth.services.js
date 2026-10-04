import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateAccessToken, generateRefreshToken } from "../utils/token.utils.js";
async function registerUser(userData) {
  const { fullName, email, password } = userData;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return {
      success: false,
      message: "Email already registered",
    };
  }
  const hashpassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    fullName,
    email,
    password: hashpassword,
  });
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  user.refreshToken = refreshToken;
  await user.save();

 const safeUser = {
    id: user._id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
};

return {
    success: true,
    message: "User registered successfully",
    user: safeUser,
    accessToken,
    refreshToken,
};
}


 async function loginUser(loginData) {
 const { email, password } = loginData;

 const user = await User.findOne({ email });

 if (!user) {
     return {
         success: false,
         message: "Invalid email or password",
     };
 }

 const isPasswordCorrect = await bcrypt.compare(
    password,
    user.password
);

 if (!isPasswordCorrect) {
     return {
         success: false,
         message: "Invalid email or password",
     };
 }
 const accessToken = generateAccessToken(user._id);

const refreshToken = generateRefreshToken(user._id);

user.refreshToken = refreshToken;

await user.save();

return {
    success: true,
    message: "User logged in successfully",
    user: {
        fullName: user.fullName,
        email: user.email,
    },
    accessToken,
    refreshToken,
};
}

async function logoutUser(userId) {

    const user = await User.findById(userId);

    if (!user) {
        return {
            success: false,
            message: "User not found",
        };
    }

    user.refreshToken = "";

    await user.save();

    return {
        success: true,
        message: "Logout successful",
    };
}



 async function refreshAccessTokenService(refreshToken) {

 

    if (!refreshToken) {
        throw new Error("Refresh token missing");
    }

    // 2. Refresh Token verify karo
    const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
    );

    // 3. User find karo
    const user = await User.findById(decoded.id);

    if (!user) {
        throw new Error("User not found");
    }

    // 4. Database wale refresh token se compare karo
    if (user.refreshToken !== refreshToken) {
        throw new Error("Invalid refresh token");
    }

    // 5. Naya Access Token banao
    const accessToken = generateAccessToken(user._id);

    // 6. Controller ko return karo
    return {
        accessToken
    };

    async function getMeService(userId) {

    const user = await User.findById(userId).select("-password -refreshToken");

    if (!user) {
        return {
            success: false,
            message: "User not found"
        };
    }

    return {
        success: true,
        user
    };
}
}

async function getMeService(userId) {

    const user = await User.findById(userId)
        .select("-password -refreshToken");

    if (!user) {
        return {
            success: false,
            message: "User not found"
        };
    }

    return {
        success: true,
        user
    };

}


export { registerUser , loginUser , logoutUser, refreshAccessTokenService, getMeService};

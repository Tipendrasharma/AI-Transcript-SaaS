import { registerUser , loginUser ,logoutUser, refreshAccessTokenService, getMeService } from "../services/auth.services.js";
import { cookieOptions } from "../config/cookie.config.js";

async function register(req, res, next) {
  try {
    const result = await registerUser(req.body);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.cookie("accessToken", result.accessToken, cookieOptions);

    res.cookie("refreshToken", result.refreshToken, cookieOptions);

    return res.status(200).json({
      success: result.success,
      message: result.message,
      user: result.user,
    });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const result = await loginUser(req.body);

    if (!result.success) {
      return res.status(400).json(result);
    }
     res.cookie("accessToken", result.accessToken, cookieOptions);

    res.cookie("refreshToken", result.refreshToken, cookieOptions);

    return res.status(200).json({
      success: result.success,
      message: result.message,
      user: result.user,
    });



  } catch (error) {
    next(error);
  }
}


async function logout(req, res, next) {

    try {

        const result = await logoutUser(req.user.id);

        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        };

        res.clearCookie("accessToken", cookieOptions);

        res.clearCookie("refreshToken", cookieOptions);

        return res.status(200).json({
            success: result.success,
            message: result.message,
        });

    } catch (error) {

        next(error);

    }

}

 async function refreshAccessToken(req, res, next) {

    try {

        const refreshToken = req.cookies.refreshToken;

        const result = await refreshAccessTokenService(refreshToken);

        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        };

        res.cookie(
            "accessToken",
            result.accessToken,
            cookieOptions
        );

        return res.status(200).json({
            success: true,
            message: "Access token refreshed"
        });

    } catch (error) {

        next(error);

    }

}

async function getMe(req, res, next) {
    try {

        const result = await getMeService(req.user.id);

        return res.status(200).json(result);

    } catch (error) {

        next(error);

    }
}

export default { register, login, logout, refreshAccessToken, getMe };

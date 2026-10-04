import jwt from "jsonwebtoken";

function generateAccessToken(user) {
  const accessToken = jwt.sign(
    {
    
      id: user._id,
      role:user.role
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  )
  return accessToken;

}

function generateRefreshToken(user) {
  const refreshToken = jwt.sign(
    {
      id: user._id,
      role:user.role
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  )
  return refreshToken;  


}


export { generateAccessToken, generateRefreshToken };
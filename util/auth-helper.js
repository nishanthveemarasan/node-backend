import RefreshTokenModel from '../models/refresh-token.js';   
export const generateResetToken = async(userId, activeRefreshToken) => {
    try{
        await RefreshTokenModel.expireActiveTokens(userId, activeRefreshToken);
        const newRefreshToken = await RefreshTokenModel.createRefreshToken(userId);
        return newRefreshToken;
    }catch(err){
        console.error("Error generating reset token:", err);
        throw new Error("Error generating reset token");
    }
};


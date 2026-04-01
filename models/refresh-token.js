import { v4 as uuidv4 } from 'uuid';
import prisma from '../util/prismaClient.js';
class RefreshToken {
  static expireActiveTokens = async (userId=null, activeRefreshToken=null) => {
    try {
      const whereClause = {
        expiresAt: {
          gt: new Date(),
        },
      };
      if (userId) {
        whereClause.userId = userId;
      }
      if (activeRefreshToken) {
        whereClause.token = activeRefreshToken;
      }

      await prisma.refreshToken.updateMany({
        where: whereClause,
        data: {
          expiresAt: new Date(),
        },
      });
    } catch (err) {
      console.error("Error expiring active tokens:", err);
      throw new Error("Error expiring active tokens");
    }
  };


  static createRefreshToken = async (userId) => {
    try{
        const token = uuidv4();
        const expires = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
        const refreshToken = await prisma.refreshToken.create({
            data: {
                userId,
                token,
                expiresAt: new Date(expires)
            }
        });
        return refreshToken.token;

    }catch(err){
      console.error("Error creating refresh token:", err);
      throw new Error("Error creating refresh token");
    }
  }

  static findByToken = async (token) => {
    try{
        const activeToken = await prisma.refreshToken.findUnique({
            where: { 
                token,
                expiresAt: {
                    gt: new Date(),
                }
            }
        });
        return activeToken;
    }catch(err){
      console.error("Error finding refresh token:", err);
      throw new Error("Error finding refresh token");
    }
  }
}

export default RefreshToken;

import Wallet from "../model/walletModel.js";


export const findWalletByUserId = async (userId) => {
    return await Wallet.findOne({ user: userId });
  };
  
export const createWallet = async (userId) => {
    const newWallet = new Wallet({ user: userId });
    return await newWallet.save();
  };
  
export const creditWallet = async (userId, amount) => {
    const wallet = await findWalletByUserId(userId);
    if (!wallet) {
      throw new Error("Wallet not found");
    }
    wallet.balance += amount;
    wallet.transactions.push({
      description: "Refund for canceled order",
      amount,
    });
    await wallet.save();
    return wallet;
  };

  export default {
    findWalletByUserId,
    createWallet,
    creditWallet,
  }

  
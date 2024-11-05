import walletRepository from "../adapters/repository/walletRepo.js";

export const getWalletBalance = async (userId) => {
    let wallet = await walletRepository.findWalletByUserId(userId);
    if (!wallet) {
      wallet = await walletRepository.createWallet(userId); // Create a wallet if it doesn't exist
    }
    return wallet;
  };
  
  export const creditWallet = async (userId, amount) => {
    try {
      console.log(amount, "amounttttttttttttttttttttttttttt");
      
      // Ensure amount is a valid number
      if (isNaN(amount) || amount <= 0) {
        throw new Error("Invalid amount for crediting wallet");
      }
  
      const wallet = await walletRepository.findWalletByUserId(userId);
      
      // Check if wallet exists
      if (!wallet) {
        throw new Error("Wallet not found for user");
      }
  
      // Update wallet balance
      wallet.balance += amount;
  
      // Ensure balance remains a number
      if (isNaN(wallet.balance)) {
        throw new Error("Balance calculation resulted in NaN");
      }
  
      // Update transactions
      wallet.transactions.push({
        description: "Refund for canceled order",
        amount,
      });
  
      return await wallet.save();
    } catch (error) {
      console.error("Error in creditWallet:", error.message);
      throw error;
    }
  };

  export default {
    getWalletBalance,
    creditWallet,
  }
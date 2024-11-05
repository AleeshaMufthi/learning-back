import walletService from "../../usecases/walletService.js";

export const getWalletBalance = async (req, res) => {
    try {
      const wallet = await walletService.getWalletBalance(req.user._id);
      res.status(200).json({ balance: wallet.balance, transactions: wallet.transactions });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

export const creditWallet = async (req, res) => {
  console.log(req.body,"req.bodyyyyyyyyyyyyyy")
    const { amount } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }
    try {
      const wallet = await walletService.creditWallet(req.user._id, amount);
      res.status(200).json({ balance: wallet.balance });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

export default {
    getWalletBalance,
    creditWallet,
}
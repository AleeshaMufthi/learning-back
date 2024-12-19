import revenueService from "../../usecases/revenueService.js";

export const processOrderPayment = async (req, res) => {
    console.log(req.params, 'request paramsssssssssssssss');
    
    const { orderId } = req.params;
    try {
      const result = await revenueService.handleOrderPayment(orderId);
      if (result.success) {
        return res.status(200).json({ message: result.message });
      } else {
        return res.status(400).json({ message: result.message });
      }
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };

  const getAdminRevenue = async (req, res) => {
    try {
      const { totalRevenue, formattedRevenues } = await revenueService.getAdminRevenueDetails();
      res.status(200).json({
        success: true,
        revenue: formattedRevenues,
        totalRevenue,
      });
    } catch (error) {
      console.error('Error fetching admin revenue:', error);
      res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
  };

  const getTutorRevenue = async (req, res) => {
    try {
      const { totalRevenue, formattedRevenues } = await revenueService.getTutorRevenueDetails();
      res.status(200).json({
        success: true,
        revenue: formattedRevenues,
        totalRevenue,
      });
    } catch (error) {
      console.error('Error fetching tutor revenue:', error);
      res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
  };

export default {
    processOrderPayment,
    getAdminRevenue,
    getTutorRevenue,
}

const CustomError = require("../../errors/CustomError");
const Booking = require("../../models/Booking");
const Category = require("../../models/Category");
const Event = require("../../models/Event");
const User = require("../../models/User");

const getDashboardData = async (req, res, next) => {
    try {
      const eventStats = await Event.aggregate([
        {
          $facet: {
            totalEvents: [{ $count: "total" }], 
            activeEvents: [{ $match: { status: "active" } }, { $count: "total" }], 
            pendingEvents: [{ $match: { status: "pending" } }, { $count: "total" }], 
            completedEvents: [{ $match: { status: "completed" } }, { $count: "total" }], 
            totalRevenue: [{ $group: { _id: null, total: { $sum: "$price" } } }]  
          }
        }
      ]);

      const userStats = await User.aggregate([
      {
        $facet: {
          totalUsers: [{ $count: "total" }],
          activeUsers: [{ $match: { isBlocked: false } }, { $count: "total" }],
        }
      }
      ]);
  
     const categoryStats = await Category.aggregate([
        {
          $facet: {
            totalCategories: [{ $count: "total" }] 
          }
        }
      ]);

     const revenueStats = await Booking.aggregate([
      {
        $group: {
          _id: null, 
          totalAmount: { $sum: "$amount" }
        }
      }
     ]);
 
      const dashboardData = {
        events: {
          total: eventStats[0]?.totalEvents[0]?.total || 0,
          active: eventStats[0]?.activeEvents[0]?.total || 0,
          pending: eventStats[0]?.pendingEvents[0]?.total || 0,
          completed: eventStats[0]?.completedEvents[0]?.total || 0,
          totalRevenue: revenueStats[0]?.totalAmount || 0 ,
        },
        users: {
          total: userStats[0]?.totalUsers[0]?.total || 0,
          active: userStats[0]?.activeUsers[0]?.total || 0,
        },
        categories: {
          total: categoryStats[0]?.totalCategories[0]?.total || 0,
        }
      };

      res.status(200).json(dashboardData);
    } catch (err) {
      next(new CustomError(err.message, 500));
    }
  };
 

  module.exports = {
    getDashboardData
  }
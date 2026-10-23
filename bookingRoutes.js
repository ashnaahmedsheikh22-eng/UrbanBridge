
const express = require('express');

const {
  getProviderBookings,
  updateProviderBookingStatus,
  createBooking,
} = require('../controllers/booking');

const authMiddleware = require('../middleware/auth');

const bookingRouter = express.Router();

const providerOnly = (req, res, next) => {
  if (req.user.role !== 'provider') {
    return res.status(403).json({
      success: false,
      message: 'Only providers can access this route',
    });
  }

  next();
};

// Customer creates a booking
bookingRouter.post(
  '/',
  authMiddleware,
  createBooking
);

// Provider sees incoming bookings
bookingRouter.get(
  '/provider',
  authMiddleware,
  providerOnly,
  getProviderBookings
);

// Provider updates booking status
bookingRouter.patch(
  '/provider/:id/status',
  authMiddleware,
  providerOnly,
  updateProviderBookingStatus
);

module.exports = bookingRouter;

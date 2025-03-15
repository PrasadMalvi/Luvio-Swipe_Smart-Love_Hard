const otpStore = new Map(); // Temporary in-memory storage (use Redis in production)

// Generate OTP
const generateOtp = (mobileNumber) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
  otpStore.set(mobileNumber, { otp, expiresAt: Date.now() + 5 * 60 * 1000 }); // 5-minute expiry
  console.log(`OTP for ${mobileNumber}: ${otp}`); // ⚠️ Remove this in production
  return otp;
};

// Verify OTP
const verifyOtp = (mobileNumber, otp) => {
  const storedOtpData = otpStore.get(mobileNumber);
  if (!storedOtpData) return false;

  const { otp: storedOtp, expiresAt } = storedOtpData;
  if (Date.now() > expiresAt) {
    otpStore.delete(mobileNumber);
    return false; // Expired OTP
  }

  if (storedOtp === otp) {
    otpStore.delete(mobileNumber);
    return true;
  }
  return false;
};

module.exports = { generateOtp, verifyOtp };

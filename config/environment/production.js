module.exports = {
  // Server IP
  ip: process.env.OPENSHIFT_NODEJS_IP || process.env.IP || undefined,
  // Server port
  // port: process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 3443,
  port: 3443,
};

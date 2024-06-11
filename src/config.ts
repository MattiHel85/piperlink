export default {
    port: process.env.PORT || 3000,
    mongoURI: process.env.MONGO_URI || '',
    jwtSecret: process.env.JWT_SECRET || 'secret_key', // JWT authentication
    emailConfig: {
      service: process.env.EMAIL_SERVICE || 'Gmail', // Email service provider
      auth: {
        user: process.env.EMAIL_USER || '', // Email address for sending emails
        pass: process.env.EMAIL_PASSWORD || '' // Email password or app password
      }
    }
  };
  
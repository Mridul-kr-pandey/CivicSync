const nodemailer = require('nodemailer');

// Email transporter setup
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Send email notification
const sendEmail = async (to, subject, html, text = '') => {
  try {
    const mailOptions = {
      from: process.env.SMTP_USER,
      to,
      subject,
      html,
      text
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Email sending error:', error);
    throw new Error('Failed to send email');
  }
};

// Send welcome email
const sendWelcomeEmail = async (user) => {
  const subject = 'Welcome to Accountability Partner!';
  const html = `
    <h1>Welcome ${user.name}!</h1>
    <p>Thank you for joining Accountability Partner. We're excited to help you achieve your goals!</p>
    <p>Get started by:</p>
    <ul>
      <li>Completing your profile</li>
      <li>Finding an accountability partner</li>
      <li>Setting up your first agreement</li>
    </ul>
    <p>Best regards,<br>The Accountability Partner Team</p>
  `;

  return sendEmail(user.email, subject, html);
};

// Send connection request email
const sendConnectionRequestEmail = async (recipient, requester) => {
  const subject = 'New Accountability Partner Request';
  const html = `
    <h2>You have a new accountability partner request!</h2>
    <p><strong>${requester.name}</strong> wants to be your accountability partner.</p>
    <p>Skills: ${requester.skills.join(', ')}</p>
    <p>Goals: ${requester.goals.join(', ')}</p>
    <p>Login to your account to accept or reject this request.</p>
    <p>Best regards,<br>The Accountability Partner Team</p>
  `;

  return sendEmail(recipient.email, subject, html);
};

// Send progress reminder email
const sendProgressReminderEmail = async (user, agreement) => {
  const subject = 'Daily Progress Check-in Reminder';
  const html = `
    <h2>Time for your daily check-in!</h2>
    <p>Hi ${user.name},</p>
    <p>Don't forget to submit your daily progress for your accountability agreement:</p>
    <p><strong>Goal:</strong> ${agreement.what}</p>
    <p>Submit your progress now to avoid penalties!</p>
    <p>Best regards,<br>The Accountability Partner Team</p>
  `;

  return sendEmail(user.email, subject, html);
};

// Send penalty notification email
const sendPenaltyEmail = async (user, amount, reason) => {
  const subject = 'Penalty Applied - Accountability Partner';
  const html = `
    <h2>Penalty Applied</h2>
    <p>Hi ${user.name},</p>
    <p>A penalty of ₹${amount} has been applied to your account.</p>
    <p><strong>Reason:</strong> ${reason}</p>
    <p>Please ensure you submit your progress on time to avoid further penalties.</p>
    <p>Best regards,<br>The Accountability Partner Team</p>
  `;

  return sendEmail(user.email, subject, html);
};

// Send dispute notification email
const sendDisputeEmail = async (user, dispute) => {
  const subject = 'Dispute Filed - Accountability Partner';
  const html = `
    <h2>Dispute Filed</h2>
    <p>Hi ${user.name},</p>
    <p>A dispute has been filed regarding your accountability agreement.</p>
    <p><strong>Type:</strong> ${dispute.type}</p>
    <p><strong>Title:</strong> ${dispute.title}</p>
    <p>Our admin team will review this dispute and get back to you soon.</p>
    <p>Best regards,<br>The Accountability Partner Team</p>
  `;

  return sendEmail(user.email, subject, html);
};

// Real-time notification via Socket.io
const sendRealTimeNotification = (io, userId, notification) => {
  io.to(`user-${userId}`).emit('notification', notification);
};

// Send progress update notification
const sendProgressUpdateNotification = (io, partnerId, progressData) => {
  const notification = {
    type: 'progress_update',
    message: 'Your partner has submitted their daily progress',
    data: progressData,
    timestamp: new Date()
  };
  
  sendRealTimeNotification(io, partnerId, notification);
};

// Send connection request notification
const sendConnectionRequestNotification = (io, recipientId, requesterData) => {
  const notification = {
    type: 'connection_request',
    message: 'You have a new accountability partner request',
    data: requesterData,
    timestamp: new Date()
  };
  
  sendRealTimeNotification(io, recipientId, notification);
};

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendConnectionRequestEmail,
  sendProgressReminderEmail,
  sendPenaltyEmail,
  sendDisputeEmail,
  sendRealTimeNotification,
  sendProgressUpdateNotification,
  sendConnectionRequestNotification
};



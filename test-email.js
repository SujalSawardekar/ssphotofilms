require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // Use SSL
  auth: {
    user: 'ssphotographyofficial08@gmail.com',
    pass: process.env.EMAIL_APP_PASSWORD, 
  },
});

async function testEmail() {
  console.log('--- TESTING GMAIL TRANSPORTER ---');
  try {
    await transporter.verify();
    console.log('✅ SMTP Connection verified successfully.');
    
    const info = await transporter.sendMail({
      from: '"Test" <ssphotographyofficial08@gmail.com>',
      to: 'ssphotographyofficial08@gmail.com',
      subject: '🚨 DIAGNOSTIC TEST: SMTP Check',
      text: 'If you see this, the reminder system is now working.',
    });
    console.log('✅ Email sent successfully!');
    console.log('Message ID:', info.messageId);
  } catch (err) {
    console.error('❌ GMAIL ERROR:', err.message);
    if (err.message.includes('Invalid login')) {
      console.log('>>> REASON: The App Password is incorrect or 2-Step Verification is not active.');
    }
  } finally {
    process.exit(0);
  }
}

testEmail();

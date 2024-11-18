// import nodemailer from 'nodemailer';
// import dotenv from 'dotenv';
// dotenv.config();

// const transporter = nodemailer.createTransport({
//     host: 'smtp.gmail.com',
//     port: 465,
//     secure: true, // use SSL
//     auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_APP_PASSWORD
//     },
//     tls: {
//         rejectUnauthorized: false
//     }
// });

// // Verify the connection configuration
// transporter.verify(function(error, success) {
//     if (error) {
//         console.log('SMTP connection error:', error);
//     } else {
//         console.log('SMTP server is ready to take our messages');
//     }
// });

// export const sendUpdateNotification = async (userEmail, updateType) => {
//     const subjects = {
//         username: 'Username Update Notification',
//         email: 'Email Update Notification',
//         password: 'Password Update Notification'
//     };

//     const messages = {
//         username: 'Your username has been successfully updated.',
//         email: 'Your email address has been successfully updated.',
//         password: 'Your password has been successfully changed.'
//     };

//     const mailOptions = {
//         from: {
//             name: 'Estate App',
//             address: process.env.EMAIL_USER
//         },
//         to: userEmail,
//         subject: subjects[updateType],
//         html: `
//             <div style="font-family: Arial, sans-serif; padding: 20px;">
//                 <h2>Security Alert</h2>
//                 <p>${messages[updateType]}</p>
//                 <p>If you did not make this change, please contact support immediately.</p>
//                 <p>Best regards,<br>Your App Team</p>
//             </div>
//         `
//     };

//     try {
//         const info = await transporter.sendMail(mailOptions);
//         console.log('Email sent successfully:', info.response);
//         return info;
//     } catch (error) {
//         console.error('Error sending email:', error);
//         throw new Error('Failed to send notification email');
//     }
// };
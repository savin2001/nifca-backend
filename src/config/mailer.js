const nodemailer = require('nodemailer');
const path = require('path');

const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendVerificationEmail = async (email, token) => {
    const verificationLink = `http://localhost:3000/api/auth/verify?token=${token}`;
    const logoPath = path.join(__dirname, '../assets/nifca.png'); // Adjust path if needed

    const mailOptions = {
        from: `"NIFCA Support" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Verify Your Email - NIFCA",
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background-color: #FFFFFF; border-radius: 10px; border: 1px solid #ddd;">
                <div style="text-align: center; padding-bottom: 10px;">
                    <img src="cid:logo" alt="NIFCA Logo" style="width: 150px;">
                </div>
                <h2 style="color: #A62D5C; text-align: center;">Welcome to NIFCA!</h2>
                <p style="color: #205473; font-size: 16px; text-align: center;">
                    We're excited to have you on board. Before you get started, please verify your email address by clicking the button below:
                </p>
                <div style="text-align: center; margin: 20px 0;">
                    <a href="${verificationLink}" 
                        style="background-color: #A62D5C; color: #FFFFFF; padding: 12px 18px; text-decoration: none; font-size: 16px; border-radius: 5px; display: inline-block;">
                        Verify Email
                    </a>
                </div>
                <p style="color: #205473; font-size: 14px; text-align: center;">
                    If you did not sign up for a NIFCA account, please ignore this email.
                </p>
                <p style="color: #000000; font-size: 14px; text-align: center;">
                    Thanks,<br><strong>The NIFCA Team</strong>
                </p>
            </div>
        `,
        attachments: [{
            filename: 'logo.png',
            path: logoPath,
            cid: 'logo' // Same CID as used in the <img> tag
        }]
    };

    return transporter.sendMail(mailOptions);
};

module.exports = { sendVerificationEmail };

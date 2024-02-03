/** mailer.js
 * Copyright (c) 2022, Towechlabs
 * All rights reserved.
 *
 * Utility that contains functions to generate and send emails
 */
// Libraries
const nodeMailer = require('nodemailer');
import { google } from 'googleapis';
import mailgen from 'mailgen';

const { EMAIL, FRONTEND, EMAIL_CLIENT_ID, EMAIL_CLIENT_SECRET, EMAIL_REFRESH_TOKEN } = process.env;
const OAuth2 = google.auth.OAuth2;
const OAuth2_client = new OAuth2(
  EMAIL_CLIENT_ID,
  EMAIL_CLIENT_SECRET,
  'https://developers.google.com/oauthplayground'
);
OAuth2_client.setCredentials({ refresh_token: EMAIL_REFRESH_TOKEN });

export default class Mailer {
  // creates an instance of the mail generator, that has all the common elements
  private static mailGenerator = new mailgen({
    theme: {
      path: '/public/themes/default/index.html',
      plaintextPath: '/public/themes/default/index.txt',
    },
    product: {
      name: 'Towech-FinanceApp',
      link: FRONTEND || '',
      //TODO: Create and add logo
      //logo: 'https://avatars3.githubusercontent.com/u/11511711?s=460&u=9f55fbd68f05113f749132b9ca966e34b6337cf0&v=4'
    },
  });

  // function that sends the emails
  private static sendEmail = async (
    recipient: string,
    subject: string,
    content: mailgen.Content
  ): Promise<void> => {
    try {
      const emailBody = Mailer.mailGenerator.generate(content);
      const emailText = Mailer.mailGenerator.generatePlaintext(content);

      const accessToken = await new Promise((resolve, reject) => {
        OAuth2_client.getAccessToken((err, token) => {
          if (err) {
            reject(err);
          }
          resolve(token);
        });
      });

      const transporter = nodeMailer.createTransport({
        secure: true,
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user: EMAIL,
          accessToken: accessToken,
          clientId: EMAIL_CLIENT_ID,
          clientSecret: EMAIL_CLIENT_SECRET,
          refreshToken: EMAIL_REFRESH_TOKEN,
        },
      });

      const info = await transporter.sendMail({
        from: `Towech-FinanceApp <${EMAIL}>`,
        to: recipient,
        subject: subject,
        text: emailText,
        html: emailBody,
      });

      console.log(`Sent email ${info.messageId}`);
    } catch (e) {
      console.log(e);
    }
  };

  static registrationEmail = async (recipient: string, user: string, password: string) => {
    const content: mailgen.Content = {
      body: {
        greeting: `Hi`,
        name: user,
        intro: `Welcome to the Towech-FinanceApp`,
        action: {
          instructions: `Your access password is: ${password}`,
          button: {
            color: `#22BC66`,
            text: `Go to app`,
            link: `${FRONTEND}/home`,
          },
        },
        outro: `You'll be prompted to change your password when first loging in`,
        signature: `Thanks`,
      },
    };

    Mailer.sendEmail(recipient, 'Towech-FinanceApp registration', content);
  };

  static passwordChange = (user: any) => {
    const content: mailgen.Content = {
      body: {
        greeting: `Hi`,
        name: user.name,
        intro: `Your password has been succesfully changed`,
        signature: `Thanks`,
      },
    };

    Mailer.sendEmail(user.username, 'Towech-FinanceApp password change', content);
  };

  static resetPasswordEmail = async (user: any, token: string) => {
    const content: mailgen.Content = {
      body: {
        greeting: `Hi`,
        name: user.name,
        intro: `You've asked for a password reset.`,
        action: {
          instructions: `To restore your password, click on the following link. It'll only work for 24 hours`,
          button: {
            color: `#22BC66`,
            text: `Reset my password`,
            link: `${process.env.FRONTEND}/reset/${token}`,
          },
        },
        outro: `If you didn't request for this, ignore this email. Never send this link to anyone.`,
        signature: `From`,
      },
    };

    Mailer.sendEmail(user.username, `Towech-FinanceApp password reset`, content);
  };

  static accountVerification = async (name: string, recipient: string, token: string) => {
    const content: mailgen.Content = {
      body: {
        greeting: `Hi`,
        name: name,
        intro: `Verify this email account.`,
        action: {
          instructions: `To restore your password, click on the following link. It'll only work for 24 hours`,
          button: {
            color: `#22BC66`,
            text: `Reset my password`,
            link: `${process.env.FRONTEND}/verify/${token}`,
          },
        },
        signature: `From`,
      },
    };

    Mailer.sendEmail(recipient, `Towech-FinanceApp email verification`, content);
  };
}

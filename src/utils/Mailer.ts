/** mailer.js
 * Copyright (c) 2022, Towechlabs
 * All rights reserved.
 *
 * Utility that contains functions to generate and send emails
 */
// Libraries
import sgMail from '@sendgrid/mail';
import mailgen from 'mailgen';

const { EMAIL, EMAIL_API_KEY, FRONTEND } = process.env;

export class Mailer {
  constructor() {
    sgMail.setApiKey(EMAIL_API_KEY || '');
  }

  // creates an instance of the mail generator, that has all the common elements
  private mailGenerator = new mailgen({
    theme: 'default',
    product: {
      name: 'Towech-FinanceApp',
      link: FRONTEND || '',
      //TODO: Create and add logo
      //logo: 'https://avatars3.githubusercontent.com/u/11511711?s=460&u=9f55fbd68f05113f749132b9ca966e34b6337cf0&v=4'
    },
  });

  // function that sends the emails
  private sendEmail = async (
    recipient: string,
    subject: string,
    content: mailgen.Content
  ): Promise<void> => {
    try {
      const emailBody = this.mailGenerator.generate(content);
      const emailText = this.mailGenerator.generatePlaintext(content);

      await sgMail.send({
        to: recipient,
        from: EMAIL || '',
        subject,
        text: emailText,
        html: emailBody,
      });

      // TODO: Add proper logging
      // console.log(`Sent email ${info[0].}`);
    } catch (e) {
      console.error(JSON.stringify(e));
    }
  };

  sendRegistrationEmail = async (recipient: string, name: string, password: string) => {
    const content: mailgen.Content = {
      body: {
        greeting: `Hi`,
        name: name,
        intro: `Welcome to the Towech-FinanceApp`,
        action: {
          instructions: `Your access password is: ${password} You'll be prompted to change your password when first loging in.`,
          button: {
            color: `#22BC66`,
            text: `Go to app`,
            link: `${FRONTEND}/login`,
          },
        },
        outro: `You didn't request for access? Then please ignore this message, the account will be deleted after 10 days`,
        signature: `Thanks`,
      },
    };

    this.sendEmail(recipient, 'Towech-FinanceApp registration', content);
  };

  // static passwordChange = (user: Objects.User.BaseUser) => {
  //   const content: mailgen.Content = {
  //     body: {
  //       greeting: `Hi`,
  //       name: user.name,
  //       intro: `Your password has been succesfully changed`,
  //       signature: `Thanks`,
  //     },
  //   };

  //   Mailer.sendEmail(user.username, 'Towech-FinanceApp password change', content);
  // };

  // static resetPasswordEmail = async (user: Objects.User.BaseUser, token: string) => {
  //   const content: mailgen.Content = {
  //     body: {
  //       greeting: `Hi`,
  //       name: user.name,
  //       intro: `You've asked for a password reset.`,
  //       action: {
  //         instructions: `To restore your password, click on the following link. It'll only work for 24 hours`,
  //         button: {
  //           color: `#22BC66`,
  //           text: `Reset my password`,
  //           link: `${process.env.FRONTEND}/reset/${token}`,
  //         },
  //       },
  //       outro: `If you didn't request for this, ignore this email. Never send this link to anyone.`,
  //       signature: `From`,
  //     },
  //   };

  //   Mailer.sendEmail(user.username, `Towech-FinanceApp password reset`, content);
  // };

  // static accountVerification = async (name: string, recipient: string, token: string) => {
  //   const content: mailgen.Content = {
  //     body: {
  //       greeting: `Hi`,
  //       name: name,
  //       intro: `Verify this email account.`,
  //       action: {
  //         instructions: `To restore your password, click on the following link. It'll only work for 24 hours`,
  //         button: {
  //           color: `#22BC66`,
  //           text: `Reset my password`,
  //           link: `${process.env.FRONTEND}/verify/${token}`,
  //         },
  //       },
  //       signature: `From`,
  //     },
  //   };

  //   Mailer.sendEmail(recipient, `Towech-FinanceApp email verification`, content);
  // };
}

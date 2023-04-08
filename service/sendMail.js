// const sgMail = require("@sendgrid/mail");
// sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const nodemailer = require("nodemailer");

// const { META_PASS, META_USER } = process.env;

// const sendMail = async ({ to, subject, html }) => {
//   const msg = {
//     to,
//     from: "nalivpv@gmail.com",
//     subject,
//     text: "and easy to do anywhere, even with Node.js",
//     html,
//   };

//   sgMail
//     .send(msg)
//     .then(() => {
//       console.log("Email sent");
//     })
//     .catch((error) => {
//       console.error(error);
//     });
// };

async function sendMail({ to, html, subject }) {
  const email = {
    from: "nalivpv@meta.ua",
    to,
    subject,
    html,
  };

  const transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: process.env.MAILTRAP_USER,
      pass: process.env.MAILTRAP_PASS,
    },

    // host: "smtp.meta.ua",
    // port: 465,
    // secure: true,
    // auth: {
    //   user: META_USER,
    //   pass: META_PASS,
    // },

    // service: "Gmail",
    // auth: {
    //   user: process.env.GMAIL_USER,
    //   pass: process.env.GMAIL_PASS,
    // },
  });

  await transport
    .sendMail(email)
    .then((info) => console.log("Email send"))
    .catch((err) => console.log(err));
}

module.exports = {
  sendMail,
};

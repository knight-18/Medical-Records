var nodemailer = require("nodemailer");
import _ from 'lodash';
exports.sendMessage = function(req, res) 
{ 
          try {
        const emailToken = jwt.sign(
          {
            user: _.pick(user, 'id'),
          },
          process.env.Jwt_Secret,
          {
            expiresIn: '30m',
          },
        );

        const url = `http://localhost:5000/${emailToken}`;//to be modified

        await transporter.sendMail({
            from: process.env.NODEMAILER_EMAIL,
            to: args.email,
            subject: 'Confirm Email',
            html: `Please click this email to confirm your email: <a href="${url}">${url}</a>`,
        });
      } catch (e) {
        console.log(e);
      } 
};

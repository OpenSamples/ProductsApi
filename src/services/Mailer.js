const nodemailer = require('nodemailer')
const objectToCsv = require("objects-to-csv")

require('dotenv').config()

async function sendMail(mail, data) {

    data = new objectToCsv(data)
    data = await data.toString()
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'dkarahmetovic5@gmail.com',
          pass: process.env.PASSWORD
        }
    });
    
    let mailOptions = {
        from: 'dkarahmetovic5@gmail.com',
        to: mail,
        subject: 'New product is added!',
        text: 'Thank you for using our services!',
        attachments: [
            {   
                filename: "New Product.csv",
                content: data
            }
        ]
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    }); 
}

module.exports = sendMail
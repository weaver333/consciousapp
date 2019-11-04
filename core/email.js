const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

function send(to, templateId, link) {
    const msg = {
        to: to,
        from: 'do-not-reply@consciousapp.com',
        templateId: templateId,
        dynamic_template_data: {
            link: link
        }
    };

    sgMail.send(msg);
}

/**
 * send email for login confirmation
 */
function send_verification_email(to, code) {
    var link = process.env.BASE_URL + '/login-confirm?h=' + code;
    send(to, 'd-0bb03e492a764a27bd1184a87d26fa71', link);
}

/**
 * send email for reset password
 */
function send_reset_password_email(to, code) {
    var link = process.env.BASE_URL + '/reset-password?h=' + code;
    send(to, 'd-79dc3256496745d9b8bf8c20363f482e', link);
}

/**
 * send email for changing email
 */
function send_changing_email(to, code) {
    var link = process.env.BASE_URL + '/email-confirm?h=' + code;
    send(to, 'd-0bb03e492a764a27bd1184a87d26fa71', link);
}

module.exports = {
    send_verification_email,
    send_reset_password_email,
    send_changing_email
}
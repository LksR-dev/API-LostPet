const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDRIG_API_KEY);

const msg = {
	to: 'lucasmruizsec05@gmail.com', // Change to your recipient
	from: 'lucasmruiz05@gmail.com', // Change to your verified sender
	subject: 'Sending with SendGrid is Fun',
	text: 'Check',
	html: '<strong>and easy to do anywhere, even with Node.js</strong>',
};
sgMail
	.send(msg)
	.then(() => {
		console.log('Email sent');
	})
	.catch((error) => {
		console.error(error);
	});

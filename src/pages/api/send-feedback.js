import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, email, feedback } = req.body;

    let transporter = nodemailer.createTransport({
      host: '############',
      port: 587,
      secure: false, // Use TLS
      auth: {
        user: '##############',
        pass: '##############'
      }
    });

    try {
      // Send email
      await transporter.sendMail({
        from: '"Feedback Form" <your-email@example.com>',
        to: 'rja@paperprisons.org',
        subject: 'New Feedback',
        text: `Name: ${name}\nEmail: ${email}\nFeedback: ${feedback}`,
        html: `<p><strong>Name:</strong> ${name}</p>
               <p><strong>Email:</strong> ${email}</p>
               <p><strong>Feedback:</strong> ${feedback}</p>`
      });

      res.status(200).json({ message: 'Feedback sent successfully' });
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ message: 'Error sending feedback' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
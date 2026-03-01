const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // 📩 EMAIL 1 → vers toi
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: "phipsipy@gmail.com",
      subject: "Nouveau message depuis le site",
      html: `
<div style="font-family: Arial, sans-serif; background:#f4f6f9; padding:20px;">
  <div style="max-width:600px; margin:auto; background:white; padding:30px; border-radius:10px; box-shadow:0 4px 10px rgba(0,0,0,0.1);">
    
    <h2 style="color:#2c3e50; text-align:center;">
      📩 Nouveau Message
    </h2>

    <hr style="border:none; border-top:1px solid #eee; margin:20px 0;" />

    <p><strong>Nom :</strong> ${name}</p>
    <p><strong>Email :</strong> ${email}</p>

    <div style="background:#f9f9f9; padding:15px; border-radius:6px; margin-top:10px;">
      <p style="margin:0;"><strong>Message :</strong></p>
      <p>${message}</p>
    </div>

    <p style="margin-top:20px; font-size:12px; color:#888;">
      Message envoyé depuis votre site officiel.
    </p>

  </div>
</div>
`,
    });

    // 📬 EMAIL 2 → confirmation au visiteur
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Nous avons bien reçu votre message",
      html: `
<div style="font-family: Arial; background:#f4f6f9; padding:20px;">
  <div style="max-width:600px; margin:auto; background:white; padding:30px; border-radius:10px;">
    
    <h2 style="color:#27ae60;">🙏 Merci ${name} !</h2>

    <p>Nous avons bien reçu votre message.</p>

    <div style="background:#f9f9f9; padding:15px; border-radius:6px;">
      <p><strong>Votre message :</strong></p>
      <p>${message}</p>
    </div>

    <p style="margin-top:20px;">
      Nous vous répondrons dans les plus brefs délais.
    </p>

    <hr />
    <p style="font-size:12px; color:#888;">
      Église Temple du Dieu Vivant — Lomé, Togo
    </p>

  </div>
</div>
`,
    });

    res.json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false });
  }
});

app.listen(5000, () => {
  console.log("Serveur lancé sur http://localhost:5000");
});

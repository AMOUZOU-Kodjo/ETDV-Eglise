// api/contact.js
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  // Log pour déboguer
  console.log('📨 Méthode reçue:', req.method);
  console.log('🔑 Clé API présente:', !!process.env.RESEND_API_KEY);

  // Configuration CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  try {
    const { name, email, message } = req.body;
    console.log('📝 Données reçues:', { name, email });

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({ 
        success: false, 
        error: 'Tous les champs sont requis' 
      });
    }

    // Envoi de l'email
    console.log('📤 Tentative d\'envoi à:', 'phipsipy@gmail.com');
    
    const { data, error } = await resend.emails.send({
      from: 'Formulaire Contact <onboarding@resend.dev>',
      to: ['phipsipy@gmail.com'],
      subject: `📧 Nouveau message de ${name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; }
            .container { max-width: 600px; margin: 0 auto; }
            .header { background: #667eea; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #555; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>📬 Nouveau message de contact</h2>
            </div>
            <div class="content">
              <div class="field">
                <div class="label">👤 Nom:</div>
                <div>${name}</div>
              </div>
              <div class="field">
                <div class="label">📧 Email:</div>
                <div>${email}</div>
              </div>
              <div class="field">
                <div class="label">💬 Message:</div>
                <div>${message}</div>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
      reply_to: email,
    });

    if (error) {
      console.error('❌ Erreur Resend:', error);
      return res.status(400).json({ 
        success: false, 
        error: error.message 
      });
    }

    console.log('✅ Email envoyé avec succès:', data);
    return res.status(200).json({ 
      success: true,
      message: 'Email envoyé avec succès'
    });

  } catch (error) {
    console.error('❌ Erreur serveur:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Erreur interne du serveur' 
    });
  }
}
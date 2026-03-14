// C:\Users\Lenovo\Desktop\Site\api\contact.js

// Si vous utilisez Resend (recommandé)
import { Resend } from 'resend';

// Initialisation de Resend avec la clé API
const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  // Configuration CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Gérer les requêtes OPTIONS (pre-flight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Vérifier que c'est bien une requête POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const { name, email, message } = req.body;

  // Validation des champs
  if (!name || !email || !message) {
    return res.status(400).json({ 
      success: false, 
      error: 'Tous les champs sont requis' 
    });
  }

  // Validation du format email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      success: false, 
      error: 'Format d\'email invalide' 
    });
  }

  try {
    // Envoi de l'email avec Resend
    const { data, error } = await resend.emails.send({
      from: 'Formulaire de contact <onboarding@resend.dev>', // À remplacer par votre domaine vérifié
      to: ['phipsipy@gmail.com'], // REMPLACEZ PAR VOTRE EMAIL
      subject: `📧 Nouveau message de ${name} - ${email}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; background-color: #f5f5f5; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
            .header h1 { margin: 0; font-size: 24px; }
            .content { padding: 30px; }
            .field { margin-bottom: 25px; }
            .label { font-weight: bold; color: #555; margin-bottom: 5px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; }
            .value { background: #f9f9f9; padding: 15px; border-radius: 8px; color: #333; border-left: 4px solid #667eea; }
            .message-box { background: #f9f9f9; padding: 15px; border-radius: 8px; color: #333; border-left: 4px solid #667eea; white-space: pre-wrap; }
            .footer { background: #f5f5f5; padding: 20px; text-align: center; color: #777; font-size: 12px; border-top: 1px solid #ddd; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📬 Nouveau message de contact</h1>
              <p style="margin: 10px 0 0; opacity: 0.9;">Église Temple du Dieu Vivant</p>
            </div>
            <div class="content">
              <div class="field">
                <div class="label">👤 Nom</div>
                <div class="value">${name}</div>
              </div>
              <div class="field">
                <div class="label">📧 Email</div>
                <div class="value"><a href="mailto:${email}" style="color: #667eea; text-decoration: none;">${email}</a></div>
              </div>
              <div class="field">
                <div class="label">💬 Message</div>
                <div class="message-box">${message.replace(/\n/g, '<br>')}</div>
              </div>
            </div>
            <div class="footer">
              <p>Ce message a été envoyé depuis le formulaire de contact de votre site web.</p>
              <p>Pour répondre, cliquez simplement sur "Répondre" à cet email.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      reply_to: email, // Pour pouvoir répondre directement à l'expéditeur
    });

    if (error) {
      console.error('Erreur Resend:', error);
      return res.status(400).json({ 
        success: false, 
        error: error.message 
      });
    }

    // Succès
    return res.status(200).json({ 
      success: true, 
      message: 'Email envoyé avec succès',
      data 
    });

  } catch (error) {
    console.error('Erreur serveur:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Erreur interne du serveur' 
    });
  }
}
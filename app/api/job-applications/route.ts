import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      firstName,
      lastName,
      email,
      phone,
      desiredPosition,
      experience,
      message,
      photoUrl,
      cvUrl
    } = body

    // Validar campos requeridos
    if (!firstName || !lastName || !email || !phone || !desiredPosition || !cvUrl) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      )
    }

    // Crear el HTML del correo
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #42542D 0%, #9CB83A 100%);
              color: white;
              padding: 30px;
              text-align: center;
              border-radius: 8px 8px 0 0;
            }
            .content {
              background: #f9f9f9;
              padding: 30px;
              border: 1px solid #e0e0e0;
            }
            .section {
              margin-bottom: 25px;
              background: white;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .section-title {
              color: #42542D;
              font-size: 18px;
              font-weight: bold;
              margin-bottom: 15px;
              border-bottom: 2px solid #9CB83A;
              padding-bottom: 8px;
            }
            .info-row {
              margin: 10px 0;
              padding: 8px 0;
              border-bottom: 1px solid #f0f0f0;
            }
            .info-label {
              font-weight: bold;
              color: #555;
              display: inline-block;
              width: 150px;
            }
            .info-value {
              color: #333;
            }
            .button {
              display: inline-block;
              padding: 12px 24px;
              background-color: #42542D;
              color: white;
              text-decoration: none;
              border-radius: 5px;
              margin: 10px 5px;
            }
            .photo-section {
              text-align: center;
              margin: 20px 0;
            }
            .photo-section img {
              max-width: 200px;
              border-radius: 8px;
              box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            }
            .footer {
              text-align: center;
              padding: 20px;
              color: #666;
              font-size: 12px;
              background: #f0f0f0;
              border-radius: 0 0 8px 8px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">Nueva Solicitud de Empleo</h1>
              <p style="margin: 10px 0 0 0;">Ferretería La Michoacana</p>
            </div>
            
            <div class="content">
              ${photoUrl ? `
                <div class="photo-section">
                  <img src="${photoUrl}" alt="Foto del candidato" />
                </div>
              ` : ''}
              
              <div class="section">
                <div class="section-title">📋 Información Personal</div>
                <div class="info-row">
                  <span class="info-label">Nombre Completo:</span>
                  <span class="info-value">${firstName} ${lastName}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Correo Electrónico:</span>
                  <span class="info-value">${email}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Teléfono:</span>
                  <span class="info-value">${phone}</span>
                </div>
              </div>

              <div class="section">
                <div class="section-title">💼 Información Laboral</div>
                <div class="info-row">
                  <span class="info-label">Puesto Deseado:</span>
                  <span class="info-value"><strong>${desiredPosition}</strong></span>
                </div>
                ${experience ? `
                  <div class="info-row">
                    <span class="info-label">Experiencia:</span>
                    <span class="info-value">${experience}</span>
                  </div>
                ` : ''}
                ${message ? `
                  <div class="info-row">
                    <span class="info-label">Mensaje:</span>
                    <div style="margin-top: 10px; padding: 15px; background: #f9f9f9; border-left: 4px solid #9CB83A; border-radius: 4px;">
                      ${message.replace(/\n/g, '<br>')}
                    </div>
                  </div>
                ` : ''}
              </div>

              <div class="section">
                <div class="section-title">📎 Documentos Adjuntos</div>
                <div style="text-align: center; margin-top: 15px;">
                  <a href="${cvUrl}" class="button" target="_blank">
                    📄 Ver Curriculum Vitae
                  </a>
                  ${photoUrl ? `
                    <a href="${photoUrl}" class="button" target="_blank">
                      🖼️ Ver Fotografía
                    </a>
                  ` : ''}
                </div>
              </div>
            </div>

            <div class="footer">
              <p>Este correo fue enviado desde el formulario de empleo de Ferretería La Michoacana</p>
              <p>Fecha: ${new Date().toLocaleString('es-MX', { 
                dateStyle: 'full', 
                timeStyle: 'short',
                timeZone: 'America/Mexico_City'
              })}</p>
            </div>
          </div>
        </body>
      </html>
    `

    // Enviar correo usando Resend
    const { data, error } = await resend.emails.send({
      from: 'Bolsa de Trabajo <noreply@ferreteria-michoacana.com>',
      to: 'contacto@ferreteria-michoacana.com', // Correo registrado en Resend
      reply_to: email,
      subject: `Nueva Solicitud de Empleo - ${desiredPosition} - ${firstName} ${lastName}`,
      html: emailHtml,
    })

    if (error) {
      console.error('Error sending email:', error)
      return NextResponse.json(
        { error: 'Error al enviar el correo' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      messageId: data?.id
    })

  } catch (error) {
    console.error('Error processing job application:', error)
    return NextResponse.json(
      { error: 'Error al procesar la solicitud' },
      { status: 500 }
    )
  }
}

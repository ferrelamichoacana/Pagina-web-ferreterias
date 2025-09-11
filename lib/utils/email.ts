import { Resend } from 'resend'

// Configuración de Resend para envío de emails
const resend = new Resend(process.env.RESEND_API_KEY)

interface EmailOptions {
  to: string | string[]
  subject: string
  html: string
  from?: string
}

// Función principal para enviar emails
export async function sendEmail({ to, subject, html, from }: EmailOptions) {
  try {
    const result = await resend.emails.send({
      from: from || 'Ferretería La Michoacana <noreply@ferreterialamichoacana.com>',
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
    })

    return { success: true, data: result }
  } catch (error) {
    console.error('Error sending email:', error)
    return { success: false, error }
  }
}

// Plantillas de email predefinidas

export const emailTemplates = {
  // Confirmación de solicitud de cotización al cliente
  contactConfirmation: (customerName: string, requestId: string) => ({
    subject: 'Solicitud de Cotización Recibida - Ferretería La Michoacana',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #22c55e; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Ferretería La Michoacana</h1>
        </div>
        
        <div style="padding: 30px; background-color: #f9f9f9;">
          <h2 style="color: #333;">¡Hola ${customerName}!</h2>
          
          <p style="color: #666; line-height: 1.6;">
            Hemos recibido tu solicitud de cotización correctamente. 
            Nuestro equipo de asesores la está revisando y en breve se pondrán en contacto contigo.
          </p>
          
          <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #333;">
              <strong>Número de seguimiento:</strong> #${requestId}
            </p>
          </div>
          
          <p style="color: #666; line-height: 1.6;">
            Puedes hacer seguimiento de tu solicitud iniciando sesión en nuestro portal web.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" 
               style="background-color: #22c55e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Ver Mi Solicitud
            </a>
          </div>
          
          <p style="color: #666; font-size: 14px;">
            Si tienes alguna pregunta, no dudes en contactarnos:<br>
            📞 (443) 123-4567<br>
            📧 contacto@ferreterialamichoacana.com
          </p>
        </div>
        
        <div style="background-color: #333; color: white; padding: 20px; text-align: center; font-size: 12px;">
          <p style="margin: 0;">© 2024 Ferretería La Michoacana. Todos los derechos reservados.</p>
          <p style="margin: 5px 0 0 0;">Desarrollado por DINOS Tech</p>
        </div>
      </div>
    `
  }),

  // Notificación a vendedor de nueva asignación
  vendorAssignment: (vendorName: string, customerName: string, requestId: string) => ({
    subject: 'Nueva Solicitud Asignada - Ferretería La Michoacana',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #22c55e; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Nueva Asignación</h1>
        </div>
        
        <div style="padding: 30px; background-color: #f9f9f9;">
          <h2 style="color: #333;">¡Hola ${vendorName}!</h2>
          
          <p style="color: #666; line-height: 1.6;">
            Se te ha asignado una nueva solicitud de cotización para atender.
          </p>
          
          <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0 0 10px 0; color: #333;">
              <strong>Cliente:</strong> ${customerName}
            </p>
            <p style="margin: 0; color: #333;">
              <strong>Solicitud #:</strong> ${requestId}
            </p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/vendedor" 
               style="background-color: #22c55e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Ver Solicitud
            </a>
          </div>
          
          <p style="color: #666; line-height: 1.6;">
            Recuerda contactar al cliente lo antes posible para brindar el mejor servicio.
          </p>
        </div>
      </div>
    `
  }),

  // Notificación de nuevo ticket IT
  itTicketNotification: (ticketId: string, branchName: string, description: string) => ({
    subject: `Nuevo Ticket IT #${ticketId} - ${branchName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #f97316; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Nuevo Ticket IT</h1>
        </div>
        
        <div style="padding: 30px; background-color: #f9f9f9;">
          <h2 style="color: #333;">Nuevo Ticket de Soporte</h2>
          
          <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0 0 10px 0; color: #333;">
              <strong>Ticket #:</strong> ${ticketId}
            </p>
            <p style="margin: 0 0 10px 0; color: #333;">
              <strong>Sucursal:</strong> ${branchName}
            </p>
            <p style="margin: 0; color: #333;">
              <strong>Descripción:</strong> ${description}
            </p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/it" 
               style="background-color: #f97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Ver Ticket
            </a>
          </div>
        </div>
      </div>
    `
  }),

  // Confirmación de aplicación a empleo
  jobApplicationConfirmation: (applicantName: string, jobTitle: string, branchName: string) => ({
    subject: `Aplicación Recibida - ${jobTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #22c55e; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Ferretería La Michoacana</h1>
        </div>
        
        <div style="padding: 30px; background-color: #f9f9f9;">
          <h2 style="color: #333;">¡Gracias por tu interés, ${applicantName}!</h2>
          
          <p style="color: #666; line-height: 1.6;">
            Hemos recibido tu aplicación para la posición de <strong>${jobTitle}</strong> 
            en nuestra sucursal de ${branchName}.
          </p>
          
          <p style="color: #666; line-height: 1.6;">
            Nuestro equipo de Recursos Humanos revisará tu perfil y se pondrá en contacto 
            contigo en caso de que tu perfil sea seleccionado para continuar en el proceso.
          </p>
          
          <p style="color: #666; line-height: 1.6;">
            ¡Gracias por considerar formar parte de nuestro equipo!
          </p>
        </div>
      </div>
    `
  })
}

// Funciones de conveniencia para enviar emails específicos
export async function sendContactConfirmation(customerEmail: string, customerName: string, requestId: string) {
  const template = emailTemplates.contactConfirmation(customerName, requestId)
  return sendEmail({
    to: customerEmail,
    subject: template.subject,
    html: template.html
  })
}

export async function sendVendorAssignment(vendorEmail: string, vendorName: string, customerName: string, requestId: string) {
  const template = emailTemplates.vendorAssignment(vendorName, customerName, requestId)
  return sendEmail({
    to: vendorEmail,
    subject: template.subject,
    html: template.html
  })
}

export async function sendITTicketNotification(itEmail: string, ticketId: string, branchName: string, description: string) {
  const template = emailTemplates.itTicketNotification(ticketId, branchName, description)
  return sendEmail({
    to: itEmail,
    subject: template.subject,
    html: template.html
  })
}

export async function sendJobApplicationConfirmation(applicantEmail: string, applicantName: string, jobTitle: string, branchName: string) {
  const template = emailTemplates.jobApplicationConfirmation(applicantName, jobTitle, branchName)
  return sendEmail({
    to: applicantEmail,
    subject: template.subject,
    html: template.html
  })
}
import { Resend } from 'resend'
import { 
  contactConfirmationTemplate,
  vendorAssignmentTemplate,
  quotationSentTemplate,
  jobApplicationConfirmationTemplate,
  jobApplicationStatusTemplate,
  EmailTemplate
} from './templates'

// Inicializar Resend
const resend = new Resend(process.env.RESEND_API_KEY)

// Configuración base
const FROM_EMAIL = 'noreply@ferreteria-michoacana.com'
const REPLY_TO_EMAIL = 'contacto@ferreteria-michoacana.com'

// Interfaz para el resultado del envío
interface EmailResult {
  success: boolean
  messageId?: string
  error?: string
}

// Función genérica para enviar emails
async function sendEmail(
  to: string | string[],
  template: EmailTemplate,
  replyTo?: string
): Promise<EmailResult> {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: Array.isArray(to) ? to : [to],
      reply_to: replyTo || REPLY_TO_EMAIL,
      subject: template.subject,
      html: template.html,
      text: template.text,
    })

    if (error) {
      console.error('Error sending email:', error)
      return { success: false, error: error.message }
    }

    return { success: true, messageId: data?.id }
  } catch (error) {
    console.error('Email service error:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

// 1. Enviar confirmación de solicitud de contacto
export async function sendContactConfirmation(data: {
  clientEmail: string
  clientName: string
  trackingId: string
  companyName: string
  projectDescription: string
}): Promise<EmailResult> {
  const template = contactConfirmationTemplate({
    clientName: data.clientName,
    trackingId: data.trackingId,
    companyName: data.companyName,
    projectDescription: data.projectDescription
  })

  return sendEmail(data.clientEmail, template)
}

// 2. Notificar asignación de vendedor
export async function sendVendorAssignmentNotification(data: {
  clientEmail: string
  clientName: string
  vendorName: string
  vendorPhone: string
  vendorEmail: string
  trackingId: string
}): Promise<EmailResult> {
  const template = vendorAssignmentTemplate({
    clientName: data.clientName,
    vendorName: data.vendorName,
    vendorPhone: data.vendorPhone,
    vendorEmail: data.vendorEmail,
    trackingId: data.trackingId
  })

  return sendEmail(data.clientEmail, template, data.vendorEmail)
}

// 3. Enviar cotización por email
export async function sendQuotationEmail(data: {
  clientEmail: string
  clientName: string
  quotationNumber: string
  vendorName: string
  vendorEmail: string
  total: number
  validUntil: string
  items: Array<{ name: string; quantity: number; price: number }>
}): Promise<EmailResult> {
  const template = quotationSentTemplate({
    clientName: data.clientName,
    quotationNumber: data.quotationNumber,
    vendorName: data.vendorName,
    total: data.total,
    validUntil: data.validUntil,
    items: data.items
  })

  return sendEmail(data.clientEmail, template, data.vendorEmail)
}

// 4. Confirmar aplicación de empleo
export async function sendJobApplicationConfirmation(data: {
  applicantEmail: string
  applicantName: string
  jobTitle: string
  branchName: string
  applicationId: string
}): Promise<EmailResult> {
  const template = jobApplicationConfirmationTemplate({
    applicantName: data.applicantName,
    jobTitle: data.jobTitle,
    branchName: data.branchName,
    applicationId: data.applicationId
  })

  return sendEmail(data.applicantEmail, template)
}

// 5. Actualizar estado de aplicación
export async function sendJobApplicationStatusUpdate(data: {
  applicantEmail: string
  applicantName: string
  jobTitle: string
  status: string
  notes?: string
}): Promise<EmailResult> {
  const template = jobApplicationStatusTemplate({
    applicantName: data.applicantName,
    jobTitle: data.jobTitle,
    status: data.status,
    notes: data.notes
  })

  return sendEmail(data.applicantEmail, template)
}

// 6. Notificaciones internas para el equipo
export async function sendInternalNotification(data: {
  to: string | string[]
  subject: string
  message: string
  priority?: 'low' | 'normal' | 'high'
}): Promise<EmailResult> {
  const priorityColors = {
    low: '#10b981',
    normal: '#3b82f6', 
    high: '#ef4444'
  }

  const template: EmailTemplate = {
    subject: `[${data.priority?.toUpperCase() || 'NORMAL'}] ${data.subject}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: ${priorityColors[data.priority || 'normal']}; color: white; padding: 20px; text-align: center;">
          <h2>Notificación Interna</h2>
          <p>Ferretería La Michoacana</p>
        </div>
        <div style="padding: 30px; background: #f9f9f9;">
          <h3>${data.subject}</h3>
          <div style="background: white; padding: 20px; border-radius: 5px;">
            ${data.message.replace(/\n/g, '<br>')}
          </div>
          <p style="margin-top: 20px; font-size: 14px; color: #666;">
            Esta es una notificación automática del sistema.
          </p>
        </div>
      </div>
    `,
    text: `${data.subject}\n\n${data.message}\n\nFerretería La Michoacana - Notificación automática`
  }

  return sendEmail(data.to, template)
}

// 7. Función para envío masivo (newsletters, promociones)
export async function sendBulkEmail(data: {
  recipients: string[]
  subject: string
  htmlContent: string
  textContent: string
  batchSize?: number
}): Promise<{ success: boolean; results: EmailResult[] }> {
  const batchSize = data.batchSize || 50 // Enviar en lotes para evitar límites
  const results: EmailResult[] = []
  
  // Dividir en lotes
  for (let i = 0; i < data.recipients.length; i += batchSize) {
    const batch = data.recipients.slice(i, i + batchSize)
    
    const template: EmailTemplate = {
      subject: data.subject,
      html: data.htmlContent,
      text: data.textContent
    }
    
    try {
      const result = await sendEmail(batch, template)
      results.push(result)
      
      // Pausa entre lotes para evitar rate limiting
      if (i + batchSize < data.recipients.length) {
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    } catch (error) {
      results.push({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Batch send failed' 
      })
    }
  }
  
  const successCount = results.filter(r => r.success).length
  return {
    success: successCount > 0,
    results
  }
}
// Plantillas de email para el sistema
export interface EmailTemplate {
  subject: string
  html: string
  text: string
}

// Datos base de la empresa
const COMPANY_INFO = {
  name: 'Ferretería La Michoacana',
  website: 'https://ferreteria-michoacana.com',
  phone: '(443) 123-4567',
  email: 'contacto@ferreteria-michoacana.com',
  address: 'Av. Principal #123, Morelia, Michoacán'
}

// Estilos CSS para emails
const EMAIL_STYLES = `
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #16a34a; color: white; padding: 20px; text-align: center; }
    .content { padding: 30px 20px; background: #f9f9f9; }
    .footer { background: #374151; color: white; padding: 20px; text-align: center; font-size: 14px; }
    .button { display: inline-block; background: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 10px 0; }
    .highlight { background: #fef3c7; padding: 15px; border-left: 4px solid #f59e0b; margin: 20px 0; }
    .table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    .table th, .table td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
    .table th { background: #f3f4f6; }
  </style>
`

// Plantilla base para todos los emails
const createBaseTemplate = (content: string, title: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  ${EMAIL_STYLES}
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${COMPANY_INFO.name}</h1>
      <p>Tu ferretería de confianza</p>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <p><strong>${COMPANY_INFO.name}</strong></p>
      <p>${COMPANY_INFO.address}</p>
      <p>Teléfono: ${COMPANY_INFO.phone} | Email: ${COMPANY_INFO.email}</p>
      <p>Visítanos en: ${COMPANY_INFO.website}</p>
    </div>
  </div>
</body>
</html>
`

// 1. Confirmación de solicitud de contacto
export const contactConfirmationTemplate = (data: {
  clientName: string
  trackingId: string
  companyName: string
  projectDescription: string
}): EmailTemplate => {
  const content = `
    <h2>¡Gracias por contactarnos!</h2>
    <p>Estimado/a <strong>${data.clientName}</strong>,</p>
    <p>Hemos recibido tu solicitud de cotización y queremos confirmarte que está siendo procesada por nuestro equipo especializado.</p>
    
    <div class="highlight">
      <h3>Detalles de tu solicitud:</h3>
      <p><strong>ID de seguimiento:</strong> ${data.trackingId}</p>
      <p><strong>Empresa:</strong> ${data.companyName}</p>
      <p><strong>Proyecto:</strong> ${data.projectDescription}</p>
    </div>
    
    <h3>¿Qué sigue?</h3>
    <ul>
      <li>Nuestro equipo revisará tu solicitud en las próximas 2 horas</li>
      <li>Un vendedor especializado se pondrá en contacto contigo</li>
      <li>Recibirás una cotización personalizada para tu proyecto</li>
    </ul>
    
    <p>Puedes usar el ID <strong>${data.trackingId}</strong> para dar seguimiento a tu solicitud.</p>
    <p>Si tienes alguna pregunta urgente, no dudes en contactarnos al ${COMPANY_INFO.phone}.</p>
  `
  
  return {
    subject: `Confirmación de solicitud - ${data.trackingId}`,
    html: createBaseTemplate(content, 'Confirmación de Solicitud'),
    text: `Gracias por contactarnos, ${data.clientName}. Tu solicitud ${data.trackingId} ha sido recibida y será procesada pronto.`
  }
}

// 2. Notificación de asignación de vendedor
export const vendorAssignmentTemplate = (data: {
  clientName: string
  vendorName: string
  vendorPhone: string
  vendorEmail: string
  trackingId: string
}): EmailTemplate => {
  const content = `
    <h2>Tu solicitud ha sido asignada</h2>
    <p>Estimado/a <strong>${data.clientName}</strong>,</p>
    <p>Nos complace informarte que tu solicitud <strong>${data.trackingId}</strong> ha sido asignada a uno de nuestros vendedores especializados.</p>
    
    <div class="highlight">
      <h3>Tu vendedor asignado:</h3>
      <p><strong>Nombre:</strong> ${data.vendorName}</p>
      <p><strong>Teléfono:</strong> ${data.vendorPhone}</p>
      <p><strong>Email:</strong> ${data.vendorEmail}</p>
    </div>
    
    <p>${data.vendorName} se pondrá en contacto contigo muy pronto para:</p>
    <ul>
      <li>Revisar los detalles de tu proyecto</li>
      <li>Aclarar cualquier duda que puedas tener</li>
      <li>Preparar una cotización personalizada</li>
    </ul>
    
    <p>También puedes contactar directamente a ${data.vendorName} si tienes alguna pregunta.</p>
  `
  
  return {
    subject: `Vendedor asignado - ${data.trackingId}`,
    html: createBaseTemplate(content, 'Vendedor Asignado'),
    text: `Tu solicitud ${data.trackingId} ha sido asignada a ${data.vendorName}. Contacto: ${data.vendorPhone}`
  }
}

// 3. Envío de cotización
export const quotationSentTemplate = (data: {
  clientName: string
  quotationNumber: string
  vendorName: string
  total: number
  validUntil: string
  items: Array<{ name: string; quantity: number; price: number }>
}): EmailTemplate => {
  const itemsTable = data.items.map(item => 
    `<tr><td>${item.name}</td><td>${item.quantity}</td><td>$${item.price.toLocaleString()}</td></tr>`
  ).join('')
  
  const content = `
    <h2>Tu cotización está lista</h2>
    <p>Estimado/a <strong>${data.clientName}</strong>,</p>
    <p><strong>${data.vendorName}</strong> ha preparado una cotización personalizada para tu proyecto.</p>
    
    <div class="highlight">
      <h3>Cotización ${data.quotationNumber}</h3>
      <p><strong>Total:</strong> $${data.total.toLocaleString()}</p>
      <p><strong>Válida hasta:</strong> ${data.validUntil}</p>
    </div>
    
    <h3>Productos cotizados:</h3>
    <table class="table">
      <thead>
        <tr><th>Producto</th><th>Cantidad</th><th>Precio</th></tr>
      </thead>
      <tbody>
        ${itemsTable}
      </tbody>
    </table>
    
    <p>Para aceptar esta cotización o solicitar modificaciones, puedes:</p>
    <ul>
      <li>Responder a este email</li>
      <li>Contactar directamente a ${data.vendorName}</li>
      <li>Llamarnos al ${COMPANY_INFO.phone}</li>
    </ul>
    
    <p><em>Esta cotización es válida hasta el ${data.validUntil}.</em></p>
  `
  
  return {
    subject: `Cotización ${data.quotationNumber} - ${COMPANY_INFO.name}`,
    html: createBaseTemplate(content, 'Cotización Lista'),
    text: `Tu cotización ${data.quotationNumber} por $${data.total.toLocaleString()} está lista. Válida hasta ${data.validUntil}.`
  }
}

// 4. Confirmación de aplicación de empleo
export const jobApplicationConfirmationTemplate = (data: {
  applicantName: string
  jobTitle: string
  branchName: string
  applicationId: string
}): EmailTemplate => {
  const content = `
    <h2>¡Aplicación recibida exitosamente!</h2>
    <p>Estimado/a <strong>${data.applicantName}</strong>,</p>
    <p>Gracias por tu interés en formar parte de nuestro equipo. Hemos recibido tu aplicación para la posición de <strong>${data.jobTitle}</strong> en nuestra sucursal de <strong>${data.branchName}</strong>.</p>
    
    <div class="highlight">
      <h3>Detalles de tu aplicación:</h3>
      <p><strong>ID de aplicación:</strong> ${data.applicationId}</p>
      <p><strong>Posición:</strong> ${data.jobTitle}</p>
      <p><strong>Sucursal:</strong> ${data.branchName}</p>
    </div>
    
    <h3>Próximos pasos:</h3>
    <ul>
      <li>Nuestro equipo de RRHH revisará tu aplicación en las próximas 48 horas</li>
      <li>Te contactaremos por email o teléfono si tu perfil es seleccionado</li>
      <li>Mantén tu teléfono disponible para posibles llamadas</li>
    </ul>
    
    <p>Puedes usar el ID <strong>${data.applicationId}</strong> para consultas sobre tu aplicación.</p>
    <p>¡Gracias por considerar ${COMPANY_INFO.name} como tu próximo lugar de trabajo!</p>
  `
  
  return {
    subject: `Aplicación recibida - ${data.jobTitle}`,
    html: createBaseTemplate(content, 'Aplicación Recibida'),
    text: `Gracias ${data.applicantName}. Tu aplicación ${data.applicationId} para ${data.jobTitle} ha sido recibida.`
  }
}

// 5. Actualización de estado de aplicación
export const jobApplicationStatusTemplate = (data: {
  applicantName: string
  jobTitle: string
  status: string
  notes?: string
}): EmailTemplate => {
  const statusMessages = {
    'revisada': 'Tu aplicación ha sido revisada por nuestro equipo de RRHH.',
    'entrevista': '¡Felicidades! Has sido seleccionado/a para una entrevista.',
    'contratada': '¡Excelentes noticias! Has sido seleccionado/a para el puesto.',
    'rechazada': 'Después de una cuidadosa revisión, hemos decidido continuar con otros candidatos.'
  }
  
  const content = `
    <h2>Actualización de tu aplicación</h2>
    <p>Estimado/a <strong>${data.applicantName}</strong>,</p>
    <p>Queremos informarte sobre el estado de tu aplicación para la posición de <strong>${data.jobTitle}</strong>.</p>
    
    <div class="highlight">
      <h3>Estado actual: ${data.status.toUpperCase()}</h3>
      <p>${statusMessages[data.status as keyof typeof statusMessages]}</p>
      ${data.notes ? `<p><strong>Comentarios:</strong> ${data.notes}</p>` : ''}
    </div>
    
    ${data.status === 'entrevista' ? `
      <h3>Próximos pasos:</h3>
      <ul>
        <li>Nuestro equipo se pondrá en contacto contigo para programar la entrevista</li>
        <li>Prepara preguntas sobre la posición y la empresa</li>
        <li>Mantén actualizada tu información de contacto</li>
      </ul>
    ` : ''}
    
    ${data.status === 'contratada' ? `
      <h3>¡Bienvenido/a al equipo!</h3>
      <ul>
        <li>Nuestro equipo de RRHH te contactará con los siguientes pasos</li>
        <li>Prepara tu documentación personal</li>
        <li>Estamos emocionados de tenerte en nuestro equipo</li>
      </ul>
    ` : ''}
    
    <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
  `
  
  return {
    subject: `Actualización de aplicación - ${data.jobTitle}`,
    html: createBaseTemplate(content, 'Actualización de Aplicación'),
    text: `${data.applicantName}, tu aplicación para ${data.jobTitle} está ahora en estado: ${data.status}.`
  }
}
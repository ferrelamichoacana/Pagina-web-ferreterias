import React from 'react'
import { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Política de Privacidad - Ferretería La Michoacana',
  description: 'Política de privacidad y protección de datos personales',
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm border p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
              Política de Privacidad y Protección de Datos
            </h1>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-600 mb-6">
                <strong>Última actualización:</strong> {new Date().toLocaleDateString('es-MX')}
              </p>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Información General</h2>
                <p className="text-gray-700 mb-4">
                  Ferretería La Michoacana se compromete a proteger la privacidad y los datos personales 
                  de nuestros usuarios, clientes y visitantes del sitio web, en cumplimiento con la 
                  Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP).
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Datos que Recopilamos</h2>
                <p className="text-gray-700 mb-4">Recopilamos los siguientes tipos de información:</p>
                <ul className="list-disc pl-6 text-gray-700 mb-4">
                  <li>Información de contacto (nombre, email, teléfono, dirección)</li>
                  <li>Información de la empresa (nombre de empresa, giro comercial)</li>
                  <li>Información profesional (CV, experiencia laboral, educación)</li>
                  <li>Información técnica (dirección IP, navegador, dispositivo)</li>
                  <li>Cookies y tecnologías similares</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Uso de la Información</h2>
                <p className="text-gray-700 mb-4">Utilizamos sus datos personales para:</p>
                <ul className="list-disc pl-6 text-gray-700 mb-4">
                  <li>Procesar solicitudes de cotización y contacto</li>
                  <li>Gestionar aplicaciones de empleo y procesos de selección</li>
                  <li>Enviar newsletters y comunicaciones comerciales (con su consentimiento)</li>
                  <li>Mejorar nuestros servicios y experiencia del usuario</li>
                  <li>Cumplir con obligaciones legales y regulatorias</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Compartir Información</h2>
                <p className="text-gray-700 mb-4">
                  No vendemos, alquilamos ni compartimos sus datos personales con terceros, 
                  excepto en los siguientes casos:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-4">
                  <li>Con su consentimiento explícito</li>
                  <li>Para cumplir con obligaciones legales</li>
                  <li>Con proveedores de servicios que nos ayudan a operar nuestro negocio</li>
                  <li>En caso de fusión, adquisición o venta de activos</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Seguridad de los Datos</h2>
                <p className="text-gray-700 mb-4">
                  Implementamos medidas de seguridad técnicas, físicas y administrativas apropiadas 
                  para proteger sus datos personales contra acceso no autorizado, alteración, 
                  divulgación o destrucción.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Sus Derechos (Derechos ARCO)</h2>
                <p className="text-gray-700 mb-4">Usted tiene derecho a:</p>
                <ul className="list-disc pl-6 text-gray-700 mb-4">
                  <li><strong>Acceder</strong> a sus datos personales</li>
                  <li><strong>Rectificar</strong> datos inexactos o incompletos</li>
                  <li><strong>Cancelar</strong> sus datos cuando no sean necesarios</li>
                  <li><strong>Oponerse</strong> al tratamiento de sus datos</li>
                  <li><strong>Revocar</strong> su consentimiento en cualquier momento</li>
                </ul>
                <p className="text-gray-700 mb-4">
                  Para ejercer estos derechos, contáctenos en: 
                  <a href="mailto:privacidad@ferreterialamichoacana.com" className="text-primary-600 hover:text-primary-700">
                    privacidad@ferreterialamichoacana.com
                  </a>
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Cookies</h2>
                <p className="text-gray-700 mb-4">
                  Utilizamos cookies y tecnologías similares para mejorar la funcionalidad del sitio, 
                  analizar el tráfico y personalizar el contenido. Puede configurar su navegador 
                  para rechazar cookies, aunque esto puede afectar la funcionalidad del sitio.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Retención de Datos</h2>
                <p className="text-gray-700 mb-4">
                  Conservamos sus datos personales solo durante el tiempo necesario para cumplir 
                  con los fines para los que fueron recopilados, o según lo requiera la ley.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Menores de Edad</h2>
                <p className="text-gray-700 mb-4">
                  Nuestros servicios no están dirigidos a menores de 18 años. No recopilamos 
                  intencionalmente datos personales de menores sin el consentimiento de los padres.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Cambios a esta Política</h2>
                <p className="text-gray-700 mb-4">
                  Podemos actualizar esta política de privacidad ocasionalmente. Le notificaremos 
                  sobre cambios significativos publicando la nueva política en nuestro sitio web.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Contacto</h2>
                <p className="text-gray-700 mb-4">
                  Si tiene preguntas sobre esta política de privacidad, contáctenos:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700 mb-2">
                    <strong>Ferretería La Michoacana</strong>
                  </p>
                  <p className="text-gray-700 mb-2">
                    Email: privacidad@ferreterialamichoacana.com
                  </p>
                  <p className="text-gray-700 mb-2">
                    Teléfono: (443) 123-4567
                  </p>
                  <p className="text-gray-700">
                    Dirección: Av. Madero #123, Centro Histórico, Morelia, Michoacán
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
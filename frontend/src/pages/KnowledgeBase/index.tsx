import SEO from '../../components/SEO';
import Section from '../../components/Section';
import { organizationSchema, faqSchema } from '../../utils/structuredData';
import styles from './KnowledgeBase.module.css';

const KnowledgeBase = () => {
  const faqs = [
    {
      question: "¿Cuáles son los horarios de atención?",
      answer: "Nuestros horarios de atención son de lunes a viernes de 8:30 AM a 3:30 PM."
    },
    {
      question: "¿Qué documentos necesito para cambiar divisas?",
      answer: "Para realizar cambio de divisas necesitas presentar tu cédula de identidad vigente o pasaporte."
    },
    {
      question: "¿Cómo puedo recibir una remesa internacional?",
      answer: "Puedes recibir remesas a través de nuestros aliados B89, Papaya, TSG y Panamericash. Solo necesitas el código de la transacción y tu identificación."
    }
  ];

  return (
    <>
      <SEO
        title="Base de Conocimiento Completa"
        description="Base de conocimiento completa de Taller360: toda la información sobre servicios, políticas, procedimientos, aliados, contacto y documentación legal."
        keywords="casa de cambio venezuela, remesas venezuela, cambio de divisas, pago móvil, B89, Papaya, TSG, Panamericash, SUDEBAN, tipos de cambio, información completa, documentación"
        canonical="/knowledge-base"
        ogImage="/images/sections/conexion.webp"
        ogImageAlt="Base de Conocimiento - Taller360"
        ogType="article"
        structuredData={[organizationSchema, faqSchema(faqs)]}
      />

      <Section className={styles.knowledgeBase}>
        <div className="container">
          <article className={styles.content}>
            {/* Header */}
            <header className={styles.header}>
              <h1>Base de Conocimiento Completa - Taller360</h1>
              <p className={styles.subtitle}>
                Información exhaustiva sobre todos nuestros servicios, políticas, procedimientos y documentación legal
              </p>
              <p className={styles.lastUpdated}>
                Última actualización: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </header>

            {/* Quick Reference */}
            <section className={styles.section} id="referencia-rapida">
              <h2>Información Esencial</h2>

              <div className={styles.quickInfo}>
                <div className={styles.infoGrid}>
                  <div className={styles.infoCard}>
                    <h3>Contacto</h3>
                    <p><strong>WhatsApp/Teléfono:</strong> <a href="https://wa.me/584142093083">+58 414-2093083</a></p>
                    <p><strong>Email:</strong> <a href="mailto:operaciones@taller360.local">operaciones@taller360.local</a></p>
                  </div>

                  <div className={styles.infoCard}>
                    <h3>Horario</h3>
                    <p><strong>Lunes a Viernes:</strong> 8:30 AM - 3:30 PM</p>
                    <p><strong>Sábados y Domingos:</strong> Cerrado</p>
                  </div>

                  <div className={styles.infoCard}>
                    <h3>Ubicación</h3>
                    <p>Av. Francisco de Miranda, Torre Seguros Sudamerica, Local PB-7</p>
                    <p>El Rosal, Chacao, Caracas</p>
                  </div>

                  <div className={styles.infoCard}>
                    <h3>Tasas Referenciales</h3>
                    <p><strong>USD:</strong> Bs. 160,4479</p>
                    <p><strong>EUR:</strong> Bs. 188,0289</p>
                    <p><small>(Actualizado: 19/09/2025)</small></p>
                  </div>
                </div>
              </div>
            </section>

            {/* Company Information */}
            <section className={styles.section} id="informacion-empresa">
              <h2>Información de la Empresa</h2>

              <div className={styles.subsection}>
                <h3>Datos Generales</h3>
                <dl className={styles.dataList}>
                  <dt>Nombre Legal:</dt>
                  <dd>Taller360, S.A. / Taller360, C.A.</dd>

                  <dt>RIF:</dt>
                  <dd>J-123456789</dd>

                  <dt>Tipo de Negocio:</dt>
                  <dd>Casa de cambio autorizada</dd>

                  <dt>Autorización:</dt>
                  <dd>SUDEBAN (Superintendencia de las Instituciones del Sector Bancario)</dd>

                  <dt>Años de Experiencia:</dt>
                  <dd>Más de 35 años en el sector cambiario venezolano</dd>

                  <dt>Año de Fundación:</dt>
                  <dd>1988 (actualizado en timeline: 2003)</dd>

                  <dt>Sitio Web:</dt>
                  <dd><a href="https://taller360.local">https://taller360.local</a></dd>
                </dl>
              </div>

              <div className={styles.subsection}>
                <h3>Misión</h3>
                <p>
                  Proporcionar servicios de cambio de divisas y transferencias internacionales seguros,
                  transparentes y convenientes, superando las expectativas de nuestros clientes y
                  contribuyendo al desarrollo económico del país.
                </p>
              </div>

              <div className={styles.subsection}>
                <h3>Visión</h3>
                <p>
                  Ser la casa de cambio digital líder en Venezuela y la región, reconocida por nuestra
                  innovación tecnológica, compromiso con el cliente y contribución al crecimiento
                  económico sostenible.
                </p>
              </div>

              <div className={styles.subsection}>
                <h3>Valores Corporativos</h3>
                <ul>
                  <li><strong>Profesionalismo:</strong> Servicio de calidad con personal altamente capacitado</li>
                  <li><strong>Transparencia:</strong> Información clara y honesta sobre tasas, comisiones y procesos</li>
                  <li><strong>Responsabilidad:</strong> Cumplimiento normativo, ético y compromiso con nuestros clientes</li>
                </ul>
              </div>

              <div className={styles.subsection}>
                <h3>Historia y Recorrido</h3>

                <h4>2003: Fundación</h4>
                <p>Nacimos con la visión de revolucionar el mercado cambiario venezolano</p>

                <h4>2010: Expansión</h4>
                <p>Ampliamos nuestros servicios a transferencias internacionales</p>

                <h4>2018: Digitalización</h4>
                <p>Implementamos plataformas digitales para mayor conveniencia</p>

                <h4>2023: Liderazgo</h4>
                <p>Consolidamos nuestra posición como líderes en el sector</p>
              </div>

              <div className={styles.subsection}>
                <h3>Contacto</h3>
                <dl className={styles.dataList}>
                  <dt>Teléfono / WhatsApp Principal:</dt>
                  <dd><a href="https://wa.me/584142093083">+58 414-2093083</a></dd>

                  <dt>Teléfono Alternativo:</dt>
                  <dd>+58 (212) 123-4567</dd>

                  <dt>Correo Electrónico Principal:</dt>
                  <dd><a href="mailto:operaciones@taller360.local">operaciones@taller360.local</a></dd>

                  <dt>Correo Electrónico Alternativo:</dt>
                  <dd><a href="mailto:info@taller360.local">info@taller360.local</a></dd>

                  <dt>Sitio Web:</dt>
                  <dd><a href="https://taller360.local">https://taller360.local</a></dd>
                </dl>
              </div>

              <div className={styles.subsection}>
                <h3>Ubicación Física</h3>
                <address className={styles.address}>
                  <p><strong>Dirección Completa:</strong></p>
                  <p>Avenida Francisco de Miranda</p>
                  <p>Torre Seguros Sudamerica, Local PB-7</p>
                  <p>Urbanización El Rosal, Municipio Chacao</p>
                  <p>Caracas, Venezuela</p>
                </address>
              </div>

              <div className={styles.subsection}>
                <h3>Horario de Atención</h3>
                <dl className={styles.dataList}>
                  <dt>Lunes a Viernes:</dt>
                  <dd>8:30 AM - 3:30 PM</dd>

                  <dt>Sábados y Domingos:</dt>
                  <dd>Cerrado</dd>
                </dl>
              </div>
            </section>

            {/* Services */}
            <section className={styles.section} id="servicios">
              <h2>Servicios Completos</h2>

              <div className={styles.subsection}>
                <h3>1. Cambio de Divisas</h3>
                <p>Compra y venta de divisas extranjeras en Venezuela, 100% legal y autorizado por SUDEBAN.</p>
                <ul>
                  <li>Compra y venta de Dólares Estadounidenses (USD)</li>
                  <li>Compra y venta de Euros (EUR)</li>
                  <li>Operaciones autorizadas por el Banco Central de Venezuela</li>
                  <li>Tasas competitivas actualizadas diariamente según mercado</li>
                  <li>Transparencia total en cada transacción</li>
                </ul>
              </div>

              <div className={styles.subsection}>
                <h3>2. Recepción de Remesas Internacionales</h3>
                <p>Conectamos a Venezuela con el mundo. Recibe dinero desde 13 países.</p>
                <ul>
                  <li><strong>Cobertura:</strong> 13 países</li>
                  <li><strong>Procesamiento rápido:</strong> Fondos disponibles en minutos</li>
                  <li><strong>Seguro y legal:</strong> Autorizado por SUDEBAN</li>
                  <li><strong>Aliados confiables:</strong> B89, Papaya, TSG, Panamericash</li>
                  <li><strong>Sin complicaciones:</strong> Solo necesitas cédula y código de seguimiento</li>
                </ul>
              </div>

              <div className={styles.subsection}>
                <h3>3. Métodos de Dispersión de Fondos</h3>
                <p>Tres formas de recibir tu dinero, tú eliges la que más te convenga:</p>

                <h4>Pago Móvil (Opción Más Rápida)</h4>
                <ul>
                  <li>Transferencia directa a tu cuenta bancaria venezolana</li>
                  <li>Mediante el sistema de pago móvil venezolano</li>
                  <li>Procesamiento instantáneo</li>
                  <li>La opción más popular entre nuestros clientes</li>
                  <li>Sin necesidad de visitar oficina física</li>
                </ul>

                <h4>Crédito Inmediato</h4>
                <ul>
                  <li>Transferencia bancaria directa a tu cuenta</li>
                  <li>Procesamiento rápido y seguro</li>
                  <li>Sin necesidad de desplazamiento</li>
                  <li>Ideal para montos mayores</li>
                </ul>

                <h4>Retiro Físico en Efectivo</h4>
                <ul>
                  <li>Retira dinero en efectivo en nuestra oficina de Caracas</li>
                  <li>Ubicación: Av. Francisco de Miranda, Torre Seguros Sudamerica, Local PB-7</li>
                  <li>Horario: Lunes a viernes 8:30 AM - 3:30 PM</li>
                  <li>Requisitos: Cédula de identidad vigente + código de seguimiento</li>
                  <li>Sin comisión adicional por retiro en oficina</li>
                </ul>
              </div>

              <div className={styles.subsection}>
                <h3>Beneficios de Nuestros Servicios</h3>

                <h4>Rapidez y Eficiencia</h4>
                <p>Nuestras operaciones son rápidas y directas. Las remesas están disponibles en minutos.</p>

                <h4>Legalidad y Respaldo</h4>
                <p>Operamos 100% dentro del marco legal venezolano, autorizados por SUDEBAN, garantizando tu tranquilidad y seguridad.</p>

                <h4>Conexión Global</h4>
                <p>Gracias a nuestros aliados internacionales (B89, Papaya, TSG, Panamericash), conectamos a Venezuela con 13 países en el mundo.</p>

                <h4>Comodidad Total</h4>
                <p>Elije entre opciones digitales (Pago Móvil, Crédito Inmediato) o presenciales (Retiro Físico) para tus transacciones según tu conveniencia.</p>
              </div>
            </section>

            {/* Exchange Rates */}
            <section className={styles.section} id="tasas-cambio">
              <h2>Tasas de Cambio</h2>

              <div className={styles.important}>
                <p>
                  <strong>Importante:</strong> Las tasas mostradas son referenciales y pueden variar según las condiciones del mercado.
                  Para conocer la tasa exacta aplicable a tu transacción, contáctanos directamente.
                </p>
              </div>

              <div className={styles.subsection}>
                <h3>Tasas de Referencia</h3>
                <p><em>Actualización: 19 de septiembre de 2025</em></p>
                <dl className={styles.dataList}>
                  <dt>Dólar Estadounidense (USD):</dt>
                  <dd>Bs. 160,4479</dd>

                  <dt>Euro (EUR):</dt>
                  <dd>Bs. 188,0289</dd>
                </dl>
              </div>

              <div className={styles.subsection}>
                <h3>Política de Tasas</h3>
                <ul>
                  <li>Las tasas son determinadas por Taller360</li>
                  <li>Varían según las condiciones del mercado cambiario</li>
                  <li>Se actualizan diariamente</li>
                  <li>Las tasas publicadas en el sitio web son referenciales</li>
                  <li>Pueden cambiar sin previo aviso</li>
                  <li>La tasa aplicable será la vigente al momento de completar la transacción</li>
                  <li>Siempre confirmamos la tasa antes de procesar cualquier operación</li>
                </ul>
              </div>

              <div className={styles.subsection}>
                <h3>Cómo Consultar Tasas Actuales</h3>
                <p>Para conocer la tasa exacta vigente para tu operación:</p>
                <ul>
                  <li>WhatsApp: <a href="https://wa.me/584142093083">+58 414-2093083</a></li>
                  <li>Email: <a href="mailto:operaciones@taller360.local">operaciones@taller360.local</a></li>
                  <li>Teléfono: +58 (212) 123-4567</li>
                  <li>Visita nuestra oficina en horario de atención</li>
                </ul>
              </div>
            </section>

            {/* Partners */}
            <section className={styles.section} id="aliados">
              <h2>Aliados Internacionales</h2>
              <p>
                Trabajamos de la mano con reconocidos aliados internacionales para asegurar que cada remesa
                llegue de forma rápida, legal y segura a su destino.
              </p>

              <div className={styles.subsection}>
                <h3>B89</h3>
                <p>
                  A través de nuestro aliado B89 proporcionamos a nuestros clientes un servicio de fácil acceso
                  para enviar y recibir remesas desde y hacia Venezuela.
                </p>
                <p><strong>Países disponibles con B89:</strong></p>
                <ul>
                  <li>🇵🇪 Perú</li>
                  <li>🇩🇪 Alemania</li>
                  <li>🇪🇸 España</li>
                  <li>🇫🇷 Francia</li>
                  <li>🇦🇷 Argentina</li>
                  <li>🇨🇴 Colombia</li>
                  <li>🇨🇱 Chile</li>
                  <li>🇪🇨 Ecuador</li>
                  <li>🇲🇽 México</li>
                </ul>
              </div>

              <div className={styles.subsection}>
                <h3>Papaya</h3>
                <p>
                  Nuestro aliado Papaya ofrece una experiencia de pago rápida, moderna y accesible.
                  Papaya le permite a los clientes de Taller360 una alternativa a los servicios de transferencias tradicionales,
                  facilitando los pagos de manera rápida y con un bajo costo entre usuarios de diferentes regiones.
                </p>
                <p><strong>Países disponibles con Papaya:</strong></p>
                <ul>
                  <li>🇲🇽 México</li>
                  <li>🇨🇦 Canadá</li>
                  <li>🇨🇱 Chile</li>
                  <li>🇨🇴 Colombia</li>
                  <li>🇨🇷 Costa Rica</li>
                  <li>🇪🇨 Ecuador</li>
                  <li>🇵🇪 Perú</li>
                  <li>🇺🇸 Estados Unidos</li>
                </ul>
              </div>

              <div className={styles.subsection}>
                <h3>TSG</h3>
                <p>
                  A través de TSG facilitamos el envío de remesas desde España hacia Venezuela de manera segura y confiable.
                </p>
                <p><strong>País disponible con TSG:</strong></p>
                <ul>
                  <li>🇪🇸 España</li>
                </ul>
              </div>

              <div className={styles.subsection}>
                <h3>Panamericash</h3>
                <p>
                  Panamericash es nuestro aliado para recibir remesas desde Panamá hacia Venezuela de forma rápida y segura.
                </p>
                <p><strong>País disponible con Panamericash:</strong></p>
                <ul>
                  <li>🇵🇦 Panamá</li>
                </ul>
              </div>

              <div className={styles.subsection}>
                <h3>Cobertura Total</h3>
                <p>
                  Gracias a nuestra red de aliados internacionales, puedes recibir dinero desde
                  <strong> 13 países</strong> alrededor del mundo:
                </p>
                <ul>
                  <li>🇲🇽 México</li>
                  <li>🇨🇦 Canadá</li>
                  <li>🇨🇱 Chile</li>
                  <li>🇨🇴 Colombia</li>
                  <li>🇨🇷 Costa Rica</li>
                  <li>🇪🇨 Ecuador</li>
                  <li>🇵🇦 Panamá</li>
                  <li>🇵🇪 Perú</li>
                  <li>🇺🇸 Estados Unidos</li>
                  <li>🇩🇪 Alemania</li>
                  <li>🇪🇸 España</li>
                  <li>🇫🇷 Francia</li>
                  <li>🇦🇷 Argentina</li>
                </ul>
              </div>
            </section>

            {/* Requirements */}
            <section className={styles.section} id="requisitos">
              <h2>Requisitos</h2>

              <div className={styles.subsection}>
                <h3>Para Recibir Remesas</h3>
                <p>Es muy sencillo, solo necesitas:</p>
                <ul>
                  <li><strong>Cédula de identidad venezolana vigente</strong></li>
                  <li><strong>Código de seguimiento</strong> (proporcionado por quien envía el dinero)</li>
                </ul>
                <p className={styles.important}>
                  ¡Eso es todo! Con estos dos requisitos puedes recibir tu remesa.
                </p>
              </div>

              <div className={styles.subsection}>
                <h3>Para Cambio de Divisas</h3>
                <ul>
                  <li>Ser mayor de 18 años</li>
                  <li>Poseer cédula de identidad venezolana vigente</li>
                  <li>Proporcionar información veraz y actualizada</li>
                  <li>Cumplir con los requisitos de prevención de lavado de dinero (LC/FT/FPADM)</li>
                </ul>
              </div>

              <div className={styles.subsection}>
                <h3>Para Retiro en Oficina</h3>
                <ul>
                  <li>Cédula de identidad venezolana original</li>
                  <li>Código de seguimiento de la remesa</li>
                  <li>Acudir en horario de atención (Lunes a Viernes 8:30 AM - 3:30 PM)</li>
                </ul>
              </div>
            </section>

            {/* Processing Time & Fees */}
            <section className={styles.section} id="procesamiento-comisiones">
              <h2>Tiempo de Procesamiento y Comisiones</h2>

              <div className={styles.subsection}>
                <h3>Tiempo de Procesamiento</h3>
                <ul>
                  <li>Las remesas generalmente están disponibles <strong>en minutos</strong> después de ser enviadas</li>
                  <li>El tiempo exacto depende del método de envío y el país de origen</li>
                  <li>Pago Móvil es el método de dispersión más rápido (instantáneo)</li>
                  <li>Crédito inmediato se procesa rápidamente (minutos a horas)</li>
                  <li>Retiro físico está disponible inmediatamente en horario de oficina</li>
                </ul>
              </div>

              <div className={styles.subsection}>
                <h3>Comisiones y Tarifas</h3>
                <ul>
                  <li>Las tarifas varían según el monto y país de origen</li>
                  <li><strong>Sin comisión adicional</strong> por retiro en efectivo en nuestras oficinas</li>
                  <li>Las comisiones aplicables se informan claramente antes de completar cualquier operación</li>
                  <li>Transparencia total en todos los costos</li>
                  <li>Para conocer los costos exactos de tu transacción específica, contáctanos directamente</li>
                </ul>
              </div>
            </section>

            {/* Security & Compliance - Comprehensive */}
            <section className={styles.section} id="seguridad-cumplimiento-completo">
              <h2>Seguridad y Cumplimiento Normativo Completo</h2>

              <div className={styles.subsection}>
                <h3>Marco Legal y Autorización</h3>
                <ul>
                  <li>100% legal y autorizado por SUDEBAN</li>
                  <li>Opera dentro del marco legal venezolano</li>
                  <li>Cumple con todas las regulaciones bancarias</li>
                  <li>Más de 35 años de experiencia y trayectoria confiable</li>
                  <li>Como "Sujeto Obligado", realizamos operaciones autorizadas por el Banco Central de Venezuela</li>
                </ul>
              </div>

              <div className={styles.subsection}>
                <h3>Prevención de Lavado de Dinero (LC/FT/FPADM)</h3>
                <p>
                  En Taller360, S.A; tu seguridad es nuestra prioridad. La prevención y el control contra
                  la legitimación de capitales, el financiamiento al terrorismo y el financiamiento de la proliferación
                  de armas de destrucción masiva son de suma importancia para nosotros.
                </p>

                <h4>¿Qué es la Legitimación de Capitales (LC)?</h4>
                <p>
                  Es el proceso de esconder o dar apariencia de legalidad a capitales, bienes y haberes provenientes de
                  actividades ilícitas (Art. 4.15, Definiciones, de la LOCDO/FT).
                </p>

                <h4>¿Qué es el Financiamiento al Terrorismo (FT)?</h4>
                <p>
                  Se califica como tal, la acción de proporcionar, facilitar, resguardar, administrar, colectar o recabar
                  fondos por cualquier medio, directa o indirectamente, con el propósito de que éstos sean utilizados para
                  actos terroristas (Art. 53 de la LOCDO/FT).
                </p>

                <h4>¿Qué es el Financiamiento de la Proliferación de Armas de Destrucción Masiva (FPADM)?</h4>
                <p>
                  Es el acto de proporcionar fondos o servicios financieros que se utilizan para la fabricación,
                  adquisición, posesión, desarrollo, exportación o uso de armas nucleares, químicas o biológicas y
                  sus vectores y materiales relacionados.
                </p>
              </div>

              <div className={styles.subsection}>
                <h3>Nuestras Medidas de Protección</h3>
                <p>
                  Taller360, S.A; protege los intereses de sus clientes y salvaguarda su reputación mediante:
                </p>
                <ul>
                  <li><strong>Debida Diligencia Sobre el Cliente:</strong> Política de obtención veraz, transparente y completa de información</li>
                  <li><strong>Seguimiento continuo:</strong> Monitoreo de transacciones según nivel de riesgo</li>
                  <li><strong>Sistema Integral de Administración de Riesgos:</strong> Estructura eficiente que involucra todo el personal</li>
                  <li><strong>Capacitación continua:</strong> Personal entrenado en prevención LC/FT/FPADM</li>
                </ul>
              </div>

              <div className={styles.subsection}>
                <h3>Podemos Solicitar</h3>
                <ul>
                  <li>Información y documentación adicional sobre el origen de fondos</li>
                  <li>Información para cumplir con políticas de "Conozca a su Cliente"</li>
                  <li>Actualización de datos personales</li>
                  <li>Declaración jurada sobre origen y destino de fondos</li>
                </ul>
              </div>

              <div className={styles.subsection}>
                <h3>Nos Reservamos el Derecho de</h3>
                <ul>
                  <li>Solicitar información y documentación adicional sobre el origen de los fondos</li>
                  <li>Rechazar transacciones que no cumplan con nuestras políticas de cumplimiento</li>
                  <li>Reportar operaciones sospechosas a las autoridades competentes</li>
                  <li>Mantener registros de transacciones según lo establecido por SUDEBAN (mínimo 5 años)</li>
                </ul>
              </div>

              <div className={styles.subsection}>
                <h3>Personas Expuestas Políticamente (PEP's)</h3>
                <p>
                  Como "Sujeto Obligado", estamos en la obligación de aplicar procedimientos de Debida Diligencia
                  al establecer relaciones comerciales con Personas Expuestas Políticamente (PEP).
                </p>
                <p>
                  Una PEP es una persona natural que es, o fue, figura política de alto nivel, de confianza o afines,
                  o sus familiares más cercanos o su círculo de colaboradores inmediatos.
                </p>
              </div>

              <div className={styles.subsection}>
                <h3>Marco Legal que nos Rige</h3>
                <ul>
                  <li>Decreto con Rango, Valor y Fuerza de Ley de Instituciones del Sector Bancario (G.O. N° 6.154)</li>
                  <li>Ley Orgánica Contra la Delincuencia Organizada y Financiamiento al Terrorismo (LOCDOFT - G.O. N° 39.912)</li>
                  <li>Ley Orgánica de Drogas (G.O. N° 39.510)</li>
                  <li>Resolución N° 010.25 sobre Riesgos de LC/FT/FPADM (G.O. N° 43.098 del 31/03/2025)</li>
                  <li>Convenio Cambiario N° 1 (G.O. N° 6405 del 07/09/2018)</li>
                  <li>Ley Orgánica de Protección de Datos Personales (LOPD)</li>
                </ul>
              </div>

              <div className={styles.subsection}>
                <h3>Tips para Mantenerse Alerta</h3>
                <ul>
                  <li>Suministre datos completos y correctos en todos los formularios</li>
                  <li>Indique clara y precisamente el origen y destino de los fondos</li>
                  <li>Mantenga sus datos actualizados (teléfono, correo, dirección)</li>
                  <li>Conteste clara y precisamente las preguntas de seguridad</li>
                  <li>Evite que terceros realicen operaciones por usted o usen sus datos</li>
                  <li>No haga operaciones de dinero con personas desconocidas</li>
                </ul>
              </div>

              <div className={styles.subsection}>
                <h3>Prevención de Fraudes</h3>
                <ul>
                  <li>Asegúrate de saber a quién le envías dinero</li>
                  <li>Desconfía de emails/SMS de desconocidos ofreciendo premios o fortunas</li>
                  <li>Verifica antes de actuar cuando recibas SMS de "familiares en apuros"</li>
                  <li>No realices envíos a personas que no conoces</li>
                  <li>Ten precaución con quien compartes información privada en redes</li>
                </ul>

                <div className={styles.important}>
                  <p>
                    <strong>MUY IMPORTANTE:</strong> EN CASA DE CAMBIOS INSULAR, S.A. NUNCA TE PEDIREMOS
                    DATOS CONFIDENCIALES POR TELÉFONO NI CORREOS ELECTRÓNICOS.
                  </p>
                </div>
              </div>

              <div className={styles.subsection}>
                <h3>Protección de Datos Personales (LOPD)</h3>
                <p>Cumplimos con la Ley Orgánica de Protección de Datos Personales de Venezuela.</p>

                <h4>Datos que Recopilamos:</h4>
                <ul>
                  <li><strong>Datos de identificación:</strong> Nombre completo, cédula de identidad, fecha de nacimiento</li>
                  <li><strong>Datos de contacto:</strong> Dirección, número de teléfono, correo electrónico</li>
                  <li><strong>Datos financieros:</strong> Información bancaria necesaria para transacciones</li>
                  <li><strong>Datos de transacciones:</strong> Historial de operaciones realizadas</li>
                </ul>

                <h4>Finalidad del Tratamiento:</h4>
                <ul>
                  <li>Procesar operaciones de cambio de divisas</li>
                  <li>Cumplir con obligaciones legales y regulatorias establecidas por SUDEBAN</li>
                  <li>Prevenir el lavado de dinero y financiamiento del terrorismo</li>
                  <li>Enviar comunicaciones relacionadas con nuestros servicios</li>
                  <li>Mejorar nuestros servicios y experiencia del cliente</li>
                </ul>

                <h4>Derechos de los Titulares:</h4>
                <ul>
                  <li><strong>Acceso:</strong> Conocer qué datos personales tenemos sobre usted</li>
                  <li><strong>Rectificación:</strong> Solicitar la corrección de datos inexactos</li>
                  <li><strong>Cancelación:</strong> Solicitar la eliminación de sus datos personales</li>
                  <li><strong>Oposición:</strong> Oponerse al tratamiento de sus datos</li>
                  <li><strong>Portabilidad:</strong> Recibir sus datos en un formato estructurado</li>
                  <li><strong>Revocación del consentimiento:</strong> Retirar su consentimiento en cualquier momento</li>
                </ul>

                <h4>Medidas de Seguridad:</h4>
                <ul>
                  <li>Encriptación de datos sensibles</li>
                  <li>Controles de acceso estrictos</li>
                  <li>Auditorías de seguridad regulares</li>
                  <li>Capacitación continua del personal en protección de datos</li>
                </ul>

                <h4>Tiempo de Conservación:</h4>
                <p>
                  Conservamos sus datos personales durante el tiempo necesario para cumplir con las finalidades
                  para las que fueron recopilados, incluyendo un mínimo de 5 años según regulaciones de SUDEBAN.
                </p>

                <h4>Transferencias Internacionales:</h4>
                <p>
                  En el marco de nuestras operaciones de remesas internacionales, podemos transferir sus datos
                  personales a nuestros socios internacionales (B89, Papaya, TSG, Panamericash). Estas
                  transferencias se realizan cumpliendo con las garantías adecuadas establecidas por la LOPD y
                  con el consentimiento expreso del titular.
                </p>
              </div>
            </section>

            {/* FAQ Comprehensive */}
            <section className={styles.section} id="preguntas-frecuentes-completas">
              <h2>Preguntas Frecuentes (FAQ)</h2>

              <div className={styles.faqItem}>
                <h3>¿Qué necesito para recibir mi remesa?</h3>
                <p>
                  Necesitas tu cédula de identidad venezolana vigente y el código de seguimiento proporcionado
                  por quien envía el dinero. ¡Es muy sencillo!
                </p>
              </div>

              <div className={styles.faqItem}>
                <h3>¿En cuánto tiempo recibo mi remesa?</h3>
                <p>
                  Las remesas están disponibles para retirar en minutos después de ser enviadas. El tiempo exacto
                  depende del método de envío y el país de origen.
                </p>
              </div>

              <div className={styles.faqItem}>
                <h3>¿Cuáles son los métodos para recibir mi dinero?</h3>
                <p>
                  Ofrecemos tres opciones: Pago Móvil (la más rápida, directo a tu cuenta), Crédito Inmediato
                  (transferencia bancaria), y Retiro Físico (en efectivo en nuestra oficina de Caracas).
                </p>
              </div>

              <div className={styles.faqItem}>
                <h3>¿Dónde puedo retirar en dólares?</h3>
                <p>
                  Puedes retirar en nuestras oficinas ubicadas en Caracas (Av. Francisco de Miranda, Torre Seguros
                  Sudamerica, Local PB-7).
                </p>
              </div>

              <div className={styles.faqItem}>
                <h3>¿Cuáles son los aliados disponibles en mi zona?</h3>
                <p>
                  Contamos con B89, Papaya, TSG y Panamericash como aliados internacionales para el envío de remesas desde 13 países hacia Venezuela. Contáctanos al +58 414-2093083 para más información.
                </p>
              </div>

              <div className={styles.faqItem}>
                <h3>¿Cuáles son las tarifas y comisiones por remesa?</h3>
                <p>
                  Las tarifas varían según el monto y el país de origen. No cobramos comisión adicional por el
                  retiro en nuestras oficinas. Para costos exactos, contáctanos directamente.
                </p>
              </div>

              <div className={styles.faqItem}>
                <h3>¿Desde qué países puedo recibir dinero?</h3>
                <p>
                  A través de nuestros aliados (B89, Papaya, TSG, Panamericash), puedes recibir dinero desde 13 países: México, Canadá, Chile, Colombia, Costa Rica, Ecuador, Panamá, Perú, Estados Unidos, Alemania, España, Francia y Argentina.
                </p>
              </div>

              <div className={styles.faqItem}>
                <h3>¿Son un negocio legal y autorizado?</h3>
                <p>
                  ¡Sí! Estamos 100% autorizados por SUDEBAN con más de 35 años de experiencia en Venezuela.
                  Operamos dentro del marco legal venezolano.
                </p>
              </div>

              <div className={styles.faqItem}>
                <h3>¿Necesito cita previa para ir a la oficina?</h3>
                <p>
                  No es requerida cita previa, pero puedes contactarnos vía WhatsApp (+58 414-2093083) para
                  un servicio más rápido y personalizado.
                </p>
              </div>

              <div className={styles.faqItem}>
                <h3>¿Qué hago si tengo problemas con mi remesa?</h3>
                <p>
                  Contáctanos inmediatamente vía WhatsApp (+58 414-2093083) o email (operaciones@taller360.local).
                  Nuestro equipo está disponible para ayudarte.
                </p>
              </div>

              <div className={styles.faqItem}>
                <h3>¿Cuál es la tasa de cambio actual?</h3>
                <p>
                  Las tasas cambian diariamente según el mercado. Tasas referenciales actuales: USD Bs. 160,4479 /
                  EUR Bs. 188,0289. Contáctanos para conocer la tasa exacta vigente para tu transacción.
                </p>
              </div>

              <div className={styles.faqItem}>
                <h3>¿Qué documentos necesito para cambiar divisas?</h3>
                <p>
                  Necesitas ser mayor de 18 años, poseer cédula de identidad venezolana vigente, proporcionar
                  información veraz y cumplir con los requisitos de prevención de lavado de dinero.
                </p>
              </div>
            </section>

            {/* Important Notes */}
            <section className={styles.section} id="notas-importantes">
              <h2>Notas Importantes y Recomendaciones</h2>
              <ul>
                <li>Verifica siempre que estás comunicando con canales oficiales de Taller360</li>
                <li><strong>NUNCA</strong> solicitamos contraseñas o detalles bancarios sensibles vía chat/email/teléfono</li>
                <li>Para asuntos urgentes, usa WhatsApp: <a href="https://wa.me/584142093083">+58 414-2093083</a></li>
                <li>Las tasas de cambio varían diariamente - confirma siempre la tasa actual antes de tu transacción</li>
                <li>Todas las operaciones se realizan en cumplimiento con la normativa venezolana vigente</li>
                <li>Mantén tus datos actualizados para un mejor servicio</li>
                <li>Guarda siempre tu código de seguimiento de remesas</li>
                <li>Si tienes dudas, pregunta - estamos aquí para ayudarte</li>
              </ul>
            </section>

            {/* Contact for More Info */}
            <section className={styles.section} id="contacto-completo">
              <h2>¿Necesitas Más Información o Ayuda?</h2>
              <p>Nuestro equipo está disponible y listo para ayudarte con cualquier consulta:</p>

              <div className={styles.contactBox}>
                <h3>Contacto Principal</h3>
                <p><strong>WhatsApp / Teléfono:</strong> <a href="https://wa.me/584142093083">+58 414-2093083</a></p>
                <p><strong>Email:</strong> <a href="mailto:operaciones@taller360.local">operaciones@taller360.local</a></p>
                <p><strong>Teléfono Alternativo:</strong> +58 (212) 123-4567</p>
                <p><strong>Email Alternativo:</strong> <a href="mailto:info@taller360.local">info@taller360.local</a></p>

                <h3 style={{ marginTop: '1.5rem' }}>Horario de Atención</h3>
                <p><strong>Lunes a Viernes:</strong> 8:30 AM - 3:30 PM</p>
                <p><strong>Sábados y Domingos:</strong> Cerrado</p>

                <h3 style={{ marginTop: '1.5rem' }}>Ubicación</h3>
                <p>Avenida Francisco de Miranda</p>
                <p>Torre Seguros Sudamerica, Local PB-7</p>
                <p>Urbanización El Rosal, Municipio Chacao</p>
                <p>Caracas, Venezuela</p>
              </div>
            </section>

            {/* Footer Note */}
            <footer className={styles.footer}>
              <p>
                Esta página contiene información completa y exhaustiva sobre Taller360 para
                facilitar el acceso a todos nuestros servicios, políticas, procedimientos y documentación legal.
                Toda la información aquí contenida está actualizada y es válida para consultas de clientes,
                asistentes virtuales, motores de búsqueda y sistemas de inteligencia artificial.
              </p>
              <p>
                <small>
                  <strong>Última actualización:</strong> {new Date().toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </small>
              </p>
              <p>
                <small>
                  <strong>Versión:</strong> 2.0 - Base de Conocimiento Completa
                </small>
              </p>
            </footer>
          </article>
        </div>
      </Section>
    </>
  );
};

export default KnowledgeBase;

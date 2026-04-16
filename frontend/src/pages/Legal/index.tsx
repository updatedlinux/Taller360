import { useState, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SEO from '../../components/SEO';
import { gsap } from 'gsap';
import { Cookie, Lock, FileText, Search, Shield, ChevronUp, ChevronDown } from 'lucide-react';
import Section from '../../components/Section';
import styles from './Legal.module.css';

const Legal = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'cookies' | 'privacy' | 'terms' | 'lcft' | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const contentRef = useRef<HTMLDivElement>(null);
  const [highlightedContent, setHighlightedContent] = useState<ReactNode>(null);
  const [matchCounts, setMatchCounts] = useState<Record<string, number>>({});
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [totalMatches, setTotalMatches] = useState(0);
  const allMatchesRef = useRef<Element[]>([]);
  const tabContentTextRef = useRef<Record<string, string>>({});

  // Handle hash navigation on mount and hash changes
  useEffect(() => {
    const hash = location.hash.replace('#', '');
    if (hash === 'cookies' || hash === 'privacy' || hash === 'terms' || hash === 'lcft') {
      setActiveTab(hash);
    } else if (hash === 'prevencion') {
      // Redirect #prevencion to #lcft for backward compatibility
      setActiveTab('lcft');
      navigate('/legal#lcft', { replace: true });
    }

    // Scroll to top when navigating to legal page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.hash, navigate]);

  // Animate content change
  useEffect(() => {
    if (!contentRef.current) return;

    gsap.fromTo(
      contentRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
    );
  }, [activeTab]);

  const tabs = [
    { id: 'cookies' as const, label: 'Política de Cookies', icon: Cookie },
    { id: 'privacy' as const, label: 'Política de Privacidad (LOPD)', icon: Lock },
    { id: 'terms' as const, label: 'Términos y Condiciones', icon: FileText },
    { id: 'lcft' as const, label: 'Prevención LC/FT/FPADM', icon: Shield }
  ];

  const handleTabChange = (tabId: 'cookies' | 'privacy' | 'terms' | 'lcft') => {
    setActiveTab(tabId);
    navigate(`/legal#${tabId}`, { replace: true });
  };

  // Count matches in all documents
  const countMatchesInDocument = (content: string, searchTerm: string): number => {
    if (!searchTerm) return 0;
    const lowerContent = content.toLowerCase();
    const lowerSearch = searchTerm.toLowerCase();
    let count = 0;
    let pos = 0;
    while ((pos = lowerContent.indexOf(lowerSearch, pos)) !== -1) {
      count++;
      pos += lowerSearch.length;
    }
    return count;
  };

  // Store current tab's text content whenever it renders
  useEffect(() => {
    if (contentRef.current) {
      // Use a small delay to ensure content is fully rendered
      const timeoutId = setTimeout(() => {
        if (contentRef.current) {
          tabContentTextRef.current[activeTab] = contentRef.current.textContent || '';
        }
      }, 50);
      return () => clearTimeout(timeoutId);
    }
  }, [activeTab]);

  // Get text content from a document
  const getDocumentText = (tabId: 'cookies' | 'privacy' | 'terms' | 'lcft'): string => {
    return tabContentTextRef.current[tabId] || '';
  };

  const getContent = () => {
    if (activeTab === null) {
      return (
        <div className={styles.defaultContent}>
          <div className={styles.contentHeader}>
            <h1 className={styles.contentTitle}>Documentación Legal</h1>
            <p className={styles.contentSubtitle}>Toda la información que necesitas en un solo lugar</p>
          </div>
          <div className={styles.contentBody}>
            <p>
              Selecciona cualquiera de las opciones del menú para acceder a nuestra documentación legal completa,
              incluyendo políticas de privacidad, términos y condiciones, política de cookies y normativas de
              prevención de legitimación de capitales. Nos comprometemos con la transparencia y el cumplimiento normativo.
            </p>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'cookies':
        return (
          <div>
            <h1>Política de Cookies</h1>
            <p className={styles.lastUpdated}>Última actualización: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

            <section className={styles.section}>
              <h2>1. ¿Qué son las cookies?</h2>
              <p>
                Las cookies son pequeños archivos de texto que se almacenan en su dispositivo cuando visita nuestro sitio web.
                Estas cookies nos permiten recordar sus preferencias y mejorar su experiencia de navegación.
              </p>
            </section>

            <section className={styles.section}>
              <h2>2. Tipos de cookies que utilizamos</h2>

              <h3>Cookies esenciales</h3>
              <p>
                Son necesarias para el funcionamiento básico del sitio web. Sin estas cookies, el sitio no puede funcionar correctamente.
              </p>

              <h3>Cookies de rendimiento</h3>
              <p>
                Nos ayudan a entender cómo los visitantes interactúan con nuestro sitio web, proporcionándonos información sobre las áreas visitadas,
                el tiempo de permanencia y cualquier problema encontrado.
              </p>

              <h3>Cookies funcionales</h3>
              <p>
                Permiten que el sitio web recuerde las elecciones que usted hace y proporcionan características mejoradas y más personales.
              </p>

              <h3>Cookies de marketing</h3>
              <p>
                Se utilizan para rastrear a los visitantes en los sitios web. La intención es mostrar anuncios relevantes y atractivos para el usuario individual.
              </p>
            </section>

            <section className={styles.section}>
              <h2>3. Gestión de cookies</h2>
              <p>
                Puede configurar su navegador para que rechace todas las cookies o para que le avise cuando se envía una cookie.
                Sin embargo, si no acepta las cookies, es posible que no pueda utilizar todas las funciones de nuestro sitio web.
              </p>
              <p>
                Para obtener más información sobre cómo administrar las cookies en los navegadores más populares, consulte los siguientes enlaces:
              </p>
              <ul>
                <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer">Google Chrome</a></li>
                <li><a href="https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web-rastrear-preferencias" target="_blank" rel="noopener noreferrer">Mozilla Firefox</a></li>
                <li><a href="https://support.apple.com/es-es/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer">Safari</a></li>
                <li><a href="https://support.microsoft.com/es-es/microsoft-edge/eliminar-las-cookies-en-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer">Microsoft Edge</a></li>
              </ul>
            </section>

            <section className={styles.section}>
              <h2>4. Contacto</h2>
              <p>
                Si tiene alguna pregunta sobre nuestra política de cookies, puede contactarnos en:
              </p>
              <p className={styles.contactInfo}>
                <strong>Email:</strong> info@taller360.local<br />
                <strong>Teléfono:</strong> +58 (212) 123-4567
              </p>
            </section>
          </div>
        );

      case 'privacy':
        return (
          <div>
            <h1>Política de Privacidad (LOPD)</h1>
            <p className={styles.lastUpdated}>Última actualización: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

            <section className={styles.section}>
              <h2>1. Responsable del tratamiento</h2>
              <p>
                <strong>Taller360, C.A.</strong><br />
                RIF: J-123456789<br />
                Dirección: Av. Francisco de Miranda, Torre Seguros Sudamerica, local PB-7, Urbanización El Rosal, Municipio Chacao, Caracas, Venezuela<br />
                Email: info@taller360.local<br />
                Teléfono: +58 (212) 123-4567
              </p>
            </section>

            <section className={styles.section}>
              <h2>2. Datos personales que recopilamos</h2>
              <p>
                En cumplimiento de la Ley Orgánica de Protección de Datos Personales (LOPD), recopilamos y procesamos los siguientes tipos de datos personales:
              </p>
              <ul>
                <li><strong>Datos de identificación:</strong> Nombre completo, cédula de identidad, fecha de nacimiento</li>
                <li><strong>Datos de contacto:</strong> Dirección, número de teléfono, correo electrónico</li>
                <li><strong>Datos financieros:</strong> Información bancaria necesaria para transacciones de cambio de divisas</li>
                <li><strong>Datos de transacciones:</strong> Historial de operaciones realizadas</li>
              </ul>
            </section>

            <section className={styles.section}>
              <h2>3. Finalidad del tratamiento</h2>
              <p>
                Los datos personales que recopilamos se utilizan para:
              </p>
              <ul>
                <li>Procesar operaciones de cambio de divisas</li>
                <li>Cumplir con obligaciones legales y regulatorias establecidas por SUDEBAN</li>
                <li>Prevenir el lavado de dinero y financiamiento del terrorismo</li>
                <li>Enviar comunicaciones relacionadas con nuestros servicios</li>
                <li>Mejorar nuestros servicios y experiencia del cliente</li>
              </ul>
            </section>

            <section className={styles.section}>
              <h2>4. Base legal del tratamiento</h2>
              <p>
                El tratamiento de sus datos personales se basa en:
              </p>
              <ul>
                <li>El consentimiento expreso que usted nos otorga</li>
                <li>La ejecución de un contrato en el que usted es parte</li>
                <li>El cumplimiento de obligaciones legales aplicables a nuestra actividad</li>
                <li>El interés legítimo en mejorar nuestros servicios</li>
              </ul>
            </section>

            <section className={styles.section}>
              <h2>5. Derechos de los titulares</h2>
              <p>
                De acuerdo con la LOPD, usted tiene derecho a:
              </p>
              <ul>
                <li><strong>Acceso:</strong> Conocer qué datos personales tenemos sobre usted</li>
                <li><strong>Rectificación:</strong> Solicitar la corrección de datos inexactos</li>
                <li><strong>Cancelación:</strong> Solicitar la eliminación de sus datos personales</li>
                <li><strong>Oposición:</strong> Oponerse al tratamiento de sus datos en determinadas circunstancias</li>
                <li><strong>Portabilidad:</strong> Recibir sus datos en un formato estructurado</li>
                <li><strong>Revocación del consentimiento:</strong> Retirar su consentimiento en cualquier momento</li>
              </ul>
              <p>
                Para ejercer estos derechos, puede enviarnos un correo a: info@taller360.local
              </p>
            </section>

            <section className={styles.section}>
              <h2>6. Seguridad de los datos</h2>
              <p>
                Implementamos medidas técnicas y organizativas apropiadas para proteger sus datos personales contra acceso no autorizado,
                pérdida, destrucción o alteración. Estas medidas incluyen:
              </p>
              <ul>
                <li>Encriptación de datos sensibles</li>
                <li>Controles de acceso estrictos</li>
                <li>Auditorías de seguridad regulares</li>
                <li>Capacitación continua del personal en protección de datos</li>
              </ul>
            </section>

            <section className={styles.section}>
              <h2>7. Tiempo de conservación</h2>
              <p>
                Conservamos sus datos personales durante el tiempo necesario para cumplir con las finalidades para las que fueron recopilados,
                incluyendo cualquier requisito legal, contable o de reporte. En general, conservamos los datos de transacciones durante un mínimo
                de 5 años según lo establecido por las regulaciones de SUDEBAN.
              </p>
            </section>

            <section className={styles.section}>
              <h2>8. Transferencias internacionales</h2>
              <p>
                En el marco de nuestras operaciones de remesas internacionales, podemos transferir sus datos personales a nuestros socios
                internacionales (MoneyGram, Ria, Remitly, Papaya). Estas transferencias se realizan cumpliendo con las garantías adecuadas
                establecidas por la LOPD y con el consentimiento expreso del titular.
              </p>
            </section>

            <section className={styles.section}>
              <h2>9. Contacto</h2>
              <p>
                Para cualquier consulta sobre esta política de privacidad o el tratamiento de sus datos personales, puede contactarnos:
              </p>
              <p className={styles.contactInfo}>
                <strong>Email:</strong> info@taller360.local<br />
                <strong>Teléfono:</strong> +58 (212) 123-4567<br />
                <strong>Dirección:</strong> Av. Francisco de Miranda, Torre Seguros Sudamerica, local PB-7, El Rosal, Caracas
              </p>
            </section>
          </div>
        );

      case 'terms':
        return (
          <div>
            <h1>Términos y Condiciones</h1>
            <p className={styles.lastUpdated}>Última actualización: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

            <section className={styles.section}>
              <h2>1. Aceptación de los términos</h2>
              <p>
                Al acceder y utilizar los servicios de Taller360, C.A., usted acepta estar sujeto a estos términos y condiciones,
                todas las leyes y regulaciones aplicables, y acepta que es responsable del cumplimiento de las leyes locales aplicables.
              </p>
            </section>

            <section className={styles.section}>
              <h2>2. Servicios ofrecidos</h2>
              <p>
                Taller360 es una institución autorizada por SUDEBAN para ofrecer los siguientes servicios:
              </p>
              <ul>
                <li>Compra y venta de divisas (dólares americanos y euros)</li>
                <li>Recepción de remesas internacionales a través de nuestros aliados</li>
                <li>Dispersión de fondos mediante pago móvil y crédito inmediato</li>
                <li>Retiro de efectivo en nuestras oficinas</li>
              </ul>
            </section>

            <section className={styles.section}>
              <h2>3. Requisitos para utilizar nuestros servicios</h2>
              <p>
                Para realizar operaciones con nosotros, usted debe:
              </p>
              <ul>
                <li>Ser mayor de 18 años</li>
                <li>Poseer cédula de identidad venezolana vigente</li>
                <li>Proporcionar información veraz y actualizada</li>
                <li>Cumplir con los requisitos de prevención de lavado de dinero</li>
              </ul>
            </section>

            <section className={styles.section}>
              <h2>4. Tasas de cambio</h2>
              <p>
                Las tasas de cambio son determinadas por Taller360 y pueden variar según las condiciones del mercado.
                Las tasas publicadas en nuestro sitio web son referenciales y pueden cambiar sin previo aviso. La tasa aplicable
                será la vigente al momento de completar la transacción.
              </p>
            </section>

            <section className={styles.section}>
              <h2>5. Comisiones y tarifas</h2>
              <p>
                Nuestras operaciones pueden estar sujetas a comisiones y tarifas que varían según el tipo de servicio y monto de la transacción.
                Las comisiones aplicables serán informadas claramente antes de completar cualquier operación.
              </p>
              <p>
                En el caso de remesas recibidas a través de nuestros aliados, no cobramos comisión adicional por el retiro en nuestras oficinas.
              </p>
            </section>

            <section className={styles.section}>
              <h2>6. Prevención de lavado de dinero</h2>
              <p>
                En cumplimiento de la normativa venezolana de prevención de lavado de dinero y financiamiento del terrorismo, nos reservamos el derecho de:
              </p>
              <ul>
                <li>Solicitar información y documentación adicional sobre el origen de los fondos</li>
                <li>Rechazar transacciones que no cumplan con nuestras políticas de cumplimiento</li>
                <li>Reportar operaciones sospechosas a las autoridades competentes</li>
                <li>Mantener registros de transacciones según lo establecido por SUDEBAN</li>
              </ul>
            </section>

            <section className={styles.section}>
              <h2>7. Limitación de responsabilidad</h2>
              <p>
                Taller360 no será responsable por:
              </p>
              <ul>
                <li>Demoras o errores en transacciones causados por información incorrecta proporcionada por el cliente</li>
                <li>Pérdidas derivadas de fluctuaciones en las tasas de cambio</li>
                <li>Interrupciones del servicio por mantenimiento programado o causas de fuerza mayor</li>
                <li>Decisiones de inversión tomadas por el cliente basadas en las tasas publicadas</li>
              </ul>
            </section>

            <section className={styles.section}>
              <h2>8. Modificaciones de los términos</h2>
              <p>
                Nos reservamos el derecho de modificar estos términos y condiciones en cualquier momento. Las modificaciones entrarán en vigor
                inmediatamente después de su publicación en nuestro sitio web. Es responsabilidad del usuario revisar periódicamente estos términos.
              </p>
            </section>

            <section className={styles.section}>
              <h2>9. Ley aplicable y jurisdicción</h2>
              <p>
                Estos términos y condiciones se rigen por las leyes de la República Bolivariana de Venezuela. Cualquier disputa que surja
                en relación con estos términos será sometida a la jurisdicción exclusiva de los tribunales competentes de Caracas, Venezuela.
              </p>
            </section>

            <section className={styles.section}>
              <h2>10. Contacto</h2>
              <p>
                Para cualquier pregunta sobre estos términos y condiciones, puede contactarnos:
              </p>
              <p className={styles.contactInfo}>
                <strong>Taller360, C.A.</strong><br />
                <strong>Email:</strong> info@taller360.local<br />
                <strong>Teléfono:</strong> +58 (212) 123-4567<br />
                <strong>Dirección:</strong> Av. Francisco de Miranda, Torre Seguros Sudamerica, local PB-7<br />
                Urbanización El Rosal, Municipio Chacao, Caracas, Venezuela<br />
                <strong>Horario de atención:</strong> Lunes a Viernes de 8:30 AM a 3:30 PM
              </p>
            </section>

            <section className={styles.section}>
              <h2>11. Términos de Uso del Asistente Virtual (Chatbot)</h2>

              <h3>11.1 Información General del Asistente Virtual</h3>
              <p>
                Taller360, S.A. pone a disposición de sus clientes un asistente virtual automatizado
                (en adelante "el Chatbot" o "Insa") con el objetivo de facilitar el acceso a información sobre
                nuestros servicios, políticas y procedimientos.
              </p>

              <h3>11.2 Naturaleza del Servicio</h3>
              <ul>
                <li>El Chatbot es una herramienta de asistencia automatizada basada en inteligencia artificial</li>
                <li>Proporciona información general y orientación sobre nuestros servicios</li>
                <li>Opera con base en la información contenida en nuestra Base de Conocimiento</li>
                <li>Las respuestas son generadas automáticamente y pueden no ser exhaustivas</li>
                <li><strong>NO reemplaza</strong> la asesoría personalizada de nuestro equipo humano</li>
              </ul>

              <h3>11.3 Limitaciones y Exclusiones de Responsabilidad</h3>
              <p className={styles.important}>
                <strong>IMPORTANTE:</strong> Al utilizar nuestro asistente virtual, usted reconoce y acepta
                expresamente las siguientes limitaciones:
              </p>

              <h4>11.3.1 Exactitud de la Información</h4>
              <ul>
                <li>El Chatbot proporciona información de carácter general basada en datos actualizados</li>
                <li>Las tasas de cambio, tarifas y condiciones mencionadas son referenciales y pueden variar</li>
                <li>La información exacta y actualizada debe ser confirmada directamente con nuestro personal</li>
                <li>Taller360, S.A. no se responsabiliza por decisiones tomadas exclusivamente con base en información del Chatbot</li>
              </ul>

              <h4>11.3.2 No Constitución de Asesoría Profesional</h4>
              <ul>
                <li>Las respuestas del Chatbot NO constituyen asesoría financiera, legal o fiscal</li>
                <li>No debe considerarse como recomendación de inversión o transacción específica</li>
                <li>Para asesoría personalizada, debe contactar directamente con nuestro personal autorizado</li>
              </ul>

              <h4>11.3.3 Imposibilidad de Realizar Transacciones</h4>
              <ul>
                <li>El Chatbot NO puede procesar transacciones financieras de ningún tipo</li>
                <li>NO puede recibir dinero, realizar cambios de divisas ni enviar remesas</li>
                <li>NO puede confirmar, cancelar o modificar operaciones</li>
                <li>Todas las transacciones deben realizarse a través de canales oficiales autorizados</li>
              </ul>

              <h4>11.3.4 Protección de Datos Sensibles</h4>
              <p className={styles.important}>
                <strong>NUNCA comparta a través del Chatbot:</strong>
              </p>
              <ul>
                <li>Contraseñas bancarias o de servicios financieros</li>
                <li>Números completos de tarjetas de crédito o débito</li>
                <li>Códigos de seguridad (CVV/CVC)</li>
                <li>Claves de acceso a cuentas bancarias</li>
                <li>Información financiera confidencial completa</li>
              </ul>

              <h3>11.4 Limitación de Responsabilidad</h3>
              <p>
                Taller360, S.A. no será responsable, en la máxima medida permitida por la ley, por:
              </p>
              <ul>
                <li><strong>Errores o inexactitudes:</strong> Información incorrecta, desactualizada o incompleta proporcionada por el Chatbot</li>
                <li><strong>Decisiones del usuario:</strong> Cualquier decisión financiera o transacción realizada exclusivamente con base en información del Chatbot</li>
                <li><strong>Daños indirectos:</strong> Pérdidas económicas, lucro cesante o daños consecuenciales derivados del uso del Chatbot</li>
                <li><strong>Interrupciones del servicio:</strong> Disponibilidad intermitente, errores técnicos o fallas del sistema</li>
                <li><strong>Interpretación errónea:</strong> Malentendidos derivados de las respuestas automatizadas</li>
                <li><strong>Acceso no autorizado:</strong> Uso indebido del Chatbot por terceros no autorizados</li>
              </ul>

              <h3>11.5 Uso Apropiado del Servicio</h3>
              <p>Al utilizar nuestro Chatbot, usted se compromete a:</p>
              <ul>
                <li>Utilizarlo únicamente para fines informativos legítimos</li>
                <li>No intentar obtener acceso no autorizado o vulnerar el sistema</li>
                <li>No utilizar el servicio para fines fraudulentos, ilegales o no autorizados</li>
                <li>No compartir información falsa o engañosa</li>
                <li>Respetar los derechos de propiedad intelectual de Taller360, S.A.</li>
                <li>Verificar toda información crítica con nuestro personal autorizado antes de tomar decisiones</li>
              </ul>

              <h3>11.6 Confirmación y Verificación Obligatoria</h3>
              <p className={styles.important}>
                <strong>DEBE CONFIRMAR CON NUESTRO PERSONAL AUTORIZADO:</strong>
              </p>
              <ul>
                <li>Tasas de cambio exactas antes de realizar transacciones</li>
                <li>Tarifas y comisiones aplicables</li>
                <li>Requisitos específicos para su operación</li>
                <li>Plazos de procesamiento</li>
                <li>Cualquier información crítica para su decisión financiera</li>
              </ul>
              <p>
                <strong>Canales oficiales de confirmación:</strong> WhatsApp/Teléfono +58 414-2093083, Email operaciones@taller360.local,
                o presencial en nuestra oficina (Lunes a Viernes 8:30 AM - 3:30 PM).
              </p>

              <h3>11.7 Disponibilidad del Servicio</h3>
              <ul>
                <li>El Chatbot está disponible 24/7, sujeto a mantenimiento técnico</li>
                <li>Taller360, S.A. se reserva el derecho de modificar, suspender o descontinuar el servicio sin previo aviso</li>
                <li>No garantizamos disponibilidad continua e ininterrumpida del Chatbot</li>
              </ul>

              <h3>11.8 Privacidad y Registro de Conversaciones</h3>
              <ul>
                <li>Las conversaciones con el Chatbot pueden ser registradas para mejorar el servicio</li>
                <li>Los datos proporcionados serán tratados conforme a nuestra Política de Privacidad y la LOPD</li>
                <li>No almacenamos información financiera sensible proporcionada en el chat</li>
                <li>Sus datos personales están protegidos según las leyes venezolanas de protección de datos</li>
              </ul>

              <h3>11.9 Aceptación de los Términos del Chatbot</h3>
              <p className={styles.important}>
                <strong>Al utilizar nuestro Chatbot, usted reconoce que ha leído, comprendido y aceptado
                estos Términos de Uso en su totalidad.</strong> Si no está de acuerdo con alguno de estos términos,
                absténgase de utilizar el asistente virtual y contacte directamente con nuestro personal autorizado.
              </p>
            </section>
          </div>
        );

      case 'lcft':
        return (
          <div>
            <h1>Prevención y Control de Legitimación de Capitales, Financiamiento al Terrorismo y Financiamiento de la Proliferación de Armas de Destrucción Masiva (LC/FT/FPADM)</h1>
            <p className={styles.lastUpdated}>Última actualización: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

            <section className={styles.section}>
              <p>
                En Taller360, S.A; tu seguridad es nuestra prioridad. Por ello, la prevención y el control contra la legitimación de capitales, el financiamiento al terrorismo y el financiamiento de la proliferación de armas de destrucción masiva son de suma importancia para nosotros.
              </p>
              <p>
                Como "Sujeto Obligado", realizamos operaciones de cambio vinculadas a la encomienda electrónica y otras operaciones autorizadas por el Banco Central de Venezuela. Nuestro objetivo es ofrecerte un servicio rápido, seguro y conveniente, donde cada operación está respaldada por el Sistema Financiero venezolano.
              </p>
              <p>
                Sin embargo, sabemos que, como cualquier servicio financiero, podríamos ser vulnerables a personas que intentan realizar actividades ilícitas. Por esta razón, te explicamos a continuación algunos conceptos clave que debes conocer:
              </p>
            </section>

            <section className={styles.section}>
              <h2>¿Qué es la Legitimación de Capitales?</h2>
              <p>
                Es el proceso de esconder o dar apariencia de legalidad a capitales, bienes y haberes provenientes de actividades ilícitas (Art. 4.15, Definiciones, de la LOCDO/FT).
              </p>
            </section>

            <section className={styles.section}>
              <h2>Consecuencias de la Legitimación de Capitales</h2>
              <p>
                La Legitimación de Capitales es un fenómeno de dimensiones internacionales que interfiere con el desarrollo de los países y genera consecuencias negativas que afectan los diferentes sectores de la sociedad, principalmente en los aspectos sociales, políticos y económicos de las naciones.
              </p>
              <p>
                Debido a ello, surge la necesidad de generar soluciones a través de políticas de Estado y el apoyo internacional sobre las medidas que contribuyan en los esfuerzos contra la Legitimación de Capitales.
              </p>
            </section>

            <section className={styles.section}>
              <h2>¿Qué es la Delincuencia Organizada?</h2>
              <p>
                Es la acción u omisión de tres o más personas asociadas por cierto tiempo con la intención de cometer los delitos establecidos en la LOCDO/FT y obtener, directa o indirectamente, un beneficio económico o de cualquier índole para sí o para terceros.
              </p>
              <p>
                Igualmente, se considera delincuencia organizada la actividad realizada por una sola persona actuando como órgano de una persona jurídica o asociativa, con la intención de cometer los delitos previstos en dicha Ley (Art. 4.9, Definiciones, de la LOCDO/FT).
              </p>
            </section>

            <section className={styles.section}>
              <h2>¿Qué es el Financiamiento al Terrorismo?</h2>
              <p>
                Se califica como tal, la acción de proporcionar, facilitar, resguardar, administrar, colectar o recabar fondos por cualquier medio, directa o indirectamente, con el propósito de que éstos sean utilizados en su totalidad o en parte por un terrorista individual o por una organización terrorista, o para cometer uno o varios actos terroristas, aunque los fondos no hayan sido efectivamente utilizados o no se haya consumado el acto o los actos terroristas, los cuales no podrán justificarse en ninguna circunstancia, por consideraciones de índole política, filosófica, ideológica, religiosa, discriminación racial u otra similar. (Art. 53 de la LOCDO/FT).
              </p>
            </section>

            <section className={styles.section}>
              <h2>¿Qué es el Financiamiento de la Proliferación de Armas de Destrucción Masiva?</h2>
              <p>
                Es el acto de proporcionar fondos o servicios financieros que se utilizan, en todo o en parte, para la fabricación, adquisición, posesión, desarrollo, exportación, transbordo, corretaje, transporte, transferencia, almacenamiento o uso de armas nucleares, químicas o biológicas y sus vectores y materiales relacionados (incluidos ambos tecnologías y bienes de doble uso utilizados para fines no legítimos), en contravención de las leyes nacionales y/o acuerdos internacionales aplicables.
              </p>
            </section>

            <section className={styles.section}>
              <h2>Preservamos sus intereses</h2>
              <p>
                Taller360, S.A; protege los intereses de sus clientes y a la vez salvaguarda su reputación como casa de cambio, en cumplimiento de la normativa legal existente en Venezuela en materia de Prevención y Control de Legitimación de Capitales, Financiamiento al Terrorismo y Financiamiento de la Proliferación de Armas de Destrucción Masiva; con la aplicación de una "Debida Diligencia Sobre el Cliente", política por medio de la cual se busca obtener en forma veraz, transparente y completa, así como mantener actualizada, toda la información que corresponde aportar a las personas naturales y jurídicas para convertirse en clientes.
              </p>
              <p>
                Así mismo, con enfoque al mayor o menor nivel de riesgo que representan, Taller360, S.A; realiza un seguimiento continuo a las transacciones que se llevan a cabo con cada uno de nuestros clientes.
              </p>
            </section>

            <section className={styles.section}>
              <h2>Personas Expuestas Políticamente (Nacionales y Extranjeros) PEP's</h2>
              <p>
                Como "Sujeto Obligado" de la ley, estamos en la obligación de aplicar procedimientos de Debida Diligencia al establecer relaciones comerciales con Personas Expuestas Políticamente (PEP).
              </p>
              <p>
                Una Persona Expuesta Políticamente (PEP) es una persona natural que es, o fue, figura política de alto nivel, de confianza o afines, o sus familiares más cercanos o su círculo de colaboradores inmediatos, por ocupar cargos como funcionario o funcionaria importante de un órgano ejecutivo, legislativo, judicial o militar de un gobierno nacional o extranjero, elegido o no, un miembro de alto nivel de un partido político nacional o extranjero o un ejecutivo de alto nivel de una corporación, que sea propiedad de un gobierno extranjero.
              </p>
              <p>
                En el concepto de familiares cercanos se incluye a los padres, hermanos, cónyuges, hijos y parientes políticos de la Persona Expuesta Políticamente. También se incluye en esta categoría a cualquier persona jurídica que como corporación, negocio u otra entidad haya sido creada por dicho funcionario o funcionaria en su beneficio. (Art. 4.19, Definiciones, de la LOCDO/FT).
              </p>
            </section>

            <section className={styles.section}>
              <h2>Marco Legal</h2>
              <p>Como parte del marco legal que rige esta materia en Venezuela se encuentran las siguientes leyes:</p>
              <ul>
                <li>Decreto con Rango, Valor y Fuerza de Ley de Instituciones del Sector Bancario, Gaceta Oficial N° 6.154, extraordinario de fecha 19 de noviembre de 2014. Reimpresa por fallas en los originales, a través de la Gaceta Oficial N° 40.557 de fecha 8 de diciembre de 2014.</li>
                <li>Ley Orgánica Contra la Delincuencia Organizada y Financiamiento al Terrorismo (LOCDOFT), publicada en la Gaceta Oficial N° 39.912 en fecha 30/04/2012.</li>
                <li>Ley Orgánica de Drogas, publicada en la Gaceta Oficial N° 39.510 de fecha 15/09/2010, reimpresa en la Gaceta Oficial N° 39.546 en fecha 05/11/2010.</li>
                <li>Resolución N° 010.25, mediante la cual se dictan las Normas relativas a la administración y supervisión de los Riesgos de Legitimación de Capitales, Financiamiento al Terrorismo y Financiamiento de la Proliferación de Armas de Destrucción Masiva (LC/FT/FPADM), aplicables a las Instituciones del Sector Bancario, publicada en la Gaceta Oficial N° 43.098 del 31/03/2025.</li>
                <li>Resolución Normas para la Adecuada Administración Integral de Riesgos Gaceta Oficial N° 37.703 del 03 de junio de 2003.</li>
                <li>Convenio Cambiario N° 1, publicado en Gaceta Oficial N° 6405 el 07 de septiembre de 2018.</li>
                <li>Aviso Oficial de fecha 05 de febrero de 2019, publicado en la Gaceta Oficial de la República Bolivariana de Venezuela N° 41.580 del 06 de febrero de 2019, relativa a los montos máximos para las operaciones cambiarias.</li>
                <li>Aviso Oficial de fecha 23 de junio de 2021, publicado en la Gaceta Oficial de la República Bolivariana de Venezuela N° 6.635 del 22 de julio de 2021, mediante el cual se informa a las instituciones bancarias, a las casas de cambio y a los proveedores no bancarios de terminales de puntos de venta, los límites máximos de las comisiones, tarifas y/o recargos que podrán cobrar por las operaciones cambiarias.</li>
              </ul>
            </section>

            <section className={styles.section}>
              <h2>Sistema Integral de Administración de Riesgos</h2>
              <p>
                Taller360, S.A; cuenta con una estructura eficiente para administrar de forma integral los Riesgos de Legitimación de Capitales, el Financiamiento al Terrorismo y Proliferación de Armas de Destrucción Masiva (LC/FT/FPADM).
              </p>
              <p>
                La estructura del "Sistema Integral de Administración de Riesgos de Legitimación de Capitales, Financiamiento al Terrorismo y Proliferación de Armas de Destrucción Masiva", involucra a todos los empleados hasta el personal de la más alta jerarquía y permite la aplicación de medidas apropiadas, suficientes y eficaces a través de políticas y procedimientos que contribuyen a la prevención, control y detección de algún intento de Legitimar Capitales, el Financiamiento al Terrorismo y Proliferación de Armas de Destrucción Masiva.
              </p>
              <p>
                Forman parte de esa estructura, la Junta Directiva, su Presidente, el Oficial de Cumplimiento de Prevención de LC/FT/FPADM, los miembros del Comité de Prevención y Control de LC/FT/FPADM, La Unidad de Prevención y Control de LC/FT/FPADM y los empleados designados como Responsables de Cumplimiento en todas las áreas identificadas como sensibles a los riesgos de LC/FT/FPADM, en especial las agencias, que constituyen un factor esencial en la conducción de las relaciones con los clientes y usuarios.
              </p>
            </section>

            <section className={styles.section}>
              <h2>Tips para mantenerse alerta ante "El Grave Delito De Legitimación De Capitales"</h2>
              <ul>
                <li>Suministre los datos completos y correctos cuando complete el formulario de la Ficha de Identificación de Cliente en nuestra página WEB y APP.</li>
                <li>Es importante que suministre de forma clara y precisa el origen y destino de los fondos en la sección de «Declaración Jurada».</li>
                <li>Mantenga sus datos actualizados, en especial su teléfono celular, correo electrónico y dirección de habitación.</li>
                <li>Conteste de forma clara y precisa las preguntas de seguridad que le haga el operador.</li>
                <li>Evite que terceras personas realicen las operaciones por usted o usen sus datos para realizarlas.</li>
                <li>No haga, realice o reciba operaciones de dinero de personas desconocidas.</li>
              </ul>
            </section>

            <section className={styles.section}>
              <h2>Consejos adicionales para No ser Víctima de Fraude</h2>
              <ul>
                <li><strong>Asegúrate de saber a quién le envías dinero.</strong></li>
                <li>En caso de recibir un e-mail o SMS de un desconocido ofreciéndote premios o compartir contigo una gran fortuna, solicitando enviar dinero para diferentes trámites y una vez lo hagas, puede perder contacto con esa persona y su dinero.</li>
                <li>Cuando recibas un SMS de un familiar en apuros, ¡DESCONFÍA! Se ha vuelto muy popular solicitar dinero para solucionar la situación difícil de un familiar, puede ser UN FRAUDE. Debe verificar antes de actuar porque podrás ser estafado y perderás tu dinero.</li>
                <li>No realices envíos a personas que no conoces. Desconfía de personas que te indiquen que realices la transferencia a su nombre o de un familiar y que después realice el cambio de nombre del Beneficiario. Mantenerte alerta y ser prudente son las mejores medidas para navegar de forma segura.</li>
                <li>En las redes ten precaución con quien compartes tu información privada, fotos o videos, personas inescrupulosas pueden extorsionarte para no hacer público este contenido. Tu privacidad es un bien muy preciado, ¡cuídalo!</li>
              </ul>
              <p className={styles.important}>
                <strong>EN CASA DE CAMBIOS INSULAR, S.A. NUNCA TE PEDIREMOS DATOS CONFIDENCIALES POR TELÉFONO NI CORREOS ELECTRÓNICOS.</strong>
              </p>
            </section>
          </div>
        );
    }
  };

  // Update match counts for all tabs
  useEffect(() => {
    if (!searchQuery.trim()) {
      setMatchCounts({});
      setTotalMatches(0);
      setCurrentMatchIndex(0);
      return;
    }

    const searchTerm = searchQuery.trim();
    const counts: Record<string, number> = {};

    tabs.forEach(tab => {
      const docText = getDocumentText(tab.id);
      counts[tab.id] = countMatchesInDocument(docText, searchTerm);
    });

    setMatchCounts(counts);
  }, [searchQuery]);

  // Cleanup function to remove highlights
  const cleanupHighlights = () => {
    if (!contentRef.current) return;
    const highlights = contentRef.current.querySelectorAll('.search-highlight');
    highlights.forEach(el => {
      const parent = el.parentNode;
      if (parent) {
        try {
          const textNode = document.createTextNode(el.textContent || '');
          parent.replaceChild(textNode, el);
        } catch (e) {
          // Silently ignore if node is already removed
        }
      }
    });
    // Normalize to merge adjacent text nodes
    if (contentRef.current) {
      try {
        contentRef.current.normalize();
      } catch (e) {
        // Silently ignore normalization errors
      }
    }
  };

  // Clean up highlights IMMEDIATELY when activeTab changes (before React re-renders content)
  useEffect(() => {
    // This runs synchronously when activeTab changes, cleaning up before new content renders
    return () => {
      cleanupHighlights();
    };
  }, [activeTab]);

  // Search and highlight functionality
  useEffect(() => {
    // Wait a tick to let React render the new content first
    const timeoutId = setTimeout(() => {
      if (!searchQuery.trim() || !contentRef.current) {
        cleanupHighlights();
        setHighlightedContent(null);
        allMatchesRef.current = [];
        setTotalMatches(0);
        setCurrentMatchIndex(0);
        return;
      }

      const searchTerm = searchQuery.trim().toLowerCase();
      const contentElement = contentRef.current;

      // Clean up old highlights first
      cleanupHighlights();

      // Find and highlight all text nodes containing the search term
      const textNodes: Node[] = [];
      const walker = document.createTreeWalker(
        contentElement,
        NodeFilter.SHOW_TEXT,
        null
      );

      let node;
      while ((node = walker.nextNode())) {
        if (node.textContent && node.textContent.toLowerCase().includes(searchTerm)) {
          textNodes.push(node);
        }
      }

      // Highlight each match and collect all matches
      const matches: Element[] = [];
      textNodes.forEach(node => {
        const parent = node.parentNode;
        if (!parent || parent.nodeName === 'SCRIPT' || parent.nodeName === 'STYLE') return;

        const text = node.textContent || '';
        const lowerText = text.toLowerCase();
        let lastIndex = 0;
        const fragment = document.createDocumentFragment();

        let index = lowerText.indexOf(searchTerm);
        while (index !== -1) {
          // Add text before match
          if (index > lastIndex) {
            fragment.appendChild(document.createTextNode(text.substring(lastIndex, index)));
          }

          // Add highlighted match
          const mark = document.createElement('mark');
          mark.className = 'search-highlight';
          mark.textContent = text.substring(index, index + searchTerm.length);
          fragment.appendChild(mark);
          matches.push(mark);

          lastIndex = index + searchTerm.length;
          index = lowerText.indexOf(searchTerm, lastIndex);
        }

        // Add remaining text
        if (lastIndex < text.length) {
          fragment.appendChild(document.createTextNode(text.substring(lastIndex)));
        }

        parent.replaceChild(fragment, node);
      });

      allMatchesRef.current = matches;
      setTotalMatches(matches.length);
      setCurrentMatchIndex(matches.length > 0 ? 0 : -1);

      // Highlight first match and scroll to it
      if (matches.length > 0) {
        matches[0].classList.add('search-highlight-current');
        setTimeout(() => {
          matches[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
      }
    }, 100);

    // Cleanup function to remove highlights when effect is cleaned up
    return () => {
      clearTimeout(timeoutId);
      cleanupHighlights();
    };
  }, [searchQuery, activeTab]);

  // Navigate to next match
  const navigateToNextMatch = () => {
    if (allMatchesRef.current.length === 0) return;

    const currentMatch = allMatchesRef.current[currentMatchIndex];
    if (currentMatch) {
      currentMatch.classList.remove('search-highlight-current');
    }

    const nextIndex = (currentMatchIndex + 1) % allMatchesRef.current.length;
    setCurrentMatchIndex(nextIndex);

    const nextMatch = allMatchesRef.current[nextIndex];
    if (nextMatch) {
      nextMatch.classList.add('search-highlight-current');
      nextMatch.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Navigate to previous match
  const navigateToPreviousMatch = () => {
    if (allMatchesRef.current.length === 0) return;

    const currentMatch = allMatchesRef.current[currentMatchIndex];
    if (currentMatch) {
      currentMatch.classList.remove('search-highlight-current');
    }

    const prevIndex = currentMatchIndex - 1 < 0 ? allMatchesRef.current.length - 1 : currentMatchIndex - 1;
    setCurrentMatchIndex(prevIndex);

    const prevMatch = allMatchesRef.current[prevIndex];
    if (prevMatch) {
      prevMatch.classList.add('search-highlight-current');
      prevMatch.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <>
      <SEO
        title="Información Legal"
        description="Política de cookies, privacidad (LOPD), términos y condiciones y prevención LC/FT/FPADM de Taller360. Transparencia y cumplimiento normativo."
        keywords="política privacidad, términos condiciones, cookies, LOPD, prevención lavado dinero, casa de cambio legal"
        canonical="/legal"
        ogImage="/images/og/taller360-legal.jpg"
        ogImageAlt="Información Legal - Taller360"
      />

      <Section className={styles.legalPage}>
        <div className="container">
          <div className={styles.legalGrid}>
            {/* Sidebar with tabs */}
            <aside className={styles.sidebar}>
              <div className={styles.sidebarSticky}>
                <div className={styles.searchBar}>
                  <input
                    type="text"
                    placeholder="Buscar por palabra"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={styles.searchInput}
                  />
                  <Search className={styles.searchIcon} size={16} strokeWidth={2} />

                  {searchQuery && (
                    <div className={styles.searchNavigation}>
                      <button
                        onClick={() => setSearchQuery('')}
                        className={styles.clearButton}
                        aria-label="Limpiar búsqueda"
                        title="Limpiar búsqueda"
                      >
                        ✕
                      </button>
                      {totalMatches > 0 && (
                        <>
                          <span className={styles.matchCounter}>
                            {currentMatchIndex + 1}/{totalMatches}
                          </span>
                          <button
                            onClick={navigateToPreviousMatch}
                            className={styles.navButton}
                            aria-label="Resultado anterior"
                            title="Resultado anterior"
                          >
                            <ChevronUp size={14} strokeWidth={2} />
                          </button>
                          <button
                            onClick={navigateToNextMatch}
                            className={styles.navButton}
                            aria-label="Siguiente resultado"
                            title="Siguiente resultado"
                          >
                            <ChevronDown size={14} strokeWidth={2} />
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>

                <nav className={styles.tabNav}>
                  {tabs.map((tab) => {
                    const IconComponent = tab.icon;
                    const hasMatches = matchCounts[tab.id] > 0;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => handleTabChange(tab.id)}
                        className={`${styles.tabButton} ${activeTab === tab.id ? styles.tabButtonActive : ''}`}
                      >
                        <IconComponent className={styles.tabIcon} size={18} strokeWidth={2} />
                        <span className={styles.tabLabel}>{tab.label}</span>
                        {hasMatches && searchQuery && (
                          <span className={styles.matchIndicator} title={`${matchCounts[tab.id]} resultado${matchCounts[tab.id] > 1 ? 's' : ''}`}>
                            {matchCounts[tab.id]}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>
            </aside>

            {/* Main content */}
            <main className={styles.content}>
              <div key={activeTab} ref={contentRef} className={styles.contentInner}>
                {getContent()}
              </div>
            </main>
          </div>
        </div>
      </Section>
    </>
  );
};

export default Legal;

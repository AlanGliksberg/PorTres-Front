import React, { useEffect, useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { CustomText } from "@/src/components";
import { AuthStackParamList } from "@/src/types";
import { colors } from "@/src/theme";
import { NavigationProp, RouteProp, useRoute } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./TermsAndConditions.styles";
import { APP_EMAIL } from "@/src/constants/config";

type TabKey = "terms" | "privacy";

const TermsAndConditions: React.FC = () => {
  const navigation = useNavigation<NavigationProp<AuthStackParamList>>();
  const route = useRoute<RouteProp<AuthStackParamList, "TermsAndConditions">>();
  const [activeTab, setActiveTab] = useState<TabKey>("terms");

  useEffect(() => {
    if (route.params?.tab === "privacy") setActiveTab("privacy");
    else if (route.params?.tab === "terms") setActiveTab("terms");
  }, [route.params?.tab]);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={18} color={colors.primary} />
        <CustomText type="small" style={styles.backText}>
          Volver
        </CustomText>
      </TouchableOpacity>

      <CustomText.Title style={styles.title}>
        Términos y Condiciones
      </CustomText.Title>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "terms" && styles.tabButtonActive,
          ]}
          onPress={() => setActiveTab("terms")}
        >
          <CustomText
            type="body"
            style={[
              styles.tabText,
              activeTab === "terms" && styles.tabTextActive,
            ]}
          >
            T&C
          </CustomText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "privacy" && styles.tabButtonActive,
          ]}
          onPress={() => setActiveTab("privacy")}
        >
          <CustomText
            type="body"
            style={[
              styles.tabText,
              activeTab === "privacy" && styles.tabTextActive,
            ]}
          >
            Política de Privacidad
          </CustomText>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {activeTab === "terms" ? (
          <View style={styles.card}>
            <CustomText type="body" style={styles.updateDate}>
              Fecha de Última Actualización: 1 de diciembre de 2025
            </CustomText>
            <CustomText type="body" style={styles.paragraph}>
              {`Bienvenido a PorTres. Estos Términos y Condiciones ("T&C") rigen el acceso y uso de nuestra aplicación móvil y servicios relacionados, cuyo objetivo principal es conectar a jugadores de pádel dentro del territorio de la República Argentina. La Aplicación es una herramienta de intermediación para la conexión de jugadores, facilitando la creación de encuentros y un sistema de cálculo de ranking entre los jugadores. Al acceder, navegar o utilizar la Aplicación, usted ("El Usuario") acepta todos los términos y condiciones de la presente. Si no está de acuerdo con alguna parte de estos términos, no debe utilizar la Aplicación.`}
            </CustomText>

            <CustomText type="body" style={styles.sectionTitle}>
              1. REGISTRO Y CUENTA DE USUARIO
            </CustomText>
            <CustomText type="body" style={styles.paragraph}>
              1.1. Elegibilidad: Para utilizar la Aplicación, el Usuario debe
              ser mayor de 16 años. Usuarios entre 16 y 17 años declaran contar
              con la debida autorización de sus padres, tutores o responsable
              legal para utilizar la Aplicación y cumplir con estos T&C. Los
              responsables legales son enteramente responsables por la conducta
              y cualquier costo asociado al uso de la cuenta del menor.
            </CustomText>
            <CustomText type="body" style={styles.paragraph}>
              1.2. Datos de Registro: El Usuario se compromete a proporcionar
              información verdadera, precisa y completa durante el proceso de
              registro (nombre, apellido y correo electrónico). La foto de
              perfil y el número de teléfono celular son opcionales. Para
              registrarse en la aplicación deberá proporcionar los datos
              solicitados y su correo electrónico y contraseña. El correo
              electrónico será la vía principal de comunicación entre el usuario
              y el servicio. PorTres utilizará también el correo electrónico del
              usuario para el envío de comunicaciones comerciales o de
              marketing.
            </CustomText>
            <CustomText type="body" style={styles.paragraph}>
              El usuario deberá proporcionarnos información respecto de su
              Posición y Categoría de juego (Drive o Revés) y, asimismo,
              seleccionar su Categoría inicial (del 1 al 9, para Hombres o
              Mujeres). En caso que el Usuario desconozca su categoría, deberá
              responder un cuestionario para que la Aplicación determine una
              categoría inicial sugerida.
            </CustomText>
            <CustomText type="body" style={styles.paragraph}>
              1.4. Responsabilidad de la Cuenta: El Usuario es el único
              responsable de mantener la confidencialidad de su contraseña y
              todas las actividades que lleve a cabo en relación al uso de su
              cuenta quedan bajo su exclusiva responsabilidad.
            </CustomText>
            <CustomText type="body" style={styles.paragraph}>
              1.5. Aceptación de la Política de Privacidad: El Usuario declara
              haber leído y aceptado la Política de Privacidad de PorTres, la
              cual forma parte integral de estos T&C.
            </CustomText>

            <CustomText type="body" style={styles.sectionTitle}>
              2. SISTEMA DE CLASIFICACIÓN (RANKING ELO-PADEL)
            </CustomText>
            <CustomText type="body" style={styles.paragraph}>
              2.1. Funcionamiento: La Aplicación utiliza un sistema de ranking
              dinámico (ELO-Padel) basado en los resultados de los partidos
              ingresados. Este ranking busca reflejar la habilidad relativa de
              los jugadores.
            </CustomText>
            <CustomText type="body" style={styles.paragraph}>
              2.2. Categorías: Existen 9 categorías (1 siendo la más alta y 9 la
              más baja) para hombres y 9 para mujeres.
            </CustomText>
            <CustomText type="body" style={styles.paragraph}>
              2.3. Impacto de Resultados: El sistema ELO-Padel penalizará el
              ranking del Usuario en función de la diferencia de categoría con
              el oponente. La pérdida contra un jugador de menor categoría
              resultará en una disminución de puntos de ranking superior a la
              pérdida contra un jugador de categoría superior.
            </CustomText>
            <CustomText type="body" style={styles.paragraph}>
              2.4. Propiedad y Ajuste del Ranking: El ranking ELO-Padel es una
              metodología interna de la Aplicación, propiedad exclusiva de
              PorTres y registrada como software en la Dirección Nacional de
              Derechos de Autor. La Aplicación se reserva el derecho de
              modificar la fórmula de cálculo del ranking o de recategorizar
              directamente a cualquier Usuario basándose en la interacción entre
              jugadores o bien en la propia valoración de la Aplicación, sin que
              esto constituya una violación a los derechos del Usuario.
            </CustomText>
            <CustomText type="body" style={styles.paragraph}>
              2.5. Validación de Resultados: El resultado de un partido puede
              ser ingresado por cualquiera de los cuatro jugadores
              participantes. Para que el resultado sea validado o impacte en el
              Ranking generado por la aplicación, deberá ser confirmado por al
              menos un integrante del equipo rival. Si el resultado no es
              confirmado o si existe una discrepancia, el partido entrará en
              estado de Disputa.
            </CustomText>
            <CustomText type="body" style={styles.paragraph}>
              2.6. Disputas y Anulación: En caso de Disputa, PorTres podrá
              sujetar la misma a un proceso de mediación interna; en caso de que
              esta vía arroje un resultado infructuoso, la aplicación podrá
              dirimir el conflicto decidiendo anular el partido sin ajuste de
              ranking, no asumiendo responsabilidad alguna respecto de la
              controversia suscitada entre las partes.
            </CustomText>

            <CustomText type="body" style={styles.sectionTitle}>
              3. ORGANIZACIÓN DE PARTIDOS Y COMUNICACIÓN
            </CustomText>
            <CustomText type="body" style={styles.paragraph}>
              3.1. Propósito de la Aplicación: La Aplicación actúa
              exclusivamente como una herramienta de intermediación para la
              conexión de jugadores, facilitando la creación de encuentros.
            </CustomText>
            <CustomText type="body" style={styles.paragraph}>
              3.2. Responsabilidad en la Organización: El Usuario es el único
              responsable de la logística de los partidos, incluyendo: la
              reserva y el pago de la cancha, el acuerdo sobre la fecha, hora y
              lugar, y el cumplimiento de las normas de las instalaciones
              deportivas.
            </CustomText>
            <CustomText type="body" style={styles.paragraph}>
              3.3. Uso de la Información para Coordinación: Al postularse a un
              partido o crear uno, el Usuario acepta que su nombre, apellido,
              categoría y foto de perfil (si la subió), serán visibles para los
              demás jugadores involucrados en el partido con el único fin de
              permitir la coordinación del encuentro.
            </CustomText>
            <CustomText type="body" style={styles.paragraph}>
              3.4. Información Opcional en Postulaciones: En el proceso de
              postulación a un partido, el Usuario podrá, de forma voluntaria,
              proporcionar su número de teléfono celular y un mensaje personal
              al creador del partido. Esta información es compartida bajo la
              exclusiva responsabilidad del Usuario que la facilita.
            </CustomText>
            <CustomText type="body" style={styles.paragraph}>
              3.5. Conducta: El Usuario se compromete a mantener una conducta
              respetuosa, ética y deportiva dentro y fuera de la Aplicación.
              Está prohibido el acoso, la discriminación, el lenguaje ofensivo o
              cualquier actividad ilegal.
            </CustomText>
            <CustomText type="body" style={styles.paragraph}>
              3.6. Reporte de Partidos Externos: El Usuario podrá reportar
              resultados de partidos de pádel no organizados o creados
              directamente a través de la Aplicación. Estos partidos estarán
              sujetos a las mismas reglas de validación (2.5) e impacto en el
              Ranking que los partidos organizados en la App, y no tienen una
              fecha límite para ser reportados.
            </CustomText>

            <CustomText type="body" style={styles.sectionTitle}>
              4. EXCLUSIÓN TOTAL Y LIMITACIÓN DE RESPONSABILIDAD
            </CustomText>
            <CustomText type="body" style={styles.paragraph}>
              4.1. CLÁUSULA DE EXENCIÓN DE RESPONSABILIDAD ABSOLUTA: EL USUARIO
              RECONOCE Y ACEPTA QUE PORTRES NO ES UN ORGANIZADOR DE EVENTOS
              DEPORTIVOS, UN PROVEEDOR DE SERVICIOS DE RESERVA DE CANCHAS, NI
              UNA PARTE EN NINGÚN CONTRATO O ACUERDO ENTRE USUARIOS PARA JUGAR
              UN PARTIDO DE PÁDEL. LA APLICACIÓN ES ÚNICAMENTE UN MEDIO DE
              CONTACTO.
            </CustomText>
            <CustomText type="body" style={styles.paragraph}>
              4.2. Exclusión de Responsabilidad por Daños: PorTres no se hace
              responsable bajo ningún concepto, causa o circunstancia por ningún
              tipo de daño, perjuicio o lesión (física, moral o material) que el
              Usuario o terceros puedan sufrir antes, durante o después de los
              partidos organizados o reportados a través de la Aplicación. El
              Usuario asume plenamente y bajo su riesgo los riesgos inherentes a
              la práctica deportiva del pádel. El Usuario declara bajo juramento
              contar con la aptitud física y médica necesaria para la práctica
              del pádel, deslindando a PorTres de toda responsabilidad derivada
              de su estado de salud o falta de aptitud.
            </CustomText>
            <CustomText type="body" style={styles.paragraph}>
              4.3. Exclusión de Responsabilidad Financiera y Operacional:
              PorTres no se hará cargo ni responsable por: a) cualquier daño
              económico o monetario derivado de cancelaciones, inasistencias,
              incumplimiento de acuerdos, disputas financieras o gastos
              incurridos por el Usuario (incluyendo, sin limitación, el costo de
              canchas, pelotas o traslados); b) cancelaciones de partidos,
              retrasos o inasistencias de otros jugadores; c) la calidad o
              condiciones de las canchas de pádel o las instalaciones deportivas
              utilizadas.
            </CustomText>

            <CustomText type="body" style={styles.sectionTitle}>
              5. PROPIEDAD INTELECTUAL Y USO DEL CONTENIDO
            </CustomText>
            <CustomText type="body" style={styles.paragraph}>
              5.1. Propiedad de la Aplicación: Todo el código, diseño, la
              interfaz de usuario, los logotipos y, específicamente, el
              algoritmo del ranking ELO-Padel son propiedad exclusiva de PorTres
              y están protegidos por las leyes de propiedad intelectual.
            </CustomText>
            <CustomText type="body" style={styles.paragraph}>
              5.2. Contenido del Usuario: Al cargar contenido (fotos o
              mensajes), el Usuario otorga a PorTres una licencia gratuita para
              utilizar, reproducir, modificar y mostrar dicho contenido dentro
              de la Aplicación con el único fin de proveer el servicio.
            </CustomText>
            <CustomText type="body" style={styles.paragraph}>
              5.3. Uso Promocional: El Usuario, al subir su foto de perfil (si
              es opcional) y/o proporcionar cualquier testimonio o comentario
              sobre la Aplicación, otorga a PorTres el derecho a utilizar dicho
              contenido, su nombre y/o su imagen con fines de marketing,
              promoción y publicidad de la Aplicación en cualquier medio.
            </CustomText>

            <CustomText type="body" style={styles.sectionTitle}>
              6. DISPOSICIONES FINALES
            </CustomText>
            <CustomText type="body" style={styles.paragraph}>
              6.1. Ley Aplicable y Jurisdicción: Estos T&C se rigen e
              interpretan de acuerdo con las leyes de la República Argentina.
              Cualquier disputa que surja en relación con estos T&C será
              sometida a mediación dentro del sistema de la aplicación; en caso
              de no resolverse, el usuario podrá recurrir a la jurisdicción de
              los tribunales ordinarios de la Ciudad Autónoma de Buenos Aires
              (CABA).
            </CustomText>
            <CustomText type="body" style={styles.paragraph}>
              6.2. Modificaciones: PorTres se reserva el derecho de modificar
              estos T&C en cualquier momento. Las modificaciones entrarán en
              vigor inmediatamente después de su publicación en la Aplicación.
            </CustomText>
            <CustomText type="body" style={styles.paragraph}>
              6.3. Propiedad: PorTres es propiedad de los Sres. Matias Gejtman,
              Iñaki Serra Lahunsembarne y Alan Gliksberg, o bien de la entidad
              legal que estos en el futuro constituyan.
            </CustomText>

            <CustomText type="body" style={styles.sectionTitle}>
              7. SUSPENSIÓN, TERMINACIÓN Y SANCIONES
            </CustomText>
            <CustomText type="body" style={styles.paragraph}>
              7.1. Derecho de Baja y Sanciones: PorTres se reserva el derecho de
              suspender o dar de baja la cuenta de cualquier Usuario de forma
              temporal o definitiva, sin necesidad de justificación ni previo
              aviso, si: a) recibe denuncias fundamentadas de otros Usuarios
              enviadas al correo electrónico de contacto oficial ({APP_EMAIL});
              b) se detectan intentos de fraude o manipulación del ranking o del
              sistema de partidos; c) se incumple cualquier punto de estos T&C,
              incluyendo faltas de respeto o inasistencias (No-Shows), cuya
              gravedad será determinada por PorTres a su exclusivo criterio; d)
              si la denuncia involucra contenido ilegal u ofensivo. PorTres se
              compromete a realizar las gestiones necesarias para eliminar el
              contenido y/o suspender la cuenta en un plazo de 72 horas desde la
              recepción de la denuncia en el mail oficial.
            </CustomText>
            <CustomText type="body" style={styles.paragraph}>
              7.2. Revisión de Categoría: La Aplicación podrá revisar y
              modificar la categoría inicial o actual del Usuario si recibe
              reportes consistentes sobre un nivel de juego que no se
              corresponde con su ranking o por malos comentarios respecto a su
              comportamiento.
            </CustomText>
            <CustomText type="body" style={styles.paragraph}>
              CONTACTO: Si tiene alguna pregunta o inquietud sobre estos
              Términos y Condiciones, por favor, contáctenos en
              {APP_EMAIL}.
            </CustomText>
          </View>
        ) : (
          <View style={styles.card}>
            <CustomText type="body" style={styles.updateDate}>
              Fecha de Vigencia: 1 de diciembre de 2025
            </CustomText>
            <CustomText type="body" style={styles.paragraph}>
              {`Esta Política de Privacidad describe cómo PorTres (en adelante, "Nosotros", "La Empresa" o "PorTres") recopila, utiliza, divulga y protege la información personal de los usuarios ("Usuarios" o "Usted") de nuestra aplicación móvil PorTres. Al utilizar nuestra Aplicación, Usted acepta las prácticas descritas en esta Política de Privacidad.`}
            </CustomText>
            <CustomText type="body" style={styles.paragraph}>
              En concreto, se informa a los usuarios de nuestros servicios que
              sus datos de carácter personal sólo podrán obtenerse para su
              tratamiento cuando sean adecuados, pertinentes y no excesivos en
              relación con el ámbito y las finalidades determinadas, explícitas
              y legítimas para las que se hayan obtenido. Cuando se recaben los
              datos personales, se informará previamente al usuario, de forma
              clara e inequívoca, de los extremos detallados en esta política.
            </CustomText>

            <CustomText type="body" style={styles.sectionTitle}>
              1. RESPONSABLE DEL TRATAMIENTO Y REGISTRO
            </CustomText>
            <CustomText type="body" style={styles.paragraph}>
              1.1. Identidad: PorTres, propiedad de los Sres. Matias Gejtman,
              Iñaki Serra Lahunsembarne y Alan Gliksberg, o de la entidad legal
              que estos designen.
            </CustomText>
            <CustomText type="body" style={styles.paragraph}>
              1.2. Domicilio de Contacto: Ciudad Autónoma de Buenos Aires,
              Argentina.
            </CustomText>
            <CustomText type="body" style={styles.paragraph}>
              1.3. Contacto: {APP_EMAIL}
            </CustomText>
            <CustomText type="body" style={styles.paragraph}>
              1.4. Registro de Base de Datos: PorTres se compromete a registrar
              las bases de datos que contienen información personal de sus
              Usuarios ante la Agencia de Acceso a la Información Pública (AAIP)
              de la República Argentina, en cumplimiento de la Ley N° 25.326.
            </CustomText>

            <CustomText type="body" style={styles.sectionTitle}>
              2. INFORMACIÓN RECOPILADA Y CONSENTIMIENTO
            </CustomText>
            <CustomText type="body" style={styles.paragraph}>
              2.1. Consentimiento Expreso: La recolección de sus datos
              personales se realiza únicamente a través de su consentimiento
              libre, expreso e informado al momento de la registración y
              aceptación de nuestra Política de Privacidad y de sus Términos y
              Condiciones.
            </CustomText>
            <CustomText type="body" style={styles.paragraph}>
              2.2. Información Personal Recopilada Directamente: Datos de
              Registro Obligatorios: Nombre, apellido, correo electrónico. Datos
              de Juego Obligatorios: Categoría de juego (del 1 al 9) y Posición
              (Drive/Revés). Datos Opcionales y Voluntarios: Foto de perfil,
              número de teléfono celular y mensajes personales en postulaciones.
            </CustomText>
            <CustomText type="body" style={styles.paragraph}>
              2.3. Información de Uso Recopilada Automáticamente: Datos de
              Partidos (resultados, fechas, horarios y ubicación de los partidos
              creados o reportados), Datos de Ranking (puntaje actual, historial
              de ajustes, victorias y derrotas), Datos Técnicos (tipo de
              dispositivo, sistema operativo, identificadores únicos del
              dispositivo y datos de conexión).
            </CustomText>
            <CustomText type="body" style={styles.paragraph}>
              2.4. Tratamiento de Datos de Menores (16 a 17 años): Los Usuarios
              entre 16 y 17 años pueden registrarse. Al hacerlo, manifiestan
              contar con la debida autorización de sus padres, tutores o
              responsable legal. PorTres asume que dicha autorización ha sido
              otorgada.
            </CustomText>

            <CustomText type="body" style={styles.sectionTitle}>
              3. FINALIDAD DEL TRATAMIENTO DE LOS DATOS (USOS)
            </CustomText>
            <CustomText type="body" style={styles.paragraph}>
              La información personal es utilizada exclusivamente para las
              siguientes finalidades:
            </CustomText>
            <CustomText type="body" style={styles.paragraph}>
              3.1. Provisión del Servicio Principal: Crear y gestionar su cuenta
              de Usuario; calcular y ajustar su Ranking ELO-Padel para asegurar
              que juegue con personas de su mismo nivel; permitirle crear,
              postularse y coordinar partidos de pádel con otros Usuarios;
              mostrar su nombre, apellido, categoría y foto de perfil a otros
              Usuarios involucrados en un partido para facilitar la
              coordinación.
            </CustomText>
            <CustomText type="body" style={styles.paragraph}>
              3.2. Comunicación y Marketing: Enviar notificaciones esenciales
              relacionadas con el servicio (confirmaciones de partidos,
              disputas, cambios de ranking, recordatorios de login). Utilizar su
              correo electrónico para el envío de comunicaciones comerciales,
              promociones o noticias sobre PorTres.
            </CustomText>
            <CustomText type="body" style={styles.paragraph}>
              3.3. Mejora del Servicio y Análisis: Analizar patrones de uso y
              comportamiento para mejorar la funcionalidad y la interfaz de la
              Aplicación. Utilizar datos históricos de partidos para afinar la
              precisión y justicia del sistema de ranking ELO-Padel.
            </CustomText>

            <CustomText type="body" style={styles.sectionTitle}>
              4. ALMACENAMIENTO, SEGURIDAD Y CONSERVACIÓN
            </CustomText>
            <CustomText type="body" style={styles.paragraph}>
              4.1. Ubicación del Hosting de Datos: Los datos de los usuarios se
              almacenan en servidores de terceros confiables. Actualmente,
              PorTres utiliza Google Cloud Platform y Firebase para el
              alojamiento y gestión de las bases de datos. Los datos se
              almacenan en centros de datos ubicados fuera de Argentina que
              cumplen con estándares internacionales de seguridad.
            </CustomText>
            <CustomText type="body" style={styles.paragraph}>
              4.2. Medidas de Seguridad: Implementamos medidas técnicas y
              organizativas adecuadas para proteger su información personal
              contra el acceso no autorizado, la alteración, divulgación o
              destrucción.
            </CustomText>
            <CustomText type="body" style={styles.paragraph}>
              4.3. Plazo de Conservación de Datos: Sus datos de cuenta
              (registro, contacto, perfil) se conservarán mientras Usted
              mantenga activa su cuenta. En caso de baja de la cuenta, sus datos
              personales serán eliminados o anonimizados en un plazo máximo de
              60 días, excepto aquellos que deban conservarse por obligación
              legal. Los datos de historial de partidos se conservarán de manera
              anonimizada de forma indefinida, ya que son esenciales para el
              funcionamiento y la mejora continua del algoritmo ELO-Padel.
            </CustomText>

            <CustomText type="body" style={styles.sectionTitle}>
              5. DERECHOS DE LOS USUARIOS
            </CustomText>
            <CustomText type="body" style={styles.paragraph}>
              El titular de datos tiene derecho a obtener confirmación sobre si
              PorTres trata datos personales que le conciernen y, en tal caso, a
              acceder a sus datos personales, solicitar la rectificación de los
              datos inexactos o solicitar su supresión cuando los datos ya no
              sean necesarios para los fines que fueron recogidos.
            </CustomText>
            <CustomText type="body" style={styles.paragraph}>
              En determinadas circunstancias, el titular de datos podrá
              solicitar la limitación del tratamiento de sus datos, en cuyo caso
              únicamente los conservaremos para el ejercicio o la defensa de
              reclamaciones. También podrá oponerse a la toma de decisiones
              basadas en el tratamiento automatizado de sus datos y solicitar la
              intervención personal de un analista.
            </CustomText>
            <CustomText type="body" style={styles.paragraph}>
              El titular podrá solicitar la portabilidad de sus datos para que
              estos sean remitidos directamente a la entidad por él designada en
              un formato estructurado, de uso común y lectura mecánica. Puede
              retirar el consentimiento otorgado para el tratamiento en
              cualquier momento.
            </CustomText>
            <CustomText type="body" style={styles.paragraph}>
              Procedimiento para el ejercicio de derechos: Puede remitir un
              email a {APP_EMAIL} expresando con claridad su petición y
              aportando los datos necesarios para su identificación. En un plazo
              de 10 días corridos PorTres responderá indicando las acciones a
              seguir. El derecho de acceso podrá ser ejercido de forma gratuita
              en intervalos no inferiores a seis meses, salvo interés legítimo
              conforme artículo 14 inciso 3 de la Ley 25.326. La Agencia de
              Acceso Público a la Información tiene la atribución de atender
              denuncias y reclamos vinculados a la protección de datos
              personales.
            </CustomText>

            <CustomText type="body" style={styles.sectionTitle}>
              6. USO DE COOKIES
            </CustomText>
            <CustomText type="body" style={styles.paragraph}>
              La Página Web podría utilizar cookies para rastrear patrones de
              tráfico. Los Usuarios pueden configurar su navegador para recibir
              avisos o rechazar cookies. El uso de cookies, salvo las
              estrictamente necesarias, está sujeto al permiso previo del
              usuario mediante confirmación expresa de su aceptación y
              almacenamiento seguro de dicho consentimiento.
            </CustomText>

            <CustomText type="body" style={styles.sectionTitle}>
              7. MODIFICACIONES A LA POLÍTICA DE PRIVACIDAD
            </CustomText>
            <CustomText type="body" style={styles.paragraph}>
              PorTres se reserva el derecho de modificar esta Política de
              Privacidad. Notificaremos a los Usuarios sobre cualquier cambio
              material a través de la Aplicación o por correo electrónico. El
              uso continuado de la Aplicación después de la publicación de las
              modificaciones constituirá su aceptación de los nuevos términos.
            </CustomText>
            <CustomText type="body" style={styles.paragraph}>
              CONTACTO: Si tiene alguna pregunta o inquietud sobre esta Política
              de Privacidad, por favor, contáctenos en {APP_EMAIL}.
            </CustomText>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default TermsAndConditions;

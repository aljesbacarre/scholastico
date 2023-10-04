const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const WebWhatsappProvider = require('@bot-whatsapp/provider/web-whatsapp')
const MockAdapter = require('@bot-whatsapp/database/mock')

const flowSecundario = addKeyword(['Fin', 'siguiente', 'Gracias']).addAnswer(['📄 Agradecemos tu confianza, recuerda que deseamos que tengas una experiencia extraordinaria'])

const flowFacturación = addKeyword(['Facturación', 'Factura', 'Facturacion','1']).addAnswer(
    [
        '📄 Te compartimos el manual para realizar tu facturación.',
        'https://drive.google.com/file/d/1bEFi_WqzgHrkopvrfbNf284pwN-0Uj_e/view?usp=sharing',
        'Sí la falla persíste por favor comunícate con *Gabriela Camacho* al telefóno 📞 *55 7373 5359* en un horario de *lunes a viernes de 6:00 - 15:00*  ó  con  *Juan Castañeda*  al telefóno 📞 *55 1609 6692* en horario de *09:00 - 19:00.*',
        '\n Escríbe *Gracias* para finalizar.'
    ],
    null,
    null,
    [flowSecundario]
)

const flowTec = addKeyword(['Emergencia', 'Emergencias','5']).addAnswer(
    [
        '🚨 Nuestro número telefóno de *Emergencia Tec* es *Nido CEM* 📞 *55 7980 9699*',
        ' \n  Escríbe *Gracias* para finalizar.'
    ],
    null,
    null,
    [flowSecundario]
    
)

const flowServicio = addKeyword(['Servicio', 'Atención','4']).addAnswer(
    [
        '⭐ Por favor comunícate con *Gabriela Camacho* al telefóno 📞 *55 7373 5359* en un horario de *lunes a viernes de 6:00 - 15:00*  ó  con  *Juan Castañeda*  al telefóno 📞 *55 1609 6692* en horario de *09:00 - 19:00.*',
        ' \n  Escríbe *Gracias* para finalizar.'
    ],
    null,
    null,
    [flowSecundario]
    
)

const flowReporte = addKeyword(['Reporte','Queja','2'])
.addAction(async (_, { flowDynamic }) => {
    return flowDynamic('📄 *Scholastico* lamenta el mal tiempo dentro de la unidad. *Te ofrecemos una disculpa, nos podrías relatar los hechos, ruta y horario.* Lo compartido será enviado de forma inmediata al área operativa.')
})
.addAction({ capture: true }, async (ctx, { flowDynamic, state }) => {
    state.update({ reporteu: ctx.body })
    return (flowDynamic`✅Hemos registado tu reporte, *nos pondremos en contacto a la brevedad posible,agradecemos tu confianza*, recuerda que deseamos que tengas una experiencia extraordinaria ${ctx.body}`)
},
null,
null,
[flowSecundario]
)

const flowGracias = addKeyword(['grac']).addAnswer(
    [
        '🚀 Agradecemos  tu preferencia , te deseamos un gran día.',
    ],
    null,
    null,
    [flowSecundario]
)

const flowObjetos = addKeyword(['Objetos','3'])
.addAction(async (_, { flowDynamic }) => {
    return flowDynamic('🎒 Scholastico entiende la importancia de tus pertenencias , *por favor indícanos, ruta y horario, así como detalles  del objeto agregando una descripción o foto.*')
})
.addAction({ capture: true }, async (ctx, { flowDynamic, state }) => {
    state.update({ reporteo: ctx.body })
    return (flowDynamic`✅Hemos registado tu reporte, *nos pondremos en contacto a la brevedad posible,agradecemos tu confianza* , recuerda que deseamos que tengas una experiencia extraordinaria ${ctx.body}`)
},
null,
null,
[flowSecundario]
)

const flowPrincipal = addKeyword(['hola', 'ole', 'alo','Reinicio', 'Iniciar','Menú','Menu','Buen día','Buenos días','Buenos tardes','Buenos noches','0'])
    .addAnswer(
            '*Hola, buen día,* 🙋 Soy tu asesor inteligente, antes de iniciar: *¿Me puedes proporcionar tu nombre?* ',
            {
                capture: true,
            },
            async (ctx, { flowDynamic, state }) => {
                state.update({ name: ctx.body })
                flowDynamic('🆔 *Gracias, te regístramos*')
            }
        )
        .addAnswer(
            '*¿Me podrías compartir tu correo electrónico?*',
            {
                capture: true,
            },
            async (ctx, { flowDynamic, state }) => {
                state.update({  mail: ctx.body })
                const myState = state.getMyState()
                await flowDynamic(`✉️ *Regístramos tu correo:* ${myState.mail}`)
            },
        )
 .addAnswer(
            '*Antes de terminar tu registro ¿Me podrías compartir tu matrícula?*',
            {
                capture: true,
            },
            async (ctx, { flowDynamic, state }) => {
                state.update({  matri: ctx.body })
                const myState = state.getMyState()
                await flowDynamic(`🪪 *Regístramos tu martrícula:* ${myState.matri}`)
            })
    .addAnswer(
        [
            'Gracias, a continuación te compartimos las opciones que tenemos para ti, *escribe* la más adecuada para continuar:',
            '👉 *1* o *Facturación*',
            '👉 *2* o *Reporte* Reporte a Conductor o Unidades',
            '👉 *3* o *Objetos* Reporte Objetos Perdidos',
            '👉 *4* o *Servicio* Servicio al cliente',
            '👉 *5* o *Emergencia* Emergencia Tec',
        ],
        null,
        null,
        [flowFacturación, flowGracias, flowReporte, flowObjetos, flowServicio , flowTec]
    )

const main = async () => {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([flowPrincipal])
    const adapterProvider = createProvider(WebWhatsappProvider)
    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })
    QRPortalWeb()
}

main()

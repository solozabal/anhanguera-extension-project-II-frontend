/**
 * @fileoverview Dados do quiz sobre descarte consciente de medicamentos
 * @description Contém perguntas, alternativas e configurações do quiz
 * @author Pedro Solozabal
 * @version 1.0.0
 * @package JS
 */

/**
 * Configurações gerais do sistema de quiz
 * @constant {Object} QUIZ_CONFIG
 * @description Define parâmetros e delays para operações do quiz
 */
const QUIZ_CONFIG = {
    /** @type {number} Número total de perguntas no quiz */
    TOTAL_PERGUNTAS: 5,
    /** @type {number} Pontuação máxima possível */
    PONTUACAO_MAXIMA: 5,
    /** @type {number} Limite para resultado excelente */
    RESULTADO_EXCELENTE: 5,
    /** @type {number} Limite para resultado bom */
    RESULTADO_BOM: 4,
    /** @type {number} Limite para resultado médio */
    RESULTADO_MEDIO: 3,
    /** @type {Object} Delays para animações e transições */
    DELAYS: {
        /** @type {number} Delay para scroll suave (ms) */
        SCROLL: 100,
        /** @type {number} Delay para animações (ms) */
        ANIMATION: 10,
        /** @type {number} Delay para scroll do feedback (ms) */
        FEEDBACK_SCROLL: 300,
        /** @type {number} Delay para scroll do resultado (ms) */
        RESULTADO_SCROLL: 500
    }
};

/**
 * Configurações de resultado baseadas na pontuação obtida
 * @constant {Object} RESULTADO_CONFIG
 * @description Mapeia pontuações para feedback personalizado
 */
const RESULTADO_CONFIG = {
    5: {
        classe: 'resultado-excelente',
        icone: '🏆',
        titulo: 'Parabéns! Você é um Expert!',
        mensagem: 'Você acertou todas as perguntas! Seu conhecimento sobre descarte consciente de medicamentos é excelente. Continue cuidando bem da sua saúde e do meio ambiente!'
    },
    4: {
        classe: 'resultado-bom',
        icone: '🌟',
        titulo: 'Muito Bem! Ótimo Desempenho!',
        mensagem: 'Você acertou quase todas as perguntas! Seu conhecimento é muito bom. Continue assim e revise os pontos que ainda têm dúvidas.'
    },
    3: {
        classe: 'resultado-medio',
        icone: '💪',
        titulo: 'Ei, você pode melhorar!',
        mensagem: 'Você acertou a maioria das perguntas, mas ainda há espaço para aprender mais. Que tal rever o conteúdo e tentar novamente?'
    },
    default: {
        classe: 'resultado-baixo',
        icone: '📚',
        titulo: 'Ei, tente novamente!',
        mensagem: 'Não desanime! O aprendizado leva tempo. Que tal revisar o conteúdo com calma e tentar de novo? Você vai se sair melhor!'
    }
};

/**
 * Array de perguntas do quiz sobre descarte consciente de medicamentos
 * @constant {Array<Object>} PERGUNTAS_QUIZ
 * @description Contém 5 perguntas educativas com alternativas e explicações detalhadas
 */
const PERGUNTAS_QUIZ = [
    {
        pergunta: "Onde a maioria das pessoas no Brasil (63%) joga os remédios que não usa mais ou que estão vencidos?",
        alternativas: [
            { 
                letra: "A)", 
                texto: "No lixo reciclável, junto com o papel e o plástico.", 
                correta: false, 
                explicacao: "Apenas 5% descartam no lixo reciclável. Essa prática não é correta, pois os medicamentos contaminam os materiais que seriam reaproveitados." 
            },
            { 
                letra: "B)", 
                texto: "No vaso sanitário ou na pia (descarte no esgoto).", 
                correta: false, 
                explicacao: "Descartar no esgoto (pia ou vaso) é feito por 8% das pessoas e é muito perigoso, pois os resíduos poluem os rios e mananciais, mesmo após o tratamento." 
            },
            { 
                letra: "C)", 
                texto: "No lixo comum, incluindo o lixo da cozinha e o lixo de banheiro.", 
                correta: true, 
                explicacao: "Infelizmente, 63% dos brasileiros jogam os medicamentos no lixo comum. Essa é a forma de descarte incorreto mais comum e a que mais expõe pessoas, animais e o meio ambiente a riscos de contaminação." 
            },
            { 
                letra: "D)", 
                texto: "Guardam no armário e não descartam.", 
                correta: false, 
                explicacao: "Não descartar medicamentos vencidos ou em desuso no local correto prolonga o risco de acidentes e contaminação dentro de casa." 
            }
        ]
    },
    {
        pergunta: "Qual é o maior perigo de jogar os remédios vencidos no lixo de casa ou na privada (esgoto)?",
        alternativas: [
            { 
                letra: "A)", 
                texto: "O farmacêutico não consegue saber se o remédio foi usado corretamente.", 
                correta: false, 
                explicacao: "O controle do farmacêutico é importante, mas o maior risco do descarte incorreto não é esse." 
            },
            { 
                letra: "B)", 
                texto: "O lixo fica mais pesado para o caminhão da coleta.", 
                correta: false, 
                explicacao: "O peso do lixo não é a principal preocupação ambiental." 
            },
            { 
                letra: "C)", 
                texto: "O remédio vai para os postos de saúde e contamina outros pacientes.", 
                correta: false, 
                explicacao: "O resíduo descartado de forma errada vai para o meio ambiente ou aterros, e não para os postos de saúde." 
            },
            { 
                letra: "D)", 
                texto: "Contaminação grave da água (lençol freático e rios) e do solo.", 
                correta: true, 
                explicacao: "Jogar medicamentos fora de forma incorreta causa poluição do solo, do lençol freático e da atmosfera, e os resíduos químicos podem permanecer nos rios mesmo depois do tratamento de esgoto, expondo pessoas e animais a riscos de contaminação." 
            }
        ]
    },
    {
        pergunta: "Para onde devemos levar os remédios vencidos, os restinhos de xarope ou as cartelas de comprimidos que sobraram?",
        alternativas: [
            { 
                letra: "A)", 
                texto: "Devemos enterrar no quintal ou no mato.", 
                correta: false, 
                explicacao: "Descartar em terra, no quintal ou no mato, é uma prática incorreta feita por 1% dos brasileiros e contamina diretamente o solo." 
            },
            { 
                letra: "B)", 
                texto: "Para os postos de coleta que ficam nas farmácias, drogarias ou unidades de saúde.", 
                correta: true, 
                explicacao: "O sistema de Logística Reversa, regulamentado em 2020, exige que os consumidores levem os medicamentos vencidos ou em desuso aos pontos de coleta específicos, localizados em farmácias, drogarias ou unidades de saúde. Estes locais têm coletores adequados para o descarte seguro." 
            },
            { 
                letra: "C)", 
                texto: "Devemos queimar os medicamentos para que eles sumam.", 
                correta: false, 
                explicacao: "Queimar ou descartar em cinereira (feito por 1%) também é incorreto e polui a atmosfera." 
            },
            { 
                letra: "D)", 
                texto: "Podemos misturar com o lixo orgânico para que o lixeiro recolha.", 
                correta: false, 
                explicacao: "O lixo orgânico faz parte do lixo comum. É a forma mais comum de descarte incorreto (63%) e causa contaminação ambiental." 
            }
        ]
    },
    {
        pergunta: "Quando levamos os remédios para o posto de coleta na farmácia, como devemos prepará-los?",
        alternativas: [
            { 
                letra: "A)", 
                texto: "Devemos tirar os comprimidos de dentro das cartelas (blisters) e colocar todos em um saco plástico.", 
                correta: false, 
                explicacao: "O consumidor deve levar os produtos de volta aos estabelecimentos da forma que estão, sem retirar dos blisters ou frascos." 
            },
            { 
                letra: "B)", 
                texto: "Devemos misturar os restos de xaropes com água antes de jogar fora.", 
                correta: false, 
                explicacao: "Não devemos manipular ou diluir os medicamentos que serão descartados." 
            },
            { 
                letra: "C)", 
                texto: "Devemos levar os produtos da forma que estão, dentro de seus frascos ou cartelas originais.", 
                correta: true, 
                explicacao: "O farmacêutico orienta que o consumidor leve os resíduos da forma que estão, para evitar a manipulação e a contaminação. Somente as caixas de papelão e as bulas (embalagens que não tiveram contato com o medicamento) podem ser colocadas para reciclagem em casa." 
            },
            { 
                letra: "D)", 
                texto: "Devemos levar apenas a caixa de papelão, pois é o que a farmácia precisa.", 
                correta: false, 
                explicacao: "As caixas de papelão e bulas podem ser recicladas em casa, mas o medicamento em si (comprimido, xarope, frasco) e suas embalagens primárias (blisters, vidros) devem ir para o coletor da farmácia." 
            }
        ]
    },
    {
        pergunta: "Qual é a primeira atitude que o consumidor pode tomar para diminuir o problema do descarte incorreto de medicamentos?",
        alternativas: [
            { 
                letra: "A)", 
                texto: "Juntar todos os remédios e só descartar uma vez por ano.", 
                correta: false, 
                explicacao: "Guardar os medicamentos por muito tempo aumenta o risco em casa." 
            },
            { 
                letra: "B)", 
                texto: "Evitar sobras de medicamentos, adquirindo somente a quantidade necessária para o tratamento.", 
                correta: true, 
                explicacao: "A primeira orientação para fazer o certo é justamente evitar sobras de medicamentos, adquirindo somente o necessário para o tratamento prescrito. Isso diminui o volume de resíduos que precisa ser descartado na logística reversa." 
            },
            { 
                letra: "C)", 
                texto: "Pedir ajuda ao vizinho para descartar o que sobrou.", 
                correta: false, 
                explicacao: "O dever de descarte é do consumidor e deve ser feito nos postos adequados." 
            },
            { 
                letra: "D)", 
                texto: "Levar todos os remédios da casa para o posto de coleta de uma só vez, mesmo que não estejam vencidos.", 
                correta: false, 
                explicacao: "O descarte deve ser feito quando o medicamento está vencido ou em desuso. O uso racional (comprar só o necessário) deve ser incentivado." 
            }
        ]
    }
];
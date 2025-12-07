/**
 * @fileoverview Sistema de flashcards interativos de medicamentos para idosos
 * @description Implementa cards rotacionáveis com informações sobre medicamentos e cuidados específicos para a terceira idade
 * @author Pedro Solozabal
 * @version 1.0.0
 * @package JS
 * @requires CSS com classes .flashcards-grid, .medicamento-card, .card-inner, .card-face
 */

(function() {
    'use strict';
    
    /**
     * Base de dados dos medicamentos de uso comum por idosos
     * @typedef {Object} MedicamentoData
     * @property {number} id - Identificador único do medicamento
     * @property {string} principioAtivo - Nome do princípio ativo
     * @property {string} nomeComercial - Nomes comerciais conhecidos
     * @property {string} cuidados - Cuidados específicos para idosos
     */
    const medicamentos = [
        {
            id: 1,
            principioAtivo: "Paracetamol",
            nomeComercial: "Tylenol",
            cuidados: "Não ultrapasse 4 g (4.000 mg) por dia! Doses altas são hepatotóxicas. Se você tem doença hepática grave e ativa, o uso é contraindicado. A meia-vida pode ser prolongada em idosos."
        },
        {
            id: 2,
            principioAtivo: "Ibuprofeno",
            nomeComercial: "Advil, Alivium",
            cuidados: "RISCO CARDÍACO E DE SANGRAMENTO: Idosos têm risco maior de eventos gastrointestinais sérios (sangramentos, úlceras) e cardiovasculares. Tome com comida ou leite. Evite se tiver insuficiência cardíaca severa."
        },
        {
            id: 3,
            principioAtivo: "Dipirona",
            nomeComercial: "Anador, Novalgina",
            cuidados: "CUIDADOS: Não use se tiver problemas no sangue (discrasias sanguíneas). Se tiver doença renal ou hepática, considere doses reduzidas para terapia crônica, pois o metabólito ativo pode se acumular."
        },
        {
            id: 4,
            principioAtivo: "Ácido Acetilsalicílico (AAS)",
            nomeComercial: "Aspirina",
            cuidados: "ALERTA DE SANGRAMENTO: Aumenta o risco de sangramento no estômago. Se você já toma AAS para o coração (antiagregação), o uso de AAS analgésico aumenta este risco. Contraindicado em caso suspeito de Dengue."
        },
        {
            id: 5,
            principioAtivo: "Naproxeno/Naproxeno Sódico",
            nomeComercial: "Flanax",
            cuidados: "RISCO SEMELHANTE AO IBUPROFENO: É um AINE de alto risco para idosos (problemas cardíacos e gastrointestinais). Use a menor dose eficaz e pelo menor tempo."
        },
        {
            id: 6,
            principioAtivo: "Dipirona + Orfenadrina + Cafeína",
            nomeComercial: "Dorflex",
            cuidados: "ALTO RISCO DE SEDATIVIDADE: A Orfenadrina é um anticolinérgico que causa sonolência, tontura e confusão mental. Deve ser usado com extrema cautela ou evitado em idosos."
        },
        {
            id: 7,
            principioAtivo: "Butilbrometo de Escopolamina",
            nomeComercial: "Buscopan",
            cuidados: "NÃO RECOMENDADO PARA IDOSOS. O risco de efeitos anticolinérgicos (confusão, retenção urinária, tontura) é maior. Não use se tiver glaucoma, obstrução intestinal ou retenção urinária."
        },
        {
            id: 8,
            principioAtivo: "Lactulose",
            nomeComercial: "Lactulona, Laktus",
            cuidados: "O efeito demora 1 a 2 dias para começar. O uso prolongado (mais de 6 meses) deve ser evitado devido ao risco de desequilíbrio de eletrólitos (sais minerais)."
        },
        {
            id: 9,
            principioAtivo: "Bisacodil",
            nomeComercial: "Dulcolax, Lacto-Purga",
            cuidados: "CUIDADO: Não use por mais de 10 dias. O uso prolongado pode causar dependência intestinal e risco de desequilíbrio eletrolítico. Pode ser usado para preparo de exames."
        },
        {
            id: 10,
            principioAtivo: "Hidróxido de Alumínio + Magnésio",
            nomeComercial: "Leite de Magnésia",
            cuidados: "Os antiácidos podem diminuir a absorção de outros remédios (interação medicamentosa). Consulte o farmacêutico sobre o intervalo ideal de tomada. Cuidado se tiver insuficiência renal (risco de retenção de magnésio)."
        },
        {
            id: 11,
            principioAtivo: "Hidróxido de Alumínio + Magnésio + Simeticona",
            nomeComercial: "Mylanta Plus, Gastrogel Plus",
            cuidados: "Alivia azia, dor de estômago e flatulência (gases). Mesmos cuidados de interação medicamentosa do antiácido simples (item 10)."
        },
        {
            id: 12,
            principioAtivo: "Saccharomyces boulardii",
            nomeComercial: "Floratil, Enterogermina",
            cuidados: "Para que serve? Trata diarreias e restaura a flora intestinal. CUIDADO: Não use junto com antifúngicos orais (remédios para micoses por via oral), pois pode diminuir o efeito do probiótico."
        },
        {
            id: 13,
            principioAtivo: "Macrogol",
            nomeComercial: "Muvinlax",
            cuidados: "Para que serve? Laxativo eficaz para prisão de ventre. É um pó que deve ser dissolvido em água. Diferente do Bisacodil, age atraindo água para as fezes. É usado sob orientação profissional para preparo diagnóstico."
        },
        {
            id: 14,
            principioAtivo: "Loratadina",
            nomeComercial: "Claritin, Desalex",
            cuidados: "Causa menos sonolência que os antigos. Em idosos, a Loratadina atinge concentração máxima aumentada e tem o tempo de eliminação prolongado. Se necessário um antialérgico oral, este é preferível aos de 1ª geração."
        },
        {
            id: 15,
            principioAtivo: "Maleato de Dexclorfeniramina",
            nomeComercial: "Polaramine, Histamin",
            cuidados: "DEVE SER EVITADO EM IDOSOS (Critério de Beers). Causa sonolência, tontura, confusão e retenção urinária. Se for usado, evite atividades que exijam atenção mental."
        },
        {
            id: 16,
            principioAtivo: "Cloridrato de Ambroxol",
            nomeComercial: "Mucosolvan, Flüitte",
            cuidados: "Ajuda a soltar o catarro (secreções densas). Se você tem dificuldade para tossir ou está acamado, não use, pois pode acumular a secreção."
        },
        {
            id: 17,
            principioAtivo: "Bromidrato de Dextrometorfano",
            nomeComercial: "Vick Pyrena Tosse, Silencio",
            cuidados: "Usado para tosse seca (sem catarro). Pode causar sonolência e tontura. Cuidado se estiver tomando medicamentos para depressão (antidepressivos), devido a interações."
        },
        {
            id: 18,
            principioAtivo: "Paracetamol + Fenilefrina + Clorfeniramina",
            nomeComercial: "Benegrip, Resfenol",
            cuidados: "CUIDADO TRIPLO: Contém Paracetamol (risco hepático), Fenilefrina (risco de aumento da pressão) e Clorfeniramina (anti-histamínico de 1ª geração - alto risco de sonolência e confusão em idosos)."
        },
        {
            id: 19,
            principioAtivo: "Cloreto de Sódio 0,9%",
            nomeComercial: "Rinosoro, Sorine SSC",
            cuidados: "Para que serve? Fluidifica, limpa e alivia a congestão nasal. É seguro e não há relatos de reações adversas nessa apresentação. Se tiver insuficiência renal, use com cuidado, devido ao risco de retenção de sódio."
        },
        {
            id: 20,
            principioAtivo: "Carmelose Sódica",
            nomeComercial: "Lacrima Plus, Fresh Tears",
            cuidados: "Para que serve? É um Lubrificante Oftálmico / Lágrima Artificial. Usado para olho seco e irritação. CUIDADO: É de uso local e geralmente seguro, mas pare de usar se sentir dor, vermelhidão ou alteração na visão."
        },
        {
            id: 21,
            principioAtivo: "Cloridrato de Nafazolina + Maleato de Feniramina",
            nomeComercial: "Moura Brasil",
            cuidados: "Para que serve? Alivia Irritação e Coceira nos olhos. ATENÇÃO: Use por poucos dias. O uso prolongado pode causar efeito rebote. Se você tem glaucoma de ângulo fechado, o uso é contraindicado (o componente Nafazolina pode piorar a condição)."
        },
        {
            id: 22,
            principioAtivo: "Iodopovidona",
            nomeComercial: "Povidine",
            cuidados: "ALERTA TIREOIDE: O Iodo pode ser absorvido. Se você tem Hipertireoidismo (tireoide em excesso), o uso em grandes áreas ou por tempo prolongado é contraindicado."
        },
        {
            id: 23,
            principioAtivo: "Neomicina + Bacitracina",
            nomeComercial: "Nebacetin",
            cuidados: "Para que serve? Prevenção e/ou tratamento de infecções em feridas leves. CUIDADO RINS/OUVIDOS: Em lesões extensas e abertas, o risco de toxicidade para rins (nefrotoxicidade) e ouvidos (ototoxicidade) aumenta. Não use se tiver doença renal crônica grave."
        },
        {
            id: 24,
            principioAtivo: "Nistatina + Óxido de Zinco",
            nomeComercial: "Hipoglós, Dermodex",
            cuidados: "Para que serve? Previne e trata Assaduras e irritações da pele. Muito seguro. Ideal para proteger a pele de idosos acamados, em axilas ou áreas de atrito."
        },
        {
            id: 25,
            principioAtivo: "Policresuleno + Cloridrato de Cinchocaína",
            nomeComercial: "Ultraproct, Proctan",
            cuidados: "Para que serve? Trata Hemorroidas e fissuras anais. Uso local. Cuidado com a higiene. Se os sintomas persistirem, procure um médico."
        },
        {
            id: 26,
            principioAtivo: "Fenol + Mentol",
            nomeComercial: "Otosylase",
            cuidados: "Para que serve? Alivia a Dor de Ouvido e ajuda na Remoção de Cerume (cera). Uso: Siga as instruções de gotejamento. Se a dor persistir ou piorar, procure um médico imediatamente."
        },
        {
            id: 27,
            principioAtivo: "Cetoconazol",
            nomeComercial: "Nizoral",
            cuidados: "Para que serve? Trata Micoses superficiais da pele (creme) e Caspa (xampu). CUIDADO: Uso tópico, evite contato com os olhos."
        },
        {
            id: 28,
            principioAtivo: "Sulfato Ferroso",
            nomeComercial: "Anemifer, Vitafer",
            cuidados: "Para que serve? Prevenção e tratamento de Anemia por falta de ferro. DICAS: Tome com Vitamina C (suco de laranja) para absorver melhor. Causa escurecimento das fezes (normal). Idosos: Doses mais baixas (15 a 50 mg/dia) podem ter menos efeitos colaterais gastrointestinais."
        },
        {
            id: 29,
            principioAtivo: "Miconazol (Nitrato)",
            nomeComercial: "Daktarin",
            cuidados: "Para que serve? Trata Micoses superficiais de pele e unhas (creme, pó) ou Candidíase vaginal (creme vaginal). CUIDADOS: Continue o tratamento pelo tempo prescrito, mesmo que os sintomas melhorem."
        },
        {
            id: 30,
            principioAtivo: "Nicotina",
            nomeComercial: "Nicorette, NiQuitin",
            cuidados: "Para que serve? Auxílio na Cessação do Tabagismo. ALERTA CARDÍACO: Se tiver histórico de infarto, arritmias graves ou angina, evite o uso. Adesivos devem ser removidos se houver Ressonância Magnética (RM). Comece a terapia na faixa inferior de dosagem."
        }
    ];
    
    /**
     * Cria e renderiza todos os flashcards na interface
     */
    function criarFlashcards() {
        const container = document.querySelector('.flashcards-grid');
        
        if (!container) {
            console.error('❌ Container dos flashcards não encontrado');
            return;
        }
        
        // Limpar container e criar cards
        container.innerHTML = '';
        
        medicamentos.forEach(medicamento => {
            const cardHTML = `
                <div class="medicamento-card" data-id="${medicamento.id}" tabindex="0" role="button" aria-label="Card do medicamento ${medicamento.principioAtivo}">
                    <div class="card-inner">
                        <div class="card-face card-front">
                            <h3>${medicamento.principioAtivo}</h3>
                            <h4>${medicamento.nomeComercial}</h4>
                        </div>
                        <div class="card-face card-back">
                            <h5>⚠️ Cuidados para Idosos</h5>
                            <div class="cuidados">
                                <p>${medicamento.cuidados}</p>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            container.insertAdjacentHTML('beforeend', cardHTML);
        });
        
        // Configurar eventos dos cards
        configurarEventos();
    }
    
    /**
     * Configura eventos de interação dos cards
     */
    function configurarEventos() {
        document.querySelectorAll('.medicamento-card').forEach(card => {
            // Evento unificado para clique e teclado
            const flipCard = () => card.classList.toggle('flipped');
            
            card.addEventListener('click', flipCard);
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    flipCard();
                }
            });
        });
    }

    // Inicialização
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', criarFlashcards);
    } else {
        criarFlashcards();
    }

    // API pública
    window.FlashcardsAPI = {
        recriar: criarFlashcards,
        getTotalMedicamentos: () => medicamentos.length,
        getMedicamentoPorId: (id) => medicamentos.find(m => m.id === id) || null
    };

})();
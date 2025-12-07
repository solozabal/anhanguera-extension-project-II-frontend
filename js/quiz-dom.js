/**
 * @fileoverview Manipulação de DOM para o quiz de descarte de medicamentos
 * @description Classe responsável pela interface e interações DOM
 * @author Pedro Solozabal
 * @version 1.0.0
 * @package JS
 */

/**
 * Gerencia manipulação de elementos DOM do quiz
 * @class QuizDOM
 * @description Responsável por toda interação com interface, renderização e animações
 */
class QuizDOM {
    /**
     * Construtor da classe QuizDOM
     * @constructor
     * @description Inicializa referências dos elementos DOM necessários
     */
    constructor() {
        this.elements = this.initializeElements();
    }

    /**
     * Inicializa referências para elementos DOM
     * @method initializeElements
     * @returns {Object} Objeto com referências para todos os elementos necessários
     * @description Obtém e organiza referências dos elementos HTML do quiz
     */
    initializeElements() {
        return {
            perguntaTexto: document.getElementById('pergunta-texto'),
            alternativasContainer: document.getElementById('alternativas-container'),
            feedbackContainer: document.getElementById('feedback-container'),
            feedbackMensagem: document.getElementById('feedback-mensagem'),
            feedbackExplicacao: document.getElementById('feedback-explicacao'),
            proximaBtn: document.getElementById('proxima-btn'),
            resultadoContainer: document.getElementById('resultado-container'),
            quizProgress: document.getElementById('quiz-progress'),
            resultadoCard: document.getElementById('resultado-card'),
            tentarNovamenteBtn: document.getElementById('tentar-novamente-btn'),
            perguntaAtualSpan: document.getElementById('pergunta-atual'),
            totalPerguntasSpan: document.getElementById('total-perguntas'),
            pontuacaoAtualSpan: document.getElementById('pontuacao-atual'),
            iniciarContainer: document.getElementById('iniciar-quiz-container'),
            quizArea: document.getElementById('quiz-area'),
            iniciarBtn: document.getElementById('iniciar-quiz-btn')
        };
    }

    /**
     * Exibe pergunta atual na interface
     * @method renderizarPergunta
     * @param {Object} pergunta - Objeto contendo pergunta e alternativas
     * @description Renderiza pergunta e cria botões de alternativas na interface
     */
    renderizarPergunta(pergunta) {
        console.log('DOM: Renderizando pergunta:', pergunta); // Debug
        console.log('DOM: Elemento pergunta texto:', this.elements.perguntaTexto); // Debug
        
        this.elements.perguntaTexto.textContent = pergunta.pergunta;
        this.elements.alternativasContainer.innerHTML = '';
        
        pergunta.alternativas.forEach((alternativa, index) => {
            const botao = this.criarBotaoAlternativa(alternativa, index);
            this.elements.alternativasContainer.appendChild(botao);
        });

        this.elements.feedbackContainer.style.display = 'none';
        this.elements.proximaBtn.style.display = 'none';
        
        this.adicionarAnimacao();
    }

    /**
     * Cria botão de alternativa com acessibilidade
     * @method criarBotaoAlternativa
     * @param {Object} alternativa - Dados da alternativa (letra, texto, correta, explicacao)
     * @param {number} index - Índice da alternativa no array
     * @returns {HTMLElement} Elemento button configurado para a alternativa
     * @description Cria botão com estrutura HTML e atributos de acessibilidade
     */
    criarBotaoAlternativa(alternativa, index) {
        const botao = document.createElement('button');
        botao.className = 'alternativa-btn';
        botao.setAttribute('tabindex', '0');
        botao.setAttribute('role', 'button');
        botao.setAttribute('aria-label', `Alternativa ${alternativa.letra}: ${alternativa.texto}`);
        botao.dataset.index = index;
        
        botao.innerHTML = `
            <div class="alternativa-conteudo">
                <span class="alternativa-letra">${alternativa.letra}</span>
                <span class="alternativa-texto">${alternativa.texto}</span>
            </div>
        `;
        
        return botao;
    }

    /**
     * Adiciona animação de transição
     */
    adicionarAnimacao() {
        this.elements.alternativasContainer.classList.remove('fade-transition');
        setTimeout(() => {
            this.elements.alternativasContainer.classList.add('fade-transition');
        }, QUIZ_CONFIG.DELAYS.ANIMATION);
    }

    /**
     * Atualiza interface com feedback da resposta
     * @method exibirFeedback
     * @param {boolean} correta - Se a resposta está correta
     * @param {string} explicacao - Texto explicativo da resposta
     * @description Exibe feedback visual e textual sobre a resposta selecionada
     */
    exibirFeedback(correta, explicacao) {
        const alertClass = correta ? 'alert alert-success' : 'alert alert-danger';
        const mensagem = correta ? '<strong>✅ Muito bem!</strong>' : '<strong>❌ Não exatamente.</strong>';
        
        this.elements.feedbackMensagem.className = alertClass;
        this.elements.feedbackMensagem.innerHTML = mensagem;
        this.elements.feedbackExplicacao.textContent = explicacao;
        this.elements.feedbackContainer.style.display = 'block';
        this.elements.proximaBtn.style.display = 'inline-block';
        
        this.scrollParaFeedback();
    }

    /**
     * Marca alternativas como corretas/incorretas
     * @method marcarAlternativas
     * @param {number} indexSelecionado - Índice da alternativa selecionada
     * @param {number} indexCorreto - Índice da alternativa correta
     * @description Aplica classes CSS e desabilita botões após resposta
     */
    marcarAlternativas(indexSelecionado, indexCorreto) {
        const botoes = this.elements.alternativasContainer.querySelectorAll('.alternativa-btn');
        
        botoes.forEach(botao => {
            botao.classList.add('disabled');
            botao.style.pointerEvents = 'none';
        });

        botoes[indexSelecionado].classList.add(indexSelecionado === indexCorreto ? 'correta' : 'incorreta');
        
        if (indexSelecionado !== indexCorreto) {
            botoes[indexCorreto].classList.add('correta');
        }
    }

    /**
     * Atualiza informações de progresso do quiz
     * @method atualizarProgresso
     * @param {number} perguntaAtual - Índice da pergunta atual (0-based)
     * @param {number} totalPerguntas - Total de perguntas no quiz
     * @param {number} pontuacao - Pontuação atual do usuário
     * @description Atualiza barra de progresso e contadores na interface
     */
    atualizarProgresso(perguntaAtual, totalPerguntas, pontuacao) {
        const progresso = ((perguntaAtual + 1) / totalPerguntas) * 100;
        
        this.elements.quizProgress.style.width = `${progresso}%`;
        this.elements.quizProgress.setAttribute('aria-valuenow', progresso);
        this.elements.perguntaAtualSpan.textContent = perguntaAtual + 1;
        this.elements.totalPerguntasSpan.textContent = totalPerguntas;
        this.elements.pontuacaoAtualSpan.textContent = pontuacao;
    }

    /**
     * Exibe resultado final
     */
    exibirResultado(pontuacao, totalPerguntas) {
        const config = RESULTADO_CONFIG[pontuacao] || RESULTADO_CONFIG.default;
        
        this.elements.quizArea.style.display = 'none';
        this.elements.resultadoContainer.style.display = 'block';
        
        this.elements.resultadoCard.className = `resultado-card ${config.classe}`;
        this.elements.resultadoCard.innerHTML = `
            <div class="resultado-icone">${config.icone}</div>
            <h3 class="resultado-titulo">${config.titulo}</h3>
            <div class="resultado-pontuacao">${pontuacao} de ${totalPerguntas} acertos</div>
            <div class="resultado-mensagem">${config.mensagem}</div>
        `;
        
        this.scrollParaResultado();
    }

    /**
     * Controla visibilidade das seções
     */
    alternarVisibilidade(mostrarQuiz = false) {
        console.log('DOM: Alternando visibilidade para:', mostrarQuiz); // Debug
        console.log('DOM: Elementos encontrados:', {
            iniciarContainer: !!this.elements.iniciarContainer,
            quizArea: !!this.elements.quizArea,
            resultadoContainer: !!this.elements.resultadoContainer
        }); // Debug
        
        if (mostrarQuiz) {
            this.elements.iniciarContainer.style.display = 'none';
            this.elements.quizArea.style.display = 'block';
            this.scrollParaQuiz();
        } else {
            this.elements.iniciarContainer.style.display = 'block';
            this.elements.quizArea.style.display = 'none';
            this.elements.resultadoContainer.style.display = 'none';
            this.scrollParaInicio();
        }
    }

    /**
     * Métodos de scroll suave
     */
    scrollParaQuiz() {
        setTimeout(() => {
            this.elements.quizArea.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }, QUIZ_CONFIG.DELAYS.SCROLL);
    }

    scrollParaFeedback() {
        setTimeout(() => {
            this.elements.feedbackContainer.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'nearest' 
            });
        }, QUIZ_CONFIG.DELAYS.FEEDBACK_SCROLL);
    }

    scrollParaResultado() {
        setTimeout(() => {
            this.elements.resultadoContainer.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        }, QUIZ_CONFIG.DELAYS.RESULTADO_SCROLL);
    }

    scrollParaInicio() {
        setTimeout(() => {
            document.getElementById('descarte').scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        }, QUIZ_CONFIG.DELAYS.FEEDBACK_SCROLL);
    }
}
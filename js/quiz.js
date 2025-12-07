/**
 * @fileoverview Sistema de quiz interativo sobre descarte consciente de medicamentos
 * @description Implementa quiz educativo com 5 perguntas, feedback e pontuação para idosos
 * @author Pedro Solozabal
 * @version 1.0.0
 * @package JS
 */

/**
 * Classe principal do quiz sobre descarte de medicamentos
 * @class QuizDescarteMedicamentos
 * @description Gerencia lógica de negócio, estado e fluxo do quiz educativo
 */
class QuizDescarteMedicamentos {
    /**
     * Construtor da classe QuizDescarteMedicamentos
     * @constructor
     * @description Inicializa estado, dados e interface do quiz
     */
    constructor() {
        /** @type {Array<Object>} Array de perguntas do quiz */
        this.perguntas = PERGUNTAS_QUIZ;
        /** @type {number} Índice da pergunta atual (0-based) */
        this.perguntaAtual = 0;
        /** @type {number} Pontuação atual do usuário */
        this.pontuacao = 0;
        /** @type {boolean} Indica se uma resposta foi selecionada */
        this.respostaSelecionada = false;
        /** @type {boolean} Indica se o quiz está ativo */
        this.quizAtivo = false;
        
        /** @type {QuizDOM} Instância para manipulação do DOM */
        this.dom = new QuizDOM();
        this.inicializar();
    }

    /**
     * Inicializa o sistema do quiz
     * @method inicializar
     * @description Configura event listeners e botão de inicialização
     */
    inicializar() {
        this.configurarEventListeners();
        this.configurarBotaoIniciar();
    }

    /**
     * Configura todos os event listeners necessários
     * @method configurarEventListeners
     * @description Adiciona listeners para navegação, interação e acessibilidade
     */
    configurarEventListeners() {
        this.dom.elements.proximaBtn.addEventListener('click', () => this.proximaPergunta());
        this.dom.elements.tentarNovamenteBtn.addEventListener('click', () => this.reiniciarQuiz());
        
        // Event delegation para alternativas
        this.dom.elements.alternativasContainer.addEventListener('click', (e) => {
            const botao = e.target.closest('.alternativa-btn');
            if (botao && !this.respostaSelecionada) {
                const index = parseInt(botao.dataset.index);
                this.verificarResposta(index, botao);
            }
        });

        // Suporte a teclado
        this.dom.elements.alternativasContainer.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const botao = e.target.closest('.alternativa-btn');
                if (botao && !this.respostaSelecionada) {
                    const index = parseInt(botao.dataset.index);
                    this.verificarResposta(index, botao);
                }
            }
        });
    }

    /**
     * Configura o botão de inicialização do quiz
     * @method configurarBotaoIniciar
     * @description Adiciona listener ao botão "Iniciar Quiz"
     */
    configurarBotaoIniciar() {
        if (this.dom.elements.iniciarBtn) {
            this.dom.elements.iniciarBtn.addEventListener('click', () => {
                console.log('Botão iniciar clicado'); // Debug
                this.ativarQuiz();
            });
        } else {
            console.error('Botão iniciar não encontrado!'); // Debug
        }
    }

    /**
     * Ativa o quiz e inicia o fluxo
     * @method ativarQuiz
     * @description Altera estado para ativo, mostra interface e inicia quiz
     */
    ativarQuiz() {
        console.log('Ativando quiz...'); // Debug
        this.quizAtivo = true;
        this.dom.alternarVisibilidade(true);
        this.iniciarQuiz();
    }

    /**
     * Inicializa o estado do quiz
     * @method iniciarQuiz
     * @description Reseta estado, atualiza interface e exibe primeira pergunta
     */
    iniciarQuiz() {
        console.log('Iniciando quiz...'); // Debug
        this.resetarEstado();
        this.mostrarPergunta();
    }

    /**
     * Reseta o estado do quiz para valores iniciais
     * @method resetarEstado
     * @description Zera contadores e flags do quiz
     */
    resetarEstado() {
        this.perguntaAtual = 0;
        this.pontuacao = 0;
        this.respostaSelecionada = false;
    }

    /**
     * Atualiza interface geral do quiz
     * @method atualizarInterface
     * @description Atualiza progresso e contadores iniciais
     */
    atualizarInterface() {
        this.dom.atualizarProgresso(
            this.perguntaAtual, 
            this.perguntas.length, 
            this.pontuacao
        );
    }

    /**
     * Exibe pergunta atual na interface
     * @method mostrarPergunta
     * @description Renderiza pergunta atual através do DOM
     */
    mostrarPergunta() {
        console.log('Mostrando pergunta:', this.perguntaAtual); // Debug
        const pergunta = this.perguntas[this.perguntaAtual];
        console.log('Dados da pergunta:', pergunta); // Debug
        this.dom.renderizarPergunta(pergunta);
        this.atualizarProgresso();
    }

    /**
     * Atualiza informações de progresso
     * @method atualizarProgresso
     * @description Atualiza progresso e contadores
     */
    atualizarProgresso() {
        this.dom.atualizarProgresso(
            this.perguntaAtual, 
            this.perguntas.length, 
            this.pontuacao
        );
    }

    /**
     * Verifica resposta selecionada pelo usuário
     * @method verificarResposta
     * @param {number} index - Índice da alternativa selecionada
     * @param {HTMLElement} elemento - Elemento DOM do botão clicado
     * @description Avalia resposta, atualiza pontuação e exibe feedback
     */
    verificarResposta(index, elemento) {
        if (this.respostaSelecionada) return;
        
        this.respostaSelecionada = true;
        const alternativa = this.perguntas[this.perguntaAtual].alternativas[index];
        const indexCorreto = this.encontrarIndexCorreto();
        
        this.dom.marcarAlternativas(index, indexCorreto);
        
        if (alternativa.correta) {
            this.pontuacao++;
            this.atualizarProgresso();
        }
        
        this.dom.exibirFeedback(alternativa.correta, alternativa.explicacao);
    }

    /**
     * Encontra o índice da resposta correta na pergunta atual
     * @method encontrarIndexCorreto
     * @returns {number} Índice da alternativa correta
     * @description Localiza qual alternativa possui flag correta = true
     */
    encontrarIndexCorreto() {
        return this.perguntas[this.perguntaAtual].alternativas.findIndex(alt => alt.correta);
    }

    /**
     * Avança para próxima pergunta ou finaliza quiz
     * @method proximaPergunta
     * @description Controla navegação entre perguntas e finalização do quiz
     */
    proximaPergunta() {
        this.perguntaAtual++;
        this.respostaSelecionada = false;
        
        if (this.perguntaAtual < this.perguntas.length) {
            this.mostrarPergunta();
        } else {
            this.finalizarQuiz();
        }
    }

    /**
     * Finaliza o quiz e exibe resultado final
     * @method finalizarQuiz
     * @description Chama exibição de resultado com pontuação final
     */
    finalizarQuiz() {
        this.dom.exibirResultado(this.pontuacao, this.perguntas.length);
    }

    /**
     * Reinicia o quiz para estado inicial
     * @method reiniciarQuiz
     * @description Reseta estado e volta para tela de início
     */
    reiniciarQuiz() {
        this.quizAtivo = false;
        this.resetarEstado();
        this.dom.alternarVisibilidade(false);
    }
}

/**
 * Inicialização do sistema de quiz
 * @function
 * @description Cria instância do quiz quando DOM está completamente carregado
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM carregado, iniciando quiz...'); // Debug
    try {
        console.log('PERGUNTAS_QUIZ disponível:', typeof PERGUNTAS_QUIZ !== 'undefined'); // Debug
        console.log('QuizDOM disponível:', typeof QuizDOM !== 'undefined'); // Debug
        new QuizDescarteMedicamentos();
        console.log('Quiz inicializado com sucesso!'); // Debug
    } catch (error) {
        console.error('Erro ao inicializar quiz:', error); // Debug
    }
});
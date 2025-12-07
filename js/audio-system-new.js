/**
 * @fileoverview Sistema de síntese de voz para acessibilidade
 * @description Implementa funcionalidade de leitura de conteúdo da página usando Web Speech API
 * @author Pedro Solozabal
 * @version 1.0.0
 * @package JS
 */

/**
 * Objeto principal do sistema de áudio
 * @namespace AudioSystem
 * @description Controla toda a funcionalidade de síntese de voz da aplicação
 */
window.audioFuncional = {
    
    /**
     * Estado atual do sistema de áudio
     * @type {boolean}
     * @description Indica se o áudio está sendo reproduzido
     */
    ativo: false,
    
    /**
     * Instância do objeto SpeechSynthesisUtterance
     * @type {SpeechSynthesisUtterance|null}
     * @description Objeto usado para controlar a síntese de voz
     */
    utterance: null,
    
    /**
     * Extrai todo o conteúdo textual relevante da página
     * @function extrairTexto
     * @memberof AudioSystem
     * @description Percorre elementos DOM específicos e coleta texto para leitura
     * @returns {string} Texto formatado pronto para síntese de voz
     * @example
     * const texto = audioFuncional.extrairTexto();
     * // Returns: "Viver Bem na Melhor Idade. Cuidando da sua saúde..."
     */
    extrairTexto: function() {
        const textos = [];
        
        // Extrair título principal
        const h1 = document.querySelector('h1');
        if (h1) textos.push(h1.textContent.trim());
        
        // Extrair subtítulo do header
        const headerP = document.querySelector('header p');
        if (headerP) textos.push(headerP.textContent.trim());
        
        // Extrair títulos de seções principais
        document.querySelectorAll('main h2').forEach(h2 => {
            textos.push(h2.textContent.trim());
        });
        
        // Extrair conteúdo de alertas importantes
        document.querySelectorAll('.alert').forEach(alert => {
            const texto = alert.textContent.trim().replace(/\s+/g, ' ');
            if (texto.length > 10) textos.push(texto);
        });
        
        // Extrair dados da tabela de vacinas
        const tabela = document.querySelector('.calendario-vacinas');
        if (tabela) {
            textos.push("Calendário de vacinação para idosos.");
            const linhas = tabela.querySelectorAll('tbody tr');
            linhas.forEach(linha => {
                const cels = linha.querySelectorAll('td');
                if (cels.length >= 3) {
                    const vacina = cels[0].textContent.trim();
                    const dose = cels[1].textContent.trim();
                    const protege = cels[2].textContent.trim();
                    textos.push(`Vacina ${vacina}, ${dose}, protege contra ${protege}.`);
                }
            });
        }
        
        // Extrair observações importantes
        document.querySelectorAll('.lista-observacoes li').forEach(li => {
            textos.push(li.textContent.trim());
        });
        
        // Formatar texto final
        const textoFinal = textos.join('. ').replace(/\.\./g, '.') + '. Fim do conteúdo.';
        return textoFinal;
    },
    
    /**
     * Inicia a reprodução de áudio do conteúdo da página
     * @function iniciar
     * @memberof AudioSystem
     * @description Configura e inicia a síntese de voz com o conteúdo extraído
     * @returns {void}
     * @throws {Error} Quando o navegador não suporta Web Speech API
     */
    iniciar: function() {
        // Verificar suporte do navegador
        if (!speechSynthesis) {
            alert('Navegador não suporta síntese de voz');
            return;
        }
        
        // Parar qualquer reprodução anterior
        this.parar();
        
        // Extrair e validar conteúdo
        const texto = this.extrairTexto();
        if (!texto || texto.length < 10) {
            alert('Nenhum conteúdo disponível para leitura');
            return;
        }
        
        // Configurar síntese de voz
        this.utterance = new SpeechSynthesisUtterance(texto);
        this.utterance.lang = 'pt-BR';
        this.utterance.rate = 0.8; // Velocidade adequada para idosos
        this.utterance.volume = 1.0;
        
        // Configurar callbacks de eventos
        this.utterance.onstart = () => {
            this.ativo = true;
            this.atualizarBotao();
        };
        
        this.utterance.onend = () => {
            this.ativo = false;
            this.atualizarBotao();
        };
        
        this.utterance.onerror = (e) => {
            console.error('Erro na síntese de voz:', e.error);
            this.parar();
        };
        
        // Iniciar reprodução
        speechSynthesis.speak(this.utterance);
        this.ativo = true;
        this.atualizarBotao();
    },
    
    /**
     * Para a reprodução de áudio em andamento
     * @function parar
     * @memberof AudioSystem
     * @description Cancela a síntese de voz e reseta o estado do sistema
     * @returns {void}
     */
    parar: function() {
        if (speechSynthesis.speaking) {
            speechSynthesis.cancel();
        }
        this.ativo = false;
        this.utterance = null;
        this.atualizarBotao();
    },
    
    /**
     * Alterna entre iniciar e parar a reprodução de áudio
     * @function alternar
     * @memberof AudioSystem
     * @description Método principal chamado pelo botão de controle de áudio
     * @returns {void}
     */
    alternar: function() {
        if (this.ativo) {
            this.parar();
        } else {
            this.iniciar();
        }
    },
    
    /**
     * Atualiza a aparência do botão de controle de áudio
     * @function atualizarBotao
     * @memberof AudioSystem
     * @description Modifica texto, classes CSS e estilos do botão baseado no estado atual
     * @returns {void}
     */
    atualizarBotao: function() {
        const btn = document.querySelector('button[onclick="toggleAudio()"]');
        if (!btn) return;
        
        if (this.ativo) {
            // Estado ativo - botão de parar
            btn.innerHTML = '⏹️ PARAR';
            btn.className = 'btn btn-danger btn-lg';
            btn.style.animation = 'pulse 1.5s infinite';
        } else {
            // Estado inativo - botão de iniciar
            btn.innerHTML = '🔊 Ouvir conteúdo';
            btn.className = 'btn btn-outline-light btn-lg';
            btn.style.animation = '';
        }
    }
};

/**
 * Função global para controle de áudio
 * @function toggleAudio
 * @global
 * @description Interface pública para alternar reprodução de áudio
 * @returns {void}
 * @example
 * toggleAudio(); // Inicia ou para o áudio
 */
window.toggleAudio = function() {
    window.audioFuncional.alternar();
};

/**
 * Inicialização do sistema quando DOM está carregado
 * @function initializeAudioSystem
 * @description Configura o sistema de áudio após carregamento completo da página
 * @returns {void}
 */
document.addEventListener('DOMContentLoaded', function() {
    window.audioFuncional.atualizarBotao();
});
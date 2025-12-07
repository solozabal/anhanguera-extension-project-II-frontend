/**
 * @fileoverview Sistema de gerenciamento LGPD e privacidade de dados
 * @description Controla consentimento LGPD, cookies e integração com formulários conforme legislação brasileira
 * @author Pedro Solozabal
 * @version 1.0.0
 * @package JS
 */

/**
 * Estado global do sistema de privacidade
 * @namespace PrivacyState
 */
let lgpdConsentido = false;
let cookiesAceitos = false;
let formDataTemporario = null;

/**
 * Inicializa o sistema de privacidade quando DOM está carregado
 * @function initializePrivacySystem
 * @description Configura LGPD, cookies e handlers de formulário
 * @returns {void}
 */
document.addEventListener('DOMContentLoaded', function() {
    
    // Obter referências dos elementos DOM
    const lgpdModal = document.getElementById('lgpdModal');
    const aceitarLgpd = document.getElementById('aceitarLgpd');
    const cancelarLgpd = document.getElementById('cancelarLgpd');
    const cadastroForm = document.getElementById('formCadastro');
    const cookieBanner = document.getElementById('cookieBanner');
    const aceitarCookies = document.getElementById('aceitarCookies');
    const recusarCookies = document.getElementById('recusarCookies');

    /**
     * Inicializa estado dos modais baseado em preferências salvas
     * @function initializeModals
     * @description Verifica localStorage e configura visibilidade inicial dos modals
     * @returns {void}
     */
    function initializeModals() {
        // Gerenciar estado dos cookies
        const cookiesSalvos = localStorage.getItem('cookiesAceitos');
        if (cookiesSalvos === 'true') {
            cookiesAceitos = true;
            if (cookieBanner) cookieBanner.style.display = 'none';
        } else if (cookiesSalvos === 'false') {
            cookiesAceitos = false;
            if (cookieBanner) cookieBanner.style.display = 'none';
        } else {
            if (cookieBanner) cookieBanner.style.display = 'block';
        }

        // Verificar consentimento LGPD anterior
        const lgpdSalvo = localStorage.getItem('lgpdAccepted');
        if (lgpdSalvo === 'true') {
            lgpdConsentido = true;
        }

        // Garantir que modal LGPD inicia oculto
        if (lgpdModal) {
            lgpdModal.style.display = 'none';
        }
    }

    /**
     * Configura handlers para gerenciamento de cookies
     * @function setupCookieHandlers
     * @description Adiciona listeners para aceitar/recusar cookies
     * @returns {void}
     */
    function setupCookieHandlers() {
        // Handler para aceitar cookies
        if (aceitarCookies) {
            aceitarCookies.addEventListener('click', function() {
                localStorage.setItem('cookiesAceitos', 'true');
                cookiesAceitos = true;
                if (cookieBanner) cookieBanner.style.display = 'none';
            });
        }

        // Handler para recusar cookies
        if (recusarCookies) {
            recusarCookies.addEventListener('click', function() {
                localStorage.setItem('cookiesAceitos', 'false');
                cookiesAceitos = false;
                if (cookieBanner) cookieBanner.style.display = 'none';
            });
        }
    }

    /**
     * Configura sistema de formulário com validação LGPD
     * @function setupFormHandler
     * @description DESABILITADO - Interceptação agora feita pelo form-validation.js
     * @returns {void}
     */
    function setupFormHandler() {
        // DESABILITADO - A interceptação do formulário agora é feita pelo form-validation.js
        // para evitar conflitos de event handlers duplos
        /*
        if (!cadastroForm) return;

        cadastroForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validar formulário antes de prosseguir
            if (!validateForm()) {
                return;
            }

            // Armazenar dados temporariamente
            formDataTemporario = new FormData(cadastroForm);
            
            // Verificar se já possui consentimento LGPD
            if (lgpdConsentido) {
                submitForm();
            } else {
                showLGPDModal();
            }
        });
        */
    }

    /**
     * Configura handlers do modal LGPD
     * @function setupLGPDHandlers
     * @description Adiciona listeners para aceitar/cancelar termos LGPD
     * @returns {void}
     */
    function setupLGPDHandlers() {
        // Handler para aceitar LGPD
        if (aceitarLgpd) {
            aceitarLgpd.addEventListener('click', function() {
                localStorage.setItem('lgpdAccepted', 'true');
                lgpdConsentido = true;
                hideLGPDModal();
                submitForm();
            });
        }

        // Handler para cancelar LGPD
        if (cancelarLgpd) {
            cancelarLgpd.addEventListener('click', function() {
                localStorage.setItem('lgpdAccepted', 'false');
                lgpdConsentido = false;
                hideLGPDModal();
                formDataTemporario = null;
                alert('Cadastro cancelado. É necessário aceitar os termos para prosseguir.');
            });
        }
    }

    /**
     * Configura funcionalidades avançadas do modal
     * @function setupModalEnhancements
     * @description Adiciona fechamento por ESC e clique fora do modal
     * @returns {void}
     */
    function setupModalEnhancements() {
        // Fechar modal clicando fora
        if (lgpdModal) {
            lgpdModal.addEventListener('click', function(e) {
                if (e.target === lgpdModal) {
                    hideLGPDModal();
                }
            });
        }

        // Fechar modal com tecla ESC
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && lgpdModal && lgpdModal.style.display === 'block') {
                hideLGPDModal();
            }
        });
    }

    /**
     * Exibe o modal LGPD e bloqueia scroll da página
     * @function showLGPDModal
     * @returns {void}
     */
    function showLGPDModal() {
        if (lgpdModal) {
            lgpdModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    }

    /**
     * Oculta o modal LGPD e restaura scroll da página
     * @function hideLGPDModal
     * @returns {void}
     */
    function hideLGPDModal() {
        if (lgpdModal) {
            lgpdModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    /**
     * Valida todos os campos obrigatórios do formulário
     * @function validateForm
     * @returns {boolean} True se formulário é válido, false caso contrário
     */
    function validateForm() {
        const nome = document.getElementById('nome');
        const email = document.getElementById('email');
        const idade = document.getElementById('idade');

        // Verificar existência dos campos
        if (!nome || !email || !idade) {
            alert('Erro: Campos do formulário não encontrados.');
            return false;
        }

        const nomeValor = nome.value.trim();
        const emailValor = email.value.trim();
        const idadeValor = idade.value.trim();

        // Validar campo nome
        if (!nomeValor) {
            alert('Por favor, preencha o campo Nome Completo.');
            nome.focus();
            return false;
        }

        // Validar campo email
        if (!emailValor) {
            alert('Por favor, preencha o campo Email.');
            email.focus();
            return false;
        }

        // Validar campo idade
        if (!idadeValor) {
            alert('Por favor, preencha o campo Idade.');
            idade.focus();
            return false;
        }

        // Validar formato do email
        if (!validateEmailFormat(emailValor)) {
            alert('Por favor, digite um email válido (exemplo: nome@dominio.com).');
            email.focus();
            return false;
        }

        return true;
    }

    /**
     * Valida formato básico de email
     * @function validateEmailFormat
     * @param {string} email - Endereço de email a ser validado
     * @returns {boolean} True se email tem formato válido
     * @example
     * validateEmailFormat('usuario@exemplo.com'); // Returns: true
     * validateEmailFormat('email-invalido'); // Returns: false
     */
    function validateEmailFormat(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email) && email.length >= 5;
    }

    /**
     * Envia formulário para o servidor via AJAX
     * @function submitForm
     * @description Processa envio com feedback visual e tratamento de erros
     * @returns {void}
     */
    function submitForm() {
        if (!formDataTemporario) {
            alert('Erro: Dados do formulário não encontrados.');
            return;
        }

        // Adicionar informações de consentimento
        formDataTemporario.append('lgpd_consent', lgpdConsentido ? 'true' : 'false');
        formDataTemporario.append('cookies_accepted', cookiesAceitos ? 'true' : 'false');

        // Configurar feedback visual
        const submitBtn = cadastroForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '⏳ Enviando...';
        submitBtn.disabled = true;

        // Enviar dados via fetch API
        fetch('php/save-lead.php', {
            method: 'POST',
            body: formDataTemporario
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro na comunicação: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                handleSubmitSuccess();
            } else {
                throw new Error(data.message || 'Erro desconhecido no servidor');
            }
        })
        .catch(error => {
            handleSubmitError(error);
        })
        .finally(() => {
            // Restaurar estado do botão
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        });
    }

    /**
     * Processa sucesso no envio do formulário
     * @function handleSubmitSuccess
     * @description Limpa formulário e exibe mensagem de sucesso
     * @returns {void}
     */
    function handleSubmitSuccess() {
        alert('✅ Cadastro realizado com sucesso! Em breve você receberá nossos conteúdos exclusivos.');
        cadastroForm.reset();
        
        // Ocultar formulário após sucesso
        const formularioSection = document.getElementById('formulario-cadastro');
        if (formularioSection) {
            formularioSection.style.display = 'none';
        }
        
        // Limpar estado temporário
        formDataTemporario = null;
        lgpdConsentido = false;
        localStorage.removeItem('lgpdAccepted');
    }

    /**
     * Processa erro no envio do formulário
     * @function handleSubmitError
     * @param {Error} error - Objeto de erro capturado
     * @returns {void}
     */
    function handleSubmitError(error) {
        console.error('Erro no envio:', error);
        alert('❌ Erro ao enviar formulário: ' + error.message);
    }

    // Executar inicialização dos módulos
    initializeModals();
    setupCookieHandlers();
    setupFormHandler();
    setupLGPDHandlers();
    setupModalEnhancements();
});
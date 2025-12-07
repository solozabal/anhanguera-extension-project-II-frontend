/**
 * @fileoverview Sistema de gerenciamento de cookies e navegação suave
 * @description Controla a exibição do banner de cookies conforme LGPD e implementa navegação suave para âncoras internas
 * @author Pedro Solozabal
 * @version 1.0.0
 * @package JS
*/

/**
 * Inicializa o sistema de gerenciamento de cookies e navegação quando o DOM está carregado
 * @function initializeApp
 * @description Configura listeners para cookies, formulários e navegação suave
 * @returns {void}
 */
document.addEventListener('DOMContentLoaded', function() {
    
    /**
     * Gerencia a exibição do banner de cookies baseado na preferência do usuário
     * @function manageCookieBanner
     * @description Verifica se o usuário já aceitou/recusou cookies e controla a visibilidade do banner
     * @returns {void}
     */
    function manageCookieBanner() {
        const cookieBanner = document.getElementById('cookieBanner');
        const cookiesAccepted = localStorage.getItem('cookiesAceitos');
        
        if (cookieBanner) {
            if (!cookiesAccepted || cookiesAccepted === 'null') {
                cookieBanner.style.display = 'block';
            } else {
                cookieBanner.style.display = 'none';
            }
        }
    }

    /**
     * Configura os event listeners para os botões de aceitar e recusar cookies
     * @function setupCookieButtons
     * @description Adiciona funcionalidade aos botões de gerenciamento de cookies
     * @returns {void}
     */
    function setupCookieButtons() {
        const cookieBanner = document.getElementById('cookieBanner');
        
        // Configurar botão de aceitar cookies
        const aceitarBtn = document.getElementById('aceitarCookies');
        if (aceitarBtn) {
            aceitarBtn.addEventListener('click', function() {
                localStorage.setItem('cookiesAceitos', 'true');
                if (cookieBanner) cookieBanner.style.display = 'none';
            });
        }

        // Configurar botão de recusar cookies
        const recusarBtn = document.getElementById('recusarCookies');
        if (recusarBtn) {
            recusarBtn.addEventListener('click', function() {
                localStorage.setItem('cookiesAceitos', 'false');
                if (cookieBanner) cookieBanner.style.display = 'none';
            });
        }
    }

    /**
     * Configura o comportamento do formulário de cadastro
     * @function setupFormToggle
     * @description Controla a exibição do formulário de cadastro e implementa scroll suave
     * @returns {void}
     */
    function setupFormToggle() {
        const btnMostrarFormulario = document.getElementById('btnMostrarFormulario');
        
        if (btnMostrarFormulario) {
            btnMostrarFormulario.addEventListener('click', function() {
                // Ocultar CTA e mostrar formulário
                document.getElementById('cta-cadastro').style.display = 'none';
                document.getElementById('formulario-cadastro').style.display = 'block';
                
                // Scroll suave para o formulário
                document.getElementById('formulario-cadastro').scrollIntoView({
                    behavior: 'smooth'
                });
            });
        }
    }

    /**
     * Implementa navegação suave para links internos (âncoras)
     * @function setupSmoothScrolling
     * @description Adiciona comportamento de scroll suave para todos os links que apontam para âncoras internas
     * @returns {void}
     */
    function setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // Executar inicialização dos módulos
    manageCookieBanner();
    setupCookieButtons();
    setupFormToggle();
    setupSmoothScrolling();
});
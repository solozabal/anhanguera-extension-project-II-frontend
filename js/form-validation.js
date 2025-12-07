/**
 * Sistema de validação de formulários com LGPD
 * @author Pedro Solozabal
 * @version 3.0.0 - REFATORAÇÃO CORRETA DO FLUXO COM MODAL LGPD
 */
document.addEventListener('DOMContentLoaded', function() {
    
    // ========== VALIDAÇÃO DE FORMULÁRIO ==========
    function setupFormValidation() {
        const forms = document.querySelectorAll('.needs-validation');
        Array.from(forms).forEach(form => {
            form.addEventListener('submit', event => {
                event.preventDefault();
                event.stopPropagation();
                
                if (form.checkValidity()) {
                    // Validar idade customizada
                    const idadeField = form.querySelector('input[name="idade"]');
                    if (idadeField && !validateAgeField(idadeField)) {
                        showValidationError(form);
                        return;
                    }
                    // Validar obrigatórios
                    const requiredFields = form.querySelectorAll('[required]');
                    let allValid = true;
                    requiredFields.forEach(field => {
                        if (!validateRequiredField(field)) {
                            allValid = false;
                        }
                    });
                    if (allValid) {
                        showLGPDModalThenSubmit(form);
                    } else {
                        showValidationError(form);
                    }
                } else {
                    showValidationError(form);
                }
                form.classList.add('was-validated');
            });
        });
    }

    // ========== LGPD ==========
    function showLGPDModalThenSubmit(form) {
        const lgpdModal = document.getElementById('lgpdModal');
        if (!lgpdModal) {
            alert('❌ Erro: Modal LGPD não encontrado.');
            return;
        }
        // Exibir modal
        lgpdModal.style.display = 'flex';
        lgpdModal.style.zIndex = '99999';
        lgpdModal.style.position = 'fixed';
        lgpdModal.style.top = '0';
        lgpdModal.style.left = '0';
        lgpdModal.style.width = '100%';
        lgpdModal.style.height = '100%';
        document.body.style.overflow = 'hidden';

        // Remove e adiciona listeners (clonar e substituir)
        const aceitarLgpdOld = document.getElementById('aceitarLgpd');
        const cancelarLgpdOld = document.getElementById('cancelarLgpd');
        const aceitarLgpd = aceitarLgpdOld.cloneNode(true);
        const cancelarLgpd = cancelarLgpdOld.cloneNode(true);
        aceitarLgpdOld.parentNode.replaceChild(aceitarLgpd, aceitarLgpdOld);
        cancelarLgpdOld.parentNode.replaceChild(cancelarLgpd, cancelarLgpdOld);
        
        aceitarLgpd.addEventListener('click', function() {
            ocultarModalLGPD();
            submitFormViaAjax(form, true);
        });
        cancelarLgpd.addEventListener('click', function() {
            ocultarModalLGPD();
            showErrorMessage('Cadastro não realizado. Você não aceitou a política de privacidade LGPD.');
        });

        document.addEventListener('keydown', function escHandler(e) {
            if (e.key === 'Escape') {
                ocultarModalLGPD();
                document.removeEventListener('keydown', escHandler);
            }
        });
    }

    function ocultarModalLGPD() {
        const lgpdModal = document.getElementById('lgpdModal');
        if (lgpdModal) {
            lgpdModal.style.display = 'none';
            document.body.style.overflow = '';
        }
    }

    // ========== SUBMISSÃO AJAX ==========
    function submitFormViaAjax(form, lgpdConsentido) {
        const btnSubmit = form.querySelector('button[type="submit"]');
        const originalText = btnSubmit.innerHTML;
        btnSubmit.disabled = true;
        btnSubmit.innerHTML = `
            <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            Enviando...
        `;

        const formData = new FormData(form);
        // NÃO confie em campo hidden lgpd_consent do HTML, adicione só se usuário aceitar!
        formData.set('lgpd_consent', lgpdConsentido ? 'true' : 'false');

        // Cookies
        const cookieChoice = localStorage.getItem('cookiesAceitos');
        if (cookieChoice === 'true') {
            formData.set('cookies_accepted', 'true');
        } else if (cookieChoice === 'false') {
            formData.set('cookies_accepted', 'false');
        } else {
            formData.set('cookies_accepted', 'null');
        }

        fetch('php/save-lead.php', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.json();
        })
        .then(data => {
            if (data.success) {
                showSuccessMessage(form);
            } else {
                showErrorMessage(data.message || 'Erro desconhecido no cadastro.');
            }
        })
        .catch(error => {
            showErrorMessage('Erro de conexão ou no servidor. Tente novamente.');
        })
        .finally(() => {
            btnSubmit.disabled = false;
            btnSubmit.innerHTML = originalText;
        });
    }

    // ========== MENSAGENS ==========
    function showSuccessMessage(form) {
        form.style.display = 'none';
        const successDiv = document.createElement('div');
        successDiv.className = 'alert alert-success mt-4';
        successDiv.innerHTML = `
            <h4><i class="fas fa-check-circle me-2"></i>Cadastro realizado com sucesso!</h4>
            <p>Parabéns! Você foi cadastrado(a) em nossa plataforma de saúde.<br>
            Em breve você receberá conteúdos importantes sobre medicamentos, vacinas e cuidados com a saúde.</p>
            <p class="mb-0"><strong>Verifique sua caixa de entrada dos próximos minutos.</strong></p>
        `;
        form.parentNode.appendChild(successDiv);
    }

    function showErrorMessage(message) {
        // Remover alertas anteriores
        const existingAlerts = document.querySelectorAll('.alert-danger');
        existingAlerts.forEach(alert => alert.remove());
        const errorDiv = document.createElement('div');
        errorDiv.className = 'alert alert-danger mt-3';
        errorDiv.innerHTML = `
            <i class="fas fa-exclamation-triangle me-2"></i>
            <strong>Erro:</strong> ${message}
        `;
        const form = document.querySelector('.needs-validation');
        form.parentNode.insertBefore(errorDiv, form);
        errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // ========== VALIDAÇÕES ==========
    function validateAgeField(campo) {
        const idade = parseInt(campo.value);
        if (isNaN(idade) || idade < 60 || idade > 120) {
            campo.setCustomValidity('A idade deve estar entre 60 e 120 anos');
            return false;
        }
        campo.setCustomValidity('');
        return true;
    }

    function validateRequiredField(campo) {
        if (!campo.value.trim()) {
            campo.setCustomValidity('Este campo é obrigatório');
            return false;
        }
        campo.setCustomValidity('');
        return true;
    }

    function showValidationError(form) {
        const invalidField = form.querySelector(':invalid');
        if (invalidField) {
            invalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
            invalidField.focus();
        }
    }

    // ========== EXIBIÇÃO DO FORMULÁRIO ==========
    function setupFormDisplay() {
        const btnEncontrarUBS = document.getElementById('btnEncontrarUBS');
        const formSection = document.getElementById('formSection');
        if (btnEncontrarUBS && formSection) {
            btnEncontrarUBS.addEventListener('click', function() {
                formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                setTimeout(() => {
                    const firstInput = formSection.querySelector('input');
                    if (firstInput) firstInput.focus();
                }, 800);
            });
        }
    }

    // ========== MÁSCARA DE TELEFONE ==========
    function setupPhoneMask() {
        const phoneInput = document.querySelector('input[name="phone"]');
        if (phoneInput) {
            phoneInput.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length > 11) value = value.slice(0, 11);
                const formatted = formatBrazilianPhone(value);
                e.target.value = formatted;
            });
            phoneInput.addEventListener('keypress', function(e) {
                if (!/[0-9]/.test(e.key) &&
                    !['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'Home', 'End', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                    e.preventDefault();
                }
            });
        }
    }

    function formatBrazilianPhone(value) {
        if (value.length <= 2) {
            return `(${value}`;
        } else if (value.length <= 7) {
            return `(${value.slice(0, 2)}) ${value.slice(2)}`;
        } else {
            return `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
        }
    }

    // ========== VALIDAÇÃO EM TEMPO REAL ==========
    function setupRealTimeValidation() {
        const inputs = document.querySelectorAll('input[required]');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                if (this.name === 'idade') {
                    validateAgeField(this);
                } else {
                    validateRequiredField(this);
                }
                if (this.checkValidity()) {
                    this.classList.remove('is-invalid');
                    this.classList.add('is-valid');
                } else {
                    this.classList.remove('is-valid');
                    this.classList.add('is-invalid');
                }
            });
        });
    }

    // ========== INICIALIZAÇÃO ==========
    setupFormValidation();
    setupFormDisplay();
    setupPhoneMask();
    setupRealTimeValidation();
});
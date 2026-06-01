(function () {
  function formatResidentialPhone(value) {
    const digits = String(value || '').replace(/\D/g, '').slice(0, 10);
    if (digits.length <= 2) return `(${digits}`;
    if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }

  function formatMobilePhone(value) {
    const digits = String(value || '').replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 2) return `(${digits}`;
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }

  function isValidResidentialPhone(value) {
    return /^\(\d{2}\)\s\d{4}-\d{4}$/.test(String(value || ''));
  }

  function isValidMobilePhone(value) {
    return /^\(\d{2}\)\s\d{5}-\d{4}$/.test(String(value || ''));
  }

  function formatCPF(value) {
    const digits = String(value || '').replace(/\D/g, '').slice(0, 11);
    return digits.replace(/(\d{0,3})(\d{0,3})(\d{0,3})(\d{0,2})/, '$1.$2.$3-$4').trim();
  }

  function formatCEP(value) {
    const digits = String(value || '').replace(/\D/g, '').slice(0, 8);
    return digits.replace(/(\d{0,5})(\d{0,3})/, '$1-$2').trim();
  }

  function convertBrDateToDb(dateStr) {
    if (!dateStr) return '';
    const isoMatch = String(dateStr).match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (isoMatch) {
      return dateStr;
    }
    const parts = String(dateStr).split('/');
    if (parts.length !== 3) return '';
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }

  function validateContactFields(formData) {
    if (!formData.phone && !formData.phone2) {
      return 'Informe ao menos Telefone residencial ou Celular';
    }

    if (formData.phone && !isValidResidentialPhone(formData.phone)) {
      return 'Telefone residencial inválido. Use (00) 0000-0000';
    }

    if (formData.phone2 && !isValidMobilePhone(formData.phone2)) {
      return 'Celular inválido. Use (00) 00000-0000';
    }

    return null;
  }

  async function fetchViaCep(cep) {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    return response.json();
  }

  function attachPhoneMasks(options = {}) {
    const residential = document.getElementById(options.residentialId || 'phone1');
    const mobile = document.getElementById(options.mobileId || 'phone2');
    const responsible = document.getElementById(options.responsibleId || 'responsible-phone');

    if (residential) {
      residential.addEventListener('input', function () {
        this.value = formatResidentialPhone(this.value);
      });
    }

    if (mobile) {
      mobile.addEventListener('input', function () {
        this.value = formatMobilePhone(this.value);
      });
    }

    if (responsible) {
      responsible.addEventListener('input', function () {
        this.value = formatMobilePhone(this.value);
      });
    }
  }

  function attachCpfMask(options = {}) {
    const cpfInput = document.getElementById(options.cpfId || 'cpf');
    if (!cpfInput) return;

    cpfInput.addEventListener('input', function () {
      this.value = formatCPF(this.value);
    });
  }

  function attachCepAutoFill(options = {}) {
    const cepInput = document.getElementById(options.cepId || 'cep');
    const streetInput = document.getElementById(options.streetId || 'street');
    const neighborhoodInput = document.getElementById(options.neighborhoodId || 'neighborhood');
    const cityInput = document.getElementById(options.cityId || 'city');
    const stateInput = document.getElementById(options.stateId || 'state');

    if (!cepInput) return;

    cepInput.addEventListener('input', async function () {
      this.value = formatCEP(this.value);
      const cepClean = this.value.replace(/\D/g, '');

      if (cepClean.length !== 8) return;

      try {
        const data = await fetchViaCep(cepClean);

        if (data.erro) {
          if (typeof options.onNotFound === 'function') {
            options.onNotFound();
          }
          return;
        }

        if (streetInput) streetInput.value = data.logradouro || '';
        if (neighborhoodInput) neighborhoodInput.value = data.bairro || '';
        if (cityInput) cityInput.value = data.localidade || '';
        if (stateInput) stateInput.value = data.uf || '';

        if (typeof options.onFilled === 'function') {
          options.onFilled();
        }
      } catch (error) {
        if (typeof options.onError === 'function') {
          options.onError(error);
        }
      }
    });
  }

  window.PatientFormUtils = {
    formatResidentialPhone,
    formatMobilePhone,
    isValidResidentialPhone,
    isValidMobilePhone,
    formatCPF,
    formatCEP,
    convertBrDateToDb,
    validateContactFields,
    attachPhoneMasks,
    attachCpfMask,
    attachCepAutoFill
  };
})();

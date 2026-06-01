(function () {
  function resolveLocale() {
    if (!window.flatpickr || !window.flatpickr.l10ns) {
      return 'pt';
    }

    if (window.flatpickr.l10ns.pt && window.flatpickr.l10ns.default !== window.flatpickr.l10ns.pt) {
      window.flatpickr.localize(window.flatpickr.l10ns.pt);
    }

    return 'pt';
  }

  function initPtBrDatePicker(selector, options = {}) {
    if (!window.flatpickr) {
      return [];
    }

    const locale = resolveLocale();
    const elements = document.querySelectorAll(selector);
    if (!elements.length) {
      return [];
    }

    const defaultConfig = {
      locale,
      dateFormat: 'Y-m-d',
      altInput: true,
      altFormat: 'd/m/Y',
      allowInput: false,
      disableMobile: true,
      onChange: function (selectedDates, dateStr, instance) {
        const inputEvent = new Event('input', { bubbles: true });
        const changeEvent = new Event('change', { bubbles: true });
        instance.input.dispatchEvent(inputEvent);
        instance.input.dispatchEvent(changeEvent);
      }
    };

    return Array.from(elements).map((element) => window.flatpickr(element, { ...defaultConfig, ...options }));
  }

  window.initPtBrDatePicker = initPtBrDatePicker;
})();

/**
 * Questionnaire Handler para page de visualização de paciente
 * Gerencia interação com prontuários integrados na página
 */

class QuestionnaireHandler {
  constructor() {
    this.API_BASE_URL = 'http://localhost:3000/api/questionnaires';
    this.userEmail = localStorage.getItem('userEmail');
    this.currentPatient = null;
    this.currentQuestionnaire = null;
  }

  /**
   * Inicializar handler com dados do paciente
   */
  async init(patientData) {
    this.currentPatient = patientData;
    console.log('QuestionnaireHandler inicializado para:', patientData.name);
  }

  /**
   * Listar prontuários disponíveis para um curso
   */
  async getAvailableQuestionnaires(course) {
    try {
      const response = await fetch(`${this.API_BASE_URL}/questionnaires/course/${encodeURIComponent(course)}`, {
        headers: {
          'x-user-email': this.userEmail,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Erro ao carregar prontuários');
      }

      const questionnaires = await response.json();
      // Retornar apenas prontuários publicados
      return questionnaires.filter(q => q.is_published);
    } catch (error) {
      console.error('Erro ao listar prontuários:', error);
      return [];
    }
  }

  /**
   * Obter perguntas de um prontuário
   */
  async getQuestionnaireQuestions(questionnaireId) {
    try {
      const response = await fetch(`${this.API_BASE_URL}/questionnaires/${questionnaireId}/questions`, {
        headers: {
          'x-user-email': this.userEmail,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const msg = `Erro ao carregar perguntas (${response.status})`;
        throw new Error(msg);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao listar perguntas:', error);
      throw error;
    }
  }

  /**
   * Salvar respostas de um prontuário
   */
  async saveResponses(questionnaireId, responses) {
    try {
      const response = await fetch(`${this.API_BASE_URL}/responses`, {
        method: 'POST',
        headers: {
          'x-user-email': this.userEmail,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          patientId: this.currentPatient.id,
          questionnaireId: questionnaireId,
          responses: responses
        })
      });

      if (!response.ok) {
        throw new Error('Erro ao salvar respostas');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao salvar respostas:', error);
      throw error;
    }
  }

  /**
   * Obter histórico de respostas anteriores
   */
  async getPreviousResponses(questionnaireId) {
    try {
      const response = await fetch(
        `${this.API_BASE_URL}/responses/${this.currentPatient.id}/${questionnaireId}`,
        {
          headers: {
            'x-user-email': this.userEmail,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Erro ao carregar histórico');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao listar histórico:', error);
      return [];
    }
  }

  /**
   * Renderizar pergunta com base em seu tipo
   */
  renderQuestion(question, responseValue = '') {
    const questionId = question.id;
    let html = `
      <div class="questionnaire-question" data-question-id="${questionId}">
        <label class="questionnaire-question__label">
          <span class="questionnaire-question__title">${this.escapeHtml(question.title)}</span>
          ${question.description ? `<p class="questionnaire-question__description">${this.escapeHtml(question.description)}</p>` : ''}
        </label>
    `;

    switch (question.question_type) {
      case 'texto_livre':
        html += `<textarea 
          class="questionnaire-question__input" 
          name="question_${questionId}"
          placeholder="Digite sua resposta..."
          rows="4"
        >${this.escapeHtml(responseValue)}</textarea>`;
        break;

      case 'multipla_escolha':
      case 'multipla_escolha': {
        const rawOpts = question.options;
        let options = [];
        if (rawOpts) {
          if (typeof rawOpts === 'string') {
            try { options = JSON.parse(rawOpts).options || []; } catch (e) { options = []; }
          } else if (Array.isArray(rawOpts)) {
            options = rawOpts;
          } else {
            options = rawOpts.options || [];
          }
        }
        html += `<div class="questionnaire-question__options">`;
        options.forEach(option => {
          const isSelected = responseValue === option;
          html += `
            <label class="questionnaire-question__option">
              <input type="radio" name="question_${questionId}" value="${this.escapeHtml(option)}" ${isSelected ? 'checked' : ''}>
              <span>${this.escapeHtml(option)}</span>
            </label>
          `;
        });
        html += `</div>`;
        break;
      }

      case 'sim_nao':
        const simSelected = responseValue === 'Sim';
        const naoSelected = responseValue === 'Não';
        html += `
          <div class="questionnaire-question__options">
            <label class="questionnaire-question__option">
              <input type="radio" name="question_${questionId}" value="Sim" ${simSelected ? 'checked' : ''}>
              <span>Sim</span>
            </label>
            <label class="questionnaire-question__option">
              <input type="radio" name="question_${questionId}" value="Não" ${naoSelected ? 'checked' : ''}>
              <span>Não</span>
            </label>
          </div>
        `;
        break;

      case 'escala':
        html += `<div class="questionnaire-question__scale">`;
        for (let i = 1; i <= 5; i++) {
          const isSelected = parseInt(responseValue) === i;
          html += `
            <label class="questionnaire-question__scale-item">
              <input type="radio" name="question_${questionId}" value="${i}" ${isSelected ? 'checked' : ''}>
              <span>${i}</span>
            </label>
          `;
        }
        html += `</div>`;
        break;
    }

    html += `</div>`;
    return html;
  }

  /**
   * Escapar HTML para prevenir XSS
   */
  escapeHtml(text) {
    const value = String(text ?? '');
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return value.replace(/[&<>"']/g, m => map[m]);
  }

  /**
   * Coletar respostas do formulário
   */
  collectResponses(formElement) {
    const responses = {};
    const formData = new FormData(formElement);

    for (const [key, value] of formData.entries()) {
      const questionId = key.replace('question_', '');
      responses[questionId] = value;
    }

    return responses;
  }
}

// Exportar para uso global
window.QuestionnaireHandler = QuestionnaireHandler;

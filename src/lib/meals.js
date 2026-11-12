import { el, empty } from './elements.js';

export class MealSearcher {
  /* TODO útfæra rest */
  constructor(api, baseElement) {
    this.api = api;
    this.baseElement = baseElement;
  }

  /* TODO útfæra önnur methods */
  renderForm() {
    const input = el('input', { type: 'text', name: 'Leita' });
    const button = el('button', { type: 'submit' }, 'Leita');
    const form = el('form', {submit : (e) => e.preventDefault()}, input, button);
    this.baseElement.appendChild(form);
  }
    /**
   * Birtir annaðhvort leitarform eða ákveðna uppskrift.
   * @param {string|null} id ID uppskriftar, ef ekki null er hún birt.
   */
  render(id = null) {
    if (id) {
      this.renderRecipe(id);
    } else {
      this.renderForm();
    }
  }
}



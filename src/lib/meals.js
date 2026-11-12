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
    const form = el('form', {submit : (e) => {e.preventDefault(); this.search(input.value)}}, input, button);
    this.baseElement.appendChild(form);
    this.resultsElement = el('div', { class: 'results' });
    this.baseElement.appendChild(this.resultsElement);
  }

  async search(query) {
    const results = await this.api.search(query);
    this.renderResults(results);
  }

  renderResults(results) {
    empty(this.resultsElement);
    const list = el('ul');
    for (const result of results) {
    const img = el('img', { src: result.image, alt: result.title });
    const link = el('a', { href: `?id=${result.id}` }, img, result.title);
    const item = el('li',{}, link);
    list.appendChild(item);
    }
    this.resultsElement.appendChild(list);
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


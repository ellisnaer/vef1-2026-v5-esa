import { el, empty } from "./elements.js";

export class MealSearcher {
  /**
   * @param {MealApi} api Hlutur sem sækir gögn frá API
   * @param {HTMLElement} baseElement Element sem viðmótið fer inn í
   */
  constructor(api, baseElement) {
    this.api = api;
    this.baseElement = baseElement;
  }

  /**
   * Býr til textareit og takka
   */
  renderForm() {
    const input = el("input", { type: "text", name: "Leita" });
    const button = el("button", { type: "submit" }, "Leita");
    const form = el(
      "form",
      {
        submit: (e) => {
          e.preventDefault();
          this.search(input.value);
        },
      },
      input,
      button,
    );
    this.baseElement.appendChild(form);
    this.resultsElement = el("div", { class: "results" });
    this.baseElement.appendChild(this.resultsElement);
  }
  /**
   * Leitar að uppskriftum og birtir niðurstöður
   * @param {string} query Leitarorð frá notanda
   * @returns {Promise<void>}
   */
  async search(query) {
    if (!query) {
      empty(this.resultsElement);
      this.resultsElement.appendChild(el("p", {}, "Sláðu inn leitarorð"));
      return;
    }
    empty(this.resultsElement);
    this.resultsElement.appendChild(el("p", {}, 'Leita að "' + query + '"...'));
    try {
      const results = await this.api.search(query);
      this.renderResults(results);
    } catch (e) {
      empty(this.resultsElement);
      this.resultsElement.appendChild(
        el("p", {}, "Villa kom upp við leit: " + e.message),
      );
    }
  }
  /**
   * Birtir niðurstöður leitar
   * @param {Array} results Fylki af uppskriftum með id, title og image
   */
  renderResults(results) {
    empty(this.resultsElement);
    if (results.length === 0) {
      this.resultsElement.appendChild(el("p", {}, "Engar niðurstöður"));
      return;
    }
    const list = el("ul");
    for (const result of results) {
      const img = el("img", { src: result.image, alt: result.title });
      const link = el("a", { href: `?id=${result.id}` }, img, result.title);
      const item = el("li", {}, link);
      list.appendChild(item);
    }
    this.resultsElement.appendChild(list);
  }

  /**
   * Sækir eina uppskrift og birtir hana
   * @param {string} id Auðkenning uppskriftar
   * @returns {Promise<void>}
   */
  async renderRecipe(id) {
    const result = await this.api.lookup(id);
    if (!result) {
      this.baseElement.appendChild(el("p", {}, "Uppskrift fannst ekki"));
      return;
    }
    const title = el("h2", {}, result.title);
    const img = el("img", { src: result.image, alt: result.title });
    const ingredients = el("ul");
    for (const item of result.ingredients) {
      const li = el("li", {}, `${item.ingredient} - ${item.measure}`);
      ingredients.appendChild(li);
    }
    const instructions = el("p", {}, result.instructions);
    const back = el("a", { href: "?" }, "Til baka");
    const recipe = el(
      "article",
      {},
      title,
      img,
      ingredients,
      instructions,
      back,
    );
    this.baseElement.appendChild(recipe);
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

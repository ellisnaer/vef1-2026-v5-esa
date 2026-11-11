import { sleep, error } from "./helpers.js";

/** Hámarksfjöldi hráefna í svari frá API. */
const MAX_INGREDIENTS = 20;

/**
 * Býr til lista af hráefnum með magni úr uppskrift
 * @param {object} meal Uppskrift frá API
 * @returns {Array} Fylki af hráefnum með ingredients og measure
 */
function getIngredients(meal) {
  const ingredients = [];
  for (let i = 1; i <= MAX_INGREDIENTS; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ingredient) {
      ingredients.push({ ingredient, measure });
    }
  }
  return ingredients;
}

export class MealApi {
  /**
   * @param {string} baseUrl API base url.
   */
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }
  /**
   * Leitar af uppskriftum eftir nafni
   * @param {string} query Leitar orð frá notanda
   * @returns {Promise<Array>} Fylki af uppskriftum með id, title og image
   */
  async search(query) {
    if (query.includes("slow")) {
      await sleep(5);
    }
    if (query.includes("error")) {
      error("Simulated error");
    }
    const url = `${this.baseUrl}search.php?s=${query}`;
    const response = await fetch(url);
    if (!response.ok) {
      error(`Gat ekki leitað af uppskrift`);
    }
    const data = await response.json();
    if (!Array.isArray(data.meals)) {
      return [];
    }
    return data.meals.map((meal) => ({
      id: meal.idMeal,
      title: meal.strMeal,
      image: meal.strMealThumb,
    }));
  }
  /**
   * Sækir eina uppskrift eftir id
   * @param {string} id Auðkenning uppskriftar
   * @returns {Promise<object|null>} Uppskrift með id, title, image, instructions og ingredients, eða null ef hún finnst ekki
   */
  async lookup(id) {
    const url = `${this.baseUrl}lookup.php?i=${id}`;
    const response = await fetch(url);
    if (!response.ok) {
      error(`Gat ekki sótt uppskrift`);
    }
    const data = await response.json();
    if (!Array.isArray(data.meals)) {
      return null;
    }
    const meal = data.meals[0];
    return {
      id: meal.idMeal,
      title: meal.strMeal,
      image: meal.strMealThumb,
      instructions: meal.strInstructions,
      ingredients: getIngredients(meal),
    };
  }
}

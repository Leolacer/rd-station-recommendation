/**
 * Serviço de recomendação de produtos
 * Implementa a lógica de negócios para determinar recomendações
 * baseadas nas preferências do usuário
 */
class RecommendationService {
  constructor() {
    this.products = [];
  }

  /**
   * Carrega os produtos do servidor
   * @returns {Promise<Array>} Lista de produtos
   */
  async loadProducts() {
    try {
      const response = await fetch('http://localhost:3001/products');
      if (!response.ok) {
        throw new Error('Erro ao carregar produtos');
      }
      this.products = await response.json();
      return this.products;
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      return [];
    }
  }

  /**
   * Calcula a pontuação de um produto baseada nas preferências
   * @param {Object} product - Produto a ser avaliado
   * @param {Object} preferences - Preferências do usuário
   * @returns {number} Pontuação do produto
   */
  calculateProductScore(product, preferences) {
    let score = 0;

    // Pontuação por categoria
    if (preferences.category && product.category === preferences.category) {
      score += 10;
    }

    // Pontuação por tags
    if (preferences.tags && preferences.tags.length > 0) {
      const matchingTags = preferences.tags.filter(tag => 
        product.tags.includes(tag)
      );
      score += matchingTags.length * 5;
    }

    // Pontuação por faixa de preço
    if (preferences.priceRange) {
      const { min, max } = preferences.priceRange;
      if (product.price >= min && product.price <= max) {
        score += 8;
      } else if (product.price <= max * 1.2) {
        score += 4; // Produtos ligeiramente acima do orçamento
      }
    }

    // Pontuação por nível de experiência
    if (preferences.experienceLevel) {
      const experienceMap = {
        'iniciante': ['iniciante'],
        'intermediário': ['iniciante', 'intermediário'],
        'avançado': ['iniciante', 'intermediário', 'avançado']
      };
      
      const allowedLevels = experienceMap[preferences.experienceLevel] || [];
      if (allowedLevels.some(level => product.tags.includes(level))) {
        score += 6;
      }
    }

    // Pontuação por orçamento disponível
    if (preferences.budget && product.price <= preferences.budget) {
      score += 3;
    }

    return score;
  }

  /**
   * Filtra produtos por critérios básicos
   * @param {Object} preferences - Preferências do usuário
   * @returns {Array} Produtos filtrados
   */
  filterProducts(preferences) {
    return this.products.filter(product => {
      // Filtro por categoria
      if (preferences.category && product.category !== preferences.category) {
        return false;
      }

      // Filtro por orçamento máximo
      if (preferences.budget && product.price > preferences.budget) {
        return false;
      }

      // Filtro por nível de experiência
      if (preferences.experienceLevel) {
        const experienceMap = {
          'iniciante': ['iniciante'],
          'intermediário': ['iniciante', 'intermediário'],
          'avançado': ['iniciante', 'intermediário', 'avançado']
        };
        
        const allowedLevels = experienceMap[preferences.experienceLevel] || [];
        if (!allowedLevels.some(level => product.tags.includes(level))) {
          return false;
        }
      }

      return true;
    });
  }

  /**
   * Obtém recomendações baseadas nas preferências
   * @param {Object} preferences - Preferências do usuário
   * @param {string} mode - Modo de recomendação ('single' ou 'multiple')
   * @param {number} limit - Número máximo de produtos (para modo múltiplo)
   * @returns {Array|Object} Recomendações
   */
  getRecommendations(preferences, mode = 'single', limit = 5) {
    // Filtra produtos por critérios básicos
    let filteredProducts = this.filterProducts(preferences);
    
    if (filteredProducts.length === 0) {
      return mode === 'single' ? null : [];
    }

    // Calcula pontuação para cada produto filtrado
    const scoredProducts = filteredProducts.map(product => ({
      ...product,
      score: this.calculateProductScore(product, preferences)
    }));

    // Ordena por pontuação (maior para menor)
    scoredProducts.sort((a, b) => b.score - a.score);

    // Em caso de empate, mantém a ordem original (último produto válido)
    const uniqueScores = [...new Set(scoredProducts.map(p => p.score))];
    if (uniqueScores.length < scoredProducts.length) {
      // Reordena mantendo a ordem original para produtos com mesma pontuação
      scoredProducts.sort((a, b) => {
        if (a.score === b.score) {
          return this.products.findIndex(p => p.id === a.id) - 
                 this.products.findIndex(p => p.id === b.id);
        }
        return b.score - a.score;
      });
    }

    if (mode === 'single') {
      return scoredProducts[0];
    } else {
      return scoredProducts.slice(0, limit);
    }
  }

  /**
   * Obtém estatísticas das recomendações
   * @param {Array} recommendations - Lista de recomendações
   * @returns {Object} Estatísticas
   */
  getRecommendationStats(recommendations) {
    if (!recommendations || recommendations.length === 0) {
      return { count: 0, averagePrice: 0, categories: [] };
    }

    const prices = recommendations.map(p => p.price);
    const categories = [...new Set(recommendations.map(p => p.category))];

    return {
      count: recommendations.length,
      averagePrice: prices.reduce((sum, price) => sum + price, 0) / prices.length,
      categories: categories,
      priceRange: {
        min: Math.min(...prices),
        max: Math.max(...prices)
      }
    };
  }
}

export default RecommendationService;

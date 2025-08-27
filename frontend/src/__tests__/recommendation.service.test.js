import RecommendationService from '../recommendation.service';

// Mock do fetch global
global.fetch = jest.fn();

describe('RecommendationService', () => {
  let service;
  const mockProducts = [
    {
      id: 1,
      name: 'Marketing Digital Básico',
      category: 'marketing',
      price: 99.00,
      tags: ['iniciante', 'marketing', 'digital'],
      description: 'Curso introdutório de marketing digital'
    },
    {
      id: 2,
      name: 'Automação de Vendas',
      category: 'vendas',
      price: 199.00,
      tags: ['vendas', 'automação', 'intermediário'],
      description: 'Sistema completo de automação de vendas'
    },
    {
      id: 3,
      name: 'Analytics Avançado',
      category: 'analytics',
      price: 299.00,
      tags: ['analytics', 'avançado', 'dados'],
      description: 'Análise avançada de dados'
    }
  ];

  beforeEach(() => {
    service = new RecommendationService();
    service.products = [...mockProducts];
    fetch.mockClear();
  });

  describe('loadProducts', () => {
    it('deve carregar produtos com sucesso', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockProducts
      });

      const result = await service.loadProducts();
      
      expect(result).toEqual(mockProducts);
      expect(service.products).toEqual(mockProducts);
      expect(fetch).toHaveBeenCalledWith('http://localhost:3001/products');
    });

    it('deve lidar com erro na requisição', async () => {
      fetch.mockRejectedValueOnce(new Error('Erro de rede'));

      const result = await service.loadProducts();
      
      expect(result).toEqual([]);
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('calculateProductScore', () => {
    it('deve calcular pontuação correta para produto com categoria correspondente', () => {
      const preferences = { category: 'marketing' };
      const product = mockProducts[0];
      
      const score = service.calculateProductScore(product, preferences);
      
      expect(score).toBe(10); // 10 pontos por categoria
    });

    it('deve calcular pontuação para produto com tags correspondentes', () => {
      const preferences = { tags: ['marketing', 'digital'] };
      const product = mockProducts[0];
      
      const score = service.calculateProductScore(product, preferences);
      
      expect(score).toBe(10); // 2 tags * 5 pontos
    });

    it('deve calcular pontuação para produto dentro da faixa de preço', () => {
      const preferences = { priceRange: { min: 50, max: 150 } };
      const product = mockProducts[0]; // preço 99
      
      const score = service.calculateProductScore(product, preferences);
      
      expect(score).toBe(8); // 8 pontos por estar na faixa
    });

    it('deve calcular pontuação para produto com nível de experiência', () => {
      const preferences = { experienceLevel: 'intermediário' };
      const product = mockProducts[1]; // tags incluem 'intermediário'
      
      const score = service.calculateProductScore(product, preferences);
      
      expect(score).toBe(6); // 6 pontos por nível de experiência
    });

    it('deve calcular pontuação para produto dentro do orçamento', () => {
      const preferences = { budget: 200 };
      const product = mockProducts[0]; // preço 99
      
      const score = service.calculateProductScore(product, preferences);
      
      expect(score).toBe(3); // 3 pontos por estar dentro do orçamento
    });

    it('deve calcular pontuação combinada', () => {
      const preferences = {
        category: 'marketing',
        tags: ['digital'],
        budget: 200
      };
      const product = mockProducts[0];
      
      const score = service.calculateProductScore(product, preferences);
      
      expect(score).toBe(18); // 10 (categoria) + 5 (tag) + 3 (orçamento)
    });
  });

  describe('filterProducts', () => {
    it('deve filtrar produtos por categoria', () => {
      const preferences = { category: 'marketing' };
      
      const filtered = service.filterProducts(preferences);
      
      expect(filtered).toHaveLength(1);
      expect(filtered[0].category).toBe('marketing');
    });

    it('deve filtrar produtos por orçamento', () => {
      const preferences = { budget: 150 };
      
      const filtered = service.filterProducts(preferences);
      
      expect(filtered).toHaveLength(2); // produtos com preço <= 150
    });

    it('deve filtrar produtos por nível de experiência', () => {
      const preferences = { experienceLevel: 'avançado' };
      
      const filtered = service.filterProducts(preferences);
      
      expect(filtered).toHaveLength(1); // apenas produto avançado
    });

    it('deve retornar todos os produtos quando não há filtros', () => {
      const preferences = {};
      
      const filtered = service.filterProducts(preferences);
      
      expect(filtered).toHaveLength(3);
    });
  });

  describe('getRecommendations', () => {
    it('deve retornar produto único quando mode é single', () => {
      const preferences = { category: 'marketing' };
      
      const result = service.getRecommendations(preferences, 'single');
      
      expect(result).toBeDefined();
      expect(result.id).toBe(1);
      expect(result.score).toBeDefined();
    });

    it('deve retornar múltiplos produtos quando mode é multiple', () => {
      const preferences = { budget: 200 };
      
      const result = service.getRecommendations(preferences, 'multiple', 2);
      
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeLessThanOrEqual(2);
      expect(result[0].score).toBeDefined();
    });

    it('deve retornar null para produto único quando não há produtos', () => {
      const preferences = { category: 'inexistente' };
      
      const result = service.getRecommendations(preferences, 'single');
      
      expect(result).toBeNull();
    });

    it('deve retornar array vazio para múltiplos produtos quando não há produtos', () => {
      const preferences = { category: 'inexistente' };
      
      const result = service.getRecommendations(preferences, 'multiple');
      
      expect(result).toEqual([]);
    });

    it('deve ordenar produtos por pontuação', () => {
      const preferences = { tags: ['marketing'] };
      
      const result = service.getRecommendations(preferences, 'multiple', 3);
      
      expect(result[0].score).toBeGreaterThanOrEqual(result[1].score);
      expect(result[1].score).toBeGreaterThanOrEqual(result[2].score);
    });
  });

  describe('getRecommendationStats', () => {
    it('deve calcular estatísticas corretas para múltiplos produtos', () => {
      const recommendations = [
        { price: 100, category: 'marketing' },
        { price: 200, category: 'vendas' },
        { price: 300, category: 'analytics' }
      ];
      
      const stats = service.getRecommendationStats(recommendations);
      
      expect(stats.count).toBe(3);
      expect(stats.averagePrice).toBe(200);
      expect(stats.categories).toContain('marketing');
      expect(stats.categories).toContain('vendas');
      expect(stats.categories).toContain('analytics');
      expect(stats.priceRange.min).toBe(100);
      expect(stats.priceRange.max).toBe(300);
    });

    it('deve retornar estatísticas vazias quando não há recomendações', () => {
      const stats = service.getRecommendationStats([]);
      
      expect(stats.count).toBe(0);
      expect(stats.averagePrice).toBe(0);
      expect(stats.categories).toEqual([]);
    });

    it('deve lidar com recomendações undefined', () => {
      const stats = service.getRecommendationStats(undefined);
      
      expect(stats.count).toBe(0);
      expect(stats.averagePrice).toBe(0);
      expect(stats.categories).toEqual([]);
    });
  });
});

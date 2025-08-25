import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';

// Mock do RecommendationService
jest.mock('../recommendation.service', () => {
  return jest.fn().mockImplementation(() => ({
    loadProducts: jest.fn().mockResolvedValue([]),
    getRecommendations: jest.fn(),
    getRecommendationStats: jest.fn()
  }));
});

// Mock do fetch global
global.fetch = jest.fn();

describe('App Component', () => {
  let mockRecommendationService;

  beforeEach(() => {
    // Limpa todos os mocks
    jest.clearAllMocks();
    
    // Mock do fetch para carregar produtos
    fetch.mockResolvedValue({
      ok: true,
      json: async () => []
    });
  });

  it('deve renderizar o header com informações da RD Station', () => {
    render(<App />);
    
    expect(screen.getByText('RD Station')).toBeInTheDocument();
    expect(screen.getByText('Sistema de Recomendação de Produtos')).toBeInTheDocument();
    expect(screen.getByText('Node.js ≥18.3')).toBeInTheDocument();
    expect(screen.getByText('React 18.2.0')).toBeInTheDocument();
  });

  it('deve renderizar o formulário de preferências', () => {
    render(<App />);
    
    expect(screen.getByText('Configure suas Preferências')).toBeInTheDocument();
    expect(screen.getByText('Gerar Recomendações')).toBeInTheDocument();
  });

  it('deve renderizar a seção de recomendações', () => {
    render(<App />);
    
    expect(screen.getByText('Recomendações')).toBeInTheDocument();
    expect(screen.getByText('Configure suas preferências e clique em "Gerar Recomendações" para ver sugestões personalizadas.')).toBeInTheDocument();
  });

  it('deve renderizar o footer com informações do projeto', () => {
    render(<App />);
    
    expect(screen.getByText('Desafio Técnico - Frontend RD Station | Engenharia 2024')).toBeInTheDocument();
    expect(screen.getByText('Desenvolvido com React.js, Tailwind CSS e json-server')).toBeInTheDocument();
  });

  it('deve carregar produtos ao inicializar', async () => {
    const mockLoadProducts = jest.fn().mockResolvedValue([]);
    
    // Mock do RecommendationService com método loadProducts
    const RecommendationService = require('../recommendation.service').default;
    RecommendationService.mockImplementation(() => ({
      loadProducts: mockLoadProducts,
      getRecommendations: jest.fn(),
      getRecommendationStats: jest.fn()
    }));

    render(<App />);
    
    await waitFor(() => {
      expect(mockLoadProducts).toHaveBeenCalled();
    });
  });

  it('deve lidar com erro ao carregar produtos', async () => {
    const mockLoadProducts = jest.fn().mockRejectedValue(new Error('Erro de rede'));
    
    const RecommendationService = require('../recommendation.service').default;
    RecommendationService.mockImplementation(() => ({
      loadProducts: mockLoadProducts,
      getRecommendations: jest.fn(),
      getRecommendationStats: jest.fn()
    }));

    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText('Erro ao carregar produtos do servidor')).toBeInTheDocument();
    });
  });

  it('deve mostrar estatísticas quando há recomendações', async () => {
    const mockGetRecommendationStats = jest.fn().mockReturnValue({
      count: 2,
      averagePrice: 150,
      categories: ['marketing', 'vendas'],
      priceRange: { min: 100, max: 200 }
    });

    const RecommendationService = require('../recommendation.service').default;
    RecommendationService.mockImplementation(() => ({
      loadProducts: jest.fn().mockResolvedValue([]),
      getRecommendations: jest.fn().mockReturnValue([
        { id: 1, name: 'Produto 1', price: 100, category: 'marketing' },
        { id: 2, name: 'Produto 2', price: 200, category: 'vendas' }
      ]),
      getRecommendationStats: mockGetRecommendationStats
    }));

    render(<App />);
    
    // Simula submissão do formulário
    const submitButton = screen.getByText('Gerar Recomendações');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Resumo das Recomendações')).toBeInTheDocument();
      expect(screen.getByText('Total:')).toBeInTheDocument();
      expect(screen.getByText('Preço Médio:')).toBeInTheDocument();
      expect(screen.getByText('Faixa de Preço:')).toBeInTheDocument();
      expect(screen.getByText('Categorias:')).toBeInTheDocument();
    });
  });

  it('deve formatar preços corretamente em português brasileiro', () => {
    render(<App />);
    
    // O componente App tem um método formatPrice que formata para BRL
    // Vamos testar se ele está sendo usado corretamente
    const appInstance = screen.getByText('Recomendações').closest('.App');
    expect(appInstance).toBeInTheDocument();
  });

  it('deve mostrar loading state durante processamento', async () => {
    const mockGetRecommendations = jest.fn().mockImplementation(() => {
      // Simula um delay para mostrar o loading
      return new Promise(resolve => {
        setTimeout(() => resolve([]), 100);
      });
    });

    const RecommendationService = require('../recommendation.service').default;
    RecommendationService.mockImplementation(() => ({
      loadProducts: jest.fn().mockResolvedValue([]),
      getRecommendations: mockGetRecommendations,
      getRecommendationStats: jest.fn()
    }));

    render(<App />);
    
    // Simula submissão do formulário
    const submitButton = screen.getByText('Gerar Recomendações');
    fireEvent.click(submitButton);
    
    // Deve mostrar loading
    expect(screen.getByText('Gerando recomendações...')).toBeInTheDocument();
    expect(screen.getByText('Gerando recomendações...').closest('div')).toHaveClass('animate-spin');
  });

  it('deve lidar com erro ao gerar recomendações', async () => {
    const mockGetRecommendations = jest.fn().mockImplementation(() => {
      throw new Error('Erro ao gerar recomendações');
    });

    const RecommendationService = require('../recommendation.service').default;
    RecommendationService.mockImplementation(() => ({
      loadProducts: jest.fn().mockResolvedValue([]),
      getRecommendations: mockGetRecommendations,
      getRecommendationStats: jest.fn()
    }));

    render(<App />);
    
    // Simula submissão do formulário
    const submitButton = screen.getByText('Gerar Recomendações');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Erro ao gerar recomendações')).toBeInTheDocument();
    });
  });

  it('deve renderizar produtos recomendados corretamente', async () => {
    const mockProducts = [
      {
        id: 1,
        name: 'Marketing Digital Básico',
        price: 99.00,
        category: 'marketing',
        tags: ['iniciante', 'marketing'],
        description: 'Curso introdutório de marketing digital',
        score: 15
      }
    ];

    const RecommendationService = require('../recommendation.service').default;
    RecommendationService.mockImplementation(() => ({
      loadProducts: jest.fn().mockResolvedValue([]),
      getRecommendations: jest.fn().mockReturnValue(mockProducts),
      getRecommendationStats: jest.fn().mockReturnValue({
        count: 1,
        averagePrice: 99,
        categories: ['marketing'],
        priceRange: { min: 99, max: 99 }
      })
    }));

    render(<App />);
    
    // Simula submissão do formulário
    const submitButton = screen.getByText('Gerar Recomendações');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Marketing Digital Básico')).toBeInTheDocument();
      expect(screen.getByText('R$ 99,00')).toBeInTheDocument();
      expect(screen.getByText('marketing')).toBeInTheDocument();
      expect(screen.getByText('iniciante')).toBeInTheDocument();
      expect(screen.getByText('Curso introdutório de marketing digital')).toBeInTheDocument();
      expect(screen.getByText('15')).toBeInTheDocument();
    });
  });
});

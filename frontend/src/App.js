import React, { useState, useEffect } from 'react';
import Form from './Form';
import RecommendationService from './recommendation.service';
import './App.css';

/**
 * Componente principal da aplicação
 * Gerencia o estado das recomendações e integra todos os componentes
 */
function App() {
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recommendationService] = useState(() => new RecommendationService());

  useEffect(() => {
    // Carrega produtos ao inicializar
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      await recommendationService.loadProducts();
    } catch (error) {
      setError('Erro ao carregar produtos do servidor');
      console.error('Erro ao carregar produtos:', error);
    }
  };

  const handleFormSubmit = async (preferences) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const mode = preferences.mode || 'single';
      const limit = mode === 'multiple' ? 5 : 1;
      
      const possibleResults = recommendationService.getRecommendations(preferences, mode, limit);
      const isThenable = possibleResults && typeof possibleResults.then === 'function';
      const results = isThenable
        ? await possibleResults
        : await new Promise((resolve) => setTimeout(() => resolve(possibleResults), 0));
      
      if (mode === 'single') {
        setRecommendations(results ? [results] : []);
      } else {
        setRecommendations(results || []);
      }
    } catch (error) {
      setError('Erro ao gerar recomendações');
      console.error('Erro ao gerar recomendações:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRecommendationStats = () => {
    if (!recommendations || recommendations.length === 0) {
      return null;
    }
    return recommendationService.getRecommendationStats(recommendations);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const renderProductCard = (product, index) => (
    <div key={product.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-rd-dark">{product.name}</h3>
        <span className="text-2xl font-bold text-rd-blue">{formatPrice(product.price)}</span>
      </div>
      
      <p className="text-gray-600 mb-4">{product.description}</p>
      
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
          {product.category}
        </span>
        {product.tags.map(tag => (
          <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">
            {tag}
          </span>
        ))}
      </div>
      
      {product.score !== undefined && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Pontuação de relevância:</span>
          <span className="text-lg font-semibold text-green-600">{product.score}</span>
        </div>
      )}
    </div>
  );

  const stats = getRecommendationStats();

  return (
    <div className="min-h-screen bg-rd-gray">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-rd-dark">
                RD Station
              </h1>
              <p className="text-lg text-gray-600">
                Sistema de Recomendação de Produtos
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Node.js ≥18.3</p>
              <p className="text-sm text-gray-500">React 18.2.0</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-1">
            <Form onSubmit={handleFormSubmit} isLoading={isLoading} />
          </div>

          {/* Recommendations Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-rd-dark mb-6">
                Recomendações
              </h2>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}

              {isLoading && (
                <div className="text-center py-8">
                  <div className="animate-spin">
                    <div className="inline-block rounded-full h-8 w-8 border-b-2 border-rd-blue"></div>
                    <p className="mt-2 text-gray-600">Gerando recomendações...</p>
                  </div>
                </div>
              )}

              {!isLoading && !error && recommendations.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    Configure suas preferências e clique em "Gerar Recomendações" para ver sugestões personalizadas.
                  </p>
                </div>
              )}

              {!isLoading && !error && recommendations.length > 0 && (
                <>
                  {/* Statistics */}
                  {stats && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                      <h3 className="font-semibold text-blue-800 mb-2">Resumo das Recomendações</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-blue-600 font-medium">Total:</span>
                          <p className="text-blue-800">{stats.count}</p>
                        </div>
                        <div>
                          <span className="text-blue-600 font-medium">Preço Médio:</span>
                          <p className="text-blue-800">{formatPrice(stats.averagePrice)}</p>
                        </div>
                        <div>
                          <span className="text-blue-600 font-medium">Faixa de Preço:</span>
                          <p className="text-blue-800">
                            {formatPrice(stats.priceRange.min)} - {formatPrice(stats.priceRange.max)}
                          </p>
                        </div>
                        <div>
                          <span className="text-blue-600 font-medium">Categorias:</span>
                          <p className="text-blue-800">{stats.categories.join(', ')}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Products Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {recommendations.map((product, index) => renderProductCard(product, index))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-500 text-sm">
            <p>Desafio Técnico - Frontend RD Station | Engenharia 2024</p>
            <p className="mt-1">
              Desenvolvido com React.js, Tailwind CSS e json-server
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

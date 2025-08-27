import React, { useState } from 'react';

const Form = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    category: '',
    experienceLevel: '',
    budget: '',
    tags: [],
    priceRange: { min: '', max: '' },
    mode: 'single'
  });

  const [availableTags] = useState([
    'marketing', 'vendas', 'analytics', 'crm', 'seo', 'social', 'ads',
    'iniciante', 'intermediário', 'avançado', 'digital', 'automação', 'dados'
  ]);

  const categories = [
    { value: '', label: 'Todas as categorias' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'vendas', label: 'Vendas' },
    { value: 'analytics', label: 'Analytics' },
    { value: 'crm', label: 'CRM' },
    { value: 'seo', label: 'SEO' },
    { value: 'social', label: 'Social Media' },
    { value: 'ads', label: 'Google Ads' }
  ];

  const experienceLevels = [
    { value: '', label: 'Qualquer nível' },
    { value: 'iniciante', label: 'Iniciante' },
    { value: 'intermediário', label: 'Intermediário' },
    { value: 'avançado', label: 'Avançado' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTagToggle = (tag) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const handlePriceRangeChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      priceRange: {
        ...prev.priceRange,
        [field]: value === '' ? '' : parseFloat(value)
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.budget && formData.budget <= 0) {
      alert('O orçamento deve ser maior que zero');
      return;
    }
    if (formData.priceRange.min && formData.priceRange.max && 
        formData.priceRange.min > formData.priceRange.max) {
      alert('O preço mínimo não pode ser maior que o máximo');
      return;
    }
    const cleanData = {};
    if (formData.mode) cleanData.mode = formData.mode;
    if (formData.category) cleanData.category = formData.category;
    if (formData.experienceLevel) cleanData.experienceLevel = formData.experienceLevel;
    if (formData.budget) cleanData.budget = formData.budget;
    if (formData.tags.length > 0) cleanData.tags = formData.tags;
    if (formData.priceRange.min || formData.priceRange.max) {
      cleanData.priceRange = {};
      if (formData.priceRange.min) cleanData.priceRange.min = formData.priceRange.min;
      if (formData.priceRange.max) cleanData.priceRange.max = formData.priceRange.max;
    }
    onSubmit(cleanData);
  };

  const resetForm = () => {
    setFormData({
      category: '',
      experienceLevel: '',
      budget: '',
      tags: [],
      priceRange: { min: '', max: '' },
      mode: 'single'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold text-rd-dark mb-6">
        Configure suas Preferências
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Modo de Recomendação
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="mode"
                value="single"
                checked={formData.mode === 'single'}
                onChange={(e) => handleInputChange('mode', e.target.value)}
                className="mr-2"
              />
              Produto Único
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="mode"
                value="multiple"
                checked={formData.mode === 'multiple'}
                onChange={(e) => handleInputChange('mode', e.target.value)}
                className="mr-2"
              />
              Múltiplos Produtos
            </label>
          </div>
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
            Categoria
          </label>
          <select
            id="category"
            value={formData.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rd-blue"
          >
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="experienceLevel" className="block text-sm font-medium text-gray-700 mb-2">
            Nível de Experiência
          </label>
          <select
            id="experienceLevel"
            value={formData.experienceLevel}
            onChange={(e) => handleInputChange('experienceLevel', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rd-blue"
          >
            {experienceLevels.map(level => (
              <option key={level.value} value={level.value}>
                {level.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
            Orçamento Máximo (R$)
          </label>
          <input
            id="budget"
            type="number"
            value={formData.budget}
            onChange={(e) => handleInputChange('budget', e.target.value)}
            placeholder="Ex: 200"
            min="0"
            step="0.01"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rd-blue"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Faixa de Preço (R$)
          </label>
          <div className="grid grid-cols-3 gap-2 items-center">
            <input
              id="priceMin"
              type="number"
              value={formData.priceRange.min}
              onChange={(e) => handlePriceRangeChange('min', e.target.value)}
              placeholder="Mín"
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rd-blue"
            />
            <span className="text-center text-gray-500 text-sm">até</span>
            <input
              id="priceMax"
              type="number"
              value={formData.priceRange.max}
              onChange={(e) => handlePriceRangeChange('max', e.target.value)}
              placeholder="Máx"
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rd-blue"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tags de Interesse
          </label>
          <div className="flex flex-wrap gap-2">
            {availableTags.map(tag => (
              <button
                key={tag}
                type="button"
                onClick={() => handleTagToggle(tag)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  formData.tags.includes(tag)
                    ? 'bg-rd-blue text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
        <div className="flex space-x-4 pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-rd-blue text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Processando...' : 'Gerar Recomendações'}
          </button>
          <button
            type="button"
            onClick={resetForm}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            Limpar
          </button>
        </div>
      </form>
    </div>
  );
};

export default Form;



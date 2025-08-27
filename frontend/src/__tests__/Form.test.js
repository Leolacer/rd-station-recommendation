import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Form from '../Form';

describe('Form Component', () => {
  const mockOnSubmit = jest.fn();
  const mockIsLoading = false;

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it('deve renderizar todos os campos do formulário', () => {
    render(<Form onSubmit={mockOnSubmit} isLoading={mockIsLoading} />);
    
    expect(screen.getByText('Configure suas Preferências')).toBeInTheDocument();
    expect(screen.getByText('Produto Único')).toBeInTheDocument();
    expect(screen.getByText('Múltiplos Produtos')).toBeInTheDocument();
    expect(screen.getByLabelText('Categoria')).toBeInTheDocument();
    expect(screen.getByLabelText('Nível de Experiência')).toBeInTheDocument();
    expect(screen.getByLabelText('Orçamento Máximo (R$)')).toBeInTheDocument();
    expect(screen.getByText('Tags de Interesse')).toBeInTheDocument();
    expect(screen.getByText('Gerar Recomendações')).toBeInTheDocument();
    expect(screen.getByText('Limpar')).toBeInTheDocument();
  });

  it('deve permitir seleção de modo de recomendação', () => {
    render(<Form onSubmit={mockOnSubmit} isLoading={mockIsLoading} />);
    
    const singleMode = screen.getByDisplayValue('single');
    const multipleMode = screen.getByDisplayValue('multiple');
    
    expect(singleMode).toBeChecked();
    expect(multipleMode).not.toBeChecked();
    
    fireEvent.click(multipleMode);
    expect(multipleMode).toBeChecked();
    expect(singleMode).not.toBeChecked();
  });

  it('deve permitir seleção de categoria', () => {
    render(<Form onSubmit={mockOnSubmit} isLoading={mockIsLoading} />);
    
    const categorySelect = screen.getByLabelText('Categoria');
    fireEvent.change(categorySelect, { target: { value: 'marketing' } });
    
    expect(categorySelect.value).toBe('marketing');
  });

  it('deve permitir seleção de nível de experiência', () => {
    render(<Form onSubmit={mockOnSubmit} isLoading={mockIsLoading} />);
    
    const experienceSelect = screen.getByLabelText('Nível de Experiência');
    fireEvent.change(experienceSelect, { target: { value: 'intermediário' } });
    
    expect(experienceSelect.value).toBe('intermediário');
  });

  it('deve permitir entrada de orçamento', () => {
    render(<Form onSubmit={mockOnSubmit} isLoading={mockIsLoading} />);
    
    const budgetInput = screen.getByPlaceholderText('Ex: 200');
    fireEvent.change(budgetInput, { target: { value: '200' } });
    
    expect(budgetInput.value).toBe('200');
  });

  it('deve permitir entrada de faixa de preço', () => {
    render(<Form onSubmit={mockOnSubmit} isLoading={mockIsLoading} />);
    
    const minPriceInput = screen.getByPlaceholderText('Mín');
    const maxPriceInput = screen.getByPlaceholderText('Máx');
    
    fireEvent.change(minPriceInput, { target: { value: '50' } });
    fireEvent.change(maxPriceInput, { target: { value: '150' } });
    
    expect(minPriceInput.value).toBe('50');
    expect(maxPriceInput.value).toBe('150');
  });

  it('deve permitir seleção de tags', () => {
    render(<Form onSubmit={mockOnSubmit} isLoading={mockIsLoading} />);
    
    const marketingTag = screen.getByText('marketing');
    const digitalTag = screen.getByText('digital');
    
    fireEvent.click(marketingTag);
    fireEvent.click(digitalTag);
    
    expect(marketingTag).toHaveClass('bg-rd-blue', 'text-white');
    expect(digitalTag).toHaveClass('bg-rd-blue', 'text-white');
  });

  it('deve permitir desseleção de tags', () => {
    render(<Form onSubmit={mockOnSubmit} isLoading={mockIsLoading} />);
    
    const marketingTag = screen.getByText('marketing');
    
    // Seleciona a tag
    fireEvent.click(marketingTag);
    expect(marketingTag).toHaveClass('bg-rd-blue', 'text-white');
    
    // Desseleciona a tag
    fireEvent.click(marketingTag);
    expect(marketingTag).toHaveClass('bg-gray-200', 'text-gray-700');
  });

  it('deve validar orçamento negativo', async () => {
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
    render(<Form onSubmit={mockOnSubmit} isLoading={mockIsLoading} />);
    
    const budgetInput = screen.getByPlaceholderText('Ex: 200');
    fireEvent.change(budgetInput, { target: { value: '-100' } });
    
    const submitButton = screen.getByText('Gerar Recomendações');
    fireEvent.click(submitButton);
    
    expect(alertSpy).toHaveBeenCalledWith('O orçamento deve ser maior que zero');
    expect(mockOnSubmit).not.toHaveBeenCalled();
    
    alertSpy.mockRestore();
  });

  it('deve validar faixa de preço inválida', async () => {
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
    render(<Form onSubmit={mockOnSubmit} isLoading={mockIsLoading} />);
    
    const minPriceInput = screen.getByPlaceholderText('Mín');
    const maxPriceInput = screen.getByPlaceholderText('Máx');
    
    fireEvent.change(minPriceInput, { target: { value: '200' } });
    fireEvent.change(maxPriceInput, { target: { value: '100' } });
    
    const submitButton = screen.getByText('Gerar Recomendações');
    fireEvent.click(submitButton);
    
    expect(alertSpy).toHaveBeenCalledWith('O preço mínimo não pode ser maior que o máximo');
    expect(mockOnSubmit).not.toHaveBeenCalled();
    
    alertSpy.mockRestore();
  });

  it('deve submeter formulário com dados válidos', async () => {
    render(<Form onSubmit={mockOnSubmit} isLoading={mockIsLoading} />);
    
    // Preenche o formulário
    fireEvent.change(screen.getByDisplayValue('Todas as categorias'), { target: { value: 'marketing' } });
    fireEvent.change(screen.getByDisplayValue('Qualquer nível'), { target: { value: 'iniciante' } });
    fireEvent.change(screen.getByPlaceholderText('Ex: 200'), { target: { value: '200' } });
    fireEvent.click(screen.getByText('marketing'));
    
    const submitButton = screen.getByText('Gerar Recomendações');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        category: 'marketing',
        experienceLevel: 'iniciante',
        budget: '200',
        tags: ['marketing'],
        mode: 'single'
      });
    });
  });

  it('deve limpar formulário ao clicar em Limpar', () => {
    render(<Form onSubmit={mockOnSubmit} isLoading={mockIsLoading} />);
    
    // Preenche o formulário
    fireEvent.change(screen.getByDisplayValue('Todas as categorias'), { target: { value: 'marketing' } });
    fireEvent.change(screen.getByPlaceholderText('Ex: 200'), { target: { value: '200' } });
    fireEvent.click(screen.getByText('marketing'));
    
    // Clica em Limpar
    const clearButton = screen.getByText('Limpar');
    fireEvent.click(clearButton);
    
    // Verifica se os campos foram limpos
    expect(screen.getByDisplayValue('Todas as categorias')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Ex: 200').value).toBe('');
    expect(screen.getByText('marketing')).toHaveClass('bg-gray-200', 'text-gray-700');
  });

  it('deve mostrar estado de carregamento', () => {
    render(<Form onSubmit={mockOnSubmit} isLoading={true} />);
    
    const submitButton = screen.getByText('Processando...');
    expect(submitButton).toBeDisabled();
  });

  it('deve remover propriedades vazias ao submeter', async () => {
    render(<Form onSubmit={mockOnSubmit} isLoading={mockIsLoading} />);
    
    // Submete formulário vazio
    const submitButton = screen.getByText('Gerar Recomendações');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        mode: 'single'
      });
    });
  });
});

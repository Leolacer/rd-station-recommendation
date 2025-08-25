module.exports = {
  // Ambiente de teste
  testEnvironment: 'jsdom',
  
  // Diretórios de teste
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx}',
    '<rootDir>/src/**/*.{test,spec}.{js,jsx}'
  ],
  
  // Diretórios a serem ignorados
  testPathIgnorePatterns: [
    '/node_modules/',
    '/build/',
    '/dist/'
  ],
  
  // Setup files
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  
  // Transformações
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest'
  },
  
  // Extensões de arquivo
  moduleFileExtensions: ['js', 'jsx', 'json'],
  
  // Módulos para mock
  moduleNameMapping: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(gif|ttf|eot|svg)$': '<rootDir>/src/__mocks__/fileMock.js'
  },
  
  // Configurações de cobertura
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/index.js',
    '!src/setupTests.js',
    '!src/**/*.test.{js,jsx}',
    '!src/**/__tests__/**'
  ],
  
  // Diretório de cobertura
  coverageDirectory: 'coverage',
  
  // Tipos de cobertura
  coverageReporters: ['text', 'lcov', 'html'],
  
  // Thresholds de cobertura
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  
  // Timeout dos testes
  testTimeout: 10000,
  
  // Verbose
  verbose: true,
  
  // Clear mocks entre testes
  clearMocks: true,
  
  // Restore mocks entre testes
  restoreMocks: true
};

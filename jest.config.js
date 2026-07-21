const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Путь к Next.js приложению для загрузки next.config.js и .env файлов
  dir: './',
})

// Добавляем кастомную конфигурацию Jest
const customJestConfig = {
  // Тестовая среда
  testEnvironment: 'jest-environment-jsdom',
  
  // Папки для поиска тестов
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)',
  ],
  
  // Папки, которые нужно игнорировать
  testPathIgnorePatterns: [
    '/node_modules/',
    '/.next/',
    '/docs/',
  ],
  
  // Файлы для настройки перед запуском тестов
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  
  // Модули, которые нужно обрабатывать
  moduleNameMapper: {
    // Обработка импортов с алиасами (если используются)
    '^@/(.*)$': '<rootDir>/$1',
    // Обработка CSS модулей и других статических файлов
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/__mocks__/fileMock.js',
  },
  
  // Коллекция покрытия кода
  collectCoverageFrom: [
    'app/**/*.{js,jsx,ts,tsx}',
    'components/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.next/**',
    '!**/coverage/**',
    '!**/*.config.{js,ts}',
  ],
  
  // Пороги покрытия (опционально)
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50,
    },
  },
}

// Экспортируем конфигурацию
module.exports = createJestConfig(customJestConfig)


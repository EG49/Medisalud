/**
 * Configuración de Jest (Tarea 5 — pruebas unitarias con cobertura >= 80%).
 * La app usa Vite + ESM; babel-jest transpila JSX/ESM para Node.
 */
module.exports = {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  setupFilesAfterEnv: ['<rootDir>/src/test/setupTests.js'],
  moduleNameMapper: {
    // CSS Modules → objeto proxy (styles.title === 'title')
    '\\.(css|less|scss)$': 'identity-obj-proxy',
    // Imágenes y otros assets → stub
    '\\.(png|jpg|jpeg|svg|gif|webp)$': '<rootDir>/src/test/fileMock.cjs',
    // Módulos que usan import.meta (sintaxis de Vite que Jest no entiende):
    // se sustituyen por mocks equivalentes solo durante las pruebas.
    '^\\.\\/apiConfig$': '<rootDir>/src/test/apiConfigMock.cjs',
    '^(.*)/lib/publicUrl$': '<rootDir>/src/test/publicUrlMock.cjs',
  },
  collectCoverageFrom: [
    'src/features/**/*.js',
    'src/api/**/*.js',
    'src/components/atoms/**/*.jsx',
    'src/components/molecules/**/*.jsx',
    '!src/api/apiConfig.js',
    '!src/features/paciente/mock*.js',
  ],
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80,
    },
  },
};

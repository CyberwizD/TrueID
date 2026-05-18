// Reexport the native module. On web, it will be resolved to TrueIdTelecomModule.web.ts
// and on native platforms to TrueIdTelecomModule.ts
export { default } from './src/TrueIdTelecomModule';
export { default as TrueIdTelecomView } from './src/TrueIdTelecomView';
export * from  './src/TrueIdTelecom.types';

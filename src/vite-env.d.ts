/// <reference types="vite/client" />

// Add Node.js environment types
interface ImportMetaEnv {
  readonly MODE: string;
  readonly DEV: boolean;
  readonly PROD: boolean;
  readonly SSR: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Add process.env for Node.js compatibility (if needed)
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
  }
}

declare let process: {
  env: NodeJS.ProcessEnv;
};

// CSS module declarations
declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

declare module '*.css' {
  const content: void;
  export default content;
}
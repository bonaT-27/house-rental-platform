/// <reference types="vite/client" />

// Add type declaration for CSS imports
declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

// Add type declaration for CSS side-effect imports
declare module '*.css' {
  const content: void;
  export default content;
}
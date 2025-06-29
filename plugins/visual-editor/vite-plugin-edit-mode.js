import { readFileSync } from 'fs';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { EDIT_MODE_STYLES } from './visual-editor-config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = resolve(__filename, '..');

export default function inlineEditDevPlugin() {
  return {
    name: 'vite:inline-edit-dev',
    apply: 'serve',
    transformIndexHtml() {
      return [
        {
          tag: 'script',
          attrs: { 
            type: 'module',
            src: '/plugins/visual-editor/edit-mode-script.js'
          },
          injectTo: 'body'
        },
        {
          tag: 'style',
          children: EDIT_MODE_STYLES,
          injectTo: 'head'
        }
      ];
    }
  };
}
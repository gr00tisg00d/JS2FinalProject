import { createThemeOptions } from '@/models/catalogModels.js'

export const themeOptions = createThemeOptions([
  {
    name: 'Signal Ember',
    accent: '#eb5e28',
    background: 'linear-gradient(135deg, #252422 0%, #403d39 100%)',
    editor: '#1f1d1a',
    idePalette: {
      syntaxKeyword: '#ff9a76',
      syntaxFunction: '#ffd36b',
      syntaxVariable: '#ffb38a',
      syntaxProperty: '#ffe7b8',
      syntaxString: '#ffd29d',
      syntaxNumber: '#ff8f8f',
      syntaxComment: '#8d7065',
    },
    description: 'Warm contrast for debugging sessions and readable terminal output.',
  },
  {
    name: 'Circuit Tide',
    accent: '#2ec4b6',
    background: 'linear-gradient(135deg, #122c34 0%, #224870 100%)',
    editor: '#0f1f24',
    idePalette: {
      syntaxKeyword: '#7de2d1',
      syntaxFunction: '#ffd166',
      syntaxVariable: '#8ee6ff',
      syntaxProperty: '#c9f27b',
      syntaxString: '#ffcf7d',
      syntaxNumber: '#ff9f9f',
      syntaxComment: '#6c8d93',
    },
    description: 'Cool, technical blues for systems work and calmer focus blocks.',
  },
  {
    name: 'Night Bloom',
    accent: '#f4a261',
    background: 'linear-gradient(135deg, #2b1d26 0%, #4a2f48 100%)',
    editor: '#1d1420',
    idePalette: {
      syntaxKeyword: '#ffb38f',
      syntaxFunction: '#f7c96f',
      syntaxVariable: '#f5b7d4',
      syntaxProperty: '#ffdca8',
      syntaxString: '#ffcf9e',
      syntaxNumber: '#ff9da8',
      syntaxComment: '#8f7187',
    },
    description: 'A softer late-night palette that keeps the workspace atmospheric.',
  },
])

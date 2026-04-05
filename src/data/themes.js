import { createThemeOptions } from '@/models/storeModels.js'

export const themeOptions = createThemeOptions([
    {
        name: 'Signal Ember',
        accent: '#eb5e28',
        background: 'linear-gradient(135deg, #252422 0%, #403d39 100%)',
        editor: '#1f1d1a',
        description: 'Warm contrast for debugging sessions and readable terminal output.',
    },
    {
        name: 'Circuit Tide',
        accent: '#2ec4b6',
        background: 'linear-gradient(135deg, #122c34 0%, #224870 100%)',
        editor: '#0f1f24',
        description: 'Cool, technical blues for systems work and calmer focus blocks.',
    },
    {
        name: 'Night Bloom',
        accent: '#f4a261',
        background: 'linear-gradient(135deg, #2b1d26 0%, #4a2f48 100%)',
        editor: '#1d1420',
        description: 'A softer late-night palette that keeps the workspace atmospheric.',
    },
])
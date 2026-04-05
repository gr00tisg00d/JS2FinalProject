import { createBannerOptions } from '@/models/storeModels.js'

export const bannerOptions = createBannerOptions([
    {
        name: 'Trace Route',
        background: 'linear-gradient(135deg, #122c34 0%, #2ec4b6 100%)',
        tagline: 'Clean signal lines for technical profiles.',
    },
    {
        name: 'Error Bloom',
        background: 'linear-gradient(135deg, #4a2f48 0%, #f4a261 100%)',
        tagline: 'Warm contrast for creative debugging energy.',
    },
    {
        name: 'Dark Launch',
        background: 'linear-gradient(135deg, #252422 0%, #eb5e28 100%)',
        tagline: 'A louder, bolder banner for release-day momentum.',
    },
])
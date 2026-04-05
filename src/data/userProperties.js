import { reactive } from 'vue'
import { UserProfileModel } from '@/models/storeModels.js'

export const userProfile = reactive(
	new UserProfileModel({
		balance: 100,
		level: 1,
		experience: 42,
		inventory: [],
		activeIcon: '',
		activeBanner: '',
		activeIDETheme: '',
		displayName: 'Cameron Trace',
		handle: '@kernel.trace',
		rankLabel: '#19 Global',
		roleLabel: 'Signal Chaser',
		joinedLabel: 'Joined Spring 2026',
		gamesPlayed: 148,
		successRate: 93,
		bugfixStreak: 17,
		flawlessRuns: 11,
	}),
)

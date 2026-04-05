import { reactive } from 'vue'
import { UserProfileModel } from '@/models/storeModels.js'

export const userProfile = reactive(
	new UserProfileModel({
		balance: 100,
		level: 1,
		inventory: [],
		activeIcon: '',
		activeBanner: '',
		activeIDETheme: '',
	}),
)

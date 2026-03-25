import { reactive } from 'vue'

export const userProfile = reactive({
	balance: 100,
	level: 1,
	inventory: [],
	activeIcon: '',
	activeBanner: '',
	activeIDETheme: '',
})

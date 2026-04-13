import { reactive } from 'vue'
import { defaultUserProfile } from '@/data/defaultUserProfile.js'
import { UserProfileModel } from '@/models/userProfileModel.js'

export const userProfile = reactive(new UserProfileModel(defaultUserProfile))

export const USER_ROLES = ['user', 'artist', 'admin'] as const;

export type UserRole = (typeof USER_ROLES)[number];

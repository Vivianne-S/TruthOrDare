// ===============================
// SHADOWS (iOS & Android compatible)
// ===============================
export const SHADOWS = {
    x0: {
      // iOS only
      shadowColor: '#FF67E7',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
      // Android only
      elevation: 0,
    },
    x1: {
      shadowColor: '#FF67E7',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.22,
      shadowRadius: 4,
      elevation: 1,
    },
    x2: {
      shadowColor: '#D17BFF',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.26,
      shadowRadius: 6,
      elevation: 2,
    },
    x4: {
      shadowColor: '#B275FF',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.3,
      shadowRadius: 9,
      elevation: 4,
    },
    x8: {
      shadowColor: '#FF67E7',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.38,
      shadowRadius: 14,
      elevation: 8,
    },
    x16: {
      shadowColor: '#FF67E7',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.5,
      shadowRadius: 20,
      elevation: 16,
    },
    x24: {
      shadowColor: '#FF67E7',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.62,
      shadowRadius: 26,
      elevation: 24,
    },
  } as const;
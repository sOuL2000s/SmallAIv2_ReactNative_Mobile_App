// src/theme/themes.js

export const lightPalette = {
  primary: '#f3f4f6',
  secondary: '#ffffff',
  textPrimary: '#1f2937',
  textSecondary: '#4b5563',
  borderColor: '#e5e7eb',
  cardBg: '#ffffff',
  headerBg: '#f9fafb',
  accentPrimary: '#6366f1',
  accentPrimaryHover: '#4f46e5',
  accentSecondary: '#22d3ee',
  accentError: '#ef4444',
  accentSuccess: '#22c55e',
  userBubbleBg: '#e0f2fe',
  userBubbleText: '#1e40af',
  aiBubbleBg: '#f3f4f6',
  aiBubbleText: '#374151',
  sidebarBg: '#ffffff',
  sidebarBorder: '#e5e7eb',
  sidebarItemHover: '#f3f4f6',
  loaderDotColor: '#6366f1',
  mainChatWindowBg: 'rgba(255, 255, 255, 0.8)',
  conversationBg: 'rgba(255, 255, 255, 0.95)',
  conversationText: '#1f2937',
  conversationIndicator: '#6366f1',
  activeSidebarItemText: 'black', // Specific for active item
  activeSidebarItemIcon: 'black', // Specific for active item
};

export const darkPalette = {
  primary: '#0a0a0f',
  secondary: '#13131a',
  textPrimary: '#e5e7eb',
  textSecondary: '#a1a1aa',
  borderColor: '#2d3748',
  cardBg: '#13131a',
  headerBg: '#1f2937',
  accentPrimary: '#818cf8',
  accentPrimaryHover: '#6366f1',
  accentSecondary: '#67e8f9',
  accentError: '#f87171',
  accentSuccess: '#4ade80',
  userBubbleBg: '#1a237e',
  userBubbleText: '#e0e7ff',
  aiBubbleBg: '#2d3748',
  aiBubbleText: '#f9fafb',
  sidebarBg: '#13131a',
  sidebarBorder: '#2d3748',
  sidebarItemHover: '#1f2937',
  loaderDotColor: '#818cf8',
  mainChatWindowBg: 'rgba(19, 19, 26, 0.9)',
  conversationBg: 'rgba(19, 19, 26, 0.95)',
  conversationText: '#e5e7eb',
  conversationIndicator: '#818cf8',
  activeSidebarItemText: 'black', // Specific for active item
  activeSidebarItemIcon: 'black', // Specific for active item
};

// Define themes with their light and dark palettes
export const appThemes = {
  'default': {
    light: lightPalette,
    dark: darkPalette,
  },
  'celestial-horizon': {
    dark: {
      primary: '#0D1117', secondary: '#161B22', textPrimary: '#C9D1D9', textSecondary: '#8B949E', borderColor: '#30363D', cardBg: '#1F2633', headerBg: '#161B22', accentPrimary: '#58A6FF', accentPrimaryHover: '#388BF2', accentSecondary: '#B1B8C1', accentError: '#F87171', accentSuccess: '#4ADE80', userBubbleBg: '#253B64', userBubbleText: '#E0F2FE', aiBubbleBg: '#1F2633', aiBubbleText: '#C9D1D9', sidebarBg: '#161B22', sidebarBorder: '#30363D', sidebarItemHover: '#1F2633', loaderDotColor: '#58A6FF', mainChatWindowBg: 'rgba(22, 27, 34, 0.9)', conversationBg: 'rgba(22, 27, 34, 0.95)', conversationText: '#C9D1D9', conversationIndicator: '#58A6FF', activeSidebarItemText: 'white', activeSidebarItemIcon: 'white',
    },
    light: {
      primary: '#F0F4F8', secondary: '#FFFFFF', textPrimary: '#2D3748', textSecondary: '#718096', borderColor: '#E2E8F0', cardBg: '#FFFFFF', headerBg: '#EDF2F7', accentPrimary: '#3B82F6', accentPrimaryHover: '#2563EB', accentSecondary: '#60A5FA', accentError: '#EF4444', accentSuccess: '#22C55E', userBubbleBg: '#DBEAFE', userBubbleText: '#1E40AF', aiBubbleBg: '#EBF4FF', aiBubbleText: '#2D3748', sidebarBg: '#FFFFFF', sidebarBorder: '#E2E8F0', sidebarItemHover: '#F0F4F8', loaderDotColor: '#3B82F6', mainChatWindowBg: 'rgba(255, 255, 255, 0.8)', conversationBg: 'rgba(255, 255, 255, 0.95)', conversationText: '#2D3748', conversationIndicator: '#3B82F6', activeSidebarItemText: 'white', activeSidebarItemIcon: 'white',
    }
  },
  'verdant-calm': { // Renamed from Forest Whisper
    dark: {
      primary: '#1a2a22', secondary: '#21362d', textPrimary: '#e0f2e8', textSecondary: '#99bbaa', borderColor: '#3f544c', cardBg: '#294237', headerBg: '#2c493c', accentPrimary: '#3cb878', accentPrimaryHover: '#2fa163', accentSecondary: '#60c58e', accentError: '#f87171', accentSuccess: '#4ade80', userBubbleBg: '#1e8449', userBubbleText: '#e0f2e8', aiBubbleBg: '#34495e', aiBubbleText: '#e0f2e8', sidebarBg: '#21362d', sidebarBorder: '#3f544c', sidebarItemHover: '#2c493c', loaderDotColor: '#3cb878', mainChatWindowBg: 'rgba(33, 54, 45, 0.9)', conversationBg: 'rgba(33, 54, 45, 0.95)', conversationText: '#e0f2e8', conversationIndicator: '#3cb878', activeSidebarItemText: 'white', activeSidebarItemIcon: 'white',
    },
    light: {
      primary: '#edf9f5', secondary: '#ffffff', textPrimary: '#2d3f35', textSecondary: '#5e7d6b', borderColor: '#dbeae5', cardBg: '#ffffff', headerBg: '#f5fcf9', accentPrimary: '#3cb878', accentPrimaryHover: '#2fa163', accentSecondary: '#60c58e', accentError: '#ef4444', accentSuccess: '#22c55e', userBubbleBg: '#c8e6c9', userBubbleText: '#1b5e20', aiBubbleBg: '#e8f5e9', aiBubbleText: '#388e3c', sidebarBg: '#ffffff', sidebarBorder: '#dbeae5', sidebarItemHover: '#edf9f5', loaderDotColor: '#3cb878', mainChatWindowBg: 'rgba(255, 255, 255, 0.8)', conversationBg: 'rgba(255, 255, 255, 0.95)', conversationText: '#2d3f35', conversationIndicator: '#3cb878', activeSidebarItemText: 'white', activeSidebarItemIcon: 'white',
    }
  },
  'cybernetic-pulse': {
    dark: {
      primary: '#0a0e1a', secondary: '#161c28', textPrimary: '#e2e8f0', textSecondary: '#94a3b8', borderColor: '#2f3e52', cardBg: '#1f2a3a', headerBg: '#1f2a3a', accentPrimary: '#0ea5e9', accentPrimaryHover: '#0284c7', accentSecondary: '#38bdf8', accentError: '#f87171', accentSuccess: '#4ade80', userBubbleBg: '#0c4a6e', userBubbleText: '#e0f2fe', aiBubbleBg: '#2d3748', aiBubbleText: '#f0f8ff', sidebarBg: '#161c28', sidebarBorder: '#2f3e52', sidebarItemHover: '#1f2a3a', loaderDotColor: '#0ea5e9', mainChatWindowBg: 'rgba(22, 28, 40, 0.9)', conversationBg: 'rgba(22, 28, 40, 0.95)', conversationText: '#e2e8f0', conversationIndicator: '#0ea5e9', activeSidebarItemText: 'white', activeSidebarItemIcon: 'white',
    },
    light: {
      primary: '#f8fafc', secondary: '#ffffff', textPrimary: '#1e293b', textSecondary: '#475569', borderColor: '#e0e7f2', cardBg: '#ffffff', headerBg: '#f1f5f9', accentPrimary: '#0ea5e9', accentPrimaryHover: '#0284c7', accentSecondary: '#38bdf8', accentError: '#ef4444', accentSuccess: '#22c55e', userBubbleBg: '#bfdbfe', userBubbleText: '#1e3a8a', aiBubbleBg: '#e0f2fe', aiBubbleText: '#0284c7', sidebarBg: '#ffffff', sidebarBorder: '#e0e7f2', sidebarItemHover: '#f1f5f9', loaderDotColor: '#0ea5e9', mainChatWindowBg: 'rgba(255, 255, 255, 0.8)', conversationBg: 'rgba(255, 255, 255, 0.95)', conversationText: '#1e293b', conversationIndicator: '#0ea5e9', activeSidebarItemText: 'white', activeSidebarItemIcon: 'white',
    }
  },
  'urban-pulse': {
    dark: {
      primary: '#1A1A1D', secondary: '#242426', textPrimary: '#F0F0F0', textSecondary: '#A0A0A0', borderColor: '#38383B', cardBg: '#242426', headerBg: '#1A1A1D', accentPrimary: '#00BFFF', accentPrimaryHover: '#009ACD', accentSecondary: '#66CCFF', accentError: '#F87171', accentSuccess: '#4ADE80', userBubbleBg: '#0F4C81', userBubbleText: '#E0FFFF', aiBubbleBg: '#36454F', aiBubbleText: '#F0F0F0', sidebarBg: '#1A1A1D', sidebarBorder: '#38383B', sidebarItemHover: '#242426', loaderDotColor: '#00BFFF', mainChatWindowBg: 'rgba(36, 36, 38, 0.9)', conversationBg: 'rgba(36, 36, 38, 0.95)', conversationText: '#F0F0F0', conversationIndicator: '#00BFFF', activeSidebarItemText: 'white', activeSidebarItemIcon: 'white',
    },
    light: {
      primary: '#F2F4F8', secondary: '#FFFFFF', textPrimary: '#333333', textSecondary: '#777777', borderColor: '#DDE2E8', cardBg: '#FFFFFF', headerBg: '#E8ECF2', accentPrimary: '#1E90FF', accentPrimaryHover: '#107EEB', accentSecondary: '#63B2FF', accentError: '#EF4444', accentSuccess: '#22C55E', userBubbleBg: '#CCE5FF', userBubbleText: '#003F8C', aiBubbleBg: '#E8F0F5', aiBubbleText: '#333333', sidebarBg: '#FFFFFF', sidebarBorder: '#DDE2E8', sidebarItemHover: '#E8F0F5', loaderDotColor: '#1E90FF', mainChatWindowBg: 'rgba(255, 255, 255, 0.8)', conversationBg: 'rgba(255, 255, 255, 0.95)', conversationText: '#333333', conversationIndicator: '#1E90FF', activeSidebarItemText: 'white', activeSidebarItemIcon: 'white',
    }
  },
  'rustic-ember': {
    dark: {
      primary: '#3E2723', secondary: '#4E342E', textPrimary: '#FBE9E7', textSecondary: '#BCAAA4', borderColor: '#5D4037', cardBg: '#4E342E', headerBg: '#3E2723', accentPrimary: '#D84315', accentPrimaryHover: '#BF360C', accentSecondary: '#FF8A65', accentError: '#F87171', accentSuccess: '#4ADE80', userBubbleBg: '#8D6E63', userBubbleText: '#FBE9E7', aiBubbleBg: '#5D4037', aiBubbleText: '#FBE9E7', sidebarBg: '#3E2723', sidebarBorder: '#5D4037', sidebarItemHover: '#4E342E', loaderDotColor: '#D84315', mainChatWindowBg: 'rgba(78, 52, 46, 0.9)', conversationBg: 'rgba(78, 52, 46, 0.95)', conversationText: '#FBE9E7', conversationIndicator: '#D84315', activeSidebarItemText: 'white', activeSidebarItemIcon: 'white',
    },
    light: {
      primary: '#F5E8DC', secondary: '#FFFFFF', textPrimary: '#4E342E', textSecondary: '#8D6E63', borderColor: '#E6DCCD', cardBg: '#FFFFFF', headerBg: '#F8EFE5', accentPrimary: '#E65100', accentPrimaryHover: '#D84315', accentSecondary: '#FFB74D', accentError: '#EF4444', accentSuccess: '#22C55E', userBubbleBg: '#FFCCBC', userBubbleText: '#BF360C', aiBubbleBg: '#FBE9E7', aiBubbleText: '#4E342E', sidebarBg: '#FFFFFF', sidebarBorder: '#E6DCCD', sidebarItemHover: '#F8EFE5', loaderDotColor: '#E65100', mainChatWindowBg: 'rgba(255, 255, 255, 0.8)', conversationBg: 'rgba(255, 255, 255, 0.95)', conversationText: '#4E342E', conversationIndicator: '#E65100', activeSidebarItemText: 'white', activeSidebarItemIcon: 'white',
    }
  },
  'neon-mirage': {
    dark: {
      primary: '#05001C', secondary: '#120033', textPrimary: '#E0FFFF', textSecondary: '#8A2BE2', borderColor: '#2F004F', cardBg: '#1A0040', headerBg: '#120033', accentPrimary: '#FF1493', accentPrimaryHover: '#C7007C', accentSecondary: '#00BFFF', accentError: '#F87171', accentSuccess: '#4ADE80', userBubbleBg: '#4B0082', userBubbleText: '#E0FFFF', aiBubbleBg: '#2E0854', aiBubbleText: '#E0FFFF', sidebarBg: '#120033', sidebarBorder: '#2F004F', sidebarItemHover: '#1A0040', loaderDotColor: '#FF1493', mainChatWindowBg: 'rgba(26, 0, 64, 0.9)', conversationBg: 'rgba(26, 0, 64, 0.95)', conversationText: '#E0FFFF', conversationIndicator: '#FF1493', activeSidebarItemText: 'white', activeSidebarItemIcon: 'white',
    },
    light: {
      primary: '#F8F0FF', secondary: '#FFFFFF', textPrimary: '#330066', textSecondary: '#663399', borderColor: '#EBD9FC', cardBg: '#FFFFFF', headerBg: '#F2E0FF', accentPrimary: '#FF69B4', accentPrimaryHover: '#E0509B', accentSecondary: '#87CEEB', accentError: '#EF4444', accentSuccess: '#22C55E', userBubbleBg: '#FCE4EC', userBubbleText: '#C2185B', aiBubbleBg: '#F3E5F5', aiBubbleText: '#330066', sidebarBg: '#FFFFFF', sidebarBorder: '#EBD9FC', sidebarItemHover: '#F2E0FF', loaderDotColor: '#FF69B4', mainChatWindowBg: 'rgba(255, 255, 255, 0.8)', conversationBg: 'rgba(255, 255, 255, 0.95)', conversationText: '#330066', conversationIndicator: '#FF69B4', activeSidebarItemText: 'white', activeSidebarItemIcon: 'white',
    }
  },
  'ivory-bloom': {
    dark: {
      primary: '#2B2D42', secondary: '#4A4E69', textPrimary: '#DCDCDC', textSecondary: '#A0A4B8', borderColor: '#5D607E', cardBg: '#4A4E69', headerBg: '#373A50', accentPrimary: '#9B59B6', accentPrimaryHover: '#8E44AD', accentSecondary: '#66CCFF', accentError: '#F87171', accentSuccess: '#4ADE80', userBubbleBg: '#7C4F9B', userBubbleText: '#FFFFFF', aiBubbleBg: '#5D607E', aiBubbleText: '#DCDCDC', sidebarBg: '#2B2D42', sidebarBorder: '#5D607E', sidebarItemHover: '#373A50', loaderDotColor: '#9B59B6', mainChatWindowBg: 'rgba(74, 78, 105, 0.9)', conversationBg: 'rgba(74, 78, 105, 0.95)', conversationText: '#DCDCDC', conversationIndicator: '#9B59B6', activeSidebarItemText: 'white', activeSidebarItemIcon: 'white',
    },
    light: {
      primary: '#FDFDFD', secondary: '#FFFFFF', textPrimary: '#333333', textSecondary: '#777777', borderColor: '#EAEAEA', cardBg: '#FFFFFF', headerBg: '#F5F5F5', accentPrimary: '#8E44AD', accentPrimaryHover: '#7F3C9E', accentSecondary: '#BA68C8', accentError: '#EF4444', accentSuccess: '#22C55E', userBubbleBg: '#F2E6F7', userBubbleText: '#5D2C7B', aiBubbleBg: '#EAE0F0', aiBubbleText: '#333333', sidebarBg: '#FFFFFF', sidebarBorder: '#EAEAEA', sidebarItemHover: '#F5F5F5', loaderDotColor: '#8E44AD', mainChatWindowBg: 'rgba(255, 255, 255, 0.8)', conversationBg: 'rgba(255, 255, 255, 0.95)', conversationText: '#333333', conversationIndicator: '#8E44AD', activeSidebarItemText: 'white', activeSidebarItemIcon: 'white',
    }
  },
  'obsidian-night': {
    dark: {
      primary: '#121212', secondary: '#1E1E1E', textPrimary: '#F0F0F0', textSecondary: '#A0A0A0', borderColor: '#333333', cardBg: '#1E1E1E', headerBg: '#121212', accentPrimary: '#BB86FC', accentPrimaryHover: '#9E65E2', accentSecondary: '#03DAC6', accentError: '#CF6679', accentSuccess: '#03DAC6', userBubbleBg: '#3700B3', userBubbleText: '#FFFFFF', aiBubbleBg: '#2C2C2C', aiBubbleText: '#F0F0F0', sidebarBg: '#121212', sidebarBorder: '#333333', sidebarItemHover: '#1E1E1E', loaderDotColor: '#BB86FC', mainChatWindowBg: 'rgba(30, 30, 30, 0.9)', conversationBg: 'rgba(30, 30, 30, 0.95)', conversationText: '#F0F0F0', conversationIndicator: '#BB86FC', activeSidebarItemText: 'white', activeSidebarItemIcon: 'white',
    },
    light: {
      primary: '#E0E0E0', secondary: '#FFFFFF', textPrimary: '#2C2C2C', textSecondary: '#6B6B6B', borderColor: '#C0C0C0', cardBg: '#FFFFFF', headerBg: '#D0D0D0', accentPrimary: '#6200EE', accentPrimaryHover: '#5B00D9', accentSecondary: '#018786', accentError: '#B00020', accentSuccess: '#018786', userBubbleBg: '#BBDEFB', userBubbleText: '#1A237E', aiBubbleBg: '#E0E0E0', aiBubbleText: '#2C2C2C', sidebarBg: '#FFFFFF', sidebarBorder: '#C0C0C0', sidebarItemHover: '#D0D0D0', loaderDotColor: '#6200EE', mainChatWindowBg: 'rgba(255, 255, 255, 0.8)', conversationBg: 'rgba(255, 255, 255, 0.95)', conversationText: '#2C2C2C', conversationIndicator: '#6200EE', activeSidebarItemText: 'white', activeSidebarItemIcon: 'white',
    }
  },
  'solar-dawn': {
    dark: {
      primary: '#1A0E2A', secondary: '#2C1840', textPrimary: '#FCE8D8', textSecondary: '#D8BFD8', borderColor: '#40265B', cardBg: '#2C1840', headerBg: '#1A0E2A', accentPrimary: '#FF5722', accentPrimaryHover: '#E64A19', accentSecondary: '#FFCC80', accentError: '#F87171', accentSuccess: '#4ADE80', userBubbleBg: '#7C4F9B', userBubbleText: '#FCE8D8', aiBubbleBg: '#40265B', aiBubbleText: '#FCE8D8', sidebarBg: '#1A0E2A', sidebarBorder: '#40265B', sidebarItemHover: '#2C1840', loaderDotColor: '#FF5722', mainChatWindowBg: 'rgba(44, 24, 64, 0.9)', conversationBg: 'rgba(44, 24, 64, 0.95)', conversationText: '#FCE8D8', conversationIndicator: '#FF5722', activeSidebarItemText: 'white', activeSidebarItemIcon: 'white',
    },
    light: {
      primary: '#FFFBEA', secondary: '#FFFFFF', textPrimary: '#3E2723', textSecondary: '#8D6E63', borderColor: '#FFE0B2', cardBg: '#FFFFFF', headerBg: '#FFF3E0', accentPrimary: '#FF8F00', accentPrimaryHover: '#FF6F00', accentSecondary: '#FFD54F', accentError: '#F87171', accentSuccess: '#4ADE80', userBubbleBg: '#FFE0B2', userBubbleText: '#E65100', aiBubbleBg: '#FFF3E0', aiBubbleText: '#3E2723', sidebarBg: '#FFFFFF', sidebarBorder: '#FFE0B2', sidebarItemHover: '#FFF3E0', loaderDotColor: '#FF8F00', mainChatWindowBg: 'rgba(255, 255, 255, 0.8)', conversationBg: 'rgba(255, 255, 255, 0.95)', conversationText: '#3E2723', conversationIndicator: '#FF8F00', activeSidebarItemText: 'white', activeSidebarItemIcon: 'white',
    }
  },
  'aurora-drift': {
    dark: {
      primary: '#0A192F', secondary: '#172A45', textPrimary: '#E6F0FF', textSecondary: '#A0B3D6', borderColor: '#2F476D', cardBg: '#172A45', headerBg: '#0A192F', accentPrimary: '#66CCCC', accentPrimaryHover: '#55B3B3', accentSecondary: '#99CCFF', accentError: '#F87171', accentSuccess: '#4ADE80', userBubbleBg: '#336699', userBubbleText: '#E6F0FF', aiBubbleBg: '#2F476D', aiBubbleText: '#E6F0FF', sidebarBg: '#0A192F', sidebarBorder: '#2F476D', sidebarItemHover: '#172A45', loaderDotColor: '#66CCCC', mainChatWindowBg: 'rgba(23, 42, 69, 0.9)', conversationBg: 'rgba(23, 42, 69, 0.95)', conversationText: '#E6F0FF', conversationIndicator: '#66CCCC', activeSidebarItemText: 'white', activeSidebarItemIcon: 'white',
    },
    light: {
      primary: '#E0F2F7', secondary: '#FFFFFF', textPrimary: '#2B4550', textSecondary: '#5E7A8A', borderColor: '#B2EBF2', cardBg: '#FFFFFF', headerBg: '#CCEEF0', accentPrimary: '#00BCD4', accentPrimaryHover: '#00ACC1', accentSecondary: '#4DD0E1', accentError: '#EF4444', accentSuccess: '#22C55E', userBubbleBg: '#B2EBF2', userBubbleText: '#006064', aiBubbleBg: '#CCEEF0', aiBubbleText: '#2B4550', sidebarBg: '#FFFFFF', sidebarBorder: '#B2EBF2', sidebarItemHover: '#CCEEF0', loaderDotColor: '#00BCD4', mainChatWindowBg: 'rgba(255, 255, 255, 0.8)', conversationBg: 'rgba(255, 255, 255, 0.95)', conversationText: '#2B4550', conversationIndicator: '#00BCD4', activeSidebarItemText: 'white', activeSidebarItemIcon: 'white',
    }
  },
  'timeless-echo': {
    dark: {
      primary: '#2C2C2C', secondary: '#3D3D3D', textPrimary: '#E0E0E0', textSecondary: '#B0B0B0', borderColor: '#555555', cardBg: '#3D3D3D', headerBg: '#2C2C2C', accentPrimary: '#A57C52', accentPrimaryHover: '#8B653D', accentSecondary: '#C8A87C', accentError: '#F87171', accentSuccess: '#4ADE80', userBubbleBg: '#785A3D', userBubbleText: '#E0E0E0', aiBubbleBg: '#555555', aiBubbleText: '#E0E0E0', sidebarBg: '#2C2C2C', sidebarBorder: '#555555', sidebarItemHover: '#3D3D3D', loaderDotColor: '#A57C52', mainChatWindowBg: 'rgba(61, 61, 61, 0.9)', conversationBg: 'rgba(61, 61, 61, 0.95)', conversationText: '#E0E0E0', conversationIndicator: '#A57C52', activeSidebarItemText: 'white', activeSidebarItemIcon: 'white',
    },
    light: {
      primary: '#FDF7E5', secondary: '#FFFFFF', textPrimary: '#4A4A4A', textSecondary: '#808080', borderColor: '#E6E0D3', cardBg: '#FFFFFF', headerBg: '#F5EFEB', accentPrimary: '#8D6E63', accentPrimaryHover: '#795548', accentSecondary: '#BCAAA4', accentError: '#EF4444', accentSuccess: '#22C55E', userBubbleBg: '#D7CCC8', userBubbleText: '#5D4037', aiBubbleBg: '#EFEBE9', aiBubbleText: '#4A4A4A', sidebarBg: '#FFFFFF', sidebarBorder: '#E6E0D3', sidebarItemHover: '#F5EFEB', loaderDotColor: '#8D6E63', mainChatWindowBg: 'rgba(255, 255, 255, 0.8)', conversationBg: 'rgba(255, 255, 255, 0.95)', conversationText: '#4A4A4A', conversationIndicator: '#8D6E63', activeSidebarItemText: 'white', activeSidebarItemIcon: 'white',
    }
  },
  'mystic-void': {
    dark: {
      primary: '#110B1D', secondary: '#1F1731', textPrimary: '#ECE4F7', textSecondary: '#B29BCE', borderColor: '#372A4F', cardBg: '#1F1731', headerBg: '#110B1D', accentPrimary: '#9400D3', accentPrimaryHover: '#7B00B0', accentSecondary: '#8A2BE2', accentError: '#F87171', accentSuccess: '#4ADE80', userBubbleBg: '#5B2C7B', userBubbleText: '#ECE4F7', aiBubbleBg: '#372A4F', aiBubbleText: '#ECE4F7', sidebarBg: '#110B1D', sidebarBorder: '#372A4F', sidebarItemHover: '#1F1731', loaderDotColor: '#9400D3', mainChatWindowBg: 'rgba(31, 23, 49, 0.9)', conversationBg: 'rgba(31, 23, 49, 0.95)', conversationText: '#ECE4F7', conversationIndicator: '#9400D3', activeSidebarItemText: 'white', activeSidebarItemIcon: 'white',
    },
    light: {
      primary: '#F7EDFF', secondary: '#FFFFFF', textPrimary: '#330066', textSecondary: '#663399', borderColor: '#EBD9FC', cardBg: '#FFFFFF', headerBg: '#F2E0FF', accentPrimary: '#8A2BE2', accentPrimaryHover: '#7B1FB2', accentSecondary: '#9370DB', accentError: '#EF4444', accentSuccess: '#22C55E', userBubbleBg: '#E6D2F2', userBubbleText: '#4B0082', aiBubbleBg: '#F0E6F8', aiBubbleText: '#330066', sidebarBg: '#FFFFFF', sidebarBorder: '#EBD9FC', sidebarItemHover: '#F2E0FF', loaderDotColor: '#8A2BE2', mainChatWindowBg: 'rgba(255, 255, 255, 0.8)', conversationBg: 'rgba(255, 255, 255, 0.95)', conversationText: '#330066', conversationIndicator: '#8A2BE2', activeSidebarItemText: 'white', activeSidebarItemIcon: 'white',
    }
  },
  'darkest-bw': {
    dark: {
      primary: '#000000', secondary: '#111111', textPrimary: '#FFFFFF', textSecondary: '#AAAAAA', borderColor: '#333333', cardBg: '#111111', headerBg: '#0A0A0A', accentPrimary: '#E0E0E0', accentPrimaryHover: '#FFFFFF', accentSecondary: '#888888', accentError: '#F87171', accentSuccess: '#4ADE80', userBubbleBg: '#222222', userBubbleText: '#FFFFFF', aiBubbleBg: '#333333', aiBubbleText: '#FFFFFF', sidebarBg: '#000000', sidebarBorder: '#333333', sidebarItemHover: '#111111', loaderDotColor: '#E0E0E0', mainChatWindowBg: '#000000', conversationBg: '#000000', conversationText: '#FFFFFF', conversationIndicator: '#FFFFFF', activeSidebarItemText: 'black', activeSidebarItemIcon: 'black',
    },
    light: {
      primary: '#FFFFFF', secondary: '#F0F0F0', textPrimary: '#000000', textSecondary: '#555555', borderColor: '#DDDDDD', cardBg: '#F0F0F0', headerBg: '#F5F5F5', accentPrimary: '#333333', accentPrimaryHover: '#000000', accentSecondary: '#777777', accentError: '#EF4444', accentSuccess: '#22C55E', userBubbleBg: '#EEEEEE', userBubbleText: '#000000', aiBubbleBg: '#DDDDDD', aiBubbleText: '#000000', sidebarBg: '#FFFFFF', sidebarBorder: '#DDDDDD', sidebarItemHover: '#F0F0F0', loaderDotColor: '#333333', mainChatWindowBg: '#F0F0F0', conversationBg: '#FFFFFF', conversationText: '#000000', conversationIndicator: '#000000', activeSidebarItemText: 'white', activeSidebarItemIcon: 'white',
    }
  }
};

export const personalities = [
  { name: "Standard", prompt: "" },
  { name: "Sarcastic", prompt: "Respond as a highly sarcastic and witty AI. Use dry humor and playful cynicism. Keep responses concise and witty." },
  { name: "Friendly", prompt: "Respond as an exceptionally friendly and helpful AI. Use warm and encouraging language, and show genuine interest. Keep your tone light and approachable." },
  { name: "Philosophical", prompt: "Respond as a deep-thinking, philosophical AI. Explore underlying meanings and broader implications, using reflective and insightful language." },
  { name: "Curious", prompt: "Respond as an endlessly curious AI, often asking thoughtful follow-up questions to understand better. Show an eagerness to learn." },
  { name: "Humorous", prompt: "Respond as a lighthearted and funny AI, often making clever jokes or witty observations. Keep the mood cheerful." },
  { name: "Formal", prompt: "Respond in a very formal and precise manner. Avoid slang or casual expressions, maintaining a sophisticated and respectful tone." },
  { name: "Casual", prompt: "Respond in a relaxed, informal, and conversational tone, like talking to a friend. Use common idioms and a laid-back style." },
  { name: "Optimistic", prompt: "Respond with an overwhelmingly positive and hopeful outlook. Emphasize solutions and bright possibilities." },
  { name: "Skeptical", prompt: "Respond with a cautious and questioning attitude, often looking for evidence or flaws in arguments. Be analytical and critical." },
  { name: "Teacher", prompt: "Respond as a patient and knowledgeable teacher, explaining concepts clearly and simply, and guiding the user to understanding." },
  { name: "Poetic", prompt: "Respond using evocative language, metaphors, and a touch of poetic flair. Let your words flow with rhythm and imagery." },
  { name: "Concise", prompt: "Respond with extreme brevity and to the point, minimizing unnecessary words. Deliver information efficiently." },
  { name: "Verbose", prompt: "Respond with detailed and elaborate explanations, exploring every facet of the topic. Provide rich descriptions and context." },
  { name: "Narrator", prompt: "Respond as if you are narrating a story or documentary, setting a scene or describing events with a captivating voice." },
  { name: "Enthusiastic", prompt: "Respond with high energy and excitement, showing great interest in the conversation. Use exclamation marks and vivid language." },
  { name: "Mysterious", prompt: "Respond with an air of mystery, hinting at deeper knowledge without revealing everything. Be intriguing and slightly enigmatic." },
  { name: "Empathetic", prompt: "Respond with strong understanding and sharing of feelings, focusing on emotional support and validation. Show genuine care." },
  { name: "Analyst", prompt: "Respond like a data analyst, breaking down information, identifying patterns, and drawing logical conclusions based on facts." },
  { name: "Mentor", prompt: "Respond as a seasoned mentor, offering guidance, advice, and a wise perspective to help the user grow." },
  { name: "Dreamer", prompt: "Respond with imaginative and abstract ideas, often exploring fantastical possibilities and creative concepts. Think outside the box." },
  { name: "Strategist", prompt: "Respond by focusing on goals, plans, and optimal ways to achieve objectives. Offer clear, actionable strategies." },
  { name: "Minimalist", prompt: "Respond with the absolute bare minimum of words, almost like a haiku or a very short, impactful statement. Less is more." },
  { name: "Futurist", prompt: "Respond with a focus on future trends, predictions, and the long-term impact of technology and societal changes." },
  { name: "Zen Master", prompt: "Respond calmly, contemplatively, and with a focus on inner peace, mindfulness, and the present moment. Offer tranquil wisdom." }
];

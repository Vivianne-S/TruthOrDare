// ===============================
// COLORS
// ===============================

export const COLORS = {
    // ============ BRAND ============
    primary: '#9D4EDD',
    secondary: '#FF2E9F',
    accent: '#008670', // General UI accent
  
    // ============ BASE COLORS ============
    // Backgrounds
    backgroundPrimary: '#FFFFFF', // Functional, settings, modals, etc.
    backgroundSecondary: '#F5F5F5', // Softer, emotional, dashboard, profile, etc.
    backgroundTertiary: '#FCFCFC', // Cards, modals, input fields, etc.
  
    // Text
    textPrimary: '#212121', // Body text
    textSecondary: '#0E0B33', // Labels, captions, metadata
    textTertiary: '#F5F5F5', // Less important text
    textDisabled: '#1D2935', // Disabled states - use with 60-80% opacity
    textInverse: '#FFFFFF', // Text on dark backgrounds
  
    // Borders
    borderDefault: '#7b605366', // Default input borders (~3-4:1 contrast)
    borderSubtle: '#7b605326', // Dividers/separators
    borderFocus: '#554C48', // Active/focused input border
  
    // ============ INTERACTIVE ELEMENTS ============
    // Links & Progress
    link: '#13797D', // Text links, standard color
    linkPressed: '#006854', // Pressed/active state for links
    progress: '#008670', // Progress bars, completion indicators
  
    // Toggle/Switch
    toggleOn: '#008670', // Enabled switch
    toggleOff: 'rgba(123, 96, 83, 0.3)', // Disabled switch
  
    // Badges & Counters
    badgeBackground: '#FF8848', // Notification badges - use sparingly!
    badgeText: '#2C2624', // Text on badge (DARK text, not white!)
  
    // ============ STATE COLORS ============
    // Success
    success: '#29812C', // Main - buttons (white text), icons, borders
    successSurface: '#A9CDAB', // Surface - subtle alerts, badges, background
    successBorder: '#29812C', // Border - same as main
    successText: '#144016', // Text on surface (6.9:1 contrast)
  
    // Error
    error: '#D33434', // Main - buttons (white text), icons, borders
    errorSurface: '#F0ADAD', // Surface - subtle alerts, badges, background
    errorBorder: '#D33434', // Border - same as main
    errorText: '#6A1A1A', // Text on surface (7.3:1 contrast)
  
    // Warning
    warning: '#FF8848', // Main - buttons (DARK text!), icons, borders
    warningSurface: '#F6CEA1', // Surface - subtle alerts, badges, background
    warningBorder: '#FF8848', // Border - same as main
    warningText: '#804424', // Text on surface (5.3:1 contrast)
  
    // Info
    info: '#416ECF', // Main - buttons (white text), icons, borders
    infoSurface: '#B5C8E9', // Surface - subtle alerts, badges, background
    infoBorder: '#416ECF', // Border - same as main
    infoText: '#203768', // Text on surface (8.0:1 contrast)
  
    //MARK: pressed states 1,3 mörkare
    // ============ PRESSED STATES ============
    primaryPressed: '#0F5D60',
    secondaryPressed: '#121A22',
    accentPressed: '#006756',
    backgroundPrimaryPressed: '#DBDBDB',
    BackgroundSecondaryPressed: '#DACCC8',
    overlayPressed: 'rgba(255,255,255,0.5)',
  
    // ============ OVERLAY (on images/media) ============
    overlayBackground: '#FFFFFF', // Solid white background
    overlayText: '#2C2624', // Body text color on overlay (15:1 contrast)
    OverlayBorder: '#FFFFFF', // Overlay default input borders
    OverlayBorderSubtle: 'rgba(255, 255, 255, 0.25)', // Dividers/separators
    OverlayBorderFocus: '#008670', // Active/focused input border
  
    // ============ DASHBOARD CARDS ============
    // Daily Mood Card
    moodHeader: '#F6CEA1', // Warning surface
    moodIcon: '#804424', // Icon background color, use with white text
    moodText: '#804424', // Warning text
  
    // Savings Card
    savingsHeader: '#B5C8E9', // Info surface
    savingsIcon: '#203768', // Icon background color, use with white text
    savingsText: '#203768', // Info text
  
    // Milestones Card
    milestonesHeader: '#FAD9E5', // Light pink surface
    milestonesIcon: '#E58AA9', // Icon background color, use with white text
    milestonesText: '#B24F74', // Text on surface
  
    // Daily Promise Card
    promiseHeader: '#E6E0FF', // Light purple surface
    promiseIcon: '#8466F6', // Icon background color, use with white text
  
    // Card Main Area (all three cards)
    cardMainBackground: '#554C48', // Primary background for main content area
    cardMainText: '#FFFFFF', // White text on primary background
  
    // ============ DAILY LOG ============
    dailyHistoryTipBackground: '#FFF3F3',
    dailyHistoryEmojiOutline: '#F5F5F5',
    dailyHistoryIconDisabled: '#B2B2B2',
    dailyLogTextInputBackground: '#FFFFFF',
    dailyLogTextInputBorder: '#EEEEEE',
  } as const;
  
  // ============ USAGE NOTES ============
  // For complete documentation se project docs folder.
  //
  // CRITICAL RULES:
  // - NEVER use white text on #FF8848 (warning) - always use dark text (#2C2624 or #804424)
  // - #008670 (accent) is for general UI accent needs (links, progress, positive tertiary buttons)
  // - Use Surface (states) variants for subtle/informative alerts
  // - Use Main (states) variants for critical/important alerts
  //
  // OPACITY GUIDELINES:
  // - textDisabled: use with 60-80% opacity
  // - borderDefault: use with 40% opacity
  // - borderSubtle: use with 10-20% opacity
  // - toggleOff: use with 30% opacity
  // - navInactive: use with 60% opacity
  //
  // BUTTON HIERARCHY:
  // - Primary: #554C48 background, #FFFFFF text
  // - Secondary: #7B6053 background, #FFFFFF text
  // - Accent: #008670 background, #FFFFFF text
  // - Ghost: Transparent background, #554C48 text, #554C48 border
  // - Text link: Transparent background, #008670 text
  // - Overlay (on images): #FFFFFF background, #2C2624 text + shadow
  //
  // BACKGROUNDS:
  // - backgroundPrimary (#FCFCFC): Functional screens (Settings, Forms, Login)
  // - backgroundSecondary (#EDE6E4): Emotional screens (Dashboard, Community, profile)
  // - backgroundTertiary (#FFFFFF): Cards, modals, input fields
  //
  // CONTRAST REQUIREMENTS (WCAG 2.1):
  // - Normal text: 4.5:1 (AA), 7:1 (AAA)
  // - Large text (18px+): 3:1 (AA), 4.5:1 (AAA)
  // - UI components: 3:1 (AA)
  // - All combinations in this system meet at least AA
  
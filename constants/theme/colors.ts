// ===============================
// COLORS
// ===============================

export const COLORS = {
    // ============ BRAND ============
    primary: '#A56BFF',
    secondary: '#FF4FD8',
    accent: '#FF8A4D',
  
    // ============ BASE COLORS ============
    backgroundPrimary: '#14062B',
    backgroundSecondary: '#1A0A36',
    backgroundTertiary: '#230E46',
  
    // Text
    textPrimary: '#F8EDFF',
    textSecondary: '#DDC8F8',
    textTertiary: '#BFA9E4',
    textDisabled: '#8F74B3',
    textInverse: '#FFFFFF',
  
    // Borders
    borderDefault: 'rgba(255, 161, 243, 0.45)',
    borderSubtle: 'rgba(184, 130, 255, 0.28)',
    borderFocus: '#FF71E9',
  
    // ============ INTERACTIVE ELEMENTS ============
    link: '#FF8BF0',
    linkPressed: '#FF63DF',
    progress: '#A56BFF',
  
    // Toggle/Switch
    toggleOn: '#FF4FD8',
    toggleOff: 'rgba(173, 134, 255, 0.4)',
  
    // Badges & Counters
    badgeBackground: '#FF8A4D',
    badgeText: '#2A113F',
  
    // ============ STATE COLORS ============
    success: '#79C9FF',
    successSurface: 'rgba(121, 201, 255, 0.2)',
    successBorder: '#79C9FF',
    successText: '#DDF3FF',
  
    error: '#FF6AAE',
    errorSurface: 'rgba(255, 106, 174, 0.2)',
    errorBorder: '#FF6AAE',
    errorText: '#FFD7EA',
  
    warning: '#FFB36B',
    warningSurface: 'rgba(255, 179, 107, 0.2)',
    warningBorder: '#FFB36B',
    warningText: '#FFE7CC',
  
    info: '#79C9FF',
    infoSurface: 'rgba(121, 201, 255, 0.2)',
    infoBorder: '#79C9FF',
    infoText: '#DDF3FF',
  
    // ============ PRESSED STATES ============
    primaryPressed: '#8E52EF',
    secondaryPressed: '#E93AC7',
    accentPressed: '#FF6F2E',
    backgroundPrimaryPressed: '#110524',
    BackgroundSecondaryPressed: '#16082E',
    overlayPressed: 'rgba(255,255,255,0.22)',
  
    // ============ OVERLAY (on images/media) ============
    overlayBackground: 'rgba(32, 12, 66, 0.58)',
    overlayText: '#F8EDFF',
    OverlayBorder: 'rgba(255, 176, 245, 0.62)',
    OverlayBorderSubtle: 'rgba(213, 164, 255, 0.3)',
    OverlayBorderFocus: '#79C9FF',
  

  // ============ USAGE NOTES ============
  // For complete documentation se project docs folder.
  //
  // CRITICAL RULES:
  // - Keep UI inside the neon palette: hot pink, galaxy purple, galaxy blue, galaxy orange
  // - Use Surface variants for subtle overlays and Main variants for stronger emphasis
  // - On dark galaxy backgrounds, prefer bright text colors from this token set
  //
  // OPACITY GUIDELINES:
  // - textDisabled: use with 60-80% opacity
  // - borderDefault: use with 40% opacity
  // - borderSubtle: use with 10-20% opacity
  // - toggleOff: use with 30% opacity
  // - navInactive: use with 60% opacity
  //
  // BUTTON HIERARCHY:
  // - Primary: galaxy purple / pink gradient tones
  // - Secondary: violet/pink glass variants
  // - Accent: neon orange for high-attention CTA details
  // - Ghost: transparent background with neon border/text
  // - Text link: neon pink / blue depending on context
  // - Overlay (on images): translucent purple layers + bright text
  //
  // BACKGROUNDS:
  // - backgroundPrimary: deep galaxy
  // - backgroundSecondary: violet galaxy
  // - backgroundTertiary: brighter card layer
  //
  // CONTRAST REQUIREMENTS (WCAG 2.1):
  // - Normal text: 4.5:1 (AA), 7:1 (AAA)
  // - Large text (18px+): 3:1 (AA), 4.5:1 (AAA)
  // - UI components: 3:1 (AA)
  // - All combinations in this system meet at least AA
}
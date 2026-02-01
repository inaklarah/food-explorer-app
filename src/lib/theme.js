/**
 * Design-System für die Food Explorer App
 * Zentrales Theme für konsistente UI-Gestaltung
 */

export const theme = {
  // Farbsystem
  colors: {
    // Primärfarben
    primary: {
      main: '#FF9B71',      // Warmes Orange - Hauptfarbe
      light: '#FFB997',     // Helleres Orange
      dark: '#FF8555',      // Dunkleres Orange
      soft: '#FFF4E6'       // Sehr helles Orange für Hintergründe
    },
    
    // Sekundärfarben
    secondary: {
      main: '#7D5A3D',      // Warmes Braun - für Überschriften
      light: '#A08875',     // Helleres Braun - für Texte
      lighter: '#C4B5A8',   // Noch heller - für Subtexte
      soft: '#FFF9F0'       // Sehr helles Beige
    },
    
    // Hintergründe
    background: {
      primary: '#FFF9F0',   // Haupt-Hintergrund
      secondary: '#FFF4E6', // Sekundärer Hintergrund
      card: '#FFFFFF',      // Karten-Hintergrund
      overlay: 'rgba(255, 249, 240, 0.95)'
    },
    
    // Akzentfarben
    accent: {
      success: '#8BC34A',   // Grün für Erfolg
      warning: '#FFC107',   // Gelb für Warnung
      error: '#D86941',     // Rot-Orange für Fehler
      info: '#4FC3F7'       // Blau für Info
    },
    
    // UI-Elemente
    border: {
      light: '#FFE8D6',
      medium: '#E7C6B1',
      dark: '#D2A784'
    },
    
    // Schatten
    shadow: {
      light: 'rgba(139, 111, 71, 0.08)',
      medium: 'rgba(139, 111, 71, 0.12)',
      strong: 'rgba(139, 111, 71, 0.15)',
      dark: 'rgba(139, 111, 71, 0.25)'
    }
  },
  
  // Typografie
  typography: {
    // Schriftfamilien
    fontFamily: {
      primary: "'Fredoka', sans-serif",
      heading: "'Fredoka', sans-serif",
      body: "'Fredoka', sans-serif"
    },
    
    // Schriftgrößen (responsive mit clamp)
    fontSize: {
      xs: 'clamp(0.75rem, 2vw, 0.875rem)',
      sm: 'clamp(0.875rem, 2.5vw, 1rem)',
      base: 'clamp(1rem, 3vw, 1.125rem)',
      lg: 'clamp(1.125rem, 3.5vw, 1.375rem)',
      xl: 'clamp(1.375rem, 4.5vw, 1.75rem)',
      '2xl': 'clamp(1.75rem, 6vw, 2.5rem)',
      '3xl': 'clamp(2.25rem, 7vw, 3rem)'
    },
    
    // Schriftstärken
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700
    },
    
    // Zeilenhöhen
    lineHeight: {
      tight: 1.2,
      base: 1.5,
      relaxed: 1.7
    }
  },
  
  // Abstände (responsive mit clamp)
  spacing: {
    xs: 'clamp(0.25rem, 1vw, 0.5rem)',
    sm: 'clamp(0.5rem, 1.5vw, 0.75rem)',
    base: 'clamp(0.75rem, 2vw, 1rem)',
    md: 'clamp(1rem, 2.5vw, 1.25rem)',
    lg: 'clamp(1.25rem, 3vw, 1.75rem)',
    xl: 'clamp(1.5rem, 4vw, 2rem)',
    '2xl': 'clamp(2rem, 5vw, 3rem)',
    '3xl': 'clamp(3rem, 7vw, 4rem)'
  },
  
  // Rundungen
  borderRadius: {
    sm: 'clamp(0.5rem, 1.5vw, 0.75rem)',
    base: 'clamp(0.75rem, 2vw, 1rem)',
    md: 'clamp(1rem, 2.5vw, 1.25rem)',
    lg: 'clamp(1.25rem, 3vw, 1.75rem)',
    xl: 'clamp(1.5rem, 4vw, 2rem)',
    full: '999px',
    circle: '50%'
  },
  
  // Schatten
  shadows: {
    sm: '0 2px 8px rgba(139, 111, 71, 0.08)',
    base: '0 4px 12px rgba(139, 111, 71, 0.12)',
    md: '0 4px 16px rgba(139, 111, 71, 0.15)',
    lg: '0 8px 24px rgba(139, 111, 71, 0.15)',
    xl: '0 12px 32px rgba(139, 111, 71, 0.2)',
    button: '0 4px 16px rgba(255, 155, 113, 0.25)'
  },
  
  // Übergänge
  transitions: {
    fast: 'all 0.15s ease',
    base: 'all 0.2s ease',
    medium: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
    slow: 'all 0.3s ease'
  },
  
  // Layout
  layout: {
    maxWidth: {
      sm: '600px',
      base: '900px',
      lg: '1200px'
    },
    
    // Sicherer Bereich für Bottom Navigation
    paddingBottom: {
      safe: 'clamp(6.25rem, 20vw, 8rem)'
    },
    
    // Header-Höhe
    header: {
      height: 'clamp(3.5rem, 12vw, 4.5rem)'
    }
  },
  
  // Button-Styles
  button: {
    // Primärer Button
    primary: {
      background: 'linear-gradient(135deg, #FF9B71 0%, #FFB997 100%)',
      color: '#FFFFFF',
      shadow: '0 4px 16px rgba(255, 155, 113, 0.25)',
      hoverShadow: '0 6px 24px rgba(255, 155, 113, 0.35)',
      hoverBackground: 'linear-gradient(135deg, #FFB997 0%, #FF9B71 100%)'
    },
    
    // Sekundärer Button
    secondary: {
      background: '#FFFFFF',
      color: '#FF9B71',
      border: '2px solid #E7C6B1',
      shadow: '0 2px 8px rgba(139, 111, 71, 0.1)',
      hoverBackground: '#FFF9F0'
    },
    
    // Icon Button
    icon: {
      size: 'clamp(2.75rem, 10vw, 3rem)',
      background: '#FFFFFF',
      color: '#FF9B71',
      shadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
    },
    
    // Button-Größen
    size: {
      sm: {
        padding: 'clamp(0.5rem, 1.5vw, 0.75rem) clamp(1rem, 3vw, 1.5rem)',
        fontSize: 'clamp(0.875rem, 2.5vw, 1rem)'
      },
      base: {
        padding: 'clamp(1rem, 3vw, 1.125rem) clamp(1.5rem, 4vw, 2rem)',
        fontSize: 'clamp(1rem, 3vw, 1.125rem)'
      },
      lg: {
        padding: 'clamp(1.125rem, 3.5vw, 1.375rem) clamp(2rem, 5vw, 2.5rem)',
        fontSize: 'clamp(1.125rem, 3.5vw, 1.375rem)'
      }
    }
  },
  
  // Card-Styles
  card: {
    background: '#FFFFFF',
    border: 'none',
    shadow: '0 4px 16px rgba(139, 111, 71, 0.12)',
    radius: 'clamp(1.25rem, 3vw, 1.75rem)',
    padding: 'clamp(1.25rem, 4vw, 1.75rem)'
  },
  
  // Icon-Größen
  icon: {
    sm: 'clamp(1rem, 4vw, 1.25rem)',
    base: 'clamp(1.5rem, 5vw, 2rem)',
    lg: 'clamp(2rem, 6vw, 2.5rem)',
    xl: 'clamp(2.5rem, 8vw, 3rem)'
  },
  
  // Z-Index Hierarchie
  zIndex: {
    base: 1,
    dropdown: 10,
    overlay: 100,
    modal: 200,
    tooltip: 300,
    menuBar: 1000,
    character: 1100
  }
};

// Hilfsfunktion für CSS Custom Properties
export function getCSSVariables() {
  const cssVars = {};
  
  // Farben
  Object.entries(theme.colors).forEach(([category, values]) => {
    if (typeof values === 'object') {
      Object.entries(values).forEach(([name, value]) => {
        cssVars[`--color-${category}-${name}`] = value;
      });
    }
  });
  
  return cssVars;
}

export default theme;

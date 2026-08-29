import { DesignSystem, DesignSystemColors, DesignSystemTypography } from "../../types";
import { BusinessBlueprint } from "../business-agent";

export interface DesignTokens {
  styleName: string;
  themeMode: 'dark' | 'light' | 'dual';
  colors: DesignSystemColors;
  typography: DesignSystemTypography;
  spacing: {
    unit: string;
    sectionPadding: string;
    containerMaxWidth: string;
    cardRadius: string;
    buttonRadius: string;
  };
  components: string[];
  animation: {
    transitionDefault: string;
    hoverScale: string;
    glowAccent: string;
  };
  cssVariables: Record<string, string>;
  generatedAt: string;
}

export class DesignSystemEngine {
  /**
   * Generates mathematical, accessible, fluid design tokens tailored to the business blueprint.
   */
  public async generateTokens(blueprint: BusinessBlueprint, stylePreference?: string): Promise<DesignTokens> {
    try {
      const res = await fetch("/api/ai/design-system", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName: blueprint.business,
          industry: blueprint.industry,
          personality: blueprint.goal,
          stylePreference: stylePreference || "Futuristic High-Performance Obsidian & Indigo"
        })
      });

      if (res.ok) {
        const payload = await res.json();
        const ds: DesignSystem = payload.data;
        return this.compileTokens(ds);
      }
    } catch (e) {
      console.warn("Design System API error, using mathematical token generator:", e);
    }

    const fallbackDs = this.generateMathematicalPalette(blueprint, stylePreference);
    return this.compileTokens(fallbackDs);
  }

  private compileTokens(ds: DesignSystem): DesignTokens {
    const cssVariables: Record<string, string> = {
      "--color-primary": ds.colors.primary,
      "--color-primary-hover": ds.colors.primaryHover,
      "--color-secondary": ds.colors.secondary,
      "--color-accent": ds.colors.accent,
      "--color-background": ds.colors.background,
      "--color-surface": ds.colors.surface,
      "--color-surface-border": ds.colors.surfaceBorder,
      "--color-text-primary": ds.colors.textPrimary,
      "--color-text-secondary": ds.colors.textSecondary,
      "--color-text-muted": ds.colors.textMuted,
      "--font-heading": ds.typography.fontHeading,
      "--font-body": ds.typography.fontBody,
      "--font-mono": ds.typography.fontMono,
      "--font-size-hero": ds.typography.scale.display,
      "--font-size-h1": ds.typography.scale.h1,
      "--font-size-h2": ds.typography.scale.h2,
      "--font-size-h3": ds.typography.scale.h3,
      "--font-size-body": ds.typography.scale.body,
      "--font-size-small": ds.typography.scale.small,
      "--section-padding": ds.spacing.sectionPadding,
      "--container-max-width": ds.spacing.containerMaxWidth,
      "--card-radius": ds.spacing.cardRadius,
      "--button-radius": ds.spacing.buttonRadius,
      "--transition-default": ds.animation.transitionDefault
    };

    return {
      styleName: ds.styleName,
      themeMode: ds.themeMode,
      colors: ds.colors,
      typography: ds.typography,
      spacing: ds.spacing,
      components: ds.components,
      animation: ds.animation,
      cssVariables,
      generatedAt: new Date().toISOString()
    };
  }

  private generateMathematicalPalette(blueprint: BusinessBlueprint, stylePreference?: string): DesignSystem {
    const ind = blueprint.industry.toLowerCase();
    
    // Choose primary & accent based on industry
    let primary = "#6366f1"; // Indigo default
    let primaryHover = "#4f46e5";
    let secondary = "#06b6d4"; // Cyan
    let accent = "#10b981"; // Emerald

    if (ind.includes("health") || ind.includes("medical") || ind.includes("clinic")) {
      primary = "#0ea5e9"; // Sky Blue
      primaryHover = "#0284c7";
      secondary = "#14b8a6"; // Teal
      accent = "#10b981"; // Emerald
    } else if (ind.includes("logistics") || ind.includes("auto") || ind.includes("transport")) {
      primary = "#f59e0b"; // Amber
      primaryHover = "#d97706";
      secondary = "#38bdf8"; // Light Blue
      accent = "#10b981";
    } else if (ind.includes("media") || ind.includes("studio") || ind.includes("creative")) {
      primary = "#8b5cf6"; // Violet
      primaryHover = "#7c3aed";
      secondary = "#ec4899"; // Pink
      accent = "#06b6d4";
    } else if (ind.includes("finance") || ind.includes("wealth") || ind.includes("invest")) {
      primary = "#10b981"; // Emerald
      primaryHover = "#059669";
      secondary = "#0284c7";
      accent = "#f59e0b";
    }

    return {
      styleName: stylePreference || "Neo-Enterprise High-Contrast Dark",
      themeMode: "dark",
      colors: {
        primary,
        primaryHover,
        secondary,
        accent,
        background: "#090d16",
        surface: "#111827",
        surfaceBorder: "#1f2937",
        textPrimary: "#f8fafc",
        textSecondary: "#94a3b8",
        textMuted: "#64748b"
      },
      typography: {
        fontHeading: "Plus Jakarta Sans, sans-serif",
        fontBody: "Plus Jakarta Sans, sans-serif",
        fontMono: "JetBrains Mono, monospace",
        scale: {
          display: "clamp(2.5rem, 5vw + 1rem, 4.25rem)",
          h1: "clamp(2rem, 3.5vw + 0.8rem, 3.25rem)",
          h2: "clamp(1.5rem, 2.5vw + 0.5rem, 2.25rem)",
          h3: "1.5rem",
          body: "1rem",
          small: "0.875rem"
        }
      },
      spacing: {
        unit: "4px",
        sectionPadding: "clamp(4rem, 8vw, 7.5rem)",
        containerMaxWidth: "1280px",
        cardRadius: "12px",
        buttonRadius: "8px"
      },
      components: [
        "FSE Sticky Header with Brand Wordmark & Dynamic Nav",
        "Hero Showcase with Split Telemetry Bento Card",
        "Feature Capability Grid with Hover Micro-elevation",
        "ROI & Pricing Matrix with SLA Guarantee Badges",
        "FAQ Accordion with Accessible Key Bindings",
        "High-Conversion Footer with Global Presence Indicator"
      ],
      animation: {
        transitionDefault: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
        hoverScale: "1.02",
        glowAccent: `0 0 24px ${primary}40`
      }
    };
  }
}

export const designSystemEngine = new DesignSystemEngine();

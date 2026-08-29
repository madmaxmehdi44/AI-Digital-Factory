import { CompiledTheme } from "../theme-compiler";
import { DesignTokens } from "../design-engine";
import { BusinessBlueprint } from "../business-agent";

export interface PreviewRenderResult {
  viewport: 'desktop' | 'tablet' | 'mobile';
  html: string;
  css: string;
  activeTemplate: string;
  availableTemplates: string[];
}

export class PreviewEngine {
  /**
   * Transforms raw Gutenberg FSE HTML block comments into clean, styled preview markup with live CSS tokens.
   */
  public renderPreview(
    theme: CompiledTheme,
    designTokens?: DesignTokens,
    blueprint?: BusinessBlueprint,
    templateName: string = "templates/front-page.html",
    viewport: 'desktop' | 'tablet' | 'mobile' = 'desktop'
  ): PreviewRenderResult {
    let rawHtml = theme.files[templateName] || theme.files["templates/front-page.html"] || theme.files["index.html"] || "<h1>Preview</h1>";

    // Resolve template parts (header, footer)
    if (theme.files["parts/header.html"]) {
      rawHtml = rawHtml.replace(/<!-- wp:template-part {"slug":"header"[^>]*}\s*\/-->/g, theme.files["parts/header.html"]);
    }
    if (theme.files["parts/footer.html"]) {
      rawHtml = rawHtml.replace(/<!-- wp:template-part {"slug":"footer"[^>]*}\s*\/-->/g, theme.files["parts/footer.html"]);
    }

    // Resolve block patterns
    Object.entries(theme.files).forEach(([path, content]) => {
      if (path.startsWith("patterns/")) {
        const patternSlug = path.replace("patterns/", "").replace(".html", "");
        const patternRegex = new RegExp(`<!-- wp:pattern {"slug":"[^"]*${patternSlug}"}\\s*\\/-->`, "g");
        rawHtml = rawHtml.replace(patternRegex, content);
      }
    });

    // Strip out remaining WordPress block comments for pure web rendering
    const cleanHtml = rawHtml
      .replace(/<!-- \/?wp:[^>]* -->/g, "")
      .replace(/<!-- wp:[^>]* \/-->/g, "");

    const customCss = theme.files["style.css"] || "";

    const availableTemplates = Object.keys(theme.files).filter(k => k.startsWith("templates/") || k === "index.html");

    return {
      viewport,
      html: cleanHtml,
      css: customCss,
      activeTemplate: templateName,
      availableTemplates
    };
  }
}

export const previewEngine = new PreviewEngine();

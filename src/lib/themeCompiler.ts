import JSZip from "jszip";
import { WordPressTheme } from "../types";

export async function downloadThemeAsZip(theme: WordPressTheme): Promise<void> {
  const zip = new JSZip();
  const folderName = theme.themeSlug || "ai-digital-factory-theme";
  const themeFolder = zip.folder(folderName);

  if (!themeFolder) return;

  // Add all files into the zip
  Object.entries(theme.files).forEach(([filePath, content]) => {
    themeFolder.file(filePath, content);
  });

  // Add readme and screenshot indicator
  themeFolder.file(
    "README.md",
    `# ${theme.themeName}\n\nGenerated autonomously by **AI Digital Factory**.\n\n### Installation\n1. In WordPress Admin, go to **Appearance > Themes > Add New > Upload Theme**.\n2. Upload this \`${folderName}.zip\` file.\n3. Click **Activate**.\n4. Go to **Appearance > Editor** to customize block patterns and templates.\n`
  );

  const blob = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${folderName}.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

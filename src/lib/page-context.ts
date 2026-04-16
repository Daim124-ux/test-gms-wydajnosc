/**
 * Utility to extract current page content and configuration state for the AI Assistant.
 */

export interface PageContext {
  title: string;
  description: string;
  url: string;
  mainContent: string;
  configuratorState?: any;
}

export function getCurrentPageContext(): PageContext | null {
  if (typeof window === 'undefined') return null;

  try {
    // 1. Meta-data retrieval
    const title = document.title;
    const description = (document.querySelector('meta[name="description"]') as HTMLMetaElement)?.content || '';
    const url = window.location.pathname;

    // 2. Main content extraction (Cleaned)
    // Targeting <main> or specifically marked content areas
    const mainElement = document.querySelector('main') || document.body;
    
    // Using textContent instead of innerText to avoid visual truncation (ellipsis) 
    // being captured. innerText respects CSS and can return '...' if the text is truncated.
    // textContent returns the full DOM text regardless of layout.
    const rawText = mainElement.textContent || mainElement.innerText || '';
    
    // Scrub the text of common UI noise (widgets, buttons, scripts)
    let cleanText = rawText
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gim, "")
      .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gim, "")
      .replace(/Napisz wiadomość\.\.\./g, "") 
      .replace(/W czym mogę pomóc\?/g, ""); 

    // Clean multiple spaces and ensure technical units stay with numbers
    const resultText = cleanText
      .replace(/\s+/g, ' ')
      .replace(/(\d+)[\s](\d+)/g, "$1$2") // Join separated numbers (e.g. 1 230 -> 1230)
      .replace(/(\d+)[,.](\d+)/g, "$1.$2") // ensure period for decimals for LLM
      .replace(/(\d+)\s*(mm|cm|m|kg|zł)/g, "$1 $2") // normalize units and ensure space
      .trim();

    console.log('[GMS-AI-DEBUG] Scraped Content:', resultText.substring(0, 500));

    // Limit text length to prevent token overflow
    const truncatedText = resultText.length > 6000 ? resultText.substring(0, 6000) + '...' : resultText;

    // 3. Configurator State (Placeholder for future feature)
    // We look for a global object that the future configurator will set
    const configuratorState = (window as any).__GMS_CONFIG__ || null;

    return {
      title,
      description,
      url,
      mainContent: truncatedText,
      configuratorState
    };
  } catch (error) {
    console.error('[PageContext] Error extracting context:', error);
    return null;
  }
}

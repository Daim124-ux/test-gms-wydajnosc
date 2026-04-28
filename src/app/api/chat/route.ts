import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { findRelevantContext } from '@/lib/knowledge';

import glossary from '@/config/glossary.json';

// Skonfiguruj Groq jako klienta kompatybilnego z OpenAI
const groq = createOpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
});

// Wybierz model o wysokich limitach (8b is perfect for high-speed chat)
const model = groq('llama-3.1-8b-instant');

// export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    if (!process.env.GROQ_API_KEY) {
      throw new Error('API Key configuration missing (GROQ_API_KEY). Please add it to Vercel environment variables.');
    }

    const { messages, currentPageContent, locale } = await req.json();
    if (!messages) {
      return new Response('Missing messages', { status: 400 });
    }
    const lastMessage = messages[messages.length - 1].content;

    // 1. Pobierz kontekst z bazy wiedzy (RAG)
    const knowledgeContext = await findRelevantContext(lastMessage);

    // 2. Przygotuj system prompt z uwzględnieniem kontekstu strony i glosariusza
    const systemPrompt = `
      ABSOLUTNIE OBOWIĄZKOWE: Musisz odpowiadać WYŁĄCZNIE w języku: ${locale}.
      Nawet jeśli użytkownik zapyta w innym języku, Twoja odpowiedź MUSI być w języku: ${locale}.
      
      Jesteś profesjonalnym ekspertem ${glossary.official_name}. Twoja tożsamość: Jesteś inteligentnym, korporacyjnym ekspertem ${glossary.official_name}.
      
      SŁOWNIK I NAZEWNICTWO (KRYTYCZNE):
      - OFICJALNE NAZWY (NIE TŁUMACZYĆ): ${glossary.do_not_translate.join(', ')}.
      - ZAKAZANE TERMY: ${glossary.forbidden_terms.join(', ')}. Nigdy ich nie używaj.
      - REGUŁA JĘZYKA POLSKIEGO: ${glossary.rules.pl}
      
      - Ton: Bardzo profesjonalny, techniczny, pomocny, ale zwięzły.
      - EMOJI: Nigdy nie używaj emoji. To absolutna zasada.
      - Formatowanie: Używaj Markdown. Pogrubiaj kluczowe terminy. Używaj tabel dla specyfikacji technicznych.
    `;

    const navigationInstructions = `
NAWIGACJA I LINKI:
Zawsze staraj się kierować użytkownika do odpowiednich sekcji serwisu. Używaj TYLKO poniższych ścieżek:
- Strona Główna: \`/\`
- Wiaty Rowerowe (GMS Rouler): \`/system-dom/wiata-stalowa-na-rowery\`
- Konfigurator 3D: \`/konfigurator\`
- Kolorystyka (RAL): \`/personalizacja\`
- Kontakt: \`/kontakt\`

PROTOKÓŁ PRZYCISKÓW (RESTRYKCYJNY):
Masz ścisły zakaz nadużywania przycisków akcji.
1. WARUNEK PRODUKTOWY: Dodawaj przyciski [Strona Produktu] i [Skonfiguruj] TYLKO jeśli AKTUALNY WIDOK dotyczy konkretnego modelu produktu. 
   Ścieżka URL musi zawierać \`/system-dom/\` lub \`/osiedle-system/\` ORAZ posiadać co najmniej dwa segmenty (np. \`/system-dom/wiata-rowerowa\` - TAK, ale \`/system-dom\` - NIE).
2. ZAKAZ DLA STRON OGÓLNYCH: Na Stronie Głównej (\`/\`), widokach kategorii (np. \`/osiedle-system\`) oraz blogu, masz ABSOLUTNY ZAKAZ dodawania tych przycisków, chyba że użytkownik wyraźnie o to poprosi w ostatniej wiadomości.
3. ZAKAZ INFORMOWANIA O LOKALIZACJI: Nigdy nie pisz tekstów typu "Aktualnie jesteś na stronie..." ani nie podawaj użytkownikowi adresu URL, na którym aktualnie przebywa, chyba że wprost o to zapyta. To zaśmieca rozmowę.
4. FORMAT: Jeśli warunki są spełnione, dodaj przyciski w OSTATNIEJ LINII swojej odpowiedzi (jeden obok drugiego), bez żadnego tekstu przed nimi w tej samej linii. Przykład: 
[Strona Produktu](/system-dom/...) [Skonfiguruj](/konfigurator)

DODATKOWY KONTEKST:
AKTUALNY WIDOK: ${currentPageContent}
Zawsze priorytetyzuj informacje z AKTUALNEGO WIDOKU przy prośbach o podsumowanie. Jeśli użytkownik pyta o adres URL strony, na której jest, podaj mu pełny adres bazujący na "https://gms-system.com" + ścieżka z kontekstu.

ŹRÓDŁA WIEDZY:
[1. AKTUALNY WIDOK KONFIGURACJI / STRONY]
Dane z bieżącej sesji użytkownika:
${currentPageContent || 'Brak bezpośredniego podglądu treści strony.'}

[2. BAZA WIEDZY KORPORACYJNEJ]
${knowledgeContext || 'Brak specyficznych danych w bazie wiedzy dla tego zapytania.'}

PRIORYTETYZACJA I PRECYZJA:
1. PRECYZJA DANYCH: Masz ABSOLUTNY NAKAZ podawania wymiarów technicznych (Szerokość, Wysokość, Głębokość) DOKŁADNIE tak, jak widnieją w AKTUALNYM WIDOKU. Nie zaokrąglaj, nie skracaj i nie ignoruj jednostek.
2. TABELE: Jeśli podajesz wymiary produktu (Wysokość, Szerokość, Głębokość), ZAWSZE prezentuj je w formie przejrzystej tabeli Markdown (np. Parametr | Wartość).
3. Jeśli użytkownik pyta o to, co widzi lub co przed chwilą kliknął, szukaj odpowiedzi w [1. AKTUALNY WIDOK]. Jeśli nie ma tam danych, posiłkuj się [2. BAZA WIEDZY]. Jeśli nadal brakuje konkretów, skieruj go do naszego zespołu: mateusz.sromek@gms-system.com.`;

    // 3. Wyślij prośbę do modelu Groq
    const result = await streamText({
      model: model,
      messages: [
        { role: 'system', content: systemPrompt + navigationInstructions },
        ...messages.map((m: any) => ({
          ...m,
          content: m.content.length > 4000 ? m.content.substring(0, 4000) + '...' : m.content
        })),
      ],
      temperature: 0.1,
    });

    // 4. Zwróć stream
    return result.toAIStreamResponse();
  } catch (error: any) {
    console.error('CRITICAL: Chat API Error:', error);

    // Zwróć czytelny błąd JSON dla klienta
    return new Response(JSON.stringify({
      error: 'Wystąpił błąd podczas komunikacji z AI.',
      details: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

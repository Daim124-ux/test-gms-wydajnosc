import { GMS_KNOWLEDGE, KnowledgeItem } from './knowledge-data';
import Fuse from 'fuse.js';

export type { KnowledgeItem };

/**
 * Pobiera bazę wiedzy ze statycznego pliku danych.
 */
export async function getKnowledgeBase(): Promise<KnowledgeItem[]> {
  return GMS_KNOWLEDGE;
}

/**
 * Znajduje najbardziej pasujące fragmenty wiedzy na podstawie zapytania.
 */
export async function findRelevantContext(query: string, limit = 4): Promise<string> {
  const knowledge = await getKnowledgeBase();

  if (knowledge.length === 0) return '';

  const fuse = new Fuse(knowledge, {
    keys: ['title', 'content'],
    threshold: 0.4, // Czułość wyszukiwania
    includeScore: true,
  });

  const results = fuse.search(query);
  
  // Pobieramy x pierwszych wyników i łączymy je w jeden kontekst
  return results
    .slice(0, limit)
    .map((res) => `Źródło: ${res.item.title} (${res.item.uri})\nTreść: ${res.item.content}`)
    .join('\n\n---\n\n');
}

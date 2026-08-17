import React from 'react';

export interface AIProductInfo {
  productName: string;
  category: string;
  technicalSpecs?: Record<string, string>;
  pricing?: string;
  availableColors?: string[];
  additionalInfo?: string;
}

interface AIContextProps {
  data: AIProductInfo;
}

/**
 * Komponent wstrzykujący ustrukturyzowane dane o produkcie dla asystenta AI.
 * Umieść go w dowolnym layoucie produktu (np. GarageLayout, CarportLayout).
 */
export default function AIContext({ data }: AIContextProps) {
  return (
    <script
      id="gms-ai-context"
      type="application/json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/**
 * Entities, places, person names, technical identifiers, and formats
 * that MUST NOT be translated to Sinhala according to localization rules.
 */

export const PRESERVED_PLACES = new Set([
  'Colombo Municipal Council',
  'Colombo',
  'CMC',
  'Borella',
  'Cinnamon Gardens',
  'Pettah',
  'Kollupitiya',
  'Maradana',
  'Dematagoda',
  'Fort',
  'Slave Island',
  'Wellawatte',
  'Bambalapitiya',
  'Havelock Town',
  'Kirulapone',
  'Narahenpita',
  'Grandpass',
  'Mattakkuliya',
  'Modara',
  'Mutwal',
  'Kotahena',
  'Kochchikade',
  'Maligawatta',
  'Panchikawatta',
  'Suduwella',
  'Kew Road',
  'Galle Face',
  'Duplication Road',
  'Galle Road',
  'Reid Avenue',
  'Ward Place',
  'Bauddhaloka Mawatha',
  'Viharamahadevi Park',
  'Town Hall',
  'Independence Square',
  'Nelum Pokuna',
  'Weddemulla',
  'Sri Lanka',
  'Vihara Maha Devi Park',
  'Albert Crescent',
  'D.S. Senanayake Mawatha',
])

export const PRESERVED_NAMES = new Set([
  'Kavindu Perera',
  'Amara Silva',
  'Kamal Gunaratne',
  'Sunil Fernando',
  'Nimal Perera',
  'Dilshan Perera',
  'Kasun Rajakaruna',
  'Anura Bandara',
  'Ruwan Jayasinghe',
  'Chathura De Silva',
  'Saman Kumara',
  'Priyani Wickramasinghe',
  'Chandana Alwis',
  'Nuwan Pradeep',
  'Mihiri Jayawardena',
  'Hasitha Senanayake',
  'Suraj Mendis',
  'LGS User',
  'Admin',
  'Lahiru',
  'Lahiru Randika',
])

// Regex patterns for identifiers, numbers, dates, emails, and coordinates
export const PRESERVED_PATTERNS: RegExp[] = [
  /^Ward\s+\d+$/i,                      // Ward numbers e.g. Ward 1, Ward 14
  /^[A-Z]{2,4}-\d{4}-\d{3,6}$/i,         // e.g. REQ-2026-0018, BK-2026-0012, APP-2026-0041, TX-2026-1042, BLD-4091
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, // UUID
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, // Email
  /^\+?\d[\d\s-]{7,15}\d$/,               // Phone numbers e.g. +94 11 000 0000
  /^-?\d{1,3}\.\d+,\s*-?\d{1,3}\.\d+$/,   // Coordinates e.g. 6.910250, 79.861400
  /^(https?:\/\/|\/cmc\/|\/assets\/|\/logos\/|\/lgs-media\/)/i, // URLs / Asset paths
  /^Rs\.\s?[\d,.]+[KMBkmb]?$/,           // Rs. 4,850.00, Rs. 185M
  /^LKR\s?[\d,.]+$/,                     // LKR 4,850.00
  /^\d+(\.\d+)?%$/,                      // Percentages e.g. 98.5%
  /^\d{1,2}\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4}$/i, // Dates e.g. 18 Oct 2026
  /^\d{1,2}:\d{2}\s*(AM|PM)\s*–\s*\d{1,2}:\d{2}\s*(AM|PM)$/i, // Time slots
  /^\d{4}-\d{2}-\d{2}(T|\s)\d{2}:\d{2}/, // ISO timestamps
  /^[0-9]+(\.[0-9]+)?(h|d|m|s|px|rem|em|%)?$/, // Raw numbers or measurements
]

/**
 * Checks if a string is a place name, personal name, or technical entity
 * that should remain in English without being translated to Sinhala.
 */
export function isPreservedEntity(text: string): boolean {
  const trimmed = text.trim()
  if (!trimmed) return true

  if (PRESERVED_PLACES.has(trimmed) || PRESERVED_NAMES.has(trimmed)) {
    return true
  }

  // Check if string matches any technical/ID pattern
  for (const pattern of PRESERVED_PATTERNS) {
    if (pattern.test(trimmed)) {
      return true
    }
  }

  // Purely punctuation / symbols or numbers
  if (/^[\d\s.,:;/#+\-_–—()'"@%&]+$/.test(trimmed)) {
    return true
  }

  return false
}

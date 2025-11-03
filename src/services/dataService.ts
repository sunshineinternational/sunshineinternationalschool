import type { Notice } from '../types';

// This URL is used for fetching live 'Notices' data.
const GOOGLE_SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ7ukhF8GqkwiCN4oYvT6FcO3RBMuk8c56emdFrN0EY9j5HA5oZkLzLQX6JQXRFA5BNQC4jc0Z8nJ5R/pub?output=csv';

interface Cache<T> {
    data: T;
    timestamp: number;
}

// In-memory cache for notices
let noticesCache: Cache<Notice[]> | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Normalizes a CSV header string to a camelCase property name.
 * Example: "GDrive Link" becomes "gdriveLink".
 * This is used for parsing the live Google Sheet data.
 * @param header The header string from the CSV file.
 * @returns A camelCase version of the header.
 */
function normalizeHeader(header: string): string {
    return header
        .trim()
        .replace(/\s+/g, ' ')
        .split(' ')
        .map((word, index) => 
            index === 0 
                ? word.toLowerCase() 
                : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join('');
}


/**
 * Parses a CSV string into an array of objects, correctly handling quoted values
 * and normalizing headers to camelCase.
 * This is used for parsing the live Google Sheet data.
 * @param csv The CSV content as a string.
 * @returns An array of objects representing the CSV rows.
 */
function parseCsvRobust(csv: string): any[] {
  const lines = csv.trim().replace(/\r\n/g, '\n').split('\n');
  if (lines.length < 2) return [];

  const headers = lines.shift()!.trim().split(',').map(normalizeHeader);

  return lines.map(line => {
    // Regex to split by comma, but ignore commas inside double quotes.
    const values = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
    
    const obj: { [key: string]: string } = {};
    headers.forEach((header, i) => {
      let value = (values[i] || '').trim();
      // Remove surrounding quotes if they exist
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }
      // Replace double-double-quotes with a single double-quote
      value = value.replace(/""/g, '"');
      obj[header] = value;
    });
    return obj;
  });
}

/**
 * Fetches and parses notice data from the public Google Sheet URL.
 * Implements a 5-minute cache to reduce network requests and improve performance.
 * @returns A promise that resolves to an array of Notice objects.
 */
export async function fetchNoticesData(): Promise<Notice[]> {
    const now = Date.now();
    
    // Check if valid cache exists
    if (noticesCache && (now - noticesCache.timestamp < CACHE_DURATION)) {
        console.log("Returning cached notices.");
        return Promise.resolve(noticesCache.data);
    }
    
    try {
        console.log("Attempting to fetch live notices from Google Sheet...");
        const response = await fetch(GOOGLE_SHEET_URL);
        if (!response.ok) {
            throw new Error(`Failed to fetch from Google Sheet: ${response.statusText}`);
        }
        const csvText = await response.text();
        const data = parseCsvRobust(csvText) as Notice[];
        
        // Update cache
        noticesCache = {
            data: data,
            timestamp: now,
        };
        
        console.log("Successfully fetched live notices and updated cache.");
        return data;
    } catch (error) {
        console.warn('Live notices fetch failed:', error);
        // If fetch fails but we have stale cache, return it to prevent a blank section
        if (noticesCache) {
            console.log("Returning stale cached notices as a fallback.");
            return Promise.resolve(noticesCache.data);
        }
        console.log("Returning an empty array as a final fallback.");
        return Promise.resolve([]); // Return empty if no cache and fetch fails
    }
}
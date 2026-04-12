import React from 'react';

/**
 * Generates a placeholder SVG and sets it as the src for an image that fails to load.
 * @param e The React synthetic event from the image's onError handler.
 * @param options Options to customize the placeholder.
 */
export const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>,
    options: { width?: number; height?: number; text?: string; isThumbnail?: boolean } = {}
) => {
    const { width = 800, height = 450, text = 'Image Not Found' } = options;
    
    e.currentTarget.onerror = null; // Prevent infinite loops

    const placeholderSvg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
        <rect fill="#E2E6E8" width="${width}" height="${height}"/>
        <text fill="#545B5C" font-family="sans-serif" font-size="16" dy="6" x="50%" y="50%" text-anchor="middle">${text}</text>
      </svg>`;
      
    e.currentTarget.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(placeholderSvg)}`;
};

/**
 * Parses a date string in DD/MM/YYYY format into a Date object.
 * Returns an invalid Date object if the format is incorrect.
 * @param dateString The date string to parse, e.g., "20/11/2025".
 * @returns A Date object.
 */
export const parseDDMMYYYY = (dateString: string): Date => {
    if (!dateString || typeof dateString !== 'string') return new Date(NaN);
    
    // Support both DD/MM/YYYY and DD-MM-YYYY (and even YYYY-MM-DD if reverse split was used)
    const separators = ['/', '-'];
    let parts: string[] = [];
    
    for (const sep of separators) {
        const potentialParts = dateString.trim().split(sep);
        if (potentialParts.length === 3) {
            parts = potentialParts;
            break;
        }
    }

    if (parts.length === 3) {
        // We assume DD/MM/YYYY or DD-MM-YYYY
        // If the first part is 4 digits, it's YYYY-MM-DD
        let day, month, year;
        if (parts[0].length === 4) {
             year = parseInt(parts[0], 10);
             month = parseInt(parts[1], 10) - 1;
             day = parseInt(parts[2], 10);
        } else {
             day = parseInt(parts[0], 10);
             month = parseInt(parts[1], 10) - 1;
             year = parseInt(parts[2], 10);
        }

        if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
            const date = new Date(Date.UTC(year, month, day));
            return date;
        }
    }
    return new Date(NaN);
};
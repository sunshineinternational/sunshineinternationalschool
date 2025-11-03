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
    if (!dateString) return new Date(NaN); // NaN is the standard for invalid dates
    const parts = dateString.trim().split('/');
    if (parts.length === 3) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1; // JS months are 0-indexed
        const year = parseInt(parts[2], 10);
        if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
            const date = new Date(Date.UTC(year, month, day)); // Use UTC to avoid timezone issues
            // Extra check to ensure date wasn't rolled over by constructor (e.g., day 32)
            if (date.getUTCFullYear() === year && date.getUTCMonth() === month && date.getUTCDate() === day) {
                return date;
            }
        }
    }
    return new Date(NaN); // Return an invalid date
};
/**
 * Date utilities for consistent date handling across the application
 */

/**
 * Format a date string or Date object to a user-friendly format
 * @param dateString Date string or Date object
 * @returns Formatted date string
 */
export const formatDate = (dateString: string | Date | null | undefined): string => {
  if (!dateString) return 'N/A';
  
  try {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      console.warn('Invalid date:', dateString);
      return 'Invalid date';
    }
    
    // Format date as: YYYY-MM-DD HH:MM
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Error';
  }
};

/**
 * Convert a date string or Date object to HTML datetime-local input format
 * @param dateString Date string or Date object
 * @returns Date string in YYYY-MM-DDTHH:MM format
 */
export const toDateTimeLocalFormat = (dateString: string | Date | null | undefined): string => {
  if (!dateString) {
    // Return current date-time in local format
    const now = new Date();
    return now.toISOString().slice(0, 16);
  }
  
  try {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      console.warn('Invalid date for input:', dateString);
      // Return current date-time as fallback
      const now = new Date();
      return now.toISOString().slice(0, 16);
    }
    
    // Format date as YYYY-MM-DDTHH:MM (datetime-local input format)
    return date.toISOString().slice(0, 16);
  } catch (error) {
    console.error('Error converting date to datetime-local format:', error);
    // Return current date-time as fallback
    const now = new Date();
    return now.toISOString().slice(0, 16);
  }
};

/**
 * Get current date-time in ISO format
 * @returns ISO date string
 */
export const getCurrentISODate = (): string => {
  return new Date().toISOString();
};

/**
 * Safely convert a date string from any format to ISO format
 * @param dateString The date string to convert
 * @returns ISO date string or current date if invalid
 */
export const toISOString = (dateString: string | null | undefined): string => {
  if (!dateString) {
    return new Date().toISOString();
  }
  
  try {
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      console.warn('Invalid date for ISO conversion:', dateString);
      return new Date().toISOString();
    }
    
    return date.toISOString();
  } catch (error) {
    console.error('Error converting to ISO format:', error);
    return new Date().toISOString();
  }
};
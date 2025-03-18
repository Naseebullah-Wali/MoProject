/**
 * Extract unique values from an array of objects based on a property
 * @param {Array} items - Array of objects
 * @param {String} property - Property name to extract unique values from
 * @returns {Array} Array of unique values
 */
export function getUniqueValues(items, property) {
    return [...new Set(items.map(item => item[property]))];
  }
  
  /**
   * Extract unique values from comma-separated strings in an array of objects
   * @param {Array} items - Array of objects
   * @param {String} property - Property name containing comma-separated values
   * @returns {Array} Array of unique values
   */
  export function getUniqueCSVValues(items, property) {
    const values = items
      .flatMap(item => item[property] ? item[property].split(',') : [])
      .map(value => value.trim())
      .filter(value => value !== '');
    
    return [...new Set(values)];
  }
  
  /**
   * Filter an array of objects by multiple criteria
   * @param {Array} items - Array of objects to filter
   * @param {Object} filters - Object with filter criteria
   * @param {String} searchQuery - Optional search text to filter by
   * @param {Array} searchFields - Fields to search in when using searchQuery
   * @returns {Array} Filtered array of objects
   */
  export function filterItems(items, filters, searchQuery = '', searchFields = []) {
    return items.filter(item => {
      // Check all filter criteria
      for (const [key, value] of Object.entries(filters)) {
        if (!value) continue; // Skip empty filters
        
        // Special case for comma-separated values
        if (key === 'topic' && item.all_topics) {
          const topics = item.all_topics.split(',').map(t => t.trim());
          if (!topics.some(t => t === value)) return false;
          continue;
        }
        
        // Regular property matching
        if (item[key] !== value) return false;
      }
      
      // Handle search query if provided
      if (searchQuery && searchFields.length > 0) {
        const query = searchQuery.toLowerCase();
        return searchFields.some(field => 
          item[field] && item[field].toString().toLowerCase().includes(query)
        );
      }
      
      return true;
    });
  }
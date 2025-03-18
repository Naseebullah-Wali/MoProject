export default {
    data() {
      return {
        items: [],
        filteredItems: [],
        visibleItems: [],
        itemsToShow: 15,
        searchQuery: "",
        user_id: localStorage.getItem('user_id')
      };
    },
    computed: {
      isFilterApplied() {
        const hasActiveFilters = Object.values(this.filters || {}).some(value => value);
        return hasActiveFilters || this.searchQuery;
      },
      canLoadMore() {
        return this.visibleItems.length < this.filteredItems.length;
      }
    },
    methods: {
      formatDate(date) {
        if (!date) return "N/A";
        return new Date(date).toLocaleDateString();
      },
      
      truncateText(text, maxLength) {
        if (!text) return "";
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = text;
        const plainText = tempDiv.textContent || tempDiv.innerText;
        return plainText.length > maxLength ? plainText.substring(0, maxLength) + "..." : plainText;
      },
      
      updateVisibleItems() {
        this.visibleItems = this.filteredItems.slice(0, this.itemsToShow);
      },
      
      loadMoreItems() {
        this.itemsToShow += 15;
        this.updateVisibleItems();
      },
    applyFilters() {
        // Override in component implementation
      },
      
      sortItems() {
        const field = this.sortBy;
        
        this.filteredItems.sort((a, b) => {
          if (field.toLowerCase().includes('date') || field.toLowerCase().includes('created_at')) {
            return new Date(b[field]) - new Date(a[field]);
          }
          return a[field]?.localeCompare(b[field]);
        });
        
        this.updateVisibleItems();
      },
      
      resetFilters() {
        if (this.filters) {
          Object.keys(this.filters).forEach(key => {
            this.filters[key] = "";
          });
        }
        this.searchQuery = "";
        this.applyFilters();
      }
    }
  };
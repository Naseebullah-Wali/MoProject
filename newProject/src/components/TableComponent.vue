<template>
    <div class="card mx-3">
      <div class="card-header d-flex justify-content-between align-items-center">
        <div class="d-flex align-items-center gap-3">
          <input
            v-model="search"
            class="form-control form-control-sm"
            placeholder="Search..."
            style="width: 200px"
          >
          <select v-model="pageSize" class="form-select form-select-sm" style="width: 80px">
            <option :value="5">5</option>
            <option :value="10">10</option>
            <option :value="25">25</option>
            <option :value="50">50</option>
          </select>
        </div>
        <slot name="tableActions"></slot>
      </div>
  
      <div class="table-responsive">
        <table class="table table-hover mb-0">
          <thead class="table-light">
            <tr>
              <th
                v-for="col in visibleColumns"
                :key="col"
                @click="sort(col)"
                class="cursor-pointer"
              >
                <div class="d-flex align-items-center gap-2">
                  {{ formatColumnHeader(col) }}
                  <div class="d-flex flex-column sort-icons">
                    <i class="bi bi-caret-up-fill"
                       :class="{ 'text-primary': sortColumn === col && sortDirection === 'asc' }"></i>
                    <i class="bi bi-caret-down-fill"
                       :class="{ 'text-primary': sortColumn === col && sortDirection === 'desc' }"></i>
                  </div>
                </div>
              </th>
              <th v-if="hasActions">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in paginatedAndFilteredData" :key="item.id">
              <td v-for="col in visibleColumns" :key="col">
                <div v-if="col.toLowerCase().includes('flag')">
                  <img :src="item[col]" :alt="item[col]" style="height: 20px">
                </div>
                <div v-else>{{ item[col] }}</div>
              </td>
              <td v-if="hasActions">
                <div class="d-flex gap-1">
                  <button
                    @click="$emit('edit', item)"
                    class="btn btn-outline-primary btn-sm"
                    title="Edit"
                  >
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button
                    @click="handleDelete(item.id)"
                    class="btn btn-outline-danger btn-sm"
                    title="Delete"
                  >
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="paginatedAndFilteredData.length === 0">
              <td :colspan="hasActions ? visibleColumns.length + 1 : visibleColumns.length" class="text-center py-4">
                No data found
              </td>
            </tr>
          </tbody>
        </table>
      </div>
  
      <div class="card-footer d-flex justify-content-between align-items-center">
        <div class="text-muted small">
          Showing {{ startIndex + 1 }} to {{ Math.min(endIndex, filteredData.length) }}
          of {{ filteredData.length }} entries
        </div>
        <nav v-if="totalPages > 1">
          <ul class="pagination pagination-sm mb-0">
            <li :class="['page-item', { disabled: currentPage === 1 }]">
              <button class="page-link" @click="currentPage = 1">«</button>
            </li>
            <li :class="['page-item', { disabled: currentPage === 1 }]">
              <button class="page-link" @click="currentPage--">‹</button>
            </li>
            <li
              v-for="page in displayedPages"
              :key="page"
              :class="['page-item', { active: currentPage === page }]"
            >
              <button class="page-link" @click="currentPage = page">{{ page }}</button>
            </li>
            <li :class="['page-item', { disabled: currentPage === totalPages }]">
              <button class="page-link" @click="currentPage++">›</button>
            </li>
            <li :class="['page-item', { disabled: currentPage === totalPages }]">
              <button class="page-link" @click="currentPage = totalPages">»</button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </template>
  
  <script setup>
  import { computed, ref, watch } from 'vue';
  
  const props = defineProps({
    data: {
      type: Array,
      required: true
    },
    hasActions: {
      type: Boolean,
      default: true
    },
    excludeColumns: {
      type: Array,
      default: () => ['id']
    },
    hideDeleted: {
      type: Boolean,
      default: true
    }
  });
  
  const emit = defineEmits(['edit', 'delete']);
  
  // State
  const search = ref('');
  const currentPage = ref(1);
  const pageSize = ref(10);
  const sortColumn = ref('');
  const sortDirection = ref('asc');
  
  // Computed columns excluding specified ones and handling Is_Deleted
  const visibleColumns = computed(() => {
    if (props.data.length === 0) return [];
    const allColumns = Object.keys(props.data[0]);
    return allColumns.filter(col =>
      !props.excludeColumns.includes(col) &&
      (props.hideDeleted ? col !== 'Is_Deleted' : true)
    );
  });
  
  // Format column headers
  function formatColumnHeader(header) {
    return header
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }
  
  // Sorting logic
  function sort(column) {
    if (sortColumn.value === column) {
      sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
    } else {
      sortColumn.value = column;
      sortDirection.value = 'asc';
    }
  }
  
  // Filter and sort data
  const filteredData = computed(() => {
    let result = [...props.data];
  
    // Filter out deleted records if hideDeleted is true
    if (props.hideDeleted) {
      result = result.filter(item => !item.Is_Deleted);
    }
  
    // Search filter
    if (search.value) {
      const searchLower = search.value.toLowerCase();
      result = result.filter(item =>
        Object.values(item).some(val =>
          String(val).toLowerCase().includes(searchLower)
        )
      );
    }
  
    // Sort
    if (sortColumn.value) {
      result.sort((a, b) => {
        let comparison = 0;
        const aVal = String(a[sortColumn.value]).toLowerCase();
        const bVal = String(b[sortColumn.value]).toLowerCase();
  
        if (aVal < bVal) comparison = -1;
        if (aVal > bVal) comparison = 1;
  
        return sortDirection.value === 'asc' ? comparison : -comparison;
      });
    }
  
    return result;
  });
  
  // Pagination
  const totalPages = computed(() =>
    Math.ceil(filteredData.value.length / pageSize.value)
  );
  
  const startIndex = computed(() =>
    (currentPage.value - 1) * pageSize.value
  );
  
  const endIndex = computed(() =>
    startIndex.value + pageSize.value
  );
  
  const paginatedAndFilteredData = computed(() =>
    filteredData.value.slice(startIndex.value, endIndex.value)
  );
  
  const displayedPages = computed(() => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];
    let l;
  
    for (let i = 1; i <= totalPages.value; i++) {
      if (
        i === 1 ||
        i === totalPages.value ||
        i >= currentPage.value - delta &&
        i <= currentPage.value + delta
      ) {
        range.push(i);
      }
    }
  
    range.forEach(i => {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    });
  
    return rangeWithDots;
  });
  
  // Delete handler
  function handleDelete(id) {
    emit('delete', id);
  }
  
  // Reset pagination when search changes
  watch(search, () => {
    currentPage.value = 1;
  });
  
  // Reset pagination when page size changes
  watch(pageSize, () => {
    currentPage.value = 1;
  });
  </script>
  
  <style scoped>
  .cursor-pointer {
    cursor: pointer;
  }
  
  .cursor-pointer:hover {
    background-color: rgba(0,0,0,0.05);
  }
  
  .sort-icons {
    line-height: 0.5;
  }
  
  .sort-icons i {
    font-size: 0.6rem;
    color: #ccc;
  }
  
  .sort-icons i.text-primary {
    color: #0d6efd !important;
  }
  
  .table th {
    white-space: nowrap;
  }
  </style>
  
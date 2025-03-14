<template>
  <div class="container py-4">
    <!-- Project Title -->
    <div class="text-center mb-4">
      <h1 class="display-5 fw-bold">{{ project.Post_Title || "No title available" }}</h1>
    </div>

    <!-- Project Details -->
    <div class="card mb-4">
      <div class="card-body bg-light">
        <div v-html="project.Post_Content || '<em>No content available</em>'"></div>
      </div>
    </div>

    <!-- Project Files -->
    <div v-if="hasProjectFiles" class="card mb-4">
      <div class="card-header">
        <h2 class="h4 mb-0">Project Files</h2>
      </div>
      <div class="card-body">
        <div class="row g-2">
          <div v-if="project.File1" class="col-md-4 mb-2">
            <div class="card">
              <div class="card-body d-flex flex-column align-items-center">
                <i class="bi fs-1" :class="getFileIconClass(project.File1)"></i>
                <p class="text-truncate w-100 text-center mt-2">{{ getFileName(project.File1) }}</p>
                <button class="btn btn-sm btn-outline-primary" @click="openUrl(project.File1)">
                  <i class="bi bi-box-arrow-up-right me-1"></i>Open
                </button>
              </div>
            </div>
          </div>
          <div v-if="project.File2" class="col-md-4 mb-2">
            <div class="card">
              <div class="card-body d-flex flex-column align-items-center">
                <i class="bi fs-1" :class="getFileIconClass(project.File2)"></i>
                <p class="text-truncate w-100 text-center mt-2">{{ getFileName(project.File2) }}</p>
                <button class="btn btn-sm btn-outline-primary" @click="openUrl(project.File2)">
                  <i class="bi bi-box-arrow-up-right me-1"></i>Open
                </button>
              </div>
            </div>
          </div>
          <div v-if="project.File3" class="col-md-4 mb-2">
            <div class="card">
              <div class="card-body d-flex flex-column align-items-center">
                <i class="bi fs-1" :class="getFileIconClass(project.File3)"></i>
                <p class="text-truncate w-100 text-center mt-2">{{ getFileName(project.File3) }}</p>
                <button class="btn btn-sm btn-outline-primary" @click="openUrl(project.File3)">
                  <i class="bi bi-box-arrow-up-right me-1"></i>Open
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Project Info Grid -->
    <div class="row g-4 mb-4">
      <div class="col-md-6">
        <div class="card h-100">
          <div class="card-body">
            <p class="mb-2"><strong>Status:</strong> {{ project.Status_Name || "No data" }}</p>
            <p class="mb-2"><strong>Priority:</strong> {{ project.Priority || "No data" }}</p>
            <p class="mb-0"><strong>Developer:</strong> {{ project.Developer_Organization || "No data" }}</p>
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="card h-100">
          <div class="card-body">
            <p class="mb-2"><strong>Project Number:</strong> {{ project.Project_Number || "No data" }}</p>
            <p class="mb-2"><strong>Level of Importance:</strong> {{ project.Character_name || "No data" }}</p>
            <p class="mb-0"><strong>Project Date:</strong> {{ project.Project_Date ? formatDate(project.Project_Date) : "No date available" }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Download Button -->
    <div class="d-grid gap-2 d-md-flex justify-content-md-start mb-4">
      <button class="btn btn-success" @click="openDownloadModal">
        <i class="bi bi-download me-2"></i>Download as PDF
      </button>
    </div>

    <!-- Project Updates -->
    <div class="mb-4">
      <h2 class="h4 mb-3">Project Updates</h2>
      <div v-if="updates.length > 0" class="row g-3">
        <div v-for="update in updates" :key="update.id" class="col-md-4">
          <div class="card h-100 shadow-sm hover-card" @click="openUpdateModal(update)">
            <div class="card-body">
              <h5 class="card-title h6">Update on {{ update.update_date || "Unknown date" }}</h5>
              <p class="card-text" v-html="truncateText(update.update_content || 'No update content available')"></p>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="alert alert-info">
        No updates available for this project.
      </div>
    </div>

    <!-- Comments Section -->
    <div class="mb-4">
      <h2 class="h4 mb-3">Comments</h2>
      <div v-if="comments.length > 0" class="list-group mb-3">
        <div v-for="comment in comments" :key="comment.id" class="list-group-item">
          <div class="d-flex justify-content-between align-items-center mb-1">
            <strong>{{ comment.Name }}</strong>
            <small class="text-muted">{{ formatDate(comment.CreatedAt) }}</small>
          </div>
          <p class="mb-0">{{ comment.Comment }}</p>
        </div>
      </div>
      <div v-else class="alert alert-info">
        No comments available.
      </div>
    </div>

    <!-- Comment Form -->
    <div class="card mb-4">
      <div class="card-body">
        <h2 class="h4 mb-3">Leave a Comment</h2>
        <div class="mb-3">
          <textarea
            class="form-control"
            v-model="newComment"
            placeholder="Write your comment..."
            rows="3"
          ></textarea>
        </div>
        <button
          class="btn btn-primary"
          @click="sendComment"
          :disabled="!newComment.trim()"
        >
          <i class="bi bi-send me-2"></i>Send Comment
        </button>
      </div>
    </div>

    <!-- Update Modal -->
    <div
      class="modal fade"
      id="updateModal"
      tabindex="-1"
      data-bs-backdrop="static"
    >
      <div class="modal-dialog modal-dialog-centered modal-xl">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Update Details</h5>
            <button
              type="button"
              class="btn-close"
              @click="closeModal('updateModal')"
            ></button>
          </div>
          <div class="modal-body">
            <div v-html="selectedUpdate.update_content"></div>

            <!-- Update Files Section -->
            <div v-if="hasUpdateFiles" class="mt-4">
              <h6 class="border-bottom pb-2">Attached Files</h6>
              <div class="row g-3 mt-2">
                <div v-for="(file, index) in filteredUpdateFiles" :key="index" class="col-md-4 mb-2">
                  <div class="card">
                    <div class="card-body d-flex flex-column align-items-center">
                      <i class="bi fs-1" :class="getFileIconClass(file)"></i>
                      <p class="text-truncate w-100 text-center mt-2">{{ getFileName(file) }}</p>
                      <button class="btn btn-sm btn-outline-primary" @click="openUrl(file)">
                        <i class="bi bi-box-arrow-up-right me-1"></i>Open
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal('updateModal')">Close</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Download PDF Selection Modal -->
    <div
      class="modal fade"
      id="downloadModal"
      tabindex="-1"
      data-bs-backdrop="static"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Select Updates to Include</h5>
            <button
              type="button"
              class="btn-close"
              @click="closeModal('downloadModal')"
            ></button>
          </div>
          <div class="modal-body">
            <div class="form-check mb-3">
              <input class="form-check-input" type="checkbox" v-model="selectAllUpdates" @change="toggleAllUpdates" id="selectAll">
              <label class="form-check-label" for="selectAll">
                Select All Updates
              </label>
            </div>
            <hr>
            <div v-if="updates.length > 0" class="mb-3">
              <div v-for="(update, index) in updates" :key="index" class="form-check mb-2">
                <input class="form-check-input" type="checkbox" v-model="selectedUpdates[index]" :id="`update-${index}`">
                <label class="form-check-label" :for="`update-${index}`">
                  Update on {{ update.update_date || "Unknown date" }}
                </label>
              </div>
            </div>
            <div v-else class="alert alert-info">
              No updates available to include.
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal('downloadModal')">Cancel</button>
            <button type="button" class="btn btn-success" @click="downloadPDF">
              <i class="bi bi-download me-2"></i>Download PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Modal } from 'bootstrap';
import he from 'he';
import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import cyrillicToTranslit from 'cyrillic-to-translit-js';

export default {
  name: 'ProjectDetails',

  data() {
    return {
      project: {},
      updates: [],
      comments: [],
      newComment: '',
      selectedUpdate: {},
      updateFiles: [],
      modals: {},
      selectedUpdates: [],
      selectAllUpdates: false,
      // baseUrl: 'http://localhost:900',
      // For production use:
      baseUrl: 'https://moproject.onrender.com',
      translit: null,
      user_id: localStorage.getItem('user_id'), // Hardcoded user_id, in real should be from localStorage
      plainTextContent: '',
      plainTextUpdates: []
    };
  },

  computed: {
    hasProjectFiles() {
      return this.project.File1 || this.project.File2 || this.project.File3;
    },
    hasUpdateFiles() {
      return this.filteredUpdateFiles.length > 0;
    },
    filteredUpdateFiles() {
      return this.updateFiles.filter(file => file);
    }
  },

  created() {
    this.translit = new cyrillicToTranslit();
    // Try to get user_id from localStorage
    try {
      const storedUserId = localStorage.getItem('user_id');
      if (storedUserId) {
        this.user_id = parseInt(storedUserId);
      }
    } catch (error) {
      console.error('Error accessing localStorage:', error);
    }
    this.fetchProjectDetails();
  },

  watch: {
    'project.ID': {
      handler(newVal) {
        if (newVal) {
          this.fetchProjectUpdates();
          this.fetchComments();
        }
      },
      immediate: true
    },
    'project.Post_Content': {
      handler(newVal) {
        if (newVal) {
          this.extractPlainText();
        }
      },
      immediate: true
    }
  },

  methods: {
    async fetchProjectDetails() {
      try {
        const projectId = this.$route.params.id || 1;
        const response = await fetch(`${this.baseUrl}/project-topics/${this.user_id}`);
        const data = await response.json();
        this.project = data.find(project => project.ID == projectId) || {};
      } catch (error) {
        console.error('Error fetching project details:', error);
      }
    },

    async fetchProjectUpdates() {
      if (!this.project.ID) return;
      try {
        const response = await fetch(`${this.baseUrl}/project-updates/${this.project.ID}`);
        this.updates = await response.json();
        this.initSelectedUpdates();
        this.extractPlainTextUpdates();
      } catch (error) {
        console.error('Error fetching project updates:', error);
      }
    },
    initSelectedUpdates() {
      this.selectedUpdates = this.updates.map(() => false);
    },

    toggleAllUpdates() {
      this.selectedUpdates = this.updates.map(() => this.selectAllUpdates);
    },

    async fetchComments() {
      if (!this.project.ID) return;
      try {
        const response = await fetch(`${this.baseUrl}/project-comments/${this.project.ID}`);
        const data = await response.json();
        this.comments = data.filter(comment => !comment.Is_Deleted);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    },

    formatDate(date) {
      return new Date(date).toLocaleDateString();
    },

    truncateText(text, maxLength = 250) {
      return text?.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
    },

    decodeText(text) {
      return text ? he.decode(text) : 'No data available';
    },

    getFileName(filePath) {
      if (!filePath) return '';
      return filePath.split('/').pop();
    },

    getFileIconClass(filePath) {
      if (!filePath) return 'bi-file';

      const extension = filePath.split('.').pop().toLowerCase();

      const iconMap = {
        'pdf': 'bi-file-pdf',
        'doc': 'bi-file-word',
        'docx': 'bi-file-word',
        'xls': 'bi-file-excel',
        'xlsx': 'bi-file-excel',
        'png': 'bi-file-image',
        'jpg': 'bi-file-image',
        'jpeg': 'bi-file-image',
        'gif': 'bi-file-image',
        'txt': 'bi-file-text',
        'zip': 'bi-file-zip',
        'rar': 'bi-file-zip'
      };

      return iconMap[extension] || 'bi-file';
    },

    openUrl(url) {
      if (!url) return;
      window.open(url, '_blank');
    },

    openUpdateModal(update) {
      this.selectedUpdate = update;

      this.updateFiles = [
        update.file1 || null,
        update.file2 || null,
        update.file3 || null,
        update.file4 || null,
        update.file5 || null,
        update.file6 || null
      ];

      this.openModal('updateModal');
    },

    openDownloadModal() {
      this.openModal('downloadModal');
    },

    openModal(modalId) {
      if (this.modals[modalId]) {
        this.modals[modalId].dispose();
      }

      const modalEl = document.getElementById(modalId);

      // Remove any inline styles
      modalEl.style.removeProperty('padding-right');
      document.body.style.removeProperty('padding-right');

      // Initialize new modal
      this.modals[modalId] = new Modal(modalEl, {
        backdrop: 'static',
        keyboard: false
      });

      // Show modal
      this.modals[modalId].show();

      // Remove unwanted styles
      modalEl.style.paddingRight = '0';
      document.body.style.paddingRight = '0';
    },

    closeModal(modalId) {
      if (this.modals[modalId]) {
        this.modals[modalId].hide();
        document.body.style.removeProperty('padding-right');
        document.body.classList.remove('modal-open');
        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) {
          backdrop.remove();
        }
      }
    },
    async sendComment() {
      if (!this.$route.params.id || !this.newComment.trim()) {
        alert('Please enter a valid comment.');
        return;
      }

      try {
        const response = await fetch(`${this.baseUrl}/project-comments`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            User_ID: this.user_id, // Use the user_id from data
            Project_ID: parseInt(this.$route.params.id),
            Comment: this.newComment.trim(),
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to post comment');
        }

        // Clear input field
        this.newComment = '';

        // Refresh comments
        await this.fetchComments();

      } catch (error) {
        console.error('Error posting comment:', error);
        alert('Failed to post comment. Please try again.');
      }
    },

    beforeUnmount() {
      // Clean up all modals
      Object.keys(this.modals).forEach(key => {
        if (this.modals[key]) {
          this.modals[key].dispose();
        }
      });
    },

    // Extract plain text from HTML content
    extractPlainText() {
      if (!this.project.Post_Content) return;
      
      // Create a temporary div to parse HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = this.project.Post_Content;
      this.plainTextContent = tempDiv.textContent || tempDiv.innerText || '';
      console.log(this.plainTextContent, "test 1")
    },

    // Extract plain text from updates
    extractPlainTextUpdates() {
      this.plainTextUpdates = this.updates.map(update => {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = update.update_content || '';
        console.log(this.plainTextUpdates)
        return {
          ...update,
          plainContent: tempDiv.textContent || tempDiv.innerText || ''
        };
        
      });
    },
    // Improved PDF generation with proper text handling
    downloadPDF() {
  try {
    // Close the download modal
    this.closeModal('downloadModal');

    // Initialize PDF
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      putOnlyUsedFonts: true,
      floatPrecision: 16
    });

    // Add custom font for better text support
    doc.addFont('https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf', 'Roboto', 'normal');
    doc.setFont('Roboto');

    const pageWidth = 190; // Consistent width for all content

    // Helper function to handle text wrapping
    const wrapText = (text, maxWidth = pageWidth) => {
      if (!text) return ['No data available'];
      
      // Sanitize text
      const sanitizedText = text.replace(/\r?\n|\r/g, ' ').trim();
      if (!sanitizedText) return ['No data available'];
      
      return doc.splitTextToSize(sanitizedText, maxWidth);
    };

    // Title
    doc.setFontSize(16);
    const titleLines = wrapText(this.project.Post_Title, pageWidth);
    doc.text(titleLines, 20, 20);
    
    // Start Y position for content
    let yPos = 20 + (titleLines.length * 7);

    // Project info
    doc.setFontSize(12);
    doc.text(`Status: ${this.project.Status_Name || 'No data'}`, 20, yPos);
    yPos += 7;
    
    doc.text(`Priority: ${this.project.Priority || 'No data'}`, 20, yPos);
    yPos += 7;
    
    doc.text(`Developer: ${this.project.Developer_Organization || 'No data'}`, 20, yPos);
    yPos += 7;
    
    doc.text(`Project Number: ${this.project.Project_Number || 'No data'}`, 20, yPos);
    yPos += 7;
    
    doc.text(`Level of Importance: ${this.project.Character_name || 'No data'}`, 20, yPos);
    yPos += 7;
    
    doc.text(`Project Date: ${this.project.Project_Date ? this.formatDate(this.project.Project_Date) : "No date available"}`, 20, yPos);
    yPos += 12;

    // Content heading
    doc.setFontSize(14);
    doc.text('Project Description', 20, yPos);
    yPos += 7;

    // Description content - use consistent width
    const descriptionLines = wrapText(this.plainTextContent || 'No description available', pageWidth);
    doc.setFontSize(10);
    doc.text(descriptionLines, 20, yPos);
    
    // Check if we have selected updates to include
    const selectedUpdatesList = this.updates.filter((_, index) => this.selectedUpdates[index]);

    if (selectedUpdatesList.length > 0) {
      // Add each selected update on a new page
      for (let i = 0; i < selectedUpdatesList.length; i++) {
        // Always start a new page for each update
        doc.addPage();
        
        const update = selectedUpdatesList[i];
        
        // Find the corresponding plain text update
        const plainUpdate = this.plainTextUpdates.find(u => u.id === update.id);
        const updateContent = plainUpdate ? plainUpdate.plainContent : 'No update content available';
        
        // Reset Y position for the new page
        yPos = 20;

        // Update header
        doc.setFontSize(14);
        doc.text(`Project Update - ${update.update_date || "Unknown date"}`, 20, yPos);
        yPos += 12;

        // Update content with consistent width
        doc.setFontSize(10);
        const updateLines = wrapText(updateContent, pageWidth);
        doc.text(updateLines, 20, yPos);
      }
    }

    // Save PDF with project ID
    doc.save(`project-${this.project.ID}-details.pdf`);

  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Failed to generate PDF. Please try again.');
  }
    }

  }
};
</script>

<style>
/* Modal styles */
.modal {
  padding-right: 0 !important;
}

.modal-open {
  padding-right: 0 !important;
  overflow: hidden;
}

.modal-backdrop {
  opacity: 0.5 !important;
  background-color: #000 !important;
}

.modal-backdrop.show {
  opacity: 0.5 !important;
}

/* Card hover effect */
.hover-card {
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
}

.hover-card:hover {
  transform: translateY(-3px);
}

/* File card styles */
.card i.bi {
  opacity: 0.7;
}
</style>
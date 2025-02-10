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
      <button class="btn btn-success" @click="downloadPDF">
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
      <h2 class="h4 mb-3">Related Comments</h2>
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
              @click="closeModal"
            ></button>
          </div>
          <div class="modal-body">
            <div v-html="selectedUpdate.update_content"></div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">Close</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import jsPDF from 'jspdf';
import { Modal } from 'bootstrap';
import he from 'he';

export default {
  name: 'ProjectDetails',
  
  data() {
    return {
      project: {},
      updates: [],
      comments: [],
      newComment: '',
      selectedUpdate: {},
      modal: null
    };
  },

  async created() {
    await this.fetchProjectDetails();
    await this.fetchProjectUpdates();
    await this.fetchComments();
  },

  methods: {
    async fetchProjectDetails() {
      try {
        const projectId = this.$route.params.id || 1;
        const response = await fetch(`http://localhost:900/project-topics/1`);
        const data = await response.json();
        this.project = data.find(project => project.ID == projectId) || {};
      } catch (error) {
        console.error('Error fetching project details:', error);
      }
    },

    async fetchProjectUpdates() {
      if (!this.project.ID) return;
      try {
        const response = await fetch(`http://localhost:900/project-updates/${this.project.ID}`);
        this.updates = await response.json();
      } catch (error) {
        console.error('Error fetching project updates:', error);
      }
    },

    async fetchComments() {
      if (!this.project.ID) return;
      try {
        const response = await fetch(`http://localhost:900/project-comments/${this.project.ID}`);
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
      return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
    },

    decodeText(text) {
      return text ? he.decode(text) : 'No data available';
    },

    downloadPDF() {
      try {
        const doc = new jsPDF();
        
        // Configure PDF
        doc.setFont('helvetica');
        doc.setFontSize(16);
        
        // Add title
        const title = this.decodeText(this.project.Post_Title);
        doc.text('Project Details', 20, 20);
        
        // Add content
        doc.setFontSize(12);
        let yPosition = 40;
        
        // Helper function for text wrapping
        const addWrappedText = (text, y) => {
          const lines = doc.splitTextToSize(text, 170);
          doc.text(lines, 20, y);
          return lines.length * 7; // Return height taken by text
        };
        
        // Add project details
        doc.text('Title:', 20, yPosition);
        yPosition += 10;
        yPosition += addWrappedText(title, yPosition);
        
        yPosition += 10;
        doc.text(`Status: ${this.decodeText(this.project.Status_Name)}`, 20, yPosition);
        
        yPosition += 10;
        doc.text(`Priority: ${this.decodeText(this.project.Priority)}`, 20, yPosition);
        
        yPosition += 20;
        doc.text('Description:', 20, yPosition);
        yPosition += 10;
        addWrappedText(this.decodeText(this.project.Post_Content), yPosition);
        
        doc.save('project-details.pdf');
      } catch (error) {
        console.error('Error generating PDF:', error);
        alert('Failed to generate PDF. Please try again.');
      }
    },

    openUpdateModal(update) {
      this.selectedUpdate = update;
      
      // Remove any existing modal and backdrop
      if (this.modal) {
        this.modal.dispose();
      }
      
      const modalEl = document.getElementById('updateModal');
      
      // Remove any inline styles
      modalEl.style.removeProperty('padding-right');
      document.body.style.removeProperty('padding-right');
      
      // Initialize new modal with specific options
      this.modal = new Modal(modalEl, {
        backdrop: 'static',
        keyboard: false
      });
      
      // Show modal
      this.modal.show();
      
      // Remove unwanted styles after modal is shown
      modalEl.style.paddingRight = '0';
      document.body.style.paddingRight = '0';
    },

    closeModal() {
      if (this.modal) {
        this.modal.hide();
        
        // Clean up styles
        document.body.style.removeProperty('padding-right');
        document.body.classList.remove('modal-open');
        
        // Remove backdrop manually if it exists
        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) {
          backdrop.remove();
        }
      }
    },

    // Previous methods remain the same

    beforeUnmount() {
      this.closeModal();
    },

    async sendComment() {
    if (!this.$route.params.id || !this.newComment.trim()) {
      alert('Please enter a valid comment.');
      return;
    }
    console.log(this.$route.params.id)
    console.log(this.newComment.trim())
    try {
      const response = await fetch('http://localhost:900/project-comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          User_ID: 1, // Change to logged USer id
          Project_ID: parseInt(this.$route.params.id), // Taken from route params
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

      // Refresh the page to reflect the new comment
      window.location.reload();

    } catch (error) {
      console.error('Error posting comment:', error);
      alert('Failed to post comment. Please try again.');
    }
  }

  },
  
  
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

</style>
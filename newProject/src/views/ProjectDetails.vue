<template>
  <div class="container mt-5">
    <div class="text-center mb-4">
      <h1><strong>{{ project.Post_Title || "No title available" }}</strong></h1>
    </div>

    <div class="border p-3 mb-4">
      <p v-html="project.Post_Content || '<i>No content available</i>'"></p>
    </div>

    <div class="row mb-4">
      <div class="col-md-6">
        <div><strong>Status:</strong> {{ project.Status_Name || "No data" }}</div>
        <div><strong>Priority:</strong> {{ project.Priority || "No data" }}</div>
        <div><strong>Developer:</strong> {{ project.Developer_Organization || "No data" }}</div>
      </div>
      <div class="col-md-6">
        <div><strong>Project Number:</strong> {{ project.Project_Number || "No data" }}</div>
        <div><strong>Level of Importance:</strong> {{ project.Character_name || "No data" }}</div>
        <div><strong>Project Date:</strong> {{ project.Project_Date ? formatDate(project.Project_Date) : "No date available" }}</div>
      </div>
    </div>

    <div class="mb-4">
      <h4>Project Updates</h4>

      <div v-if="updates.length > 0" class="row">
        <div v-for="update in updates" :key="update.id" class="col-md-4 mb-3">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">Update on {{ update.update_date || "Unknown date" }}</h5>
              <p class="card-text" v-html="truncateText(update.update_content || 'No update content available')"></p>
            </div>
          </div>
        </div>
      </div>

      <div v-else>
        <p>No updates available for this project.</p>
      </div>
    </div>

    <div>
      <h4>Comments</h4>
      <textarea
        class="form-control mb-3"
        v-model="newComment"
        placeholder="Write your comment..."
        rows="4"
      ></textarea>
      <button class="btn btn-primary" @click="sendComment">Send Comment</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      project: {},
      updates: [],
      newComment: "",
    };
  },
  async created() {
    await this.fetchProjectDetails();
    this.fetchProjectUpdates();
  },
  methods: {
    async fetchProjectDetails() {
      try {
        const projectId = this.$route.params.id || 1;
        const response = await fetch("http://localhost:900/project-topics/1");
        const data = await response.json();

        const foundProject = data.find((project) => project.ID == projectId);

        if (foundProject) {
          this.project = foundProject;
          this.fetchProjectUpdates(); // Fetch updates after project ID is set
        } else {
          console.warn("Project not found.");
        }
      } catch (error) {
        console.error("Error fetching project details:", error);
      }
    },

    async fetchProjectUpdates() {
      if (!this.project.ID) {
        console.warn("Project ID not available yet, cannot fetch updates.");
        return;
      }

      try {
        const response = await fetch(`http://localhost:900/project-updates/${this.project.ID}`);
        const data = await response.json();
        this.updates = Array.isArray(data) ? data : [];
      } catch (error) {
        console.error("Error fetching project updates:", error);
      }
    },

    formatDate(date) {
      return new Date(date).toLocaleDateString("en-US");
    },

    truncateText(text, maxLength = 250) {
      return text && text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
    },

    async sendComment() {
      if (!this.project.ID) {
        alert("Cannot submit comment without a valid project ID.");
        return;
      }

      if (this.newComment.trim() === "") {
        alert("Please enter a comment before submitting.");
        return;
      }

      try {
        const response = await fetch(`http://localhost:900/projects/${this.project.ID}/comments`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ comment: this.newComment }),
        });

        if (response.ok) {
          this.newComment = "";
          alert("Comment sent successfully!");
        } else {
          alert("Failed to send comment.");
        }
      } catch (error) {
        console.error("Error sending comment:", error);
      }
    },
  },
};
</script>

<style scoped>
.card {
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card-body {
  background-color: #f9f9f9;
}

textarea.form-control {
  resize: none;
}

button.btn-primary {
  display: inline-flex;
  align-items: center;
}
</style>

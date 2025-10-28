console.log('🚀 GitHub Stargazer Viewer is loaded!');

// Create container for our Vue app
const appContainer = document.createElement('div');
appContainer.id = 'stargazer-viewer-app';
document.body.appendChild(appContainer);

// Now Vue is available globally (loaded before this script)
const { createApp } = Vue;

// Get repository info from current page
function getRepoInfo() {
  const path = window.location.pathname.split('/').filter(Boolean);
  return {
    owner: path[0],
    repo: path[1]
  };
}

// Create Vue app
createApp({
  data() {
    return {
      showModal: false,
      loading: false,
      error: null,
      users: [],
      modalTitle: '',
      repoInfo: getRepoInfo()
    };
  },
  methods: {
    async openModal(type) {
      this.showModal = true;
      this.modalTitle = type === 'stargazers' ? '⭐ Stargazers' : '🍴 Forks';
      this.loading = true;
      this.error = null;
      this.users = [];
      
      try {
        // Fetch stargazers from GitHub API
        const url = `https://api.github.com/repos/${this.repoInfo.owner}/${this.repoInfo.repo}/stargazers`;
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error('Failed to fetch stargazers');
        }
        
        const data = await response.json();
        this.users = data;
        this.loading = false;
      } catch (err) {
        this.error = err.message;
        this.loading = false;
      }
    },
    closeModal() {
      this.showModal = false;
    }
  },
  template: `
    <div>
      <button @click="openModal('stargazers')" class="stargazer-btn">
        ⭐ View Stargazers
      </button>
      
      <div v-if="showModal" class="modal-overlay" @click="closeModal">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h2>{{ modalTitle }}</h2>
            <button class="close-btn" @click="closeModal">×</button>
          </div>
          
          <div v-if="loading" class="loading">Loading...</div>
          <div v-else-if="error" class="error">{{ error }}</div>
          <div v-else class="users-list">
            <div v-for="user in users" :key="user.login" class="user-item">
              <img :src="user.avatar_url" :alt="user.login" class="avatar" />
              <a :href="user.html_url" target="_blank">{{ user.login }}</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
}).mount('#stargazer-viewer-app');

// Add styles
const style = document.createElement('style');
style.textContent = `
  .stargazer-btn {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: #238636;
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    z-index: 9999;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    transition: all 0.2s;
  }
  .stargazer-btn:hover {
    background: #2ea043;
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0,0,0,0.15);
  }
  
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999999;
    animation: fadeIn 0.2s;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  .modal-content {
    background: white;
    border-radius: 12px;
    max-width: 600px;
    width: 90%;
    max-height: 80vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
  }
  
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    border-bottom: 1px solid #e1e4e8;
  }
  
  .modal-header h2 {
    margin: 0;
    font-size: 20px;
    color: #24292f;
  }
  
  .close-btn {
    background: none;
    border: none;
    font-size: 32px;
    cursor: pointer;
    color: #656d76;
    line-height: 1;
    padding: 0;
    width: 32px;
    height: 32px;
  }
  .close-btn:hover {
    color: #24292f;
  }
  
  .users-list {
    padding: 20px;
    overflow-y: auto;
  }
  
  .user-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 0;
    border-bottom: 1px solid #f1f3f5;
    transition: background 0.15s;
  }
  .user-item:hover {
    background: #f6f8fa;
    margin: 0 -20px;
    padding-left: 20px;
    padding-right: 20px;
  }
  .user-item:last-child {
    border-bottom: none;
  }
  
  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
  
  .user-item a {
    color: #0969da;
    text-decoration: none;
    font-size: 15px;
  }
  .user-item a:hover {
    text-decoration: underline;
  }
  
  .loading, .error {
    padding: 40px;
    text-align: center;
    color: #656d76;
  }
  
  .error {
    color: #d1242f;
  }
`;
document.head.appendChild(style);

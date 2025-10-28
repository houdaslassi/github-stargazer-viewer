console.log('🚀 GitHub Stargazer Viewer is loaded!');

// Check if Vue is loaded
if (typeof Vue === 'undefined') {
  console.error('❌ Vue is not loaded! Check manifest.json');
  throw new Error('Vue not found');
}

console.log('✅ Vue is loaded');

// Create container for our Vue app
const appContainer = document.createElement('div');
appContainer.id = 'stargazer-viewer-app';
document.body.appendChild(appContainer);

// Get repository info from current page
function getRepoInfo() {
  const path = window.location.pathname.split('/').filter(Boolean);
  return {
    owner: path[0],
    repo: path[1]
  };
}

// Create Vue app with render function (avoids template compiler issues)
const { createApp, h } = Vue;

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
  render() {
    return h('div', [
      // Button
      h('button', {
        class: 'stargazer-btn',
        onClick: () => this.openModal('stargazers')
      }, '⭐ View Stargazers'),
      
      // Modal
      this.showModal ? h('div', {
        class: 'modal-overlay',
        onClick: () => this.closeModal()
      }, [
        h('div', {
          class: 'modal-content',
          onClick: (e) => e.stopPropagation()
        }, [
          // Header
          h('div', { class: 'modal-header' }, [
            h('h2', this.modalTitle),
            h('button', { class: 'close-btn', onClick: () => this.closeModal() }, '×')
          ]),
          
          // Content
          this.loading ? h('div', { class: 'loading' }, 'Loading...') :
          this.error ? h('div', { class: 'error' }, this.error) :
          h('div', { class: 'users-list' }, this.users.map(user => 
            h('div', { key: user.login, class: 'user-item' }, [
              h('img', { src: user.avatar_url, alt: user.login, class: 'avatar' }),
              h('a', { href: user.html_url, target: '_blank' }, user.login)
            ])
          ))
        ])
      ]) : null
    ]);
  }
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

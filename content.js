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
      activeTab: 'stargazers', // Current tab: stargazers, forks, watchers
      loading: false,
      error: null,
      users: [],
      modalTitle: '',
      totalCount: null,
      repoInfo: getRepoInfo(),
      nextPageUrl: null,
      loadingMore: false,
      repoData: null // Store repo info (has all counts)
    };
  },
  methods: {
    async openModal() {
      this.showModal = true;
      this.activeTab = 'stargazers'; // Default to stargazers
      await this.fetchRepoData(); // Get all repo info once
      await this.loadTab('stargazers'); // Load default tab
    },
    async fetchRepoData() {
      // Fetch repo info once to get all counts
      try {
        const repoUrl = `https://api.github.com/repos/${this.repoInfo.owner}/${this.repoInfo.repo}`;
        const repoResponse = await fetch(repoUrl);
        if (repoResponse.ok) {
          this.repoData = await repoResponse.json();
        }
      } catch (err) {
        console.error('Failed to fetch repo data:', err);
      }
    },
    async loadTab(tab) {
      this.activeTab = tab;
      this.loading = true;
      this.error = null;
      this.users = [];
      this.nextPageUrl = null;
      
      // Set title and count based on tab
      const tabConfig = {
        stargazers: { title: '⭐ Stargazers', count: this.repoData?.stargazers_count },
        forks: { title: '🍴 Forks', count: this.repoData?.forks_count },
        watchers: { title: '👀 Watchers', count: this.repoData?.watchers_count }
      };
      
      const config = tabConfig[tab];
      this.modalTitle = config.title;
      this.totalCount = config.count;
      
      try {
        const endpoints = {
          stargazers: 'stargazers',
          forks: 'forks',
          watchers: 'subscribers' // Watchers endpoint
        };
        
        const endpoint = endpoints[tab];
        const url = `https://api.github.com/repos/${this.repoInfo.owner}/${this.repoInfo.repo}/${endpoint}`;
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch ${tab}`);
        }
        
        // Check for pagination in Link header
        const linkHeader = response.headers.get('Link');
        if (linkHeader) {
          const match = linkHeader.match(/<([^>]+)>; rel="next"/);
          if (match) {
            this.nextPageUrl = match[1];
          }
        }
        
        const data = await response.json();
        // Forks API returns repos with owner, stargazers/watchers return users
        if (tab === 'forks') {
          this.users = data.map(fork => fork.owner);
        } else {
          this.users = data;
        }
        this.loading = false;
      } catch (err) {
        this.error = err.message;
        this.loading = false;
      }
    },
    async loadMore() {
      if (!this.nextPageUrl || this.loadingMore) return;
      
      this.loadingMore = true;
      
      try {
        const response = await fetch(this.nextPageUrl);
        
        if (!response.ok) {
          throw new Error('Failed to load more');
        }
        
        // Check for next page
        const linkHeader = response.headers.get('Link');
        if (linkHeader) {
          const match = linkHeader.match(/<([^>]+)>; rel="next"/);
          this.nextPageUrl = match ? match[1] : null;
        } else {
          this.nextPageUrl = null;
        }
        
        const data = await response.json();
        // Handle forks data structure
        if (this.activeTab === 'forks') {
          this.users.push(...data.map(fork => fork.owner));
        } else {
          this.users.push(...data);
        }
        this.loadingMore = false;
      } catch (err) {
        this.error = err.message;
        this.loadingMore = false;
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
        onClick: () => this.openModal()
      }, '⭐ View Repo Insights'),
      
      // Modal
      this.showModal ? h('div', {
        class: 'modal-overlay',
        onClick: () => this.closeModal()
      }, [
        h('div', {
          class: 'modal-content',
          onClick: (e) => e.stopPropagation()
        }, [
          // Header with Tabs
          h('div', { class: 'modal-header' }, [
            h('div', { class: 'header-content' }, [
              // Tabs
              h('div', { class: 'tabs' }, [
                h('button', {
                  class: `tab ${this.activeTab === 'stargazers' ? 'active' : ''}`,
                  onClick: () => this.loadTab('stargazers')
                }, '⭐ Stargazers'),
                h('button', {
                  class: `tab ${this.activeTab === 'forks' ? 'active' : ''}`,
                  onClick: () => this.loadTab('forks')
                }, '🍴 Forks'),
                h('button', {
                  class: `tab ${this.activeTab === 'watchers' ? 'active' : ''}`,
                  onClick: () => this.loadTab('watchers')
                }, '👀 Watchers')
              ]),
              // Count
              this.totalCount !== null ? h('div', { class: 'count-badge' }, 
                `${this.totalCount.toLocaleString()} ${this.activeTab === 'stargazers' ? 'stargazers' : this.activeTab === 'forks' ? 'forks' : 'watchers'}`
              ) : null
            ]),
            h('button', { class: 'close-btn', onClick: () => this.closeModal() }, '×')
          ]),
          
          // Content - Scrollable area
          this.loading ? h('div', { class: 'loading' }, 'Loading...') :
          this.error ? h('div', { class: 'error' }, this.error) :
          h('div', { class: 'modal-body' }, [
            h('div', { class: 'users-list' }, this.users.map(user => 
              h('div', { key: user.login, class: 'user-item' }, [
                h('img', { src: user.avatar_url, alt: user.login, class: 'avatar' }),
                h('a', { href: user.html_url, target: '_blank' }, user.login)
              ])
            ))
          ]),
          
          // Footer - Load More button (always visible)
          !this.loading && !this.error ? h('div', { class: 'modal-footer' }, [
            this.loadingMore ? h('div', { class: 'loading', style: 'padding: 10px; font-size: 14px;' }, 'Loading more...') :
            this.nextPageUrl ? h('button', {
              class: 'load-more-btn',
              onClick: () => this.loadMore()
            }, 'Load More') : null
          ]) : null
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
  
  .header-content {
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: 100%;
  }
  
  .tabs {
    display: flex;
    gap: 8px;
    border-bottom: 2px solid #e1e4e8;
    margin-bottom: 4px;
  }
  
  .tab {
    background: none;
    border: none;
    padding: 12px 16px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    color: #656d76;
    border-bottom: 2px solid transparent;
    margin-bottom: -2px;
    transition: all 0.2s;
  }
  
  .tab:hover {
    color: #24292f;
    background: #f6f8fa;
  }
  
  .tab.active {
    color: #0969da;
    border-bottom-color: #0969da;
    font-weight: 600;
  }
  
  .count-badge {
    font-size: 14px;
    color: #656d76;
    font-weight: 400;
    margin-top: 4px;
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
  
  .modal-body {
    max-height: calc(80vh - 70px);
    overflow-y: auto;
  }
  
  .modal-footer {
    padding: 0 20px 20px;
    text-align: center;
  }
  
  .users-list {
    padding: 20px;
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
  
  .load-more-btn {
    padding: 10px 24px;
    background: #f6f8fa;
    border: 1px solid #d0d7de;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    color: #24292f;
    transition: all 0.2s;
  }
  .load-more-btn:hover {
    background: #f3f4f6;
    border-color: #0969da;
  }
`;
document.head.appendChild(style);

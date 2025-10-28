console.log('🚀 GitHub Stargazer Viewer is loaded!');

// Let's add a simple button to see it working
const button = document.createElement('button');
button.textContent = '⭐ View Stargazers';
button.style.cssText = `
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
`;

button.addEventListener('click', () => {
  alert('Button clicked! Now we need to add Vue.js to make this work properly.');
});

document.body.appendChild(button);


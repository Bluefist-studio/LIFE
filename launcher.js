// Launcher - Simple app selector

const AppLauncher = {
  apps: {
    activlog: {
      name: 'ACTIVLOG',
      desc: 'Activity Tracking',
      url: 'ActivLog.html',
      icon: ''
    },
    budget: {
      name: 'BUDGET UI',
      desc: 'Finance Management',
      url: 'budget.html',
      icon: ''
    }
  },

  launch(appName) {
    const app = this.apps[appName];
    if (!app) return;
    localStorage.setItem('selectedApp', appName);
    window.location.href = app.url;
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('app-selector');
  if (!container) return;

  container.innerHTML = Object.entries(AppLauncher.apps)
    .map(([key, app]) => `
      <button onclick="AppLauncher.launch('${key}')" 
              style="padding: 24px; background: rgba(76, 255, 106, 0.1); border: 2px solid #4cff6a; color: #8cff9a; cursor: pointer; font-family: VT323, monospace; font-size: 22px; text-shadow: 0 0 5px #4cff6a; transition: all 0.3s; border-radius: 4px;">
        <div style="font-weight: bold; font-size: 36px;">${app.name}</div>
        <div style="font-size: 18px; opacity: 0.85;">${app.desc}</div>
      </button>
    `).join('');
});



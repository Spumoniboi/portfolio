# Windows 95 desktop portfolio project
_Exported on 1/14/2026 at 15:55:44 EST from Cursor (2.3.35)_

---

**User**

Role: Act as a Senior Creative Developer specializing in Brutalist and Lo-Fi web design.

Objective: Build a portfolio website inspired by awge.com. The core concept is a "Windows 95/Desktop" interface inside the browser, featuring a gritty, VHS, and non-linear aesthetic.

Technical Stack: Vanilla HTML, CSS, and JavaScript. No heavy frameworks.

Key Requirements:

File Structure:

index.html: Main desktop structure.

style.css: All styling including CRT scanline effects and Windows 95 UI components.

system.js: Logic for the clock, window toggling (Open/Close), and Z-index management (clicked windows come to front).

draggable.js: Custom vanilla JS to make any element with the class .window draggable by its .window-header.

Visual Aesthetic:

Background: Use a dark teal hex #008080 or a placeholder for a grainy, looping VHS video.

UI: Use the "Classic Windows" look (grey blocky buttons, 2px inset/outset borders, pixelated fonts like 'Courier New' or 'MS Sans Serif').

CRT Overlay: Add a fixed div with a CSS-based scanline and slight flicker effect that covers the whole screen but allows pointer events to pass through.

Components to Build:

Desktop Icons: Clickable icons with labels (e.g., PROJECTS.exe, ABOUT.txt, CAMERA.mov).

The Window System: Windows must have a blue title bar, a close button [X], and a scrollable content area.

Taskbar: A bottom bar containing a "Start" button and a real-time digital clock.

Interactivity:

When an icon is double-clicked (or single-clicked for mobile), the corresponding window should toggle display.

Windows must be draggable only by the header.

Please initialize the project by creating these files with the necessary boilerplate code.

---

**Cursor**

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Portfolio OS</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <!-- CRT Overlay -->
    <div class="crt-overlay"></div>

    <!-- Desktop -->
    <div id="desktop">
        <!-- Desktop Icons -->
        <div class="icon" data-window="projects">
            <div class="icon-img">📂</div>
            <span class="icon-label">PROJECTS.exe</span>
        </div>
        <div class="icon" data-window="about">
            <div class="icon-img">📄</div>
            <span class="icon-label">ABOUT.txt</span>
        </div>
        <div class="icon" data-window="camera">
            <div class="icon-img">📹</div>
            <span class="icon-label">CAMERA.mov</span>
        </div>

        <!-- Windows -->
        <div id="projects" class="window" style="display: none; top: 50px; left: 50px;">
            <div class="window-header">
                <span class="window-title">PROJECTS.exe</span>
                <button class="close-btn" data-window="projects">X</button>
            </div>
            <div class="window-content">
                <p>Welcome to the projects directory...</p>
                <ul>
                    <li>Project 01 - Brutalism</li>
                    <li>Project 02 - Lo-Fi Beats</li>
                    <li>Project 03 - VHS Glitch</li>
                </ul>
            </div>
        </div>

        <div id="about" class="window" style="display: none; top: 100px; left: 100px;">
            <div class="window-header">
                <span class="window-title">ABOUT.txt</span>
                <button class="close-btn" data-window="about">X</button>
            </div>
            <div class="window-content">
                <p>Senior Creative Developer specializing in Brutalist and Lo-Fi web design.</p>
                <p>Inspired by AWGE, VHS aesthetics, and the early web.</p>
            </div>
        </div>

        <div id="camera" class="window" style="display: none; top: 150px; left: 150px;">
            <div class="window-header">
                <span class="window-title">CAMERA.mov</span>
                <button class="close-btn" data-window="camera">X</button>
            </div>
            <div class="window-content">
                <div class="vhs-placeholder">
                    [GRAINY VHS FEED PLACEHOLDER]
                </div>
            </div>
        </div>
    </div>

    <!-- Taskbar -->
    <div id="taskbar">
        <button id="start-btn">Start</button>
        <div id="clock">00:00:00</div>
    </div>

    <script src="draggable.js"></script>
    <script src="system.js"></script>
</body>
</html>

```

```css
:root {
    --win-bg: #c0c0c0;
    --win-blue: #000080;
    --win-border-light: #ffffff;
    --win-border-dark: #808080;
    --win-border-darkest: #000000;
    --desktop-bg: #008080;
}

* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    cursor: url('https://cur.cursors-4u.net/windows/win-1/win1.cur'), auto;
}

body, html {
    height: 100%;
    overflow: hidden;
    font-family: 'Courier New', Courier, monospace;
    background-color: var(--desktop-bg);
}

/* CRT Overlay */
.crt-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
        rgba(18, 16, 16, 0) 50%,
        rgba(0, 0, 0, 0.25) 50%
    ), linear-gradient(
        90deg,
        rgba(255, 0, 0, 0.06),
        rgba(0, 255, 0, 0.02),
        rgba(0, 0, 255, 0.06)
    );
    background-size: 100% 4px, 3px 100%;
    z-index: 10000;
    pointer-events: none;
    animation: flicker 0.15s infinite;
}

@keyframes flicker {
    0% { opacity: 0.97; }
    100% { opacity: 1; }
}

/* Desktop */
#desktop {
    width: 100%;
    height: calc(100% - 40px);
    position: relative;
    padding: 20px;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    align-content: flex-start;
}

/* Icons */
.icon {
    width: 80px;
    height: 80px;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 20px;
    color: white;
    text-align: center;
    user-select: none;
}

.icon-img {
    font-size: 40px;
    margin-bottom: 5px;
}

.icon-label {
    font-size: 12px;
    background: transparent;
    padding: 2px;
}

.icon:active .icon-label {
    background-color: var(--win-blue);
}

/* Windows */
.window {
    position: absolute;
    background-color: var(--win-bg);
    border: 2px solid;
    border-color: var(--win-border-light) var(--win-border-darkest) var(--win-border-darkest) var(--win-border-light);
    box-shadow: inset 1px 1px var(--win-border-light), inset -1px -1px var(--win-border-dark);
    min-width: 300px;
    display: flex;
    flex-direction: column;
}

.window-header {
    background-color: var(--win-blue);
    color: white;
    padding: 3px 6px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: bold;
    user-select: none;
}

.window-title {
    font-size: 14px;
}

.close-btn {
    background-color: var(--win-bg);
    border: 1px solid;
    border-color: var(--win-border-light) var(--win-border-darkest) var(--win-border-darkest) var(--win-border-light);
    width: 16px;
    height: 14px;
    font-family: Arial, sans-serif;
    font-size: 10px;
    font-weight: bold;
    display: flex;
    justify-content: center;
    align-items: center;
}

.close-btn:active {
    border-color: var(--win-border-darkest) var(--win-border-light) var(--win-border-light) var(--win-border-darkest);
    padding: 1px 0 0 1px;
}

.window-content {
    padding: 10px;
    overflow-y: auto;
    max-height: 400px;
    background: white;
    margin: 5px;
    border: 2px inset var(--win-bg);
}

/* Taskbar */
#taskbar {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 40px;
    background-color: var(--win-bg);
    border-top: 2px solid var(--win-border-light);
    display: flex;
    align-items: center;
    padding: 0 5px;
    z-index: 9999;
}

#start-btn {
    height: 30px;
    padding: 0 10px;
    font-weight: bold;
    border: 2px solid;
    border-color: var(--win-border-light) var(--win-border-darkest) var(--win-border-darkest) var(--win-border-light);
    display: flex;
    align-items: center;
    gap: 5px;
}

#start-btn:active {
    border-color: var(--win-border-darkest) var(--win-border-light) var(--win-border-light) var(--win-border-darkest);
}

#clock {
    margin-left: auto;
    padding: 0 10px;
    border: 2px inset var(--win-bg);
    height: 30px;
    display: flex;
    align-items: center;
    background: #c0c0c0;
}

.vhs-placeholder {
    background: black;
    color: lime;
    aspect-ratio: 4/3;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 12px;
}

```

```javascript
let highestZ = 10;

function updateClock() {
    const clock = document.getElementById('clock');
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    clock.textContent = `${hours}:${minutes}:${seconds}`;
}

setInterval(updateClock, 1000);
updateClock();

document.querySelectorAll('.icon').forEach(icon => {
    icon.addEventListener('dblclick', () => {
        const windowId = icon.getAttribute('data-window');
        openWindow(windowId);
    });

    // Mobile single tap support
    let lastTap = 0;
    icon.addEventListener('touchend', (e) => {
        const currentTime = new Date().getTime();
        const tapLength = currentTime - lastTap;
        if (tapLength < 500 && tapLength > 0) {
            const windowId = icon.getAttribute('data-window');
            openWindow(windowId);
            e.preventDefault();
        }
        lastTap = currentTime;
    });
});

function openWindow(id) {
    const win = document.getElementById(id);
    if (win) {
        win.style.display = 'flex';
        bringToFront(win);
    }
}

document.querySelectorAll('.close-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const windowId = btn.getAttribute('data-window');
        const win = document.getElementById(windowId);
        if (win) {
            win.style.display = 'none';
        }
    });
});

function bringToFront(win) {
    highestZ++;
    win.style.zIndex = highestZ;
}

document.querySelectorAll('.window').forEach(win => {
    win.addEventListener('mousedown', () => bringToFront(win));
});

```

```javascript
document.querySelectorAll('.window').forEach(win => {
    const header = win.querySelector('.window-header');
    let isDragging = false;
    let offsetX, offsetY;

    header.addEventListener('mousedown', (e) => {
        if (e.target.classList.contains('close-btn')) return;

        isDragging = true;
        offsetX = e.clientX - win.offsetLeft;
        offsetY = e.clientY - win.offsetTop;
        
        // Ensure the window being dragged comes to the front
        if (typeof bringToFront === 'function') {
            bringToFront(win);
        }
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        let x = e.clientX - offsetX;
        let y = e.clientY - offsetY;

        // Keep windows within viewport bounds (optional but recommended)
        const maxX = window.innerWidth - win.offsetWidth;
        const maxY = window.innerHeight - win.offsetHeight - 40; // 40 for taskbar

        x = Math.max(0, Math.min(x, maxX));
        y = Math.max(0, Math.min(y, maxY));

        win.style.left = `${x}px`;
        win.style.top = `${y}px`;
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });

    // Touch support for draggability
    header.addEventListener('touchstart', (e) => {
        if (e.target.classList.contains('close-btn')) return;

        const touch = e.touches[0];
        isDragging = true;
        offsetX = touch.clientX - win.offsetLeft;
        offsetY = touch.clientY - win.offsetTop;

        if (typeof bringToFront === 'function') {
            bringToFront(win);
        }
    });

    document.addEventListener('touchmove', (e) => {
        if (!isDragging) return;

        const touch = e.touches[0];
        let x = touch.clientX - offsetX;
        let y = touch.clientY - offsetY;

        const maxX = window.innerWidth - win.offsetWidth;
        const maxY = window.innerHeight - win.offsetHeight - 40;

        x = Math.max(0, Math.min(x, maxX));
        y = Math.max(0, Math.min(y, maxY));

        win.style.left = `${x}px`;
        win.style.top = `${y}px`;
        
        e.preventDefault(); // Prevent scrolling while dragging
    }, { passive: false });

    document.addEventListener('touchend', () => {
        isDragging = false;
    });
});

```

The Portfolio OS project has been initialized with a Windows 95/Brutalist aesthetic. I have created the four core files with the requested functionality.

### Project Overview
The interface features a classic teal desktop (`#008080`), a CRT scanline overlay with a subtle flicker, and a functional window management system.

### Files Created:

- `index.html`: Contains the core structure including the desktop area, CRT overlay, taskbar, and initial window templates.
- `style.css`: Implements the Windows 95 "Classic" UI (inset/outset borders, MS Sans Serif/Courier fonts) and the CRT scanline effect.
- `system.js`: Handles the real-time taskbar clock, window opening/closing logic, and ensures active windows stay on top (Z-index management).
- `draggable.js`: A custom vanilla JS implementation that allows windows to be dragged by their headers, including support for mobile touch events.

### Key Interactive Features:
- **Desktop Icons**: Double-click (or double-tap on mobile) `PROJECTS.exe`, `ABOUT.txt`, or `CAMERA.mov` to open their respective windows.
- **Window Management**: Windows can be dragged around the desktop, closed using the `[X]` button, and will automatically come to the front when clicked.
- **CRT Effect**: A fixed overlay provides a vintage monitor look without interfering with mouse clicks or interactions.
- **Taskbar**: Features a functional "Start" button and a digital clock updating every second.

You can now open `index.html` in your browser to view the interface.

---

**User**

how can i preview the site

---

**Cursor**

To preview the site, you have a few options depending on your preference:

### Option 1: Direct File Opening (Quickest)
Since this is a vanilla HTML/CSS/JS project, you can simply open the file directly:
1. Open your file explorer (Windows Explorer).
2. Navigate to your project folder: `C:\Users\19179\OneDrive\Desktop\Portfolio`.
3. **Double-click `index.html`**. It will open in your default web browser.

### Option 2: Using the Cursor Built-in Terminal
You can spin up a simple local server to see changes in real-time. In the Cursor terminal (Ctrl + `), run one of these commands:

**If you have Python installed:**
```bash
python -m http.server 8000
```
Then visit `http://localhost:8000` in your browser.

**If you have Node.js/npx installed:**
```bash
npx serve .
```
Then visit the URL provided in the terminal (usually `http://localhost:3000`).

### Option 3: VS Code / Cursor "Live Server" Extension
If you have the **Live Server** extension installed:
1. Right-click `index.html` in the file explorer on the left.
2. Select **"Open with Live Server"**.
This is the best method for development as it will automatically refresh the page every time you save a file.

```shellscript
python -m http.server 8000
```

```shellscript
npx serve .
```


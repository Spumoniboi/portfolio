document.querySelectorAll('.window').forEach(win => {
    const header = win.querySelector('.window-header');
    
    // Add resizer handle
    const resizer = document.createElement('div');
    resizer.className = 'resizer';
    win.appendChild(resizer);

    let isDragging = false;
    let isResizing = false;
    let offsetX, offsetY;
    let startWidth, startHeight, startX, startY;

    // DRAG LOGIC
    header.addEventListener('mousedown', (e) => {
        if (e.target.classList.contains('close-btn') || e.target.classList.contains('maximize-btn') || win.classList.contains('maximized')) return;

        isDragging = true;
        offsetX = e.clientX - win.offsetLeft;
        offsetY = e.clientY - win.offsetTop;
        
        if (typeof bringToFront === 'function') {
            bringToFront(win);
        }
    });

    // RESIZE LOGIC
    resizer.addEventListener('mousedown', (e) => {
        if (win.classList.contains('maximized')) return;
        e.preventDefault();
        isResizing = true;
        startWidth = win.offsetWidth;
        startHeight = win.offsetHeight;
        startX = e.clientX;
        startY = e.clientY;

        if (typeof bringToFront === 'function') {
            bringToFront(win);
        }
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            let x = e.clientX - offsetX;
            let y = e.clientY - offsetY;

            const maxX = window.innerWidth - win.offsetWidth;
            const maxY = window.innerHeight - win.offsetHeight - 40;

            x = Math.max(0, Math.min(x, maxX));
            y = Math.max(0, Math.min(y, maxY));

            win.style.left = `${x}px`;
            win.style.top = `${y}px`;
        }

        if (isResizing) {
            const width = startWidth + (e.clientX - startX);
            const height = startHeight + (e.clientY - startY);

            // Minimum constraints are handled by CSS min-width/min-height
            win.style.width = `${width}px`;
            win.style.height = `${height}px`;
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        isResizing = false;
    });

    // TOUCH SUPPORT
    header.addEventListener('touchstart', (e) => {
        if (e.target.classList.contains('close-btn') || e.target.classList.contains('maximize-btn') || win.classList.contains('maximized')) return;
        const touch = e.touches[0];
        isDragging = true;
        offsetX = touch.clientX - win.offsetLeft;
        offsetY = touch.clientY - win.offsetTop;
        if (typeof bringToFront === 'function') bringToFront(win);
    });

    resizer.addEventListener('touchstart', (e) => {
        if (win.classList.contains('maximized')) return;
        const touch = e.touches[0];
        isResizing = true;
        startWidth = win.offsetWidth;
        startHeight = win.offsetHeight;
        startX = touch.clientX;
        startY = touch.clientY;
        if (typeof bringToFront === 'function') bringToFront(win);
        e.preventDefault();
    });

    document.addEventListener('touchmove', (e) => {
        if (!isDragging && !isResizing) return;
        const touch = e.touches[0];

        if (isDragging) {
            let x = touch.clientX - offsetX;
            let y = touch.clientY - offsetY;
            const maxX = window.innerWidth - win.offsetWidth;
            const maxY = window.innerHeight - win.offsetHeight - 40;
            x = Math.max(0, Math.min(x, maxX));
            y = Math.max(0, Math.min(y, maxY));
            win.style.left = `${x}px`;
            win.style.top = `${y}px`;
        }

        if (isResizing) {
            const width = startWidth + (touch.clientX - startX);
            const height = startHeight + (touch.clientY - startY);
            win.style.width = `${width}px`;
            win.style.height = `${height}px`;
        }
        
        e.preventDefault();
    }, { passive: false });

    document.addEventListener('touchend', () => {
        isDragging = false;
        isResizing = false;
    });
});

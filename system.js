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

// Initial Z-index setup for open windows
document.querySelectorAll('.window').forEach((win, index) => {
    win.style.zIndex = highestZ + index;
    highestZ += index;
});

// Resume download logic
document.getElementById('resume-icon').addEventListener('dblclick', () => {
    downloadResume();
});

// Mobile single tap for resume
let lastResumeTap = 0;
document.getElementById('resume-icon').addEventListener('touchend', (e) => {
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastResumeTap;
    if (tapLength < 500 && tapLength > 0) {
        downloadResume();
        e.preventDefault();
    }
    lastResumeTap = currentTime;
});

function downloadResume() {
    const link = document.createElement('a');
    link.href = 'SimonJ-EXT-resume.pdf'; // Path to your PDF file
    link.download = 'SimonJ-EXT-resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

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
        
        // Trigger game start if it's the brick window
        if (id === 'brick-breaker' && typeof startGame === 'function') {
            startGame();
        }
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

document.querySelectorAll('.maximize-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const windowId = btn.getAttribute('data-window');
        const win = document.getElementById(windowId);
        if (win) {
            toggleMaximize(win);
        }
    });
});

function toggleMaximize(win) {
    if (win.classList.contains('maximized')) {
        win.classList.remove('maximized');
        win.style.top = win.dataset.oldTop;
        win.style.left = win.dataset.oldLeft;
        win.style.width = win.dataset.oldWidth;
        win.style.height = win.dataset.oldHeight;
    } else {
        win.dataset.oldTop = win.style.top;
        win.dataset.oldLeft = win.style.left;
        win.dataset.oldWidth = win.style.width;
        win.dataset.oldHeight = win.style.height;
        win.classList.add('maximized');
    }
}

function bringToFront(win) {
    highestZ++;
    win.style.zIndex = highestZ;
}

document.querySelectorAll('.window').forEach(win => {
    win.addEventListener('mousedown', () => bringToFront(win));
});

/* Case Study Tabs Controller */
const caseContent = {
    przm: {
        netflix: {
            brief: "Built and scaled PRZM community programs and creator outreach. Focused on repeatable formats and onboarding that turned attention into members.",
            approach: "Set up outreach systems, tracked creators, and built a steady cadence of community-driven content. Made it easy to contribute and easy to share.",
            impact: "Grew community from 500 to 2,000 members. Built a trusted creator network that sped up content production and improved campaign output."
        },
        second: {
            brief: "Brief for the second project goes here. Explaining the core goals and the starting point of the initiative.",
            approach: "Approach for the second project. Detailing the steps taken, the strategy used, and how it was implemented.",
            impact: "Impact for the second project. Showing the results, the growth, and the overall success metrics."
        },
        third: {
            brief: "Brief for the third project goes here. This section uses a single 16x9 widescreen player.",
            approach: "Approach for the third project. Detailing the steps taken and the strategy used for this single-media layout.",
            impact: "Impact for the third project. Success metrics and growth demonstrated through a single high-impact visual."
        }
    },
    hoek: {
        one: {
            brief: "HOEK Project One brief. Focusing on sustainable furniture design and digital-first brand expansion.",
            approach: "Implemented a content-first strategy, producing high-quality video demonstrations of product ease-of-use.",
            impact: "Saw a 40% increase in conversion rate and a significant boost in social media engagement."
        },
        two: {
            brief: "HOEK Project Two brief. Exploring modular living solutions for modern urban environments.",
            approach: "Developed a series of educational videos highlighting the versatility and sustainability of the products.",
            impact: "Expanded brand reach to three new major urban markets with high demand for modular solutions."
        },
        three: {
            brief: "HOEK Project Three brief. A visual deep-dive into the manufacturing process and craftsmanship.",
            approach: "Used side-by-side visual comparisons to showcase material quality and assembly speed.",
            impact: "Reduced customer support inquiries by 30% through better visual documentation."
        },
        four: {
            body: "A comprehensive look at HOEK's visual identity across multiple formats, from social grids to large-scale physical installations."
        }
    },
    choice: {
        one: {
            brief: "CHOICE Project One brief. Building a digital ecosystem for community-driven initiatives.",
            approach: "Developed a comprehensive social strategy and identity system that prioritized clarity and participation.",
            impact: "Successfully launched the platform to a core audience of 5,000 members with high retention rates."
        },
        two: {
            brief: "CHOICE Project Two brief. Streamlining cross-platform communication for distributed teams.",
            approach: "Designed a centralized hub for community engagement and content distribution across multiple channels.",
            impact: "Reduced communication friction by 50% and increased member contribution by 20%."
        }
    },
    heatonist: {
        one: {
            brief: "HEATONIST Project One brief. Creating a community around hot sauce culture and discovery.",
            approach: "Developed a series of recurring content formats that highlight flavor profiles and culinary pairings.",
            impact: "Generated millions of monthly impressions and built a loyal, engaged community of hot sauce enthusiasts."
        },
        two: {
            brief: "HEATONIST Project Two brief. Scaling digital presence through creator collaborations.",
            approach: "Partnered with niche food creators to showcase products in authentic, high-impact cooking formats.",
            impact: "Drove significant traffic increases and strengthened brand authority within the food and beverage space."
        },
        three: {
            brief: "HEATONIST Project Three brief. Streamlining social-to-subscription funnels for recurring growth.",
            approach: "Optimized on-platform conversion points to turn casual viewers into long-term subscribers.",
            impact: "Achieved a measurable lift in subscription growth and reduced overall customer acquisition costs."
        }
    }
};

function initCaseTabs() {
    const tabs = document.querySelectorAll('[data-tab]');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const projectEl = tab.closest('.case-project');
            const caseId = projectEl.getAttribute('data-case');
            const projectId = projectEl.getAttribute('data-project');
            const tabName = tab.getAttribute('data-tab');
            setCaseTab(caseId, projectId, tabName, projectEl);
        });
    });
}

function setCaseTab(caseId, projectId, tabName, projectEl) {
    // Update active class on buttons within THIS project section
    projectEl.querySelectorAll('[data-tab]').forEach(tab => {
        tab.classList.toggle('is-active', tab.getAttribute('data-tab') === tabName);
    });
    
    // Update active class on media containers and play/pause videos within THIS project section
    projectEl.querySelectorAll('[data-media]').forEach(card => {
        const isActive = card.getAttribute('data-media') === tabName;
        card.classList.toggle('is-active', isActive);
        
        const video = card.querySelector('video');
        if (video) {
            if (isActive) {
                video.play().catch(() => {});
            } else {
                video.pause();
            }
        }
    });
    
    // Swap text within THIS project section
    const copyEl = projectEl.querySelector('.case-copy');
    if (copyEl && caseContent[caseId] && caseContent[caseId][projectId]) {
        copyEl.textContent = caseContent[caseId][projectId][tabName] || caseContent[caseId][projectId].body || "";
    }
}

// Initial tab setup
document.addEventListener('DOMContentLoaded', () => {
    initCaseTabs();
});

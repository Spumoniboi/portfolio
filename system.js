let highestZ = 10;

// Coarse-pointer (touch) devices get single-tap; mice/trackpads keep dblclick.
const isCoarsePointer = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;

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

document.querySelectorAll('.window').forEach((win, index) => {
    win.style.zIndex = highestZ + index;
});
highestZ += document.querySelectorAll('.window').length;

// Resume download logic
const resumeIcon = document.getElementById('resume-icon');
if (resumeIcon) {
    const resumeHandler = (e) => {
        if (e) e.preventDefault();
        downloadResume();
    };
    if (isCoarsePointer) {
        resumeIcon.addEventListener('click', resumeHandler);
    } else {
        resumeIcon.addEventListener('dblclick', resumeHandler);
    }
}

function downloadResume() {
    const link = document.createElement('a');
    link.href = 'SimonJ-EXT-resume.pdf';
    link.download = 'SimonJ-EXT-resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Desktop icon open behavior — single-tap on touch, double-click on pointer
document.querySelectorAll('.icon').forEach(icon => {
    if (icon.id === 'resume-icon') return; // handled above

    const openHandler = (e) => {
        const windowId = icon.getAttribute('data-window');
        if (windowId) openWindow(windowId);
    };

    if (isCoarsePointer) {
        icon.addEventListener('click', openHandler);
    } else {
        icon.addEventListener('dblclick', openHandler);
    }
});

function openWindow(id) {
    const win = document.getElementById(id);
    if (!win) return;

    win.style.display = 'flex';
    bringToFront(win);

    // Lazy-mount Vimeo iframes the first time this window opens (saves bandwidth)
    mountVimeoEmbeds(win);

    // Brick game only spins up when its window is opened
    if (id === 'brick-breaker' && typeof startGame === 'function') {
        startGame();
    }
}

document.querySelectorAll('.close-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const windowId = btn.getAttribute('data-window');
        const win = document.getElementById(windowId);
        if (win) {
            win.style.display = 'none';
            // Stop the brick game when its window closes
            if (windowId === 'brick-breaker' && typeof stopGame === 'function') {
                stopGame();
            }
        }
    });
});

document.querySelectorAll('.maximize-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const windowId = btn.getAttribute('data-window');
        const win = document.getElementById(windowId);
        if (win) toggleMaximize(win);
    });
});

function toggleMaximize(win) {
    if (win.classList.contains('maximized')) {
        win.classList.remove('maximized');
        win.style.top = win.dataset.oldTop || '';
        win.style.left = win.dataset.oldLeft || '';
        win.style.width = win.dataset.oldWidth || '';
        win.style.height = win.dataset.oldHeight || '';
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
    win.addEventListener('touchstart', () => bringToFront(win), { passive: true });
});

/* ----------------------------------------------------------------- */
/* Vimeo embed mounting                                              */
/* Any element with data-vimeo-id gets an iframe mounted into it.    */
/* IDs that still look like the placeholder string are skipped, so   */
/* the [VIDEO] placeholder stays visible until you fill them in.     */
/* ----------------------------------------------------------------- */
function mountVimeoEmbeds(scope) {
    const root = scope || document;
    root.querySelectorAll('[data-vimeo-id]').forEach(card => {
        if (card.dataset.vimeoMounted === '1') return;

        const raw = (card.getAttribute('data-vimeo-id') || '').trim();
        if (!raw || raw.startsWith('VIMEO_REPLACE_')) return; // unfilled — leave placeholder

        // Parse "<id>" or "<id>?h=<hash>" or "<id>/<hash>"
        let id = raw;
        let hash = '';
        if (raw.includes('?h=')) {
            const parts = raw.split('?h=');
            id = parts[0];
            hash = parts[1];
        } else if (raw.includes('/')) {
            const parts = raw.split('/');
            id = parts[0];
            hash = parts[1];
        }

        const params = new URLSearchParams({
            background: '1',
            autoplay: '1',
            loop: '1',
            muted: '1',
            byline: '0',
            title: '0',
            portrait: '0'
        });
        if (hash) params.set('h', hash);

        const iframe = document.createElement('iframe');
        iframe.src = `https://player.vimeo.com/video/${id}?${params.toString()}`;
        iframe.setAttribute('frameborder', '0');
        iframe.setAttribute('allow', 'autoplay; fullscreen; picture-in-picture');
        iframe.setAttribute('allowfullscreen', '');
        iframe.setAttribute('loading', 'lazy');
        iframe.className = 'vimeo-embed';

        const placeholder = card.querySelector('.video-placeholder');
        if (placeholder) placeholder.style.display = 'none';

        card.appendChild(iframe);
        card.dataset.vimeoMounted = '1';
    });
}

/* Case Study Tabs Controller */
const caseContent = {
    przm: {
        netflix: {
            brief: "Netflix Queue, Netflix's premium digital and print publication, rolled out its new Instagram and TikTok accounts and needed agency support to take them to the next level — leading overall strategy, concept development, and creative production.",
            approach: "For Netflix Queue, we reimagined social media as a tool to enhance the storytelling around prestige media, entertainment, and the overall state of journalism. We developed entertaining, social-first content to promote the broader publication, producing ongoing content that expanded upon the stories and perspectives of Netflix's latest series and films — adapting and reconceiving them through a social-first, behind-the-scenes, and talent-driven lens.",
            impact: "PRZM's inaugural short-form video production for Netflix Queue quickly surpassed 1 million views. Under our guidance, Netflix Queue has achieved over 8 million views across TikTok and Instagram, attracted more than 60,000 new followers, and garnered over 3 million organic engagements."
        },
        second: {
            brief: "The Amazon Influencer Program reached out to PRZM to develop a next-gen, social-first strategy and produce content that resonated with Gen Z audiences across TikTok and Instagram.",
            approach: "We began with a custom social media style guide to define Amazon's content pillars, digitally native voice, and visual design. Through a dedicated next-gen \"brain trust,\" our content strategy focused on trending, visually engaging editing styles and templates to spotlight Amazon Fashion and top creator partners. We incorporated Gen Z language, weaving in terms like \"icks\" and \"non-negotiables\" to make AIP content relatable and drive interest around upcoming Prime Deal Days. Through on-site and remote creative production, we tapped into viral trends at the right moment, adding a brand-specific twist to create timely, impactful engagement that resonated with a younger audience.",
            impact: "Since working with PRZM, Amazon gained over 170K followers in a short time, expanding its reach among Gen Z and solidifying its presence with this key demographic. In just a few months, we surpassed 7 million views on @amazoninfluencers TikTok and Instagram, with our content claiming the top three most-watched videos on the accounts. Rapid community engagement showcased the powerful connection we built with a young, dynamic audience through compelling, on-trend content."
        },
        third: {
            brief: "PRZM activated its earned Gen Z community of creators, future creators, and influencers through a dynamic, multichannel strategy. The goal was to grow the community, foster deeper engagement, and build partnerships for brand content creation, amplifying reach and influence.",
            approach: "To engage and onboard Gen Z creators, we implemented several key strategies. We created an automated funnel using HubSpot to capture audience members from TikTok, Instagram, and Substack, converting them into an owned community. This funnel allowed us to build a network of influencers we could rely on for ongoing collaborations across various projects. Additionally, I developed a Discord server where users could interact as a \"brain trust,\" discussing trends and pop culture, sharing personal projects, and finding job opportunities with PRZM. This fostered a space for open communication and collaboration among members. To keep the community engaged and informed, I launched a bi-weekly Substack newsletter that offered insights into digital marketing trends and cultural topics relevant to a Gen Z audience.",
            impact: "Over the course of a year, PRZM's community grew from 10 to 2,000 members, significantly expanding the reach and influence of the network. The influencer network we built allowed us to streamline content creation, as we had a pool of trusted creators ready to collaborate. This made it easier and faster to hire talent and create high-quality content for our clients, driving more successful campaigns and strengthening our brand partnerships."
        },
        fourth: {
            body: "This is a compilation of the highest-performing social posts that I have made at PRZM."
        }
    },
    hoek: {
        one: {
            brief: "This campaign aimed to position Hoek Home as a disruptive, innovative player in the furniture space by leveraging guerrilla marketing tactics and playful competition with IKEA. It sought to highlight Hoek's patented tool-free, quick-assembly furniture while emphasizing the stark contrast with IKEA's reputation for stressful, complex assembly processes.",
            approach: "It began with a wheat-pasting campaign around the city, where Hoek's logo mimicked IKEA's to spark curiosity. The narrative kicked off with Hoek reaching out to IKEA for a collaboration, which was intentionally ignored, setting the stage for the campaign. Man-on-the-street interviews were planned to engage the public and generate funny, shareable content. A bold stunt followed, where Hoek furniture was secretly set up inside IKEA's showroom, capturing reactions with hidden cameras. Finally, influencer swag packages featuring redesigned IKEA-style bags helped amplify the campaign's reach. The overall approach was low-budget, high-impact, using humor, satire, and guerrilla tactics to create buzz and virality.",
            impact: "The \"Farewell to Ikea\" campaign led to strong results across social media and sales. Instagram saw a 37% increase in impressions, 96% more engagements, and notable growth in shares (+178%) and comments (+204%). TikTok had moderate gains in impressions (41%) and likes (26%). YouTube experienced a 91% rise in impressions, with a 52% increase in views from impressions. The campaign significantly boosted site metrics, with a 19% increase in sessions and a 152% jump in sales, reflecting a strong link between engagement and purchases."
        },
        two: {
            brief: "\"The Story of Hoek\" was a video created to educate customers about Hoek Home's origins as a small furniture company striving to compete with industry giants like IKEA and Floyd Detroit. The video targeted new customers while also being used as an ad to attract potential customers at the top of the marketing funnel.",
            approach: "We crafted a compelling narrative that recounted the journey of Hoek Home, complemented by engaging motion graphics to enhance the storytelling. The video served as both an educational tool for existing customers—strengthening their brand loyalty—and a strategic device to introduce the brand to a wider audience.",
            impact: "The video garnered 20,000 views on YouTube, effectively driving awareness and generating deeper loyalty and understanding among Hoek Home's audience."
        },
        three: {
            brief: "What began as a simple DM to Shantell Martin evolved into a full collaboration, which then led to the creation of the artist residency program at Hoek Home. The program was designed to bring new consumers into the Hoek Home marketing funnel while celebrating art and design.",
            approach: "To reach a broader audience, we partnered with Shantell Martin's 200,000-strong following, as well as the Museum of Art and Design (MAD) to create a unique installation. The installation featured a variety of accessible, design-forward products, including trivets, coasters, phone holders, and tessellating tables that formed a larger, cohesive piece. These products were designed to appeal to a wide range of consumers by offering both art and functional design at accessible price points. We amplified the project through a combination of the physical installation, social media (Instagram and YouTube), Shantell's own social platforms, as well as press, influencers, and tastemakers to help spread the word and drive engagement.",
            impact: "While exact numbers were not tracked, the opening night was a major success, generating approximately $15,000 in sales. The limited edition items continued to sell out after the event, solidifying the program's impact and demonstrating the strength of the collaboration in reaching new consumers and expanding the brand's presence."
        },
        four: {
            body: "This is a compilation of the highest-performing social posts that I have made at Hoek Home."
        }
    },
    choice: {
        one: {
            brief: "At Bitcoin Miami 2020, Choice aimed to dominate the social buzz with \"Blinko Miami,\" an interactive, gamified activation that encouraged engagement both at the convention and online. The primary audience included convention attendees, while the secondary audience comprised those unable to attend but eager to participate virtually.",
            approach: "To maximize engagement, we implemented a multi-channel strategy designed to integrate both physical and digital touchpoints. On-site, attendees could earn Blinko re-drops (bonus plays of Bitcoin Plinko) by interacting with Choice Crew Members, introducing others to Blinko, or spotting and sharing Choice ads on Twitter using the hashtag #BlinkoMiami. We further gamified the experience with \"Blinko Boosts,\" a community-driven activity where Twitter users collaborated to increase a collective multiplier for satoshis. Beyond the event, we partnered with Blinko Miami to create OOH (out-of-home) ads and amplified the campaign via Twitter, influencers, and branded tie-dye merch, which served as conversation starters. Additionally, we gave away Bitcoin Miami tickets to deepen engagement and foster community connections.",
            impact: "The campaign resulted in a 73.28% lift in impressions, a 74.49% increase in engagements, a 63.16% rise in retweets, and an 80.48% growth in replies on Twitter. Beyond the metrics, the activation created meaningful connections with the community. Ticket winners expressed heartfelt gratitude, describing the experience as \"life-changing,\" while others became enthusiastic fans of Choice's mission and team. The tie-dye merch proved to be a highly effective icebreaker, driving both brand awareness and conversation. By tying digital efforts to physical activations, the campaign successfully bridged online and in-person engagement, leaving a lasting impression and further solidifying Choice's reputation as an innovative and community-driven brand."
        },
        two: {
            brief: "The \"Choice Retirement Zombies\" campaign was designed to educate customers and potential customers about how their old 401(k)s, often left dormant and \"eaten\" by company fees, could instead be revitalized through a Choice Roth IRA with access to Bitcoin. The campaign targeted job changers, Bitcoin enthusiasts, and individuals looking to kickstart their retirement savings.",
            approach: "For the month of October, Choice embraced a spooky, zombie-themed seasonal campaign. A key promotion was matching sats (satoshis, a unit of Bitcoin) for customers who rolled over their retirement savings into Choice Roth IRAs. To align with the theme, the company's Twitter profile was reskinned with zombie visuals, and all content took on a spooky, Halloween-inspired tone. I created a mix of video assets, GIFs, and images featuring zombies while maintaining the regularly scheduled humor and engagement-driven \"shitposting.\" This seasonal campaign became a recurring part of Choice's marketing strategy.",
            impact: "The campaign successfully grew the user base by 13%, with job switchers and new customers rolling over an average of $45,000 into their accounts. The campaign expanded Choice's funnel beyond Bitcoin enthusiasts, bringing in a wider audience and increasing account averages. This initiative demonstrated the power of seasonal campaigns to resonate with customers while driving measurable business growth."
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
    projectEl.querySelectorAll('[data-tab]').forEach(tab => {
        tab.classList.toggle('is-active', tab.getAttribute('data-tab') === tabName);
    });

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

    const copyEl = projectEl.querySelector('.case-copy');
    if (copyEl && caseContent[caseId] && caseContent[caseId][projectId]) {
        copyEl.textContent =
            caseContent[caseId][projectId][tabName] ||
            caseContent[caseId][projectId].body ||
            "";
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initCaseTabs();
    // Mount any embeds that live inside windows already visible on load
    document.querySelectorAll('.window').forEach(win => {
        if (win.style.display !== 'none') mountVimeoEmbeds(win);
    });
});

// Theme toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    document.body.classList.add('js-enabled');

    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = themeToggleBtn.querySelector('i');
    
    // Check for saved theme preference or default to dark mode
    const currentTheme = localStorage.getItem('theme') || 'dark';
    
    // Apply the current theme
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);
    
    // Toggle theme on button click
    themeToggleBtn.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });

    const mobileMenuToggleBtn = document.getElementById('mobile-menu-toggle');
    const header = document.querySelector('header');
    const contentLinks = document.querySelector('.content-links');
    const socialLinks = document.querySelector('.header-links');

    const articlesRailLink = contentLinks ? contentLinks.querySelector('a[href="articles.html"]') : null;
    if (articlesRailLink && socialLinks) {
        const articlesTab = articlesRailLink.cloneNode(true);
        articlesTab.className = 'article-tab';
        socialLinks.insertAdjacentElement('afterend', articlesTab);
        articlesRailLink.remove();
    }

    if (contentLinks && header && header.contains(contentLinks)) {
        header.insertAdjacentElement('afterend', contentLinks);
    }

    if (mobileMenuToggleBtn && header) {
        mobileMenuToggleBtn.addEventListener('click', function() {
            const open = header.classList.toggle('mobile-menu-open');
            document.body.classList.toggle('mobile-menu-open', open);
            updateMenuIcon(open);
        });
    }

    const mobileMenuCloseBtn = document.getElementById('mobile-menu-close');
    if (mobileMenuCloseBtn && header) {
        mobileMenuCloseBtn.addEventListener('click', function() {
            closeMobileMenu();
        });
    }

    const mobileMenuLinks = document.querySelectorAll('.content-links a');
    mobileMenuLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            if (header.classList.contains('mobile-menu-open')) {
                closeMobileMenu();
            }
        });
    });

    document.querySelectorAll('.content-links a[href^="#"]').forEach(function(link) {
        link.addEventListener('click', function(event) {
            const target = document.querySelector(link.getAttribute('href'));
            if (!target) return;

            event.preventDefault();
            const headerHeight = header ? header.offsetHeight : 0;
            const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 18;
            window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
            setActiveSection(target.id);

            if (header && header.classList.contains('mobile-menu-open')) {
                closeMobileMenu();
            }
        });
    });

    document.addEventListener('click', function(event) {
        if (!header || !header.classList.contains('mobile-menu-open')) return;
        if (contentLinks && contentLinks.contains(event.target)) return;
        if (mobileMenuToggleBtn && mobileMenuToggleBtn.contains(event.target)) return;

        closeMobileMenu();
    });

    renderProjectTags();
    setupTerminalName();
    setupProjectReveal();
    setupSectionRail();

    function closeMobileMenu() {
        if (!header) return;
        header.classList.remove('mobile-menu-open');
        document.body.classList.remove('mobile-menu-open');
        updateMenuIcon(false);
    }
    
    function updateMenuIcon(isOpen) {
        const icon = mobileMenuToggleBtn.querySelector('i');
        if (!icon) return;
        icon.className = isOpen ? 'fas fa-times' : 'fas fa-bars';
    }
    
    function updateThemeIcon(theme) {
        if (theme === 'dark') {
            themeIcon.className = 'fas fa-moon';
        } else {
            themeIcon.className = 'fas fa-sun';
        }
    }

    function renderProjectTags() {
        const fallbackWords = new Set([
            'with', 'using', 'created', 'developed', 'performed', 'project',
            'simulation', 'simulations', 'computed', 'analysis', 'analyzed',
            'model', 'models', 'custom', 'comparison', 'visualization'
        ]);

        document.querySelectorAll('.project').forEach(function(project) {
            const info = project.querySelector('.project-info');
            if (!info || info.classList.contains('project-tags')) return;

            const sourceText = Array.from(info.querySelectorAll('p'))
                .map(function(paragraph) {
                    return paragraph.textContent;
                })
                .join(' ');

            const tags = createTags(sourceText, fallbackWords);
            info.innerHTML = '';
            info.classList.add('project-tags');

            tags.forEach(function(tag) {
                const chip = document.createElement('span');
                chip.className = 'project-tag';
                chip.textContent = tag;
                info.appendChild(chip);
            });
        });
    }

    function createTags(text, fallbackWords) {
        const phraseTags = [];
        const lowerText = text.toLowerCase();
        const phraseMap = {
            'unreal engine': 'unreal-engine',
            'finite element': 'finite-element',
            'modal analysis': 'modal-analysis',
            'fluid': 'fluid-sim',
            'ray': 'ray-tracing',
            'path': 'pathfinding',
            'robot': 'robotics',
            'machine learning': 'machine-learning',
            'tensorflow': 'tensorflow',
            'opengl': 'opengl',
            'abaqus': 'abaqus',
            'ansys': 'ansys',
            'arduino': 'arduino',
            'matlab': 'matlab',
            'houdini': 'houdini',
            'blender': 'blender'
        };

        Object.keys(phraseMap).forEach(function(phrase) {
            if (lowerText.includes(phrase)) {
                phraseTags.push(phraseMap[phrase]);
            }
        });

        const wordTags = lowerText
            .replace(/[^a-z0-9+#\s]/g, ' ')
            .split(/\s+/)
            .filter(function(word) {
                return word.length > 4 && !fallbackWords.has(word);
            })
            .map(function(word) {
                return word.replace(/\++/g, 'plus').replace(/#+/g, 'sharp');
            });

        return Array.from(new Set(phraseTags.concat(wordTags))).slice(0, 3);
    }

    function setupTerminalName() {
        const terminalName = document.querySelector('[data-terminal-name]');
        if (!terminalName) return;

        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        const baseName = 'Emil Keshishian';
        const shellName = 'Emilk.sh';
        const spinnerFrames = ['/', '-', '\\', '|', '/', '-', '\\', '|'];
        const glitchFrames = [
            '0x45_m1l::ksh',
            'rm -rf ./ordinary',
            'ksh@sim:~$ ???',
            'ERR_SIG_GRAPHICS',
            './emilk.sh --unstable',
            '01001011::mesh'
        ];

        const wait = function(ms) {
            return new Promise(function(resolve) {
                window.setTimeout(resolve, ms);
            });
        };

        const typeText = async function(text, delay) {
            for (let index = 0; index < text.length; index += 1) {
                terminalName.textContent += text[index];
                await wait(delay);
            }
        };

        const deleteTo = async function(targetLength, delay) {
            while (terminalName.textContent.length > targetLength) {
                terminalName.textContent = terminalName.textContent.slice(0, -1);
                await wait(delay);
            }
        };

        const replaceWith = async function(text, delay) {
            await deleteTo(0, delay);
            await typeText(text, delay);
        };

        if (reduceMotion.matches) {
            terminalName.textContent = baseName;
            return;
        }

        runTerminalLoop();

        async function runTerminalLoop() {
            while (true) {
                terminalName.textContent = '';
                await typeText(baseName, 58);
                await wait(680);

                await deleteTo(4, 42);
                await wait(180);
                await typeText('k.sh', 70);
                await wait(850);

                for (let frame = 0; frame < spinnerFrames.length; frame += 1) {
                    terminalName.textContent = shellName + ' ' + spinnerFrames[frame];
                    await wait(135);
                }

                await replaceWith('Simulations', 48);
                await wait(820);

                await replaceWith('Computer graphics', 42);
                await wait(820);

                await deleteTo(0, 34);
                for (let index = 0; index < glitchFrames.length; index += 1) {
                    terminalName.textContent = glitchFrames[index];
                    await wait(index < glitchFrames.length - 1 ? 130 : 900);
                }

                terminalName.textContent = '';
                await wait(2300);
            }
        }
    }

    function setupProjectReveal() {
        const revealCards = document.querySelectorAll('.project, .cg-project');
        if (!revealCards.length) return;

        if ('IntersectionObserver' in window) {
            const revealObserver = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    entry.target.classList.toggle('is-visible', entry.isIntersecting);
                });
            }, {
                rootMargin: '-150px 0px -12% 0px',
                threshold: 0.08
            });

            revealCards.forEach(function(card) {
                revealObserver.observe(card);
            });
        } else {
            revealCards.forEach(function(card) {
                card.classList.add('is-visible');
            });
        }
    }

    function setupSectionRail() {
        const sectionLinks = Array.from(document.querySelectorAll('.content-links a[href^="#"]'));
        const sectionTargets = sectionLinks
            .map(function(link) {
                const target = document.querySelector(link.getAttribute('href'));
                return target ? { link, target } : null;
            })
            .filter(Boolean);

        if (!sectionTargets.length) return;

        if ('IntersectionObserver' in window) {
            const visibility = new Map();
            const sectionObserver = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    visibility.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
                });

                const active = sectionTargets
                    .map(function(item) {
                        return {
                            id: item.target.id,
                            ratio: visibility.get(item.target.id) || 0
                        };
                    })
                    .sort(function(a, b) {
                        return b.ratio - a.ratio;
                    })[0];

                if (active && active.ratio > 0) {
                    setActiveSection(active.id);
                }
            }, {
                rootMargin: '-24% 0px -52% 0px',
                threshold: [0, 0.15, 0.35, 0.6]
            });

            sectionTargets.forEach(function(item) {
                sectionObserver.observe(item.target);
            });
        } else {
            setActiveSection(sectionTargets[0].target.id);
        }
    }

    function setActiveSection(sectionId) {
        document.querySelectorAll('.content-links a[href^="#"]').forEach(function(link) {
            link.classList.toggle('is-active', link.getAttribute('href') === '#' + sectionId);
        });
    }
});

// Theme toggle functionality
document.addEventListener('DOMContentLoaded', function() {
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

    if (mobileMenuToggleBtn && header) {
        mobileMenuToggleBtn.addEventListener('click', function() {
            const open = header.classList.toggle('mobile-menu-open');
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

    document.addEventListener('click', function(event) {
        if (!header || !header.classList.contains('mobile-menu-open')) return;
        if (contentLinks && contentLinks.contains(event.target)) return;
        if (mobileMenuToggleBtn && mobileMenuToggleBtn.contains(event.target)) return;

        closeMobileMenu();
    });

    function closeMobileMenu() {
        if (!header) return;
        header.classList.remove('mobile-menu-open');
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
});

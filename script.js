// ========== LAPTOP 3D - CICLO DE TELAS ==========
function cycleLaptopScreen() {
    const screenIds = [
        'codeView',
        'siteView',
        'ecommerceView',
        'qrView',
        'whatsappView',
        'instagramView',
        'brandView'
    ];

    const screens = screenIds
        .map(id => document.getElementById(id))
        .filter(Boolean);

    if (screens.length === 0) return;

    let index = 0;

    function showCurrent() {
        screens.forEach((el, i) => {
            el.classList.toggle('active', i === index);
        });

        // Tela de código fica mais tempo (efeito de digitação + cursor)
        const duration = screens[index].id === 'codeView' ? 4200 : 2300;

        setTimeout(() => {
            index = (index + 1) % screens.length;
            showCurrent();
        }, duration);
    }

    showCurrent();
}

window.addEventListener('load', cycleLaptopScreen);

// ========== FAQ ACCORDION ==========
document.querySelectorAll('.faq-item').forEach(item => {
    const question = item.querySelector('.faq-question');

    question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        document.querySelectorAll('.faq-item').forEach(el => {
            el.classList.remove('active');
        });

        if (!isActive) {
            item.classList.add('active');
        }
    });
});

// ========== MENU MOBILE ==========
const menuToggle = document.getElementById('menuToggle');
const menu = document.getElementById('menu');

menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    menu.classList.toggle('active');
});

// Fechar menu ao clicar em um link
document.querySelectorAll('#menu a').forEach(link => {
    link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        menu.classList.remove('active');
    });
});

// ========== HONEYCOMB BACKGROUND ==========
function createHoneycomb() {
    const container = document.getElementById('honeycomb');
    const spacing = 110;
    
    // Calcular quantos hexágonos precisamos
    const cols = Math.ceil(window.innerWidth / spacing) + 2;
    const rows = Math.ceil(window.innerHeight / spacing) + 2;
    
    // Limpar container
    container.innerHTML = '';
    
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const hexagon = document.createElement('div');
            hexagon.className = 'hexagon';
            
            // Offset para criar o padrão de colmeia
            const offset = row % 2 === 0 ? 0 : spacing / 2;
            const x = col * spacing + offset;
            const y = row * spacing;
            
            hexagon.style.left = x + 'px';
            hexagon.style.top = y + 'px';
            
            container.appendChild(hexagon);
        }
    }
    
    // Adicionar efeito ao mouse
    addMouseEffect();
}

// ========== BOTÃO CONHECER SOLUÇÕES ==========
const conhecerBtn = document.getElementById('conhecerBtn');

if (conhecerBtn) {
    conhecerBtn.addEventListener('click', () => {
        const sobreSection = document.getElementById('sobre');
        const serviceCards = document.querySelectorAll('.service-card');
        
        // Scroll lento até a seção
        sobreSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
        
        // Resetar animações das caixinhas
        serviceCards.forEach(card => {
            card.style.animation = 'none';
            card.style.opacity = '0';
        });
        
        // Ativar animação fade in com delay em cada caixinha
        setTimeout(() => {
            serviceCards.forEach((card, index) => {
                const delay = index * 150; // 150ms entre cada uma
                setTimeout(() => {
                    card.style.animation = `fadeInUp 0.8s ease-out forwards`;
                }, delay);
            });
        }, 600); // Espera 600ms antes de começar a animar
    });
}

function addMouseEffect() {
    const hexagons = document.querySelectorAll('.hexagon');
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let mouseActive = false;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        mouseActive = true;
    });

    document.addEventListener('mouseleave', () => {
        mouseActive = false;
    });

    document.addEventListener('mouseenter', () => {
        mouseActive = true;
    });

    // Loop de animação suave
    function updateHexagons() {
        hexagons.forEach(hexagon => {
            const rect = hexagon.getBoundingClientRect();
            const hexX = rect.left + rect.width / 2;
            const hexY = rect.top + rect.height / 2;
            
            // Distância do mouse até o hexágono
            const distance = Math.sqrt(
                Math.pow(mouseX - hexX, 2) + Math.pow(mouseY - hexY, 2)
            );
            
            const maxDistance = 300; // Raio do spotlight
            const baseOpacity = 0.08;
            const baseBorderOpacity = 0.15;
            const baseBackgroundOpacity = 0.02;
            
            let targetOpacity = baseOpacity;
            let targetBorderOpacity = baseBorderOpacity;
            let targetBackgroundOpacity = baseBackgroundOpacity;
            
            // Se mouse está ativo e dentro do raio
            if (mouseActive && distance < maxDistance) {
                // Calcular intensidade: 1 (perto) a 0 (longe)
                const intensity = 1 - (distance / maxDistance);
                
                // Quanto mais perto, mais forte
                targetOpacity = baseOpacity + (intensity * 0.7);
                targetBorderOpacity = baseBorderOpacity + (intensity * 0.65);
                targetBackgroundOpacity = baseBackgroundOpacity + (intensity * 0.18);
                
                // Adicionar classe active se muito perto
                if (intensity > 0.8) {
                    hexagon.classList.add('active');
                } else {
                    hexagon.classList.remove('active');
                }
            } else {
                hexagon.classList.remove('active');
            }
            
            // Interpolar suavemente opacidades
            const currentOpacity = parseFloat(window.getComputedStyle(hexagon).opacity) || baseOpacity;
            const smoothOpacity = currentOpacity + (targetOpacity - currentOpacity) * 0.1;
            
            hexagon.style.opacity = smoothOpacity;
            hexagon.style.borderColor = `rgba(0, 255, 0, ${targetBorderOpacity})`;
            hexagon.style.background = `rgba(0, 255, 0, ${targetBackgroundOpacity})`;
        });
        
        requestAnimationFrame(updateHexagons);
    }
    
    updateHexagons();
}

// Criar honeycomb ao carregar
window.addEventListener('load', createHoneycomb);

// Recriar honeycomb ao redimensionar
window.addEventListener('resize', createHoneycomb);

// ========== SMOOTH SCROLL ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ========== ANIMAÇÃO AO SCROLL ==========
// ========== ANIMAÇÃO AO SCROLL ==========
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Se for service-card: entrada em "flip" 3D
            if (entry.target.classList.contains('service-card')) {
                entry.target.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'rotateX(0deg) translateY(0)';
            }
            // Se for contact-link
            else if (entry.target.classList.contains('contact-link')) {
                entry.target.style.transition = 'all 0.8s ease-out';
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
            // Se for benefit-item
            else if (entry.target.classList.contains('benefit-item')) {
                entry.target.style.transition = 'all 0.8s ease-out';
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
            
            // Parar de observar depois que aparece
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observar elementos
document.querySelectorAll('.service-card, .contact-link, .benefit-item').forEach(el => {
    // Começar invisível
    el.style.opacity = '0';

    // Cards de solução comecam "fechados" (flip 3D), o resto sobe normal
    if (el.classList.contains('service-card')) {
        el.style.transform = 'rotateX(-90deg) translateY(20px)';
    } else {
        el.style.transform = 'translateY(30px)';
    }

    observer.observe(el);
});

// ========== TILT 3D NOS CARDS DE SOLUCAO (HOVER) ==========
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 8;
        const rotateX = -((y - rect.height / 2) / (rect.height / 2)) * 8;

        card.style.transition = 'transform 0.1s ease-out';
        card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transition = 'transform 0.4s ease-out';
        card.style.transform = 'rotateX(0deg) rotateY(0deg) translateY(0)';
    });
});
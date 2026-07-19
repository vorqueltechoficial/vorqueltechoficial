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

// ========== NOTEBOOK 3D: POSIÇÃO PRESA AO SCROLL (SÓ DESKTOP) ==========
// A posição do notebook é calculada a cada frame como uma função direta do
// scroll da página (sem duração de animação fixa). Isso faz com que:
// - a velocidade do movimento dele seja sempre igual à velocidade do scroll do usuário;
// - se o usuário parar de rolar, o notebook para exatamente ali, sem continuar sozinho;
// - se o usuário inverter o scroll no meio do caminho, o notebook reage na hora.
function setupLaptopScrollFollow() {
    const hero3d = document.querySelector('.hero-3d');
    if (!hero3d) return;

    const isDesktop = () => window.matchMedia('(min-width: 1900px)').matches;

    // Quantos pixels de scroll "gastam" a transição inteira (do lugar original até grudado)
    const scrollRange = 500;

    let active = false;
    let placeholder = null;
    let originalRect = null; // posição do notebook em coordenadas do documento (topo da página)

    function targetPosition() {
        const vw = window.innerWidth;
        // Em telas mais estreitas (tablet) não existe folga lateral suficiente pra
        // ele flutuar em tamanho normal sem tampar o conteúdo — então ali ele fica
        // menor e grudado num cantinho, em vez de centralizado no meio da tela.
        const isTablet = vw <= 1024;
        const scale = isTablet ? 0.5 : 1;
        const width = originalRect.width * scale;
        const height = originalRect.height * scale;

        return {
            top: isTablet ? 110 : Math.max(20, window.innerHeight / 2 - height / 2),
            left: vw - width - (isTablet ? 24 : 40),
            scale
        };
    }

    // Captura onde o notebook "deveria" estar (em relação ao documento), usando
    // o placeholder, que sempre ocupa o lugar dele no fluxo normal da página
    function captureOriginalRect() {
        const rect = placeholder.getBoundingClientRect();
        originalRect = {
            top: rect.top + window.scrollY,
            left: rect.left,
            width: rect.width,
            height: rect.height
        };
    }

    function activate() {
        if (active || !isDesktop()) return;
        active = true;

        const rect = hero3d.getBoundingClientRect();

        // Placeholder ocupa o lugar do notebook no layout, pra nada "pular" na página
        placeholder = document.createElement('div');
        placeholder.style.width = rect.width + 'px';
        placeholder.style.height = rect.height + 'px';
        placeholder.style.flex = window.getComputedStyle(hero3d).flex;
        hero3d.parentNode.insertBefore(placeholder, hero3d);

        hero3d.style.position = 'fixed';
        hero3d.style.margin = '0';
        hero3d.style.zIndex = '5';
        hero3d.style.transition = 'none'; // nada de animação por tempo: é tudo via scroll
        hero3d.style.width = rect.width + 'px';
        hero3d.style.height = rect.height + 'px';
        hero3d.style.transformOrigin = 'top left';

        captureOriginalRect();
        update();
    }

    function deactivate() {
        if (!active) return;
        active = false;

        hero3d.style.position = '';
        hero3d.style.top = '';
        hero3d.style.left = '';
        hero3d.style.width = '';
        hero3d.style.height = '';
        hero3d.style.margin = '';
        hero3d.style.zIndex = '';
        hero3d.style.transition = '';
        hero3d.style.transform = '';
        hero3d.style.transformOrigin = '';

        if (placeholder && placeholder.parentNode) {
            placeholder.parentNode.removeChild(placeholder);
        }
        placeholder = null;
        originalRect = null;
    }

    // O coração do efeito: calcula a posição atual como interpolação entre
    // "onde ele estaria se a página não tivesse esse efeito" (flowTop/flowLeft)
    // e "onde ele fica grudado" (target), na proporção exata do quanto já rolou
    function update() {
        if (!active || !originalRect) return;

        const scrollY = window.scrollY;
        const progress = Math.min(1, Math.max(0, scrollY / scrollRange));
        const target = targetPosition();

        const flowTop = originalRect.top - scrollY;
        const flowLeft = originalRect.left;

        const top = flowTop + (target.top - flowTop) * progress;
        const left = flowLeft + (target.left - flowLeft) * progress;
        const scale = 1 + (target.scale - 1) * progress;

        hero3d.style.top = top + 'px';
        hero3d.style.left = left + 'px';
        hero3d.style.transform = `scale(${scale})`;
    }

    function onScrollOrResize() {
        if (!isDesktop()) {
            if (active) deactivate();
            return;
        }
        if (!active) {
            activate();
        } else {
            update();
        }
    }

    let ticking = false;
    function requestUpdate() {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            onScrollOrResize();
            ticking = false;
        });
    }

    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', () => {
        // Ao redimensionar, recaptura as posições (mudam com a largura da tela)
        if (active) {
            captureOriginalRect();
        }
        requestUpdate();
    });

    // Roda uma vez ao carregar, caso a página já abra rolada
    onScrollOrResize();
}

window.addEventListener('load', setupLaptopScrollFollow);

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
// Contador de geração: toda vez que a colmeia é recriada (resize), incrementa.
// Assim, loops antigos (trilhas de luz do mobile) sabem que devem parar.
let honeycombGeneration = 0;

function createHoneycomb() {
    const container = document.getElementById('honeycomb');
    const spacing = 110;
    const myGeneration = ++honeycombGeneration;
    
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

            // Guarda a posição na grade (usado pelas trilhas de luz no mobile
            // pra saber quais hexágonos são "vizinhos")
            hexagon.dataset.row = row;
            hexagon.dataset.col = col;
            
            container.appendChild(hexagon);
        }
    }
    
    // Desktop: mantém o efeito de spotlight seguindo o mouse (intacto).
    // Mobile: não tem mouse, então roda 3 linhas de luz contínuas percorrendo a colmeia.
    if (window.matchMedia('(max-width: 768px)').matches) {
        startHexLightFlow(container, container.querySelectorAll('.hexagon'), myGeneration);
    } else {
        addMouseEffect();
    }
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

// ========== HONEYCOMB - LINHAS DE LUZ CONTÍNUAS (SÓ MOBILE) ==========
// Como no celular não existe hover de mouse, desenhamos 3 linhas de luz reais (SVG)
// que viajam continuamente de hexágono em hexágono (2 na paleta verde neon, 1 na
// dourada), passando por entre os hexágonos e acendendo o hexágono mais próximo
// conforme passam — parecido com o efeito de "traço de luz" enviado como referência.
function startHexLightFlow(container, hexagonList, generation) {
    const hexagons = Array.from(hexagonList);
    if (hexagons.length === 0) return;

    // Tamanho real do hexágono renderizado nesta tela (muda no breakpoint de 768px)
    const sampleRect = hexagons[0].getBoundingClientRect();
    const hexW = sampleRect.width;
    const hexH = sampleRect.height;

    // Mapa de posição -> { elemento, centro x/y }, usado tanto pra andar pela
    // colmeia (vizinhos) quanto pra saber onde desenhar a linha
    const grid = new Map();
    hexagons.forEach(hex => {
        const left = parseFloat(hex.style.left);
        const top = parseFloat(hex.style.top);
        grid.set(`${hex.dataset.row},${hex.dataset.col}`, {
            el: hex,
            x: left + hexW / 2,
            y: top + hexH / 2
        });
    });
    const allCells = Array.from(grid.values());

    // Vizinhos de uma célula na grade "offset" (linhas pares/ímpares deslocadas),
    // igual ao padrão de colmeia usado no createHoneycomb
    function getNeighbors(row, col) {
        const evenRow = row % 2 === 0;
        const deltas = evenRow
            ? [[0, -1], [0, 1], [-1, -1], [-1, 0], [1, -1], [1, 0]]
            : [[0, -1], [0, 1], [-1, 0], [-1, 1], [1, 0], [1, 1]];
        return deltas
            .map(([dr, dc]) => grid.get(`${row + dr},${col + dc}`))
            .filter(Boolean);
    }

    function resetHex(hex) {
        hex.style.opacity = '';
        hex.style.borderColor = '';
        hex.style.background = '';
        hex.style.boxShadow = '';
    }

    // SVG que fica por cima da colmeia, só pra desenhar as linhas de luz
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.style.position = 'absolute';
    svg.style.top = '0';
    svg.style.left = '0';
    svg.style.overflow = 'visible';
    svg.style.pointerEvents = 'none';
    container.appendChild(svg);

    // 3 linhas percorrendo a colmeia: 2 verdes + 1 dourada
    const trails = [
        { colorRgb: '0, 255, 0', hopDuration: 260 },
        { colorRgb: '255, 215, 0', hopDuration: 300 },
        { colorRgb: '0, 255, 0', hopDuration: 340 }
    ];

    trails.forEach(config => {
        const strokeColor = `rgb(${config.colorRgb})`;
        const glow = `rgba(${config.colorRgb}, 0.9)`;

        // A linha em si (o "traço de luz" que se move, com pontas arredondadas + brilho)
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('stroke', strokeColor);
        line.setAttribute('stroke-width', '3');
        line.setAttribute('stroke-linecap', 'round');
        line.style.filter = `drop-shadow(0 0 6px ${glow}) drop-shadow(0 0 16px ${glow})`;
        svg.appendChild(line);

        // Rastro de hexágonos que ficam "acesos" logo depois que a linha passa por perto
        let hexTrail = [];
        const hexTrailLength = 4;

        function lightHex(cell) {
            hexTrail.push(cell.el);
            cell.el.style.borderColor = `rgba(${config.colorRgb}, 0.85)`;
            cell.el.style.background = `rgba(${config.colorRgb}, 0.12)`;
            cell.el.style.opacity = '0.75';
            cell.el.style.boxShadow = `0 0 16px rgba(${config.colorRgb}, 0.5), inset 0 0 10px rgba(${config.colorRgb}, 0.25)`;

            if (hexTrail.length > hexTrailLength) {
                resetHex(hexTrail.shift());
            }
        }

        // Caminho (centros de hexágono) que a linha vai seguindo, gerado sob demanda
        let path = [allCells[Math.floor(Math.random() * allCells.length)]];
        let segIndex = 0;
        let segStart = performance.now();

        function extendPathIfNeeded() {
            while (path.length < segIndex + 3) {
                const current = path[path.length - 1];
                const previous = path[path.length - 2];
                let neighbors = getNeighbors(
                    parseInt(current.el.dataset.row, 10),
                    parseInt(current.el.dataset.col, 10)
                );

                // Evita voltar direto pro ponto anterior (caminho mais orgânico)
                if (previous && neighbors.length > 1) {
                    neighbors = neighbors.filter(n => n.el !== previous.el);
                }

                path.push(
                    neighbors.length === 0
                        ? allCells[Math.floor(Math.random() * allCells.length)]
                        : neighbors[Math.floor(Math.random() * neighbors.length)]
                );
            }

            // Evita que o array cresça pra sempre: descarta pontos já percorridos
            if (segIndex > 30) {
                path = path.slice(segIndex - 2);
                segIndex = 2;
            }
        }

        function frame(now) {
            // Se a colmeia foi recriada (resize/rotação), essa linha antiga some daqui
            if (generation !== honeycombGeneration) {
                svg.remove();
                return;
            }

            extendPathIfNeeded();

            let progress = (now - segStart) / config.hopDuration;

            if (progress >= 1) {
                segIndex++;
                segStart = now;
                progress = 0;
                extendPathIfNeeded();
                lightHex(path[segIndex]);
            }

            const a = path[segIndex];
            const b = path[segIndex + 1];

            const headX = a.x + (b.x - a.x) * progress;
            const headY = a.y + (b.y - a.y) * progress;

            // A "cauda" nasce como um ponto e cresce até virar um traço,
            // igual ao efeito de referência (linha que cresce e depois recua)
            const tailProgress = Math.max(0, progress - 0.4);
            const tailX = a.x + (b.x - a.x) * tailProgress;
            const tailY = a.y + (b.y - a.y) * tailProgress;

            line.setAttribute('x1', tailX);
            line.setAttribute('y1', tailY);
            line.setAttribute('x2', headX);
            line.setAttribute('y2', headY);

            requestAnimationFrame(frame);
        }

        lightHex(path[0]);
        requestAnimationFrame(frame);
    });
}

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
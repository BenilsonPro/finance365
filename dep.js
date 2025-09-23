class TestimonialsCarousel {
    constructor() {
        this.currentSlide = 0;
        this.testimonials = document.querySelectorAll('.testimonial-card');
        this.totalSlides = this.testimonials.length;
        this.wrapper = document.getElementById('testimonialsWrapper');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.indicatorsContainer = document.getElementById('carouselIndicators');
        this.autoPlayInterval = null;
        
        this.init();
    }

    init() {
        this.createIndicators();
        this.setupEventListeners();
        this.updateCarousel();
        this.startAutoPlay();
    }

    createIndicators() {
        for (let i = 0; i < this.totalSlides; i++) {
            const indicator = document.createElement('div');
            indicator.classList.add('indicator');
            if (i === 0) indicator.classList.add('active');
            indicator.addEventListener('click', () => this.goToSlide(i));
            this.indicatorsContainer.appendChild(indicator);
        }
    }

    setupEventListeners() {
        this.prevBtn.addEventListener('click', () => this.previousSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());

        // Pausar autoplay ao passar mouse sobre o carrossel
        const carousel = document.querySelector('.testimonials-carousel');
        carousel.addEventListener('mouseenter', () => this.stopAutoPlay());
        carousel.addEventListener('mouseleave', () => this.startAutoPlay());

        // Controles por teclado
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.previousSlide();
            if (e.key === 'ArrowRight') this.nextSlide();
        });

        // Controle por toque (mobile)
        let startX = null;
        carousel.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });

        carousel.addEventListener('touchend', (e) => {
            if (!startX) return;
            
            const endX = e.changedTouches[0].clientX;
            const diff = startX - endX;
            
            if (Math.abs(diff) > 50) { // Mínimo de 50px para considerar swipe
                if (diff > 0) {
                    this.nextSlide();
                } else {
                    this.previousSlide();
                }
            }
            
            startX = null;
        });
    }

    updateCarousel() {
        // Remover classe active de todos os slides
        this.testimonials.forEach(slide => slide.classList.remove('active'));
        
        // Adicionar classe active ao slide atual
        this.testimonials[this.currentSlide].classList.add('active');
        
        // Mover o wrapper
        const translateX = -this.currentSlide * 100;
        this.wrapper.style.transform = `translateX(${translateX}%)`;
        
        // Atualizar indicadores
        const indicators = document.querySelectorAll('.indicator');
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentSlide);
        });
        
        // Atualizar botões de navegação
        this.prevBtn.disabled = this.currentSlide === 0;
        this.nextBtn.disabled = this.currentSlide === this.totalSlides - 1;
    }

    nextSlide() {
        if (this.currentSlide < this.totalSlides - 1) {
            this.currentSlide++;
            this.updateCarousel();
            this.resetAutoPlay();
        }
    }

    previousSlide() {
        if (this.currentSlide > 0) {
            this.currentSlide--;
            this.updateCarousel();
            this.resetAutoPlay();
        }
    }

    goToSlide(slideIndex) {
        this.currentSlide = slideIndex;
        this.updateCarousel();
        this.resetAutoPlay();
    }

    startAutoPlay() {
        this.autoPlayInterval = setInterval(() => {
            if (this.currentSlide < this.totalSlides - 1) {
                this.nextSlide();
            } else {
                this.currentSlide = 0;
                this.updateCarousel();
            }
        }, 5000); // Trocar slide a cada 5 segundos
    }

    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }

    resetAutoPlay() {
        this.stopAutoPlay();
        this.startAutoPlay();
    }
}

// Inicializar carrossel quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    new TestimonialsCarousel();
    
    // Animar estatísticas quando entrarem na viewport
    const observeStats = () => {
        const stats = document.querySelectorAll('.stat-number');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateNumber(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        });

        stats.forEach(stat => observer.observe(stat));
    };

    // Função para animar números das estatísticas
    const animateNumber = (element) => {
        const finalValue = element.textContent;
        const numericValue = parseInt(finalValue.replace(/[^\d]/g, ''));
        const suffix = finalValue.replace(/[\d]/g, '');
        let currentValue = 0;
        const increment = numericValue / 100;
        
        const timer = setInterval(() => {
            currentValue += increment;
            if (currentValue >= numericValue) {
                element.textContent = finalValue;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(currentValue) + suffix;
            }
        }, 20);
    };

    // Inicializar observador das estatísticas
    observeStats();
});

// Adicionar classe para animação suave ao carregar a página
window.addEventListener('load', () => {
    document.querySelector('.testimonials-section').style.opacity = '1';
});
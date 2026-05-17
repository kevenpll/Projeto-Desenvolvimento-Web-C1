document.addEventListener('DOMContentLoaded', () => {
  // 1. Atualizar Ano no Rodapé
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // 2. Menu Hambúrguer (Mobile)
  const burger = document.getElementById('burger');
  const navLinks = document.getElementById('navLinks');
  
  if (burger && navLinks) {
    burger.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      const icon = burger.querySelector('i');
      if (navLinks.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
      } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
      }
    });

    // Fechar menu ao clicar em um link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        const icon = burger.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
      });
    });
  }

  // 3. Efeito Navbar Transparente/Sólida ao rolar e esconder seta
  const navbar = document.getElementById('navbar');
  const scrollIndicator = document.getElementById('scrollIndicator');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    
    // Esconder indicador de scroll
    if (scrollIndicator) {
      if (window.scrollY > 100) {
        scrollIndicator.style.opacity = '0';
        scrollIndicator.style.pointerEvents = 'none';
      } else {
        scrollIndicator.style.opacity = '1';
        scrollIndicator.style.pointerEvents = 'auto';
      }
    }
  });

  // 4. Scroll Reveal (Intersection Observer)
  const revealElements = document.querySelectorAll('.reveal');
  const progressBars = document.querySelectorAll('.skill-progress');
  
  const revealOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
  };

  const revealOnScroll = new IntersectionObserver(function(entries, observer) {
    entries.forEach(entry => {
      if (!entry.isIntersecting) {
        return;
      } else {
        entry.target.classList.add('active');
        
        // Se for a seção de habilidades, animar as barras
        if (entry.target.classList.contains('skills-category') || entry.target.closest('.skills-category')) {
           const bars = entry.target.querySelectorAll('.skill-progress');
           bars.forEach(bar => {
              const width = bar.getAttribute('data-width');
              bar.style.width = width;
           });
        }
        
        observer.unobserve(entry.target);
      }
    });
  }, revealOptions);

  revealElements.forEach(el => {
    revealOnScroll.observe(el);
  });

  // 5. Typing Effect (Efeito de Digitação)
  const typingSpan = document.querySelector('.typing-effect');
  const words = ['Analista de Sistemas', 'Desenvolvedor', 'Técnico em Eletrotécnica', 'Criador de Soluções'];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeSpeed = 100;

  function type() {
    if (!typingSpan) return;

    const currentWord = words[wordIndex];
    
    if (isDeleting) {
      typingSpan.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      typeSpeed = 50;
    } else {
      typingSpan.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      typeSpeed = 100;
    }

    if (!isDeleting && charIndex === currentWord.length) {
      isDeleting = true;
      typeSpeed = 2000; // Pausa no final da palavra
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typeSpeed = 500; // Pausa antes da próxima palavra
    }

    setTimeout(type, typeSpeed);
  }
  
  // Iniciar digitação
  if(typingSpan) {
    setTimeout(type, 1000);
  }

  // 6. Filtro de Projetos
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.projects .card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all buttons
      filterBtns.forEach(b => b.classList.remove('active'));
      // Add active class to clicked button
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        if (filterValue === 'all' || card.getAttribute('data-category').includes(filterValue)) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.8)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // 7. Active Menu Link on Scroll
  const sections = document.querySelectorAll('section');
  const navItems = document.querySelectorAll('.nav-item');

  window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (scrollY >= (sectionTop - 200)) {
        current = section.getAttribute('id');
      }
    });

    navItems.forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('href') === `#${current}`) {
        item.classList.add('active');
      }
    });
    
    // Tratamento especial para o "Início" / Hero
    if(scrollY < 300) {
        navItems.forEach(item => item.classList.remove('active'));
        document.querySelector('.nav-item[href="#home"]')?.classList.add('active');
    }
  });

  // 8. Form Validation & AJAX Submit (Web3Forms)
  const form = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault(); // Impede o redirecionamento padrão

      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const msg = document.getElementById('message').value.trim();

      if (!name || !email || !msg) {
        showStatus('Por favor, preencha todos os campos antes de enviar.', 'error');
        return;
      }
      
      const btn = form.querySelector('.send-btn');
      const originalBtnText = btn.innerHTML;
      btn.innerHTML = 'Enviando... <i class="fas fa-spinner fa-spin"></i>';
      btn.style.opacity = '0.8';
      btn.style.cursor = 'not-allowed';
      btn.disabled = true;

      try {
        const formData = new FormData(form);
        const object = Object.fromEntries(formData.entries());
        const json = JSON.stringify(object);

        const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: json
        });
        
        const jsonResponse = await response.json();

        if (response.status === 200) {
          showStatus('Mensagem enviada com sucesso! Entrarei em contato em breve.', 'success');
          form.reset();
        } else {
          showStatus(jsonResponse.message || 'Ocorreu um erro ao enviar. Tente novamente.', 'error');
        }
      } catch (error) {
        showStatus('Erro de conexão. Verifique sua internet.', 'error');
      } finally {
        btn.innerHTML = originalBtnText;
        btn.style.opacity = '1';
        btn.style.cursor = 'pointer';
        btn.disabled = false;
      }
    });
  }

  // Função auxiliar para exibir as mensagens no HTML
  function showStatus(message, type) {
    if (!formStatus) return;
    formStatus.textContent = message;
    formStatus.style.display = 'block';
    
    if (type === 'success') {
      formStatus.style.backgroundColor = 'rgba(16, 185, 129, 0.1)';
      formStatus.style.color = '#10b981';
      formStatus.style.border = '1px solid #10b981';
    } else {
      formStatus.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
      formStatus.style.color = '#ef4444';
      formStatus.style.border = '1px solid #ef4444';
    }
    
    setTimeout(() => {
      formStatus.style.display = 'none';
    }, 5000);
  }
});

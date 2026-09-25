(function () {
    function initTestimonials() {
      if (typeof Swiper !== 'undefined' && document.querySelector('.testimonials-slider')) {
        new Swiper('.testimonials-slider', {
          slidesPerView: 3.2,
          spaceBetween: 16,
          centeredSlides: false,
          loop: false,
          allowTouchMove: true,
          simulateTouch: true,
          grabCursor: true,
          
          breakpoints: {
            480: {
              slidesPerView: 4,
              spaceBetween: 20
            },
            768: {
              slidesPerView: 5,
              spaceBetween: 24
            }
          }
        });
      }
  
      function getYouTubeEmbedUrl(url) {
        if (!url) return null;
        let regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        let match = url.match(regExp);
        return (match && match[2].length === 11) ? 'https://www.youtube.com/embed/' + match[2] + '?autoplay=1' : null;
      }
  
      function getVimeoEmbedUrl(url) {
        if (!url) return null;
        let match = url.match(/(?:vimeo)\.com.*(?:videos\/|video\/|channels\/|channels\/\w+\/|)(\d+)/);
        return match ? 'https://player.vimeo.com/video/' + match[1] + '?autoplay=1' : null;
      }
  
      const modals = document.querySelectorAll('.testimonial-modal');
      if (!modals.length) return;
  
      modals.forEach(modal => {
        const modalBody = modal.querySelector('.testimonial-modal__body');
        const closeBtn = modal.querySelector('.testimonial-modal__close');
  
        function openModal(type, url) {
          if (!url || !modalBody) return;
          modalBody.innerHTML = '';
  
          if (type === 'video') {
            const ytUrl = getYouTubeEmbedUrl(url);
            const vimeoUrl = getVimeoEmbedUrl(url);
  
            if (ytUrl) {
              modalBody.innerHTML = `<iframe src="${ytUrl}" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
            } else if (vimeoUrl) {
              modalBody.innerHTML = `<iframe src="${vimeoUrl}" allow="autoplay; fullscreen" allowfullscreen></iframe>`;
            } else {
              modalBody.innerHTML = `<video src="${url}" controls autoplay playsinline style="max-width:100%; max-height:80vh;"></video>`;
            }
          } else {
            modalBody.innerHTML = `<img src="${url}" alt="Testimonial photo">`;
          }
  
          modal.classList.add('is-open');
          modal.setAttribute('aria-hidden', 'false');
        }
  
        function closeModal() {
          modal.classList.remove('is-open');
          modal.setAttribute('aria-hidden', 'true');
          if (modalBody) modalBody.innerHTML = '';
        }
  
        const section = modal.closest('.main-product-assignment') || document;
        section.querySelectorAll('.testimonial-card__avatar-wrapper').forEach(wrapper => {
          wrapper.addEventListener('click', function (e) {
            e.stopPropagation();
            const type = this.getAttribute('data-media-type');
            const url = this.getAttribute('data-media-url');
            openModal(type, url);
          });
        });
  
        if (closeBtn) {
          closeBtn.addEventListener('click', closeModal);
        }
  
        modal.addEventListener('click', function (e) {
          if (e.target === modal) closeModal();
        });
      });
    }
  
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initTestimonials);
    } else {
      initTestimonials();
    }
  })();
gsap.registerPlugin(ScrollTrigger);
  

    gsap.from('.ph-inner h1', {
      y: 60,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      delay: .4
    });
    gsap.from('.ph-inner .s-label', {
      y: 30,
      opacity: 0,
      duration: .8,
      ease: 'power3.out',
      delay: .2
    });
  

    // ── Contact Form Handler ──────────────────────────────────────────────────
    (function () {
      var btn = document.getElementById('submitBtn');
      var form = document.querySelector('.contact-form');
      var nameEl = form.querySelector('input[name="name"]');
      var emailEl = form.querySelector('input[name="email"]');
      var subjEl = form.querySelector('input[name="subject"]');
      var msgEl = form.querySelector('textarea[name="message"]');

      function getErr(el) {
        return el.closest('.form-group').querySelector('.form-error');
      }

      function setError(el, msg) {
        el.closest('.form-group').classList.add('has-error');
        getErr(el).textContent = msg;
      }

      function clearErrors() {
        form.querySelectorAll('.form-group').forEach(function (g) {
          g.classList.remove('has-error');
          g.querySelector('.form-error').textContent = '';
        });
      }

      function validate() {
        var ok = true;
        if (!nameEl.value.trim()) {
          setError(nameEl, 'Please enter your name.');
          ok = false;
        }
        var em = emailEl.value.trim();
        if (!em) {
          setError(emailEl, 'Please enter your email address.');
          ok = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) {
          setError(emailEl, 'Please enter a valid email.');
          ok = false;
        }
        if (!subjEl.value.trim()) {
          setError(subjEl, 'Please enter a subject.');
          ok = false;
        }
        if (!msgEl.value.trim()) {
          setError(msgEl, 'Please enter your message.');
          ok = false;
        }
        return ok;
      }

      btn.addEventListener('click', function () {
        clearErrors();
        if (!validate()) return;

        var orig = btn.textContent;
        btn.textContent = 'Sending…';
        btn.classList.add('loading');

        var fd = new FormData();
        fd.append('name', nameEl.value.trim());
        fd.append('email', emailEl.value.trim());
        fd.append('subject', subjEl.value.trim());
        fd.append('message', msgEl.value.trim());

        fetch('email.php', {
            method: 'POST',
            body: fd
          })
          .then(function (r) {
            return r.json();
          })
          .then(function (data) {
            if (data.success) {
              nameEl.value = '';
              emailEl.value = '';
              subjEl.value = '';
              msgEl.value = '';
              showThankYou();
            } else {
              alert(data.message || 'Something went wrong. Please try again.');
            }
          })
          .catch(function () {
            alert('Network error. Please check your connection and try again.');
          })
          .finally(function () {
            btn.textContent = orig;
            btn.classList.remove('loading');
          });
      });
    })();

    function showThankYou() {
      var overlay = document.getElementById('thankyouOverlay');
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeThankYou() {
      var overlay = document.getElementById('thankyouOverlay');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }
    document.getElementById('thankyouOverlay').addEventListener('click', function (e) {
      if (e.target === this) closeThankYou();
    });
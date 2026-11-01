(function () {
  'use strict';

  var EMAIL_ESCRITORIO = 'fabiosarinho@uol.com.br';

  // Menu mobile -----------------------------------------------------------
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('menu');

  function setMenu(open) {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    nav.classList.toggle('is-open', open);
  }

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      setMenu(toggle.getAttribute('aria-expanded') !== 'true');
    });

    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        setMenu(false);
        toggle.focus();
      }
    });

    window.matchMedia('(min-width: 981px)').addEventListener('change', function (mq) {
      if (mq.matches) setMenu(false);
    });
  }

  // Ano no rodapé ---------------------------------------------------------
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  // Formulário de contato --------------------------------------------------
  // Sem servidor: valida os campos e abre o e-mail do visitante já preenchido.
  // Para envio direto, troque o bloco "mailto" por um fetch() ao serviço de formulários escolhido.
  var form = document.getElementById('form-contato');
  if (!form) return;

  var status = form.querySelector('.form__status');

  function markInvalid(input, invalid) {
    var wrapper = input.closest('.field') || input.closest('.check');
    if (wrapper) wrapper.classList.toggle('is-invalid', invalid);
    input.setAttribute('aria-invalid', String(invalid));
  }

  form.addEventListener('input', function (e) {
    if (e.target.getAttribute('aria-invalid') === 'true') {
      markInvalid(e.target, !e.target.checkValidity());
    }
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var firstInvalid = null;
    form.querySelectorAll('[required]').forEach(function (input) {
      var invalid = !input.checkValidity();
      markInvalid(input, invalid);
      if (invalid && !firstInvalid) firstInvalid = input;
    });

    if (firstInvalid) {
      status.textContent = 'Preencha os campos destacados para enviar sua mensagem.';
      status.classList.add('is-error');
      firstInvalid.focus();
      return;
    }

    var data = new FormData(form);
    var assunto = 'Contato pelo site · ' + data.get('assunto');
    var corpo =
      'Nome: ' + data.get('nome') + '\n' +
      'Telefone: ' + data.get('telefone') + '\n' +
      'E-mail: ' + data.get('email') + '\n\n' +
      data.get('mensagem');

    window.location.href =
      'mailto:' + EMAIL_ESCRITORIO +
      '?subject=' + encodeURIComponent(assunto) +
      '&body=' + encodeURIComponent(corpo);

    status.classList.remove('is-error');
    status.textContent = 'Abrimos seu aplicativo de e-mail com a mensagem pronta. Se ele não abrir, escreva para ' + EMAIL_ESCRITORIO + '.';
  });
})();

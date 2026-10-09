document.addEventListener('DOMContentLoaded', function () {
  prepararMenu();
  prepararModoDeCor();
  prepararTextoAnimado();
  prepararBrilhoDoMouse();
  marcarParteAtual();
  prepararContato();
});

function prepararMenu() {
  const botaoDoMenu = document.querySelector('.menu-toggle');
  const listaDoMenu = document.querySelector('.nav-links');
  const linksDoMenu = document.querySelectorAll('.nav-link, .nav-cta, .brand, .back-top, .hero-actions a, .round-arrow');

  if (botaoDoMenu && listaDoMenu) {
    botaoDoMenu.addEventListener('click', function () {
      const menuAberto = listaDoMenu.classList.toggle('open');
      botaoDoMenu.setAttribute('aria-expanded', menuAberto ? 'true' : 'false');
      botaoDoMenu.textContent = menuAberto ? '×' : '☰';
    });
  }

  linksDoMenu.forEach(function (link) {
    link.addEventListener('click', function (evento) {
      const idDaParte = link.getAttribute('href');

      if (!idDaParte || idDaParte.charAt(0) !== '#') return;

      const parteDoSite = document.querySelector(idDaParte);
      if (!parteDoSite) return;

      evento.preventDefault();
      parteDoSite.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.replaceState(null, '', idDaParte);

      if (listaDoMenu && botaoDoMenu) {
        listaDoMenu.classList.remove('open');
        botaoDoMenu.setAttribute('aria-expanded', 'false');
        botaoDoMenu.textContent = '☰';
      }
    });
  });
}

function prepararModoDeCor() {
  const botaoDeCor = document.getElementById('themeToggle');
  const desenhoDoBotao = document.getElementById('themeIcon');
  const nomeDoBotao = document.querySelector('.theme-label');

  if (!botaoDeCor) return;

  let corSalva = 'light';

  try {
    corSalva = localStorage.getItem('miguel-theme') || 'light';
  } catch (erro) {
    corSalva = 'light';
  }

  mudarCorDoSite(corSalva === 'dark');

  botaoDeCor.addEventListener('click', function () {
    const ativarModoEscuro = !document.body.classList.contains('dark');
    mudarCorDoSite(ativarModoEscuro);

    try {
      localStorage.setItem('miguel-theme', ativarModoEscuro ? 'dark' : 'light');
    } catch (erro) {
      return;
    }
  });

  function mudarCorDoSite(modoEscuro) {
    document.body.classList.toggle('dark', modoEscuro);
    document.documentElement.style.colorScheme = modoEscuro ? 'dark' : 'light';

    if (desenhoDoBotao) desenhoDoBotao.textContent = modoEscuro ? '☀' : '☾';
    if (nomeDoBotao) nomeDoBotao.textContent = modoEscuro ? 'Modo claro' : 'Modo escuro';

    botaoDeCor.setAttribute('aria-label', modoEscuro ? 'Ativar modo claro' : 'Ativar modo escuro');
  }
}

function prepararTextoAnimado() {
  const textoDaApresentacao = document.getElementById('typingText');
  if (!textoDaApresentacao) return;

  const frasesDaApresentacao = [
    'Estudante de TI',
    'Apaixonado por tecnologia',
    'Sempre aprendendo'
  ];

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let numeroDaFrase = 0;
  let letrasMostradas = frasesDaApresentacao[0].length;
  let apagandoTexto = false;

  function escreverNaTela() {
    const fraseEscolhida = frasesDaApresentacao[numeroDaFrase];
    letrasMostradas = letrasMostradas + (apagandoTexto ? -1 : 1);
    textoDaApresentacao.textContent = fraseEscolhida.slice(0, letrasMostradas);

    let tempoDeEspera = apagandoTexto ? 45 : 80;

    if (!apagandoTexto && letrasMostradas >= fraseEscolhida.length) {
      apagandoTexto = true;
      tempoDeEspera = 1300;
    } else if (apagandoTexto && letrasMostradas <= 0) {
      apagandoTexto = false;
      numeroDaFrase = (numeroDaFrase + 1) % frasesDaApresentacao.length;
      tempoDeEspera = 250;
    }

    window.setTimeout(escreverNaTela, tempoDeEspera);
  }

  window.setTimeout(escreverNaTela, 1200);
}

function prepararBrilhoDoMouse() {
  const brilhoDoMouse = document.querySelector('.mouse-glow');
  const mouseEstaDisponivel = window.matchMedia('(pointer: fine)').matches;
  const movimentoReduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!brilhoDoMouse || !mouseEstaDisponivel || movimentoReduzido) return;

  window.addEventListener('mousemove', function (movimento) {
    brilhoDoMouse.style.left = movimento.clientX + 'px';
    brilhoDoMouse.style.top = movimento.clientY + 'px';
    brilhoDoMouse.style.opacity = '1';
  });

  document.addEventListener('mouseleave', function () {
    brilhoDoMouse.style.opacity = '0';
  });
}

function marcarParteAtual() {
  if (!('IntersectionObserver' in window)) return;

  const partesDoSite = document.querySelectorAll('main section[id]');
  const linksDoMenu = document.querySelectorAll('.nav-link');

  const observadorDePartes = new IntersectionObserver(function (partesVisiveis) {
    partesVisiveis.forEach(function (parteVisivel) {
      if (!parteVisivel.isIntersecting) return;

      linksDoMenu.forEach(function (link) {
        const linkEstaNaParteAtual = link.getAttribute('href') === '#' + parteVisivel.target.id;
        link.classList.toggle('active', linkEstaNaParteAtual);
      });
    });
  }, { rootMargin: '-25% 0px -60% 0px' });

  partesDoSite.forEach(function (parte) {
    observadorDePartes.observe(parte);
  });
}

function prepararContato() {
  const formularioDeContato = document.getElementById('contactForm');
  const avisoDoFormulario = document.getElementById('formHint');

  if (!formularioDeContato) return;

  formularioDeContato.addEventListener('submit', function (evento) {
    evento.preventDefault();

    const informacoesDoFormulario = new FormData(formularioDeContato);
    const nomeDaPessoa = informacoesDoFormulario.get('nome');
    const telefoneDaPessoa = informacoesDoFormulario.get('telefone') || 'Não informado';
    const emailDaPessoa = informacoesDoFormulario.get('email');
    const mensagemDaPessoa = informacoesDoFormulario.get('mensagem');

    const assuntoDoEmail = encodeURIComponent('Contato pelo portfólio - ' + nomeDaPessoa);
    const textoDoEmail = encodeURIComponent(
      'Nome: ' + nomeDaPessoa + '\nTelefone: ' + telefoneDaPessoa + '\nE-mail: ' + emailDaPessoa + '\n\nMensagem:\n' + mensagemDaPessoa
    );

    if (avisoDoFormulario) {
      avisoDoFormulario.textContent = 'Abrindo seu aplicativo de e-mail. Se não abrir, confira se existe um aplicativo de e-mail configurado.';
    }

    window.location.href = 'mailto:seuemail@exemplo.com?subject=' + assuntoDoEmail + '&body=' + textoDoEmail;
  });
}

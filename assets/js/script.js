/**
 * IM Store — E-commerce Front-End Application
 * Arquitetura modular em JavaScript puro (Vanilla JS)
 * Recursos: Hero 3D animada, catálogo dinâmico com controle de quantidade e variações,
 * filtros por categoria, busca semântica, carrinho persistente em localStorage
 * e finalização de pedidos integrada ao WhatsApp da Isa.
 */

'use strict';

(function () {
  /* ==========================================================================
     1. CONFIGURAÇÃO DO WHATSAPP DA ISA E CHAVES DE ARMAZENAMENTO
     ========================================================================== */

  /**
   * NÚMERO OFICIAL DE WHATSAPP DA IM STORE
   * Formato: 55 + DDD + número (11 98621-6603)
   */
  const ISA_WHATSAPP_NUMBER = '5511986216603';

  const STORAGE_KEYS = {
    CART: 'im_store_cart_v1',
    PRICES: 'im_store_prices_v1',
    WHATSAPP: 'im_store_whatsapp_v1',
    FAVORITES: 'im_store_favorites_v1'
  };

  /* ==========================================================================
     2. DADOS OFICIAIS DO CATÁLOGO — IM STORE
     ========================================================================== */

  /**
   * Catálogo oficial contendo exclusivamente os produtos reais da IM Store.
   * Preços iniciam como `null` (pendentes de cadastro comercial pela lojista),
   * sem valores fictícios inventados.
   */
  let CATALOG_PRODUCTS = [
    {
      id: 'esfoliante-pitaya-150g',
      name: 'Esfoliante de Pitaya — 150 g',
      categoryKey: 'esfoliantes',
      categoryLabel: 'Bio Instinto • Rosto e corpo',
      filterGroups: ['todos', 'esfoliantes', 'cuidados-pele'],
      tag: 'Esfoliante • 150 g',
      spec: 'Peso líquido: 150 g • Rosto e corpo',
      shortDesc: 'Linha Banho Premium Bio Instinto. Desobstrui poros e elimina impurezas da pele.',
      description:
        'O Esfoliante Rosto e Corpo de Pitaya (150 g) da linha Banho Premium — Eu Amo Frutas (Bio Instinto) foi desenvolvido para renovar a pele com delicadeza, auxiliando a desobstruir os poros e eliminar impurezas durante o banho ou ritual de skincare.',
      image: './assets/images/esfoliantes.1.webp',
      imageAlt: 'Esfoliante Rosto e Corpo Bio Instinto de Pitaya 150 g',
      careNote: 'Indicado para uso facial e corporal. Enxágue abundantemente após a aplicação.',
      highlights: [
        'Peso líquido confirmado na embalagem: 150 g',
        'Aplicação versátil: indicado para rosto e corpo',
        'Ação principal: desobstrui poros e elimina impurezas da pele',
        'Aroma frutado de Pitaya — Linha Banho Premium'
      ],
      variants: ['150 g — Pitaya (Unidade)'],
      defaultPrice: 17.60,
      originalPrice: 24.90,
      rating: 4.9,
      reviewsCount: 24,
      featuredOrder: 1
    },
    {
      id: 'esfoliante-morango-150g',
      name: 'Esfoliante de Morango — 150 g',
      categoryKey: 'esfoliantes',
      categoryLabel: 'Bio Instinto • Rosto e corpo',
      filterGroups: ['todos', 'esfoliantes', 'cuidados-pele'],
      tag: 'Esfoliante • 150 g',
      spec: 'Peso líquido: 150 g • Rosto e corpo',
      shortDesc: 'Linha Banho Premium Bio Instinto. Desobstrui poros e elimina impurezas da pele.',
      description:
        'O Esfoliante Rosto e Corpo de Morango (150 g) da linha Banho Premium — Eu Amo Frutas (Bio Instinto) promove esfoliação equilibrada para o rosto e o corpo, ajudando a desobstruir os poros e remover impurezas com fragrância suave de morango.',
      image: './assets/images/esfoliantes.2.webp',
      imageAlt: 'Esfoliante Rosto e Corpo Bio Instinto de Morango 150 g',
      careNote: 'Ideal para manter a pele limpa, macia e renovada na sua rotina de cuidados.',
      highlights: [
        'Peso líquido confirmado na embalagem: 150 g',
        'Aplicação versátil: indicado para rosto e corpo',
        'Ação principal: desobstrui poros e elimina impurezas da pele',
        'Aroma frutado de Morango — Linha Banho Premium'
      ],
      variants: ['150 g — Morango (Unidade)'],
      defaultPrice: 17.60,
      originalPrice: 24.90,
      rating: 4.9,
      reviewsCount: 19,
      featuredOrder: 2
    },
    {
      id: 'esfoliante-uva-150g',
      name: 'Esfoliante de Uva — 150 g',
      categoryKey: 'esfoliantes',
      categoryLabel: 'Bio Instinto • Rosto e corpo',
      filterGroups: ['todos', 'esfoliantes', 'cuidados-pele'],
      tag: 'Esfoliante • 150 g',
      spec: 'Peso líquido: 150 g • Rosto e corpo',
      shortDesc: 'Linha Banho Premium Bio Instinto. Desobstrui poros e elimina impurezas da pele.',
      description:
        'O Esfoliante Rosto e Corpo de Uva (150 g) da linha Banho Premium — Eu Amo Frutas (Bio Instinto) combina cuidado facial e corporal em uma textura agradável que desobstrui os poros e elimina impurezas da pele.',
      image: './assets/images/esfoliantes.3.webp',
      imageAlt: 'Esfoliante Rosto e Corpo Bio Instinto de Uva 150 g',
      careNote: 'Proporciona sensação de frescor e renovação para o rosto e para o corpo.',
      highlights: [
        'Peso líquido confirmado na embalagem: 150 g',
        'Aplicação versátil: indicado para rosto e corpo',
        'Ação principal: desobstrui poros e elimina impurezas da pele',
        'Aroma frutado de Uva — Linha Banho Premium'
      ],
      variants: ['150 g — Uva (Unidade)'],
      defaultPrice: 17.60,
      originalPrice: 24.90,
      rating: 4.8,
      reviewsCount: 16,
      featuredOrder: 3
    },
    {
      id: 'esfoliante-framboesa-150g',
      name: 'Esfoliante de Framboesa — 150 g',
      categoryKey: 'esfoliantes',
      categoryLabel: 'Bio Instinto • Rosto e corpo',
      filterGroups: ['todos', 'esfoliantes', 'cuidados-pele'],
      tag: 'Esfoliante • 150 g',
      spec: 'Peso líquido: 150 g • Rosto e corpo',
      shortDesc: 'Linha Banho Premium Bio Instinto. Desobstrui poros e elimina impurezas da pele.',
      description:
        'O Esfoliante Rosto e Corpo de Framboesa (150 g) da linha Banho Premium — Eu Amo Frutas (Bio Instinto) oferece cuidado prático para o dia a dia, auxiliando a desobstruir os poros e eliminar impurezas da pele com delicadeza.',
      image: './assets/images/esfoliantes.4.webp',
      imageAlt: 'Esfoliante Rosto e Corpo Bio Instinto de Framboesa 150 g',
      careNote: 'Transforme o momento do banho e do skincare em um ritual perfumado e acolhedor.',
      highlights: [
        'Peso líquido confirmado na embalagem: 150 g',
        'Aplicação versátil: indicado para rosto e corpo',
        'Ação principal: desobstrui poros e elimina impurezas da pele',
        'Aroma frutado de Framboesa — Linha Banho Premium'
      ],
      variants: ['150 g — Framboesa (Unidade)'],
      defaultPrice: 17.60,
      originalPrice: 24.90,
      rating: 4.9,
      reviewsCount: 21,
      featuredOrder: 4
    },
    {
      id: 'escova-limpeza-facial',
      name: 'Escova de Limpeza Facial 2 em 1',
      categoryKey: 'skincare',
      categoryLabel: 'Acessórios para skincare',
      filterGroups: ['todos', 'skincare', 'cuidados-pele', 'acessorios', 'acessorios-beleza'],
      tag: 'Skincare • Dupla Ação 2 em 1',
      spec: 'Cerdas ultrafinas + silicone esfoliante • Cabo anatômico',
      shortDesc: 'Limpeza profunda com cerdas suaves de um lado e massagem esfoliante de silicone do outro.',
      description:
        'A Escova de Limpeza Facial 2 em 1 é o acessório essencial para elevar seu momento diário de autocuidado. De um lado, cerdas ultrafinas proporcionam higienização profunda dos poros sem agredir; do outro lado, cerdas de silicone macio realizam massagem relaxante e esfoliação revigorante. Seu cabo anatômico ergonômico oferece controle firme e confortável.',
      image: './assets/images/escovafacial.webp',
      imageAlt: 'Escova de Limpeza Facial 2 em 1 Rosa',
      imageFit: 'contain',
      careNote: 'Aplique seu sabonete facial habitual e utilize as cerdas para limpeza e o silicone para massagear suavemente.',
      highlights: [
        'Design 2 em 1: cerdas densas para limpeza profunda e silicone para massagem esfoliante',
        'Cabo anatômico ergonômico que proporciona firmeza e precisão no manuseio',
        'Indicada para uso diário em todos os tipos de pele sem agredir ou ressecar',
        'Disponível em 3 opções de cores oficiais da IM Store'
      ],
      variants: ['Rosa', 'Branca e Rosa', 'Azul'],
      variantImages: {
        'Rosa': './assets/images/escovafacial.webp',
        'Branca e Rosa': './assets/images/escovafacial-rosa.webp',
        'Azul': './assets/images/escovafacial-azul.webp'
      },
      variantColors: {
        'Rosa': {
          label: 'Rosa',
          swatchType: 'solid',
          bg: '#f69cb2',
          circleCss: 'background-color: #f69cb2;'
        },
        'Branca e Rosa': {
          label: 'Branca e Rosa',
          swatchType: 'duo',
          bg: 'linear-gradient(135deg, #ffffff 50%, #f69cb2 50%)',
          circleCss: 'background: linear-gradient(135deg, #ffffff 50%, #f69cb2 50%); border: 1.5px solid #f69cb2;'
        },
        'Azul': {
          label: 'Azul',
          swatchType: 'duo',
          bg: 'linear-gradient(135deg, #ffffff 50%, #64b7e8 50%)',
          circleCss: 'background: linear-gradient(135deg, #ffffff 50%, #64b7e8 50%); border: 1.5px solid #64b7e8;'
        }
      },
      defaultVariant: 'Rosa',
      defaultPrice: 12.90,
      rating: 5.0,
      reviewsCount: 32,
      featuredOrder: 5
    },
    {
      id: 'faixa-cabelo-make',
      name: 'Faixa de Cabelo Plush com Laço',
      categoryKey: 'faixas',
      categoryLabel: 'Acessórios de beleza',
      filterGroups: ['todos', 'faixas', 'skincare', 'acessorios', 'acessorios-beleza'],
      tag: 'Acessório • 4 Variações',
      spec: 'Variações: Rosa c/ Branco, Oncinha, Rosa Blush, Lilás',
      shortDesc: 'Toque macio e ajuste confortável para proteger os fios na hora da make e do skincare.',
      description:
        'As faixas de cabelo peluciadas com laço são as queridinhas para a hora da maquiagem e do skincare. Com toque super macio e elástico confortável, mantêm os fios afastados do rosto sem marcar, trazendo praticidade e charme para o seu momento de beleza.',
      image: './assets/images/faixadecabelo.webp',
      imageAlt: 'Faixas de cabelo de pelúcia macia com laço para maquiagem',
      imageFit: 'contain',
      careNote: 'Perfeita para usar durante a limpeza facial, aplicação de máscaras, esfoliação e maquiagem.',
      highlights: [
        'Tecido peluciado de toque macio e delicado',
        'Elástico confortável que se ajusta sem apertar',
        'Ideal para rotinas de maquiagem e cuidados com a pele',
        'Disponível nas 4 variações apresentadas na coleção IM Store'
      ],
      variants: [
        'Rosa com Branco',
        'Rosa Estampa Oncinha',
        'Rosa Blush',
        'Lilás'
      ],
      defaultPrice: 10.00,
      rating: 4.9,
      reviewsCount: 28,
      featuredOrder: 6
    }
  ];

  /* ==========================================================================
     3. ESTADO DA APLICAÇÃO
     ========================================================================== */

  const state = {
    activeCategory: 'todos',
    searchQuery: '',
    sortBy: 'featured',
    cart: [],
    customPrices: {},
    whatsappNumber: '',
    favorites: [],
    activeDetailProductId: null,
    lastFocusedElement: null,
    toastTimeout: null,
    scrollObserver: null
  };

  /* ==========================================================================
     4. FUNÇÕES UTILITÁRIAS E FORMATAÇÃO MONETÁRIA (R$)
     ========================================================================== */

  const currencyFormatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });

  function formatCurrency(value) {
    if (typeof value !== 'number' || Number.isNaN(value) || value <= 0) {
      return null;
    }
    return currencyFormatter.format(value);
  }

  /**
   * Formata valor em Real brasileiro com espaço padrão ("R$ 24,90")
   * para uso consistente na mensagem do WhatsApp e na interface.
   */
  function formatBRLPlain(value) {
    if (typeof value !== 'number' || Number.isNaN(value) || value < 0) {
      return 'R$ 0,00';
    }
    return currencyFormatter.format(value).replace(/\u00a0/g, ' ');
  }

  function sanitizeWhatsAppNumber(raw) {
    return String(raw || '').replace(/\D/g, '');
  }

  function getEffectiveWhatsAppNumber() {
    const defaultClean = sanitizeWhatsAppNumber(ISA_WHATSAPP_NUMBER);
    if (defaultClean.length >= 10) {
      return defaultClean;
    }
    const customClean = sanitizeWhatsAppNumber(state.whatsappNumber);
    if (customClean.length >= 10) {
      return customClean;
    }
    return '5511986216603';
  }

  function normalizeText(str) {
    return String(str || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }

  function getProductById(productId) {
    return CATALOG_PRODUCTS.find((p) => p.id === productId) || null;
  }

  function getProductFallbackImage(product) {
    if (!product) return '';
    if (product.id === 'faixa-cabelo-make' || product.id === 'faixa-de-cabelo-plush-com-laco') {
      return './assets/images/faixadecabelo.webp';
    }
    if (product.id === 'escova-limpeza-facial' || product.id === 'escova-de-limpeza-facial-2-em-1') {
      return './assets/images/escovafacial.webp';
    }
    return '';
  }

  function getProductImageForVariant(product, variantName) {
    if (!product) return '';
    const variantImage = product.variantImages && variantName
      ? product.variantImages[variantName]
      : '';
    if (typeof variantImage === 'string' && variantImage.trim()) return variantImage.trim();

    if (typeof product.image === 'string' && product.image.trim()) return product.image.trim();
    return getProductFallbackImage(product);
  }

  function createProductImagePlaceholder(product) {
    const placeholder = document.createElement('div');
    placeholder.className = 'product-image-placeholder';
    placeholder.setAttribute('role', 'img');
    placeholder.setAttribute('aria-label', 'Imagem temporariamente indisponível para ' + (product && product.name ? product.name : 'o produto'));

    const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    icon.setAttribute('viewBox', '0 0 24 24');
    icon.setAttribute('fill', 'none');
    icon.setAttribute('stroke', 'currentColor');
    icon.setAttribute('stroke-width', '1.4');
    icon.setAttribute('stroke-linecap', 'round');
    icon.setAttribute('stroke-linejoin', 'round');
    icon.setAttribute('aria-hidden', 'true');

    const frame = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    frame.setAttribute('x', '3');
    frame.setAttribute('y', '3');
    frame.setAttribute('width', '18');
    frame.setAttribute('height', '18');
    frame.setAttribute('rx', '2');

    const imageMark = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    imageMark.setAttribute('d', 'm4 16 5-5 4 4 2-2 5 5M8.5 8.5h.01');
    icon.append(frame, imageMark);

    const caption = document.createElement('span');
    caption.className = 'placeholder-caption';
    caption.textContent = 'Foto em breve';
    placeholder.append(icon, caption);
    return placeholder;
  }

  function setProductImageSource(img, product, variantName, container) {
    if (!img || !product) return;

    const imageContainer = container || img.closest('.product-card-media, .detail-main-figure');
    const fallbackSrc = getProductFallbackImage(product);
    img.dataset.productFallbackSrc = fallbackSrc;

    if (img.dataset.productFallbackBound !== 'true') {
      img.addEventListener('error', () => {
        const failedUrl = img.currentSrc || img.src;

        // Auto-recuperação: se a imagem no Supabase falhar com .webp, tenta automaticamente com .jpg e .png
        if (failedUrl && failedUrl.includes('/storage/v1/object/public/product-images/')) {
          if (failedUrl.endsWith('.webp') && !img.dataset.retryAttempt) {
            img.dataset.retryAttempt = 'jpg';
            img.src = failedUrl.replace(/\.webp$/i, '.jpg');
            return;
          } else if (img.dataset.retryAttempt === 'jpg') {
            img.dataset.retryAttempt = 'png';
            img.src = failedUrl.replace(/\.jpg$/i, '.png');
            return;
          }
        }

        const fallback = img.dataset.productFallbackSrc || '';
        if (fallback) {
          const fallbackUrl = new URL(fallback, document.baseURI).href;
          if (img.dataset.productFallbackApplied !== 'true' && failedUrl !== fallbackUrl) {
            img.dataset.productFallbackApplied = 'true';
            img.src = fallbackUrl;
            return;
          }
        }

        // Se a imagem falhou e não há mais alternativas, oculta a tag quebrada e exibe o placeholder elegante
        img.hidden = true;
        const target = img.closest('.product-card-media, .detail-main-figure') || imageContainer;
        if (target && !target.querySelector('.product-image-placeholder')) {
          target.appendChild(createProductImagePlaceholder(product));
        }
      });
      img.dataset.productFallbackBound = 'true';
    }

    if (imageContainer) {
      const existingPlaceholder = imageContainer.querySelector('.product-image-placeholder');
      if (existingPlaceholder) existingPlaceholder.remove();
    }
    img.hidden = false;
    img.dataset.productFallbackApplied = 'false';
    delete img.dataset.retryAttempt;
    img.dataset.productImageName = product.name;
    img.alt = product.name + (variantName ? ' — ' + variantName : '');

    const targetSrc = getProductImageForVariant(product, variantName);
    if (!targetSrc) {
      // Se não há URL de imagem cadastrada, exibe diretamente o placeholder elegante
      img.hidden = true;
      if (imageContainer && !imageContainer.querySelector('.product-image-placeholder')) {
        imageContainer.appendChild(createProductImagePlaceholder(product));
      }
    } else {
      img.src = targetSrc;
    }
  }

  function getEffectivePrice(productId) {
    const product = getProductById(productId);
    return product && typeof product.defaultPrice === 'number' && product.defaultPrice > 0
      ? product.defaultPrice
      : null;
  }

  function announceToScreenReader(message) {
    const announcer = document.getElementById('a11y-announcer');
    if (!announcer) return;
    announcer.textContent = '';
    window.setTimeout(() => {
      announcer.textContent = message;
    }, 40);
  }

  function showToast(message) {
    const toast = document.getElementById('feedback-toast');
    const toastText = document.getElementById('feedback-toast-text');
    if (!toast || !toastText) return;

    toastText.textContent = message;
    toast.hidden = false;

    if (state.toastTimeout) {
      window.clearTimeout(state.toastTimeout);
    }
    state.toastTimeout = window.setTimeout(() => {
      toast.hidden = true;
    }, 4000);
  }

  /* ==========================================================================
     5. PERSISTÊNCIA EM LOCALSTORAGE (CARRINHO, PREÇOS & WHATSAPP)
     ========================================================================== */

  function loadStoredState() {
    try {
      const savedCart = window.localStorage.getItem(STORAGE_KEYS.CART);
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        if (Array.isArray(parsed)) {
          state.cart = parsed.filter(
            (item) =>
              item &&
              typeof item.productId === 'string' &&
              getProductById(item.productId) !== null &&
              typeof item.quantity === 'number' &&
              item.quantity > 0
          );
        }
      }
    } catch (err) {
      state.cart = [];
    }

    // Preços oficiais do catálogo e WhatsApp oficial da loja protegidos contra adulteração local
    state.customPrices = {};
    state.whatsappNumber = ISA_WHATSAPP_NUMBER;

    try {
      const savedFavorites = window.localStorage.getItem(STORAGE_KEYS.FAVORITES);
      if (savedFavorites) {
        const parsedFavs = JSON.parse(savedFavorites);
        if (Array.isArray(parsedFavs)) {
          state.favorites = parsedFavs.filter((id) => typeof id === 'string');
        }
      }
    } catch (err) {
      state.favorites = [];
    }
  }

  function saveFavoritesToStorage() {
    try {
      window.localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(state.favorites));
    } catch (err) {
      // Ignora erro caso localStorage esteja restrito
    }
  }

  function toggleFavorite(productId) {
    const product = getProductById(productId);
    if (!product) return;

    const idx = state.favorites.indexOf(productId);
    let isFav = false;
    if (idx > -1) {
      state.favorites.splice(idx, 1);
      isFav = false;
      showToast(product.name + ' removido dos favoritos.');
      announceToScreenReader(product.name + ' removido dos favoritos.');
    } else {
      state.favorites.push(productId);
      isFav = true;
      showToast(product.name + ' adicionado aos favoritos!');
      announceToScreenReader(product.name + ' adicionado aos favoritos.');
    }

    saveFavoritesToStorage();
    updateFavoriteButtonsUI();
  }

  function updateFavoriteButtonsUI() {
    const favButtons = document.querySelectorAll('[data-toggle-favorite]');
    favButtons.forEach((btn) => {
      const pid = btn.getAttribute('data-toggle-favorite');
      const isFav = state.favorites.includes(pid);
      btn.classList.toggle('active', isFav);
      btn.setAttribute('aria-pressed', isFav ? 'true' : 'false');
      btn.setAttribute('aria-label', isFav ? 'Remover dos favoritos' : 'Adicionar aos favoritos');
      const svg = btn.querySelector('svg');
      if (svg) {
        svg.setAttribute('fill', isFav ? '#e53935' : 'none');
        svg.setAttribute('stroke', isFav ? '#e53935' : 'currentColor');
      }
    });
  }

  function saveCartToStorage() {
    try {
      window.localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(state.cart));
    } catch (err) {
      // Ignora erro caso armazenamento esteja indisponível
    }
  }

  function savePricesToStorage() {
    try {
      window.localStorage.setItem(STORAGE_KEYS.PRICES, JSON.stringify(state.customPrices));
    } catch (err) {
      // Ignora erro caso armazenamento esteja indisponível
    }
  }

  function saveWhatsAppToStorage() {
    try {
      window.localStorage.setItem(STORAGE_KEYS.WHATSAPP, state.whatsappNumber);
    } catch (err) {
      // Ignora erro caso armazenamento esteja indisponível
    }
  }

  /* ==========================================================================
     6. RENDERIZAÇÃO DO CATÁLOGO, BUSCA E FILTROS
     ========================================================================== */

  function getFilteredProducts() {
    const query = normalizeText(state.searchQuery);

    const filtered = CATALOG_PRODUCTS.filter((product) => {
      const matchesCategory =
        state.activeCategory === 'todos' ||
        product.filterGroups.includes(state.activeCategory);

      if (!matchesCategory) return false;
      if (!query) return true;

      const searchableText = normalizeText(
        [
          product.name,
          product.categoryLabel,
          product.spec,
          product.shortDesc,
          product.description,
          product.variants.join(' ')
        ].join(' ')
      );

      return searchableText.includes(query);
    });

    return filtered.sort((a, b) => {
      if (state.sortBy === 'name-asc') {
        return a.name.localeCompare(b.name, 'pt-BR');
      }
      if (state.sortBy === 'name-desc') {
        return b.name.localeCompare(a.name, 'pt-BR');
      }
      if (state.sortBy === 'price-asc') {
        const priceA = getEffectivePrice(a.id);
        const priceB = getEffectivePrice(b.id);
        if (priceA === null && priceB === null) return a.featuredOrder - b.featuredOrder;
        if (priceA === null) return 1;
        if (priceB === null) return -1;
        return priceA - priceB;
      }
      return a.featuredOrder - b.featuredOrder;
    });
  }

  function createPriceDisplayNode(productId) {
    const product = getProductById(productId);
    const price = getEffectivePrice(productId);
    const formatted = formatCurrency(price);

    const priceRow = document.createElement('div');
    priceRow.className = 'product-price-row';
    priceRow.setAttribute('data-price-container', productId);

    if (formatted) {
      const priceSpan = document.createElement('span');
      priceSpan.className = 'product-price-value';
      priceSpan.textContent = formatted;
      priceRow.appendChild(priceSpan);

      const pixSpan = document.createElement('span');
      pixSpan.className = 'product-price-pix';
      pixSpan.textContent = ' no Pix';
      priceRow.appendChild(pixSpan);

      if (product && typeof product.originalPrice === 'number' && product.originalPrice > price) {
        const origDel = document.createElement('del');
        origDel.className = 'product-price-original';
        origDel.textContent = formatCurrency(product.originalPrice);
        priceRow.appendChild(origDel);

        const discountPercent = Math.round(((product.originalPrice - price) / product.originalPrice) * 100);
        const discountSpan = document.createElement('span');
        discountSpan.className = 'product-discount-percent';
        discountSpan.textContent = discountPercent + '% off';
        priceRow.appendChild(discountSpan);
      }

      return priceRow;
    }

    const badge = document.createElement('span');
    badge.className = 'price-pending-badge';
    badge.textContent = 'Preço pendente de cadastro';
    priceRow.appendChild(badge);
    return priceRow;
  }

  function createProductCardElement(product, index) {
    const li = document.createElement('li');
    li.className = 'product-grid-item';
    li.setAttribute('data-product-id', product.id);

    const initialVariant = product.defaultVariant || (product.variants ? product.variants[0] : '');

    const article = document.createElement('article');
    article.className = 'product-card reveal-on-scroll';
    article.setAttribute('data-product-id', product.id);
    if (initialVariant) {
      article.setAttribute('data-selected-variant', initialVariant);
    }
    article.style.setProperty('--reveal-delay', String((index % 3) * 85) + 'ms');

    // Media wrapper (botão circular de favoritos no canto superior direito, contain quando especificado)
    const mediaDiv = document.createElement('div');
    mediaDiv.className = 'product-card-media' + (product.imageFit === 'contain' ? ' has-contain-img' : '');

    // Botão circular de favoritos
    const isFav = state.favorites.includes(product.id);
    const favBtn = document.createElement('button');
    favBtn.type = 'button';
    favBtn.className = 'product-favorite-btn' + (isFav ? ' active' : '');
    favBtn.setAttribute('data-toggle-favorite', product.id);
    favBtn.setAttribute('aria-label', isFav ? 'Remover dos favoritos' : 'Adicionar aos favoritos');
    favBtn.setAttribute('aria-pressed', isFav ? 'true' : 'false');
    favBtn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="${isFav ? '#e53935' : 'none'}" stroke="${isFav ? '#e53935' : 'currentColor'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
      </svg>
    `;

    const mediaBtn = document.createElement('button');
    mediaBtn.type = 'button';
    mediaBtn.className = 'product-media-btn';
    mediaBtn.setAttribute('data-open-detail', product.id);
    mediaBtn.setAttribute('aria-label', 'Ver detalhes de ' + product.name);

    const img = document.createElement('img');
    img.width = 500;
    img.height = 500;
    img.loading = 'lazy';
    img.className = 'product-card-img' + (product.imageFit === 'contain' ? ' fit-contain' : '');
    setProductImageSource(img, product, initialVariant, mediaDiv);

    mediaBtn.appendChild(img);
    mediaDiv.appendChild(mediaBtn);
    mediaDiv.appendChild(favBtn);

    // Content wrapper - estética compacta e moderna inspirada na Nike
    const contentDiv = document.createElement('div');
    contentDiv.className = 'product-card-content';

    const h3 = document.createElement('h3');
    h3.className = 'product-card-title';

    const titleBtn = document.createElement('button');
    titleBtn.type = 'button';
    titleBtn.className = 'product-title-btn';
    titleBtn.setAttribute('data-open-detail', product.id);
    titleBtn.textContent = product.name;
    h3.appendChild(titleBtn);

    const categorySpan = document.createElement('span');
    categorySpan.className = 'product-category-label';
    categorySpan.textContent = product.categoryLabel;

    contentDiv.appendChild(h3);
    contentDiv.appendChild(categorySpan);

    // Linha de Preço (Valor atual no Pix, original riscado, % off em verde)
    const priceNode = createPriceDisplayNode(product.id);
    contentDiv.appendChild(priceNode);

    // Avaliação por estrelas e nota numérica (estilo Nike)
    const ratingRow = document.createElement('div');
    ratingRow.className = 'product-rating-row';
    const ratingVal = product.rating || 4.9;
    ratingRow.setAttribute('aria-label', `Avaliação ${ratingVal.toFixed(1)} de 5 estrelas`);

    const starsWrap = document.createElement('div');
    starsWrap.className = 'product-stars';
    starsWrap.setAttribute('aria-hidden', 'true');
    for (let s = 0; s < 5; s++) {
      const star = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      star.setAttribute('class', 'star-icon');
      star.setAttribute('viewBox', '0 0 24 24');
      star.setAttribute('width', '13');
      star.setAttribute('height', '13');
      const poly = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
      poly.setAttribute('points', '12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2');
      star.appendChild(poly);
      starsWrap.appendChild(star);
    }

    const scoreBadge = document.createElement('span');
    scoreBadge.className = 'product-rating-score';
    scoreBadge.textContent = ratingVal.toFixed(1);

    ratingRow.appendChild(starsWrap);
    ratingRow.appendChild(scoreBadge);
    contentDiv.appendChild(ratingRow);

    // Função de sincronização de cor / variação no card
    function setCardVariant(varName) {
      if (!varName) return;
      article.setAttribute('data-selected-variant', varName);

      setProductImageSource(img, product, varName, mediaDiv);

      // Atualiza o select de variação se existir
      const vSelect = contentDiv.querySelector('.card-variant-select');
      if (vSelect && vSelect.value !== varName) {
        vSelect.value = varName;
      }

      // Atualiza botões swatches do card
      contentDiv.querySelectorAll('.card-color-swatch-btn').forEach((b) => {
        const isMatch = b.getAttribute('data-color-var') === varName;
        b.classList.toggle('active', isMatch);
        b.setAttribute('aria-checked', isMatch ? 'true' : 'false');
      });
    }

    // Seletor de cores visuais interativo no card (quando houver variantColors)
    if (product.variantColors) {
      const swatchesRow = document.createElement('div');
      swatchesRow.className = 'card-color-swatches-row';
      swatchesRow.setAttribute('role', 'radiogroup');
      swatchesRow.setAttribute('aria-label', 'Cores disponíveis para ' + product.name);

      const swatchesWrap = document.createElement('div');
      swatchesWrap.className = 'card-color-swatches';

      product.variants.forEach((varName) => {
        const colorData = product.variantColors[varName];
        if (!colorData) return;

        const swatchBtn = document.createElement('button');
        swatchBtn.type = 'button';
        swatchBtn.className = 'card-color-swatch-btn' + (varName === initialVariant ? ' active' : '');
        swatchBtn.setAttribute('data-color-var', varName);
        swatchBtn.setAttribute('data-product-target', product.id);
        swatchBtn.setAttribute('role', 'radio');
        swatchBtn.setAttribute('aria-label', 'Selecionar cor ' + varName);
        swatchBtn.setAttribute('title', varName);
        swatchBtn.setAttribute('aria-checked', varName === initialVariant ? 'true' : 'false');

        if (colorData.circleCss) {
          swatchBtn.style.cssText = colorData.circleCss;
        }

        swatchBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          setCardVariant(varName);
        });

        swatchesWrap.appendChild(swatchBtn);
      });

      const countSpan = document.createElement('span');
      countSpan.className = 'card-color-swatches-count';
      countSpan.textContent = product.variants.length + ' cores';

      swatchesRow.appendChild(swatchesWrap);
      swatchesRow.appendChild(countSpan);
      contentDiv.appendChild(swatchesRow);
    }

    // Seletor de variação em dropdown quando o produto possui mais de uma opção
    if (Array.isArray(product.variants) && product.variants.length > 1) {
      const optionsRow = document.createElement('div');
      optionsRow.className = 'card-options-row';

      const selectLabel = document.createElement('label');
      selectLabel.className = 'sr-only';
      selectLabel.setAttribute('for', 'card-variant-' + product.id);
      selectLabel.textContent = 'Escolher variação de ' + product.name;

      const variantSelect = document.createElement('select');
      variantSelect.id = 'card-variant-' + product.id;
      variantSelect.className = 'card-variant-select';
      variantSelect.setAttribute('aria-label', 'Escolher variação de ' + product.name);

      product.variants.forEach((variantName) => {
        const opt = document.createElement('option');
        opt.value = variantName;
        opt.textContent = 'Opção: ' + variantName;
        variantSelect.appendChild(opt);
      });

      variantSelect.value = initialVariant;
      variantSelect.addEventListener('change', (e) => {
        setCardVariant(e.target.value);
      });

      optionsRow.appendChild(selectLabel);
      optionsRow.appendChild(variantSelect);
      contentDiv.appendChild(optionsRow);
    }

    // Controles de quantidade e Botões de compra do card
    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'product-card-actions';

    const qtyControl = document.createElement('div');
    qtyControl.className = 'card-qty-control';
    qtyControl.setAttribute('aria-label', 'Quantidade de ' + product.name);

    const minusBtn = document.createElement('button');
    minusBtn.type = 'button';
    minusBtn.className = 'card-qty-btn';
    minusBtn.setAttribute('data-card-qty-minus', product.id);
    minusBtn.setAttribute('aria-label', 'Diminuir quantidade de ' + product.name);
    minusBtn.textContent = '-';

    const qtyInput = document.createElement('input');
    qtyInput.type = 'number';
    qtyInput.className = 'card-qty-input';
    qtyInput.value = '1';
    qtyInput.min = '1';
    qtyInput.max = '99';
    qtyInput.readOnly = true;
    qtyInput.setAttribute('aria-label', 'Quantidade selecionada para ' + product.name);

    const plusBtn = document.createElement('button');
    plusBtn.type = 'button';
    plusBtn.className = 'card-qty-btn';
    plusBtn.setAttribute('data-card-qty-plus', product.id);
    plusBtn.setAttribute('aria-label', 'Aumentar quantidade de ' + product.name);
    plusBtn.textContent = '+';

    qtyControl.appendChild(minusBtn);
    qtyControl.appendChild(qtyInput);
    qtyControl.appendChild(plusBtn);

    const addBtn = document.createElement('button');
    addBtn.type = 'button';
    addBtn.className = 'btn btn-primary btn-add-cart';
    addBtn.setAttribute('data-add-cart', product.id);
    addBtn.textContent = 'Adicionar ao carrinho';

    const detailBtn = document.createElement('button');
    detailBtn.type = 'button';
    detailBtn.className = 'btn btn-outline btn-detail';
    detailBtn.setAttribute('data-open-detail', product.id);
    detailBtn.textContent = 'Detalhes';

    actionsDiv.appendChild(qtyControl);
    actionsDiv.appendChild(addBtn);
    actionsDiv.appendChild(detailBtn);

    contentDiv.appendChild(actionsDiv);

    article.appendChild(mediaDiv);
    article.appendChild(contentDiv);
    li.appendChild(article);

    return li;
  }

  function renderCatalog() {
    const grid = document.getElementById('product-grid');
    const emptyState = document.getElementById('catalog-empty-state');
    const countEl = document.getElementById('catalog-results-count');
    const searchBanner = document.getElementById('active-search-banner');
    const searchTermEl = document.getElementById('active-search-term');

    if (!grid) return;

    const products = getFilteredProducts();
    grid.replaceChildren();

    if (products.length === 0) {
      grid.hidden = true;
      if (emptyState) emptyState.hidden = false;
    } else {
      grid.hidden = false;
      if (emptyState) emptyState.hidden = true;
      const fragment = document.createDocumentFragment();
      products.forEach((product, idx) => {
        fragment.appendChild(createProductCardElement(product, idx));
      });
      grid.appendChild(fragment);
      observeRevealElements(grid);
    }

    if (countEl) {
      countEl.textContent = '';
      const prefix = document.createTextNode('Exibindo ');
      const strong = document.createElement('strong');
      strong.textContent = String(products.length);
      const suffix = document.createTextNode(
        products.length === 1 ? ' produto' : ' produtos'
      );
      countEl.appendChild(prefix);
      countEl.appendChild(strong);
      countEl.appendChild(suffix);
    }

    if (searchBanner && searchTermEl) {
      if (state.searchQuery.trim().length > 0) {
        searchBanner.hidden = false;
        searchTermEl.textContent = '"' + state.searchQuery.trim() + '"';
      } else {
        searchBanner.hidden = true;
        searchTermEl.textContent = '';
      }
    }

    updateFilterButtonsUI();
    updatePriceStatusIndicator();
  }

  function updateFilterButtonsUI() {
    const filterButtons = document.querySelectorAll('[data-filter-btn]');
    filterButtons.forEach((btn) => {
      const filterKey = btn.getAttribute('data-filter-btn');
      const isMatch =
        filterKey === state.activeCategory ||
        (state.activeCategory === 'acessorios' && filterKey === 'acessorios-beleza') ||
        (state.activeCategory === 'cuidados-pele' && filterKey === 'esfoliantes');

      btn.classList.toggle('active', isMatch);
      btn.setAttribute('aria-pressed', isMatch ? 'true' : 'false');
    });
  }

  function setActiveNavLink(sectionId) {
    const navLinks = document.querySelectorAll('.desktop-nav .nav-link');
    navLinks.forEach((link) => {
      const target = link.getAttribute('data-nav-link');
      link.classList.toggle('active', target === sectionId);
    });

    const mobileNavLinks = document.querySelectorAll('.mobile-nav-list .mobile-nav-link');
    mobileNavLinks.forEach((link) => {
      const target = link.getAttribute('data-mobile-nav');
      link.classList.toggle('active', target === sectionId);
    });
  }

  /**
   * Navegação suave universal entre seções considerando a altura do cabeçalho fixo
   */
  function navigateToSection(sectionId, updateHash = true) {
    closeMobileMenu(false);
    closeCartDrawer(false);

    if (sectionId === 'ritual') sectionId = 'cuidados-pele';
    if (sectionId === 'diferenciais') sectionId = 'beneficios';

    if (sectionId === 'inicio' || sectionId === 'hero') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      setActiveNavLink('inicio');
      if (updateHash && window.location.hash !== '#inicio') {
        history.replaceState(null, '', '#inicio');
      }
      return;
    }

    const targetEl = document.getElementById(sectionId);
    if (!targetEl) return;

    // Se estiver navegando para o catálogo, reseta para 'todos' os produtos se houver filtro ativo
    if (sectionId === 'catalogo' && state.activeCategory !== 'todos') {
      state.activeCategory = 'todos';
      state.searchQuery = '';
      const searchInput = document.getElementById('header-search-input');
      const mobileSearchInput = document.getElementById('mobile-search-input');
      if (searchInput) searchInput.value = '';
      if (mobileSearchInput) mobileSearchInput.value = '';
      renderCatalog();
      updateFilterPillsUI('todos');
    }

    const header = document.querySelector('.site-header');
    const headerHeight = header ? header.getBoundingClientRect().height : 80;
    const rect = targetEl.getBoundingClientRect();
    const targetY = window.pageYOffset + rect.top - (headerHeight + 10);

    window.scrollTo({
      top: Math.max(0, targetY),
      behavior: 'smooth'
    });

    setActiveNavLink(sectionId);
    closeMobileMenu(false);

    if (updateHash && window.location.hash !== '#' + sectionId) {
      history.replaceState(null, '', '#' + sectionId);
    }
  }

  function setFilterCategory(categoryKey, shouldScroll) {
    state.activeCategory = categoryKey || 'todos';
    renderCatalog();

    if (shouldScroll) {
      const catalogSection = document.getElementById('catalogo');
      if (catalogSection) {
        catalogSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }

    announceToScreenReader('Catálogo filtrado.');
  }

  /* ==========================================================================
     7. GERENCIAMENTO DO CARRINHO DE COMPRAS & WHATSAPP
     ========================================================================== */

  function addToCart(productId, variant, quantity) {
    const product = getProductById(productId);
    if (!product) return;

    const chosenVariant = variant || product.variants[0] || 'Unidade';
    const qtyToAdd = Math.max(1, Math.min(99, Number(quantity) || 1));

    const existingItem = state.cart.find(
      (item) => item.productId === productId && item.variant === chosenVariant
    );

    if (existingItem) {
      existingItem.quantity = Math.min(99, existingItem.quantity + qtyToAdd);
    } else {
      state.cart.push({
        productId: product.id,
        variant: chosenVariant,
        quantity: qtyToAdd
      });
    }

    saveCartToStorage();
    renderCart();

    const msg = product.name + ' adicionado ao carrinho.';
    announceToScreenReader(msg);
    showToast(msg);
  }

  function updateCartItemQuantity(index, delta) {
    if (index < 0 || index >= state.cart.length) return;
    const item = state.cart[index];
    const newQty = item.quantity + delta;

    if (newQty <= 0) {
      state.cart.splice(index, 1);
      announceToScreenReader('Item removido do carrinho.');
    } else {
      item.quantity = Math.min(99, newQty);
      announceToScreenReader('Quantidade atualizada para ' + item.quantity + '.');
    }

    saveCartToStorage();
    renderCart();
  }

  function removeCartItem(index) {
    if (index < 0 || index >= state.cart.length) return;
    state.cart.splice(index, 1);
    saveCartToStorage();
    renderCart();
    announceToScreenReader('Produto removido do carrinho.');
  }

  function clearCart() {
    state.cart = [];
    saveCartToStorage();
    renderCart();
    announceToScreenReader('Seu carrinho foi esvaziado.');
  }

  function calculateCartTotals() {
    let totalQuantity = 0;
    let subtotalCents = 0;
    let hasPendingPriceItems = false;

    state.cart.forEach((item) => {
      totalQuantity += item.quantity;
      const unitPrice = getEffectivePrice(item.productId);
      if (unitPrice !== null) {
        subtotalCents += Math.round(unitPrice * 100) * item.quantity;
      } else {
        hasPendingPriceItems = true;
      }
    });

    const subtotal = subtotalCents / 100;
    return {
      totalQuantity,
      subtotal,
      total: subtotal,
      hasPendingPriceItems
    };
  }

  function renderCart() {
    const container = document.getElementById('cart-items-container');
    const footer = document.getElementById('cart-drawer-footer');
    const headerCountBadge = document.getElementById('header-cart-count');
    const drawerSubtitle = document.getElementById('cart-drawer-subtitle');
    const totalQtyEl = document.getElementById('cart-total-qty');
    const subtotalEl = document.getElementById('cart-subtotal-value');
    const totalEl = document.getElementById('cart-total-value');
    const pendingNotice = document.getElementById('cart-pending-price-notice');
    const whatsappAlert = document.getElementById('cart-whatsapp-config-Alert');

    const totals = calculateCartTotals();

    if (headerCountBadge) {
      headerCountBadge.textContent = String(totals.totalQuantity);
      headerCountBadge.setAttribute(
        'aria-label',
        totals.totalQuantity +
          (totals.totalQuantity === 1 ? ' item no carrinho' : ' itens no carrinho')
      );
    }

    if (drawerSubtitle) {
      drawerSubtitle.textContent =
        totals.totalQuantity +
        (totals.totalQuantity === 1 ? ' item selecionado' : ' itens selecionados');
    }

    if (!container) return;
    container.replaceChildren();

    if (state.cart.length === 0) {
      if (footer) footer.hidden = true;

      const emptyBox = document.createElement('div');
      emptyBox.className = 'cart-empty-box';

      const title = document.createElement('h3');
      title.className = 'section-title';
      title.style.fontSize = '1.35rem';
      title.textContent = 'Seu carrinho está vazio';

      const desc = document.createElement('p');
      desc.textContent =
        'Escolha seus esfoliantes e acessórios de skincare favoritos no catálogo para montar seu pedido.';

      const exploreBtn = document.createElement('button');
      exploreBtn.type = 'button';
      exploreBtn.className = 'btn btn-primary';
      exploreBtn.textContent = 'Explorar produtos';
      exploreBtn.addEventListener('click', () => {
        closeAllDrawers();
        setFilterCategory('todos', true);
      });

      emptyBox.appendChild(title);
      emptyBox.appendChild(desc);
      emptyBox.appendChild(exploreBtn);
      container.appendChild(emptyBox);
      return;
    }

    if (footer) footer.hidden = false;

    const fragment = document.createDocumentFragment();

    state.cart.forEach((item, index) => {
      const product = getProductById(item.productId);
      if (!product) return;

      const unitPrice = getEffectivePrice(product.id);
      const lineTotal =
        unitPrice !== null ? (Math.round(unitPrice * 100) * item.quantity) / 100 : null;

      const itemRow = document.createElement('div');
      itemRow.className = 'cart-item';

      const img = document.createElement('img');
      img.src = getProductImageForVariant(product, item.variant);
      img.alt = product.name + ' — ' + item.variant;
      img.width = 72;
      img.height = 88;
      img.className = 'cart-item-img' + (product.imageFit === 'contain' ? ' fit-contain' : '');

      const infoCol = document.createElement('div');

      const title = document.createElement('h3');
      title.className = 'cart-item-title';
      title.textContent = product.name;

      const variantP = document.createElement('p');
      variantP.className = 'cart-item-variant';
      variantP.textContent = 'Variação: ' + item.variant;

      const priceP = document.createElement('p');
      priceP.className = 'cart-item-price';
      if (unitPrice !== null) {
        priceP.textContent = 'Preço unitário: ' + formatCurrency(unitPrice);
      } else {
        priceP.textContent = 'Preço unitário: Pendente de cadastro';
      }

      const subtotalP = document.createElement('p');
      subtotalP.className = 'cart-item-subtotal';
      if (lineTotal !== null) {
        subtotalP.textContent = 'Subtotal: ' + formatCurrency(lineTotal);
      } else {
        subtotalP.textContent = 'Subtotal: A confirmar no WhatsApp';
      }

      const controlsDiv = document.createElement('div');
      controlsDiv.className = 'cart-item-controls';

      const qtyBox = document.createElement('div');
      qtyBox.className = 'cart-qty-box';

      const minusBtn = document.createElement('button');
      minusBtn.type = 'button';
      minusBtn.className = 'cart-qty-btn';
      minusBtn.setAttribute('aria-label', 'Diminuir quantidade de ' + product.name);
      minusBtn.textContent = '-';
      minusBtn.addEventListener('click', () => updateCartItemQuantity(index, -1));

      const qtySpan = document.createElement('span');
      qtySpan.className = 'cart-qty-val';
      qtySpan.textContent = String(item.quantity);

      const plusBtn = document.createElement('button');
      plusBtn.type = 'button';
      plusBtn.className = 'cart-qty-btn';
      plusBtn.setAttribute('aria-label', 'Aumentar quantidade de ' + product.name);
      plusBtn.textContent = '+';
      plusBtn.addEventListener('click', () => updateCartItemQuantity(index, 1));

      qtyBox.appendChild(minusBtn);
      qtyBox.appendChild(qtySpan);
      qtyBox.appendChild(plusBtn);

      const removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.className = 'cart-remove-btn';
      removeBtn.textContent = 'Remover';
      removeBtn.addEventListener('click', () => removeCartItem(index));

      controlsDiv.appendChild(qtyBox);
      controlsDiv.appendChild(removeBtn);

      infoCol.appendChild(title);
      infoCol.appendChild(variantP);
      infoCol.appendChild(priceP);
      infoCol.appendChild(subtotalP);
      infoCol.appendChild(controlsDiv);

      itemRow.appendChild(img);
      itemRow.appendChild(infoCol);
      fragment.appendChild(itemRow);
    });

    container.appendChild(fragment);

    if (totalQtyEl) {
      totalQtyEl.textContent = totals.totalQuantity + ' un.';
    }
    if (subtotalEl) {
      subtotalEl.textContent = currencyFormatter.format(totals.subtotal);
    }
    if (totalEl) {
      totalEl.textContent =
        totals.hasPendingPriceItems && totals.total === 0
          ? 'A confirmar'
          : currencyFormatter.format(totals.total);
    }
    if (pendingNotice) {
      pendingNotice.hidden = !totals.hasPendingPriceItems;
    }
    if (whatsappAlert) {
      const hasNumber = getEffectiveWhatsAppNumber().length >= 10;
      if (!hasNumber) {
        whatsappAlert.hidden = false;
        whatsappAlert.textContent =
          'Aviso: O número de WhatsApp da Isa ainda não foi configurado. Clique em "Configurar loja" para informar o número ou visualize a mensagem pronta ao finalizar.';
      } else {
        whatsappAlert.hidden = true;
        whatsappAlert.textContent = '';
      }
    }
  }

  /**
   * Gera a mensagem dinâmica do pedido seguindo rigorosamente a estrutura oficial solicitada:
   *
   * Olá, Isa! Tudo bem? Gostaria de fazer o seguinte pedido na IM Store:
   *
   * *MEU PEDIDO*
   *
   * 1. [Nome do produto]
   *    Quantidade: [quantidade]
   *    Preço unitário: R$ [preço]
   *    Subtotal: R$ [subtotal]
   *
   * *Total dos produtos: R$ [total]*
   *
   * Gostaria de confirmar a disponibilidade e combinar a entrega e o pagamento.
   *
   * Aguardo seu retorno!
   */
  function buildWhatsAppOrderMessage() {
    const totals = calculateCartTotals();
    const lines = [
      'Olá, Isa! Tudo bem? Gostaria de fazer o seguinte pedido na IM Store:',
      '',
      '*MEU PEDIDO*',
      ''
    ];

    state.cart.forEach((item, idx) => {
      const product = getProductById(item.productId);
      if (!product) return;

      const unitPrice = getEffectivePrice(product.id);
      const lineTotal =
        unitPrice !== null ? (Math.round(unitPrice * 100) * item.quantity) / 100 : null;

      const displayProductName =
        product.variants.length > 1
          ? product.name + ' (' + item.variant + ')'
          : product.name;

      const unitPriceFormatted =
        unitPrice !== null ? formatBRLPlain(unitPrice) : 'R$ A confirmar';
      const subtotalFormatted =
        lineTotal !== null ? formatBRLPlain(lineTotal) : 'R$ A confirmar';

      lines.push(idx + 1 + '. ' + displayProductName);
      lines.push('   Quantidade: ' + item.quantity);
      lines.push('   Preço unitário: ' + unitPriceFormatted);
      lines.push('   Subtotal: ' + subtotalFormatted);
      lines.push('');
    });

    const totalFormatted =
      totals.hasPendingPriceItems && totals.total === 0
        ? 'R$ A confirmar'
        : formatBRLPlain(totals.total);

    lines.push('*Total dos produtos: ' + totalFormatted + '*');
    lines.push('');
    lines.push('Gostaria de confirmar a disponibilidade e combinar a entrega e o pagamento.');
    lines.push('');
    lines.push('Aguardo seu retorno!');

    return lines.join('\n');
  }

  function buildWhatsAppCheckoutUrl(phoneNumber, messageText) {
    const cleanPhone = sanitizeWhatsAppNumber(phoneNumber);
    const encodedText = encodeURIComponent(messageText);
    return 'https://wa.me/' + cleanPhone + '?text=' + encodedText;
  }

  function handleWhatsAppCheckout(triggerElement) {
    // Regra obrigatória: Bloquear finalização se o carrinho estiver vazio
    if (state.cart.length === 0) {
      showToast('Adicione pelo menos um produto ao carrinho antes de finalizar.');
      announceToScreenReader('Seu carrinho está vazio. Adicione produtos antes de finalizar o pedido.');
      return;
    }

    const messageText = buildWhatsAppOrderMessage();
    const whatsappNumber = getEffectiveWhatsAppNumber();

    // Se o número não estiver configurado, não inventa número: exibe aviso claro e prévia da mensagem
    if (!whatsappNumber) {
      closeCartDrawer(false);
      openInfoModal('whatsapp-missing-config', triggerElement, messageText);
      return;
    }

    // Abre o WhatsApp em nova aba preservando o carrinho no localStorage
    const url = buildWhatsAppCheckoutUrl(whatsappNumber, messageText);
    window.open(url, '_blank', 'noopener,noreferrer');
    showToast('Redirecionando seu pedido para o WhatsApp da Isa...');
  }

  /* ==========================================================================
     8. MODAL DE DETALHES DO PRODUTO
     ========================================================================== */

  function openProductDetailModal(productId, triggerElement) {
    const product = getProductById(productId);
    const modal = document.getElementById('product-detail-modal');
    if (!product || !modal) return;

    state.activeDetailProductId = product.id;
    state.lastFocusedElement = triggerElement || document.activeElement;

    const imgEl = document.getElementById('detail-modal-img');
    const categoryEl = document.getElementById('detail-modal-category');
    const titleEl = document.getElementById('detail-modal-title');
    const specEl = document.getElementById('detail-modal-spec');
    const priceBoxEl = document.getElementById('detail-modal-price-box');
    const descEl = document.getElementById('detail-modal-description');
    const careNoteEl = document.getElementById('detail-modal-care-note');
    const highlightsList = document.getElementById('detail-modal-highlights');
    const variantSelect = document.getElementById('detail-variant-select');
    const qtyInput = document.getElementById('detail-qty-input');
    const variantLabel = document.getElementById('detail-variant-label');
    const activeVariantNameEl = document.getElementById('detail-active-variant-name');
    const colorSwatchesEl = document.getElementById('detail-color-swatches');

    // Recupera a variação selecionada previamente no card correspondente (se houver)
    const triggerCard = triggerElement ? triggerElement.closest('.product-card') : null;
    let activeVariant = triggerCard ? triggerCard.getAttribute('data-selected-variant') : null;
    if (!activeVariant || !product.variants.includes(activeVariant)) {
      activeVariant = product.defaultVariant || (product.variants ? product.variants[0] : null);
    }

    if (categoryEl) categoryEl.textContent = product.categoryLabel;
    if (titleEl) titleEl.textContent = product.name;
    if (specEl) specEl.textContent = product.spec;
    if (descEl) descEl.textContent = product.description;
    if (careNoteEl) careNoteEl.textContent = product.careNote;

    if (priceBoxEl) {
      priceBoxEl.replaceChildren(createPriceDisplayNode(product.id));
    }

    if (highlightsList) {
      highlightsList.replaceChildren();
      product.highlights.forEach((text) => {
        const li = document.createElement('li');
        li.textContent = text;
        highlightsList.appendChild(li);
      });
    }

    // Função para alterar e sincronizar a variação/cor selecionada no modal
    function selectModalVariant(varName) {
      if (!varName) return;
      activeVariant = varName;

      if (variantSelect && variantSelect.value !== varName) {
        variantSelect.value = varName;
      }
      if (activeVariantNameEl) {
        activeVariantNameEl.textContent = varName;
      }

      if (colorSwatchesEl) {
        colorSwatchesEl.querySelectorAll('.color-swatch-btn').forEach((btn) => {
          const isMatch = btn.getAttribute('data-color-var') === varName;
          btn.classList.toggle('active', isMatch);
          btn.setAttribute('aria-checked', isMatch ? 'true' : 'false');
        });
      }

      if (imgEl) {
        imgEl.style.opacity = '0.35';
        setTimeout(() => {
          setProductImageSource(imgEl, product, varName);
          imgEl.style.opacity = '1';
        }, 80);
      }

      // Sincroniza também de volta com o card correspondente no catálogo
      if (triggerCard) {
        triggerCard.setAttribute('data-selected-variant', varName);
        const cardImg = triggerCard.querySelector('.product-card-img');
        if (cardImg) setProductImageSource(cardImg, product, varName);
        const cardSelect = triggerCard.querySelector('.card-variant-select');
        if (cardSelect && cardSelect.value !== varName) {
          cardSelect.value = varName;
        }
        triggerCard.querySelectorAll('.card-color-swatch-btn').forEach((b) => {
          const isMatch = b.getAttribute('data-color-var') === varName;
          b.classList.toggle('active', isMatch);
          b.setAttribute('aria-checked', isMatch ? 'true' : 'false');
        });
      }
    }

    // Configura a imagem principal do modal com contain fit para exibir 100% sem cortes
    if (imgEl) {
      imgEl.className = 'detail-main-img' + (product.imageFit === 'contain' ? ' fit-contain' : '');
      setProductImageSource(imgEl, product, activeVariant);
      imgEl.style.opacity = '1';
    }

    // Seletor visual de cores no modal (quando houver variantColors)
    if (colorSwatchesEl) {
      colorSwatchesEl.replaceChildren();
      if (product.variantColors) {
        colorSwatchesEl.hidden = false;
        if (variantLabel) variantLabel.textContent = 'Cor selecionada:';
        if (activeVariantNameEl) activeVariantNameEl.textContent = activeVariant;

        product.variants.forEach((varName) => {
          const colorData = product.variantColors[varName];
          if (!colorData) return;

          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'color-swatch-btn' + (varName === activeVariant ? ' active' : '');
          btn.setAttribute('data-color-var', varName);
          btn.setAttribute('role', 'radio');
          btn.setAttribute('aria-checked', varName === activeVariant ? 'true' : 'false');
          btn.setAttribute('aria-label', 'Selecionar cor ' + varName);

          const circle = document.createElement('span');
          circle.className = 'color-swatch-circle';
          if (colorData.circleCss) {
            circle.style.cssText = colorData.circleCss;
          }

          const label = document.createElement('span');
          label.className = 'color-swatch-label';
          label.textContent = varName;

          btn.appendChild(circle);
          btn.appendChild(label);

          btn.addEventListener('click', (e) => {
            e.preventDefault();
            selectModalVariant(varName);
          });

          colorSwatchesEl.appendChild(btn);
        });
      } else {
        colorSwatchesEl.hidden = true;
        if (variantLabel) variantLabel.textContent = 'Opção / Variação:';
        if (activeVariantNameEl) activeVariantNameEl.textContent = activeVariant;
      }
    }

    if (variantSelect) {
      variantSelect.replaceChildren();
      product.variants.forEach((variantName) => {
        const opt = document.createElement('option');
        opt.value = variantName;
        opt.textContent = variantName;
        variantSelect.appendChild(opt);
      });
      variantSelect.value = activeVariant;
      variantSelect.onchange = (e) => {
        selectModalVariant(e.target.value);
      };
    }

    if (qtyInput) {
      qtyInput.value = '1';
    }

    modal.hidden = false;
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    const closeBtn = document.getElementById('detail-modal-close');
    if (closeBtn) closeBtn.focus();
  }

  function closeProductDetailModal() {
    const modal = document.getElementById('product-detail-modal');
    if (!modal || modal.hidden) return;

    modal.hidden = true;
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    state.activeDetailProductId = null;

    if (state.lastFocusedElement && typeof state.lastFocusedElement.focus === 'function') {
      state.lastFocusedElement.focus();
    }
  }

  /* ==========================================================================
     9. CONFIGURADOR COMERCIAL (WHATSAPP DA ISA & TABELA DE PREÇOS)
     ========================================================================== */

  function updatePriceStatusIndicator() {
    const indicator = document.getElementById('price-status-indicator');
    if (!indicator) return;

    const pricedCount = CATALOG_PRODUCTS.filter((p) => getEffectivePrice(p.id) !== null).length;
    const hasWhatsApp = getEffectiveWhatsAppNumber().length >= 10;

    if (pricedCount === 0 && !hasWhatsApp) {
      indicator.textContent = 'Configurar loja';
    } else if (hasWhatsApp && pricedCount === CATALOG_PRODUCTS.length) {
      indicator.textContent = 'Loja configurada';
    } else {
      indicator.textContent =
        'Configurar (' + pricedCount + '/' + CATALOG_PRODUCTS.length + ' preços)';
    }
  }

  function openPriceConfigModal() {
    // Configurações de catálogo e preços são gerenciadas exclusivamente no painel administrativo (/admin.html).
  }

  function closePriceConfigModal() {
    // No-op seguro
  }

  /* ==========================================================================
     10. MODAIS DE INFORMAÇÕES E AVISO DE CONFIGURAÇÃO DO WHATSAPP
     ========================================================================== */

  function openInfoModal(type, triggerElement, extraPayload) {
    const modal = document.getElementById('info-modal');
    const titleEl = document.getElementById('info-modal-title');
    const bodyEl = document.getElementById('info-modal-body');
    if (!modal || !titleEl || !bodyEl) return;

    state.lastFocusedElement = triggerElement || document.activeElement;
    bodyEl.replaceChildren();

    if (type === 'privacidade') {
      titleEl.textContent = 'Política de Privacidade e Proteção de Dados — IM Store';

      const p1 = document.createElement('p');
      p1.style.marginBottom = '0.85rem';
      p1.textContent =
        'A IM Store valoriza a transparência e a segurança de suas clientes, em conformidade com a Lei Geral de Proteção de Dados Pessoais (LGPD — Lei nº 13.709/2018).';

      const p2 = document.createElement('p');
      p2.style.marginBottom = '0.85rem';
      p2.innerHTML =
        '<strong>1. Armazenamento Local no Dispositivo:</strong> Os produtos adicionados ao seu carrinho e a lista de itens favoritos são armazenados exclusivamente na memória local do seu próprio navegador (<em>localStorage</em>). Não utilizamos cookies invasivos de rastreamento de terceiros na navegação.';

      const p3 = document.createElement('p');
      p3.style.marginBottom = '0.85rem';
      p3.innerHTML =
        '<strong>2. Pedidos via WhatsApp:</strong> Ao clicar em "Finalizar pedido pelo WhatsApp", a seleção dos itens é formatada e enviada diretamente para o canal oficial da loja ((11) 98621-6603). Todo o atendimento ocorre no ambiente seguro e com criptografia de ponta a ponta do WhatsApp.';

      const p4 = document.createElement('p');
      p4.innerHTML =
        '<strong>3. Direitos da Titular:</strong> Você tem total controle sobre seus dados locais, podendo limpar sua seleção a qualquer momento pelo botão "Esvaziar carrinho". Para esclarecer dúvidas sobre privacidade ou atendimento, fale diretamente conosco.';

      bodyEl.append(p1, p2, p3, p4);
    } else if (type === 'trocas') {
      titleEl.textContent = 'Política de Trocas, Devoluções e Reembolso — IM Store';

      const p1 = document.createElement('p');
      p1.style.marginBottom = '0.85rem';
      p1.innerHTML =
        '<strong>1. Direito de Arrependimento (Art. 49 do CDC):</strong> Para compras realizadas fora do estabelecimento comercial físico, você tem o direito de desistir da compra em até <strong>7 (sete) dias corridos</strong> a partir do recebimento do produto, com reembolso integral dos valores pagos.';

      const p2 = document.createElement('p');
      p2.style.marginBottom = '0.85rem';
      p2.innerHTML =
        '<strong>2. Cuidados com Cosméticos e Higiene Pessoal:</strong> Para esfoliantes faciais/corporais e acessórios de skincare, a devolução por desistência exige que a embalagem original esteja inviolada, com lacres e etiquetas intactos, preservando os padrões sanitários.';

      const p3 = document.createElement('p');
      p3.style.marginBottom = '0.85rem';
      p3.innerHTML =
        '<strong>3. Produtos com Defeito ou Avaria no Transporte:</strong> Se você constatar qualquer avaria ou não conformidade no recebimento, entre em contato em até 30 dias para providenciarmos a troca imediata ou o estorno do valor.';

      const p4 = document.createElement('p');
      p4.innerHTML =
        '<strong>4. Central de Atendimento:</strong> Todas as solicitações são atendidas com carinho e rapidez pelo WhatsApp oficial: <strong>(11) 98621-6603</strong>.';

      bodyEl.append(p1, p2, p3, p4);
    } else if (type === 'whatsapp-missing-config') {
      titleEl.textContent = 'Mensagem do Pedido Pronta';

      const alertP = document.createElement('p');
      alertP.textContent =
        'Você pode copiar a mensagem estruturada do seu pedido abaixo e enviá-la para o nosso WhatsApp oficial: (11) 98621-6603.';

      const pre = document.createElement('pre');
      pre.className = 'whatsapp-preview-pre';
      pre.textContent = extraPayload || buildWhatsAppOrderMessage();

      const actionRow = document.createElement('div');
      actionRow.className = 'modal-action-row';

      const copyBtn = document.createElement('button');
      copyBtn.type = 'button';
      copyBtn.className = 'btn btn-primary';
      copyBtn.textContent = 'Copiar mensagem do pedido';
      copyBtn.addEventListener('click', () => {
        const textToCopy = pre.textContent || '';
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(textToCopy).then(() => {
            copyBtn.textContent = 'Mensagem copiada!';
          });
        }
      });

      actionRow.appendChild(copyBtn);

      bodyEl.appendChild(alertP);
      bodyEl.appendChild(pre);
      bodyEl.appendChild(actionRow);
    }

    modal.hidden = false;
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    const closeBtn = document.getElementById('info-modal-close');
    if (closeBtn) closeBtn.focus();
  }

  function closeInfoModal() {
    const modal = document.getElementById('info-modal');
    if (!modal || modal.hidden) return;
    modal.hidden = true;
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    if (state.lastFocusedElement && typeof state.lastFocusedElement.focus === 'function') {
      state.lastFocusedElement.focus();
    }
  }

  /* ==========================================================================
     11. GAVETAS DE NAVEGAÇÃO MOBILE E CARRINHO
     ========================================================================== */

  function openMobileMenu() {
    const drawer = document.getElementById('mobile-navigation');
    const overlay = document.getElementById('global-overlay');
    const openBtn = document.getElementById('mobile-menu-open-btn');
    if (!drawer || !overlay) return;

    closeCartDrawer(false);
    drawer.classList.add('active');
    drawer.setAttribute('aria-hidden', 'false');
    overlay.classList.add('active');
    if (openBtn) openBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';

    const closeBtn = document.getElementById('mobile-menu-close-btn');
    if (closeBtn) closeBtn.focus();
  }

  function closeMobileMenu(restoreFocus = true) {
    const drawer = document.getElementById('mobile-navigation');
    const overlay = document.getElementById('global-overlay');
    const openBtn = document.getElementById('mobile-menu-open-btn');
    if (!drawer) return;

    drawer.classList.remove('active');
    drawer.setAttribute('aria-hidden', 'true');
    if (overlay) overlay.classList.remove('active');
    if (openBtn) {
      openBtn.setAttribute('aria-expanded', 'false');
      if (restoreFocus) openBtn.focus();
    }
    document.body.style.overflow = '';
  }

  function openCartDrawer() {
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('global-overlay');
    const openBtn = document.getElementById('cart-open-btn');
    if (!drawer || !overlay) return;

    closeMobileMenu(false);
    renderCart();
    drawer.classList.add('active');
    drawer.setAttribute('aria-hidden', 'false');
    overlay.classList.add('active');
    if (openBtn) openBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';

    const closeBtn = document.getElementById('cart-close-btn');
    if (closeBtn) closeBtn.focus();
  }

  function closeCartDrawer(restoreFocus = true) {
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('global-overlay');
    const openBtn = document.getElementById('cart-open-btn');
    if (!drawer) return;

    drawer.classList.remove('active');
    drawer.setAttribute('aria-hidden', 'true');
    if (overlay) overlay.classList.remove('active');
    if (openBtn) {
      openBtn.setAttribute('aria-expanded', 'false');
      if (restoreFocus) openBtn.focus();
    }
    document.body.style.overflow = '';
  }

  function closeAllDrawers() {
    closeMobileMenu(false);
    closeCartDrawer(false);
  }

  /* ==========================================================================
     12. ANIMAÇÕES AO ROLAR A PÁGINA (INTERSECTION OBSERVER)
     ========================================================================== */

  function observeRevealElements(rootNode) {
    const scope = rootNode || document;
    const targets = scope.querySelectorAll('.reveal-on-scroll:not(.is-visible)');
    if (!targets.length) return;

    const prefersReducedMotion =
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion || typeof window.IntersectionObserver !== 'function') {
      targets.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    if (!state.scrollObserver) {
      state.scrollObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              observer.unobserve(entry.target);
            }
          });
        },
        {
          root: null,
          rootMargin: '0px 0px -40px 0px',
          threshold: 0.12
        }
      );
    }

    targets.forEach((el) => state.scrollObserver.observe(el));
  }

  function initScrollReveal() {
    document.documentElement.classList.add('js-ready');

    const staticGroups = [
      '.section-header',
      '.categories-grid .category-card',
      '.catalog-controls',
      '.showcase-intro-header',
      '.showcase-stage',
      '.showcase-finale',
      '.benefits-grid .benefit-card'
    ];

    staticGroups.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((el, idx) => {
        el.classList.add('reveal-on-scroll');
        el.style.setProperty('--reveal-delay', String((idx % 4) * 85) + 'ms');
      });
    });

    observeRevealElements(document);
  }

  function initNavScrollSpy() {
    const sectionIds = ['inicio', 'catalogo', 'beneficios'];
    const sectionMap = sectionIds
      .map((id) => ({ id, el: document.getElementById(id) }))
      .filter((item) => item.el !== null);

    if (sectionMap.length === 0) return;

    let isThrottled = false;
    function updateActiveOnScroll() {
      if (isThrottled) return;
      isThrottled = true;
      window.requestAnimationFrame(() => {
        isThrottled = false;
        const scrollY = window.pageYOffset || document.documentElement.scrollTop;

        // Se estiver no topo da página, mantém 'Início' ativo
        if (scrollY < 120) {
          setActiveNavLink('inicio');
          return;
        }

        // Determina a seção atualmente visível considerando a altura do cabeçalho
        const headerOffset = 150;
        let currentId = 'inicio';
        for (const item of sectionMap) {
          const top = item.el.offsetTop - headerOffset;
          if (scrollY >= top) {
            currentId = item.id;
          }
        }
        setActiveNavLink(currentId);
      });
    }

    window.addEventListener('scroll', updateActiveOnScroll, { passive: true });
    updateActiveOnScroll();
  }

  /* ==========================================================================
     13. INICIALIZAÇÃO E LISTENERS DE EVENTOS
     ========================================================================== */

  function bindEvents() {
    // Delegação de eventos para cliques em cards de produtos, categorias e botões globais
    document.addEventListener('click', (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      // 0. Alternar produto favorito (coração no card)
      const favBtn = target.closest('[data-toggle-favorite]');
      if (favBtn) {
        event.preventDefault();
        event.stopPropagation();
        const productId = favBtn.getAttribute('data-toggle-favorite');
        toggleFavorite(productId);
        return;
      }

      // 1. Abrir detalhes do produto
      const detailTrigger = target.closest('[data-open-detail]');
      if (detailTrigger) {
        event.preventDefault();
        const productId = detailTrigger.getAttribute('data-open-detail');
        openProductDetailModal(productId, detailTrigger);
        return;
      }

      // 2. Controle de quantidade (-) no card do catálogo
      const cardMinusBtn = target.closest('[data-card-qty-minus]');
      if (cardMinusBtn) {
        event.preventDefault();
        const cardItem = cardMinusBtn.closest('.product-grid-item');
        const qtyInput = cardItem ? cardItem.querySelector('.card-qty-input') : null;
        if (qtyInput) {
          const current = Number(qtyInput.value) || 1;
          qtyInput.value = String(Math.max(1, current - 1));
        }
        return;
      }

      // 3. Controle de quantidade (+) no card do catálogo
      const cardPlusBtn = target.closest('[data-card-qty-plus]');
      if (cardPlusBtn) {
        event.preventDefault();
        const cardItem = cardPlusBtn.closest('.product-grid-item');
        const qtyInput = cardItem ? cardItem.querySelector('.card-qty-input') : null;
        if (qtyInput) {
          const current = Number(qtyInput.value) || 1;
          qtyInput.value = String(Math.min(99, current + 1));
        }
        return;
      }

      // 4. Adicionar ao carrinho a partir do card (respeitando variação e quantidade selecionadas)
      const addCartTrigger = target.closest('[data-add-cart]');
      if (addCartTrigger) {
        event.preventDefault();
        const productId = addCartTrigger.getAttribute('data-add-cart');
        const cardItem = addCartTrigger.closest('.product-grid-item');
        const cardArticle = cardItem ? cardItem.querySelector('.product-card') : null;
        const variantSelect = cardItem ? cardItem.querySelector('.card-variant-select') : null;
        const qtyInput = cardItem ? cardItem.querySelector('.card-qty-input') : null;

        const chosenVariant =
          (cardArticle && cardArticle.getAttribute('data-selected-variant')) ||
          (variantSelect ? variantSelect.value : null);
        const chosenQty = qtyInput ? Number(qtyInput.value) || 1 : 1;

        addToCart(productId, chosenVariant, chosenQty);
        if (qtyInput) qtyInput.value = '1';
        return;
      }

      // 5. Botões de filtro no catálogo
      const filterBtn = target.closest('[data-filter-btn]');
      if (filterBtn) {
        event.preventDefault();
        const filterKey = filterBtn.getAttribute('data-filter-btn');
        setFilterCategory(filterKey, false);
        return;
      }

      // 6. Cards de categoria na seção Categorias
      const categoryCard = target.closest('[data-category-card]');
      if (categoryCard) {
        event.preventDefault();
        const filterKey = categoryCard.getAttribute('data-category-card');
        setFilterCategory(filterKey, true);
        return;
      }

      // 7. Links de filtro no menu desktop
      const navFilterLink = target.closest('[data-nav-filter]');
      if (navFilterLink) {
        event.preventDefault();
        const filterKey = navFilterLink.getAttribute('data-nav-filter');
        setFilterCategory(filterKey, true);
        return;
      }

      // 7b. Links diretos de seção no menu desktop
      const navSectionLink = target.closest('[data-nav-link]');
      if (navSectionLink) {
        event.preventDefault();
        const sectionKey = navSectionLink.getAttribute('data-nav-link');
        navigateToSection(sectionKey);
        return;
      }

      // 7c. Logotipo da marca no cabeçalho (retorno suave ao topo)
      const brandLogoLink = target.closest('.brand-logo');
      if (brandLogoLink) {
        event.preventDefault();
        navigateToSection('inicio');
        return;
      }

      // 7d. Botão primário da Hero ("Explorar produtos" -> catálogo)
      const heroExploreBtn = target.closest('.hero-primary-btn');
      if (heroExploreBtn) {
        event.preventDefault();
        navigateToSection('catalogo');
        return;
      }

      // 8. Links de filtro no menu mobile
      const mobileFilterLink = target.closest('[data-mobile-filter]');
      if (mobileFilterLink) {
        event.preventDefault();
        const filterKey = mobileFilterLink.getAttribute('data-mobile-filter');
        closeMobileMenu(false);
        setFilterCategory(filterKey, true);
        return;
      }

      // 9. Links de seção no menu mobile
      const mobileNavLink = target.closest('[data-mobile-nav]');
      if (mobileNavLink) {
        event.preventDefault();
        const sectionKey = mobileNavLink.getAttribute('data-mobile-nav');
        closeMobileMenu(false);
        navigateToSection(sectionKey);
        return;
      }

      // 10. Links de navegação e filtro no rodapé
      const footerFilterLink = target.closest('[data-footer-filter]');
      if (footerFilterLink) {
        event.preventDefault();
        const filterKey = footerFilterLink.getAttribute('data-footer-filter');
        setFilterCategory(filterKey, true);
        return;
      }

      const footerNavLink = target.closest('.footer-links-list a, .footer-logo-link');
      if (footerNavLink) {
        const href = footerNavLink.getAttribute('href');
        if (href && href.startsWith('#')) {
          event.preventDefault();
          navigateToSection(href.replace(/^#/, ''));
          return;
        }
      }

      // 11. Modais institucionais do rodapé
      const infoModalTrigger = target.closest('[data-open-info-modal]');
      if (infoModalTrigger) {
        event.preventDefault();
        const modalType = infoModalTrigger.getAttribute('data-open-info-modal');
        openInfoModal(modalType, infoModalTrigger);
      }
    });

    // Botão secundário da Hero: "Montar meu pedido"
    // Leva ao carrinho se já houver produtos, ou ao catálogo se estiver vazio
    const heroBuildOrderBtn = document.getElementById('hero-build-order-btn');
    if (heroBuildOrderBtn) {
      heroBuildOrderBtn.addEventListener('click', () => {
        if (state.cart.length > 0) {
          openCartDrawer();
        } else {
          const catalogSection = document.getElementById('catalogo');
          if (catalogSection) {
            catalogSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      });
    }

    // Menu Mobile e Carrinho
    const mobileMenuOpenBtn = document.getElementById('mobile-menu-open-btn');
    const mobileMenuCloseBtn = document.getElementById('mobile-menu-close-btn');
    const cartOpenBtn = document.getElementById('cart-open-btn');
    const cartCloseBtn = document.getElementById('cart-close-btn');
    const overlay = document.getElementById('global-overlay');

    if (mobileMenuOpenBtn) mobileMenuOpenBtn.addEventListener('click', openMobileMenu);
    if (mobileMenuCloseBtn) mobileMenuCloseBtn.addEventListener('click', () => closeMobileMenu(true));
    if (cartOpenBtn) cartOpenBtn.addEventListener('click', openCartDrawer);
    if (cartCloseBtn) cartCloseBtn.addEventListener('click', () => closeCartDrawer(true));
    if (overlay) overlay.addEventListener('click', closeAllDrawers);

    // Toggle da barra de busca mobile
    const mobileSearchToggleBtn = document.getElementById('mobile-search-toggle-btn');
    const mobileSearchBar = document.getElementById('mobile-search-bar');
    const mobileSearchInput = document.getElementById('mobile-search-input');
    if (mobileSearchToggleBtn && mobileSearchBar) {
      mobileSearchToggleBtn.addEventListener('click', () => {
        const isHidden = mobileSearchBar.hidden;
        mobileSearchBar.hidden = !isHidden;
        mobileSearchToggleBtn.setAttribute('aria-expanded', isHidden ? 'true' : 'false');
        if (isHidden && mobileSearchInput) {
          mobileSearchInput.focus();
        }
      });
    }

    // Busca Desktop e Mobile
    const headerSearchForm = document.getElementById('header-search-form');
    const headerSearchInput = document.getElementById('header-search-input');
    const headerSearchClear = document.getElementById('header-search-clear');
    const mobileSearchForm = document.getElementById('mobile-search-form');

    function handleSearchUpdate(value, scrollOnSubmit) {
      state.searchQuery = value;
      if (headerSearchInput && headerSearchInput.value !== value) {
        headerSearchInput.value = value;
      }
      if (mobileSearchInput && mobileSearchInput.value !== value) {
        mobileSearchInput.value = value;
      }
      if (headerSearchClear) {
        headerSearchClear.hidden = value.trim().length === 0;
      }
      renderCatalog();
      if (scrollOnSubmit) {
        const catalogSection = document.getElementById('catalogo');
        if (catalogSection) {
          catalogSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }

    if (headerSearchInput) {
      headerSearchInput.addEventListener('input', (e) => {
        handleSearchUpdate(e.target.value, false);
      });
    }

    if (headerSearchClear) {
      headerSearchClear.addEventListener('click', () => {
        handleSearchUpdate('', false);
        if (headerSearchInput) headerSearchInput.focus();
      });
    }

    if (headerSearchForm) {
      headerSearchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (headerSearchInput) {
          handleSearchUpdate(headerSearchInput.value, true);
        }
      });
    }

    if (mobileSearchInput) {
      mobileSearchInput.addEventListener('input', (e) => {
        handleSearchUpdate(e.target.value, false);
      });
    }

    if (mobileSearchForm) {
      mobileSearchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (mobileSearchInput) {
          handleSearchUpdate(mobileSearchInput.value, true);
        }
      });
    }

    // Limpar busca ou resetar catálogo
    const clearSearchBannerBtn = document.getElementById('clear-search-banner-btn');
    const resetCatalogBtn = document.getElementById('reset-catalog-btn');

    if (clearSearchBannerBtn) {
      clearSearchBannerBtn.addEventListener('click', () => handleSearchUpdate('', false));
    }
    if (resetCatalogBtn) {
      resetCatalogBtn.addEventListener('click', () => {
        state.activeCategory = 'todos';
        handleSearchUpdate('', false);
      });
    }

    // Ordenação do Catálogo
    const sortSelect = document.getElementById('catalog-sort-select');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        state.sortBy = e.target.value;
        renderCatalog();
      });
    }

    // Controles do Modal de Detalhes do Produto
    const detailCloseBtn = document.getElementById('detail-modal-close');
    const detailModal = document.getElementById('product-detail-modal');
    const detailQtyMinus = document.getElementById('detail-qty-minus');
    const detailQtyPlus = document.getElementById('detail-qty-plus');
    const detailQtyInput = document.getElementById('detail-qty-input');
    const detailAddForm = document.getElementById('detail-add-form');
    const detailVariantSelect = document.getElementById('detail-variant-select');

    if (detailCloseBtn) {
      detailCloseBtn.addEventListener('click', closeProductDetailModal);
    }
    if (detailModal) {
      detailModal.addEventListener('click', (e) => {
        if (e.target === detailModal) closeProductDetailModal();
      });
    }
    if (detailQtyMinus && detailQtyInput) {
      detailQtyMinus.addEventListener('click', () => {
        const current = Number(detailQtyInput.value) || 1;
        detailQtyInput.value = String(Math.max(1, current - 1));
      });
    }
    if (detailQtyPlus && detailQtyInput) {
      detailQtyPlus.addEventListener('click', () => {
        const current = Number(detailQtyInput.value) || 1;
        detailQtyInput.value = String(Math.min(99, current + 1));
      });
    }
    if (detailAddForm) {
      detailAddForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!state.activeDetailProductId) return;
        const variant = detailVariantSelect ? detailVariantSelect.value : null;
        const qty = detailQtyInput ? Number(detailQtyInput.value) || 1 : 1;
        addToCart(state.activeDetailProductId, variant, qty);
        closeProductDetailModal();
      });
    }

    // Ações do Carrinho (WhatsApp, Continuar Comprando e Esvaziar)
    const cartClearBtn = document.getElementById('cart-clear-btn');
    const whatsappCheckoutBtn = document.getElementById('whatsapp-checkout-btn');
    const continueShoppingBtn = document.getElementById('cart-continue-shopping-btn');
    const toastActionBtn = document.getElementById('feedback-toast-action');

    if (cartClearBtn) {
      cartClearBtn.addEventListener('click', clearCart);
    }
    if (whatsappCheckoutBtn) {
      whatsappCheckoutBtn.addEventListener('click', () => {
        handleWhatsAppCheckout(whatsappCheckoutBtn);
      });
    }
    if (continueShoppingBtn) {
      continueShoppingBtn.addEventListener('click', () => {
        closeCartDrawer(false);
        const catalogSection = document.getElementById('catalogo');
        if (catalogSection) {
          catalogSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    }
    if (toastActionBtn) {
      toastActionBtn.addEventListener('click', () => {
        const toast = document.getElementById('feedback-toast');
        if (toast) toast.hidden = true;
        openCartDrawer();
      });
    }

    // Configurador Comercial (WhatsApp e Preços)
    const openPriceConfigBtn = document.getElementById('open-price-config-btn');
    const footerPriceConfigBtn = document.getElementById('footer-price-config-btn');
    const cartPriceConfigBtn = document.getElementById('cart-open-price-config');
    const priceConfigCloseBtn = document.getElementById('price-config-close');
    const priceConfigModal = document.getElementById('price-config-modal');
    const priceConfigForm = document.getElementById('price-config-form');
    const resetPricesBtn = document.getElementById('reset-prices-btn');
    const whatsappNumberInput = document.getElementById('whatsapp-number-input');

    if (openPriceConfigBtn) {
      openPriceConfigBtn.addEventListener('click', () => openPriceConfigModal(openPriceConfigBtn));
    }
    if (footerPriceConfigBtn) {
      footerPriceConfigBtn.addEventListener('click', () => openPriceConfigModal(footerPriceConfigBtn));
    }
    if (cartPriceConfigBtn) {
      cartPriceConfigBtn.addEventListener('click', () => {
        closeCartDrawer(false);
        openPriceConfigModal(cartPriceConfigBtn);
      });
    }
    if (priceConfigCloseBtn) {
      priceConfigCloseBtn.addEventListener('click', closePriceConfigModal);
    }
    if (priceConfigModal) {
      priceConfigModal.addEventListener('click', (e) => {
        if (e.target === priceConfigModal) closePriceConfigModal();
      });
    }
    if (priceConfigForm) {
      priceConfigForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const updatedPrices = {};
        CATALOG_PRODUCTS.forEach((product) => {
          const input = document.getElementById('price-input-' + product.id);
          if (input && input.value.trim() !== '') {
            const val = Number(input.value);
            if (!Number.isNaN(val) && val > 0) {
              updatedPrices[product.id] = val;
            }
          }
        });

        if (whatsappNumberInput) {
          state.whatsappNumber = sanitizeWhatsAppNumber(whatsappNumberInput.value);
          saveWhatsAppToStorage();
        }

        state.customPrices = updatedPrices;
        savePricesToStorage();
        renderCatalog();
        renderCart();
        closePriceConfigModal();
        showToast('Configurações de preços e WhatsApp atualizadas.');
      });
    }
    if (resetPricesBtn) {
      resetPricesBtn.addEventListener('click', () => {
        state.customPrices = {};
        state.whatsappNumber = '';
        savePricesToStorage();
        saveWhatsAppToStorage();
        renderCatalog();
        renderCart();
        closePriceConfigModal();
        showToast('Configurações restauradas para o padrão.');
      });
    }

    // Fechar Modal Institucional / Aviso WhatsApp
    const infoModalCloseBtn = document.getElementById('info-modal-close');
    const infoModal = document.getElementById('info-modal');
    if (infoModalCloseBtn) {
      infoModalCloseBtn.addEventListener('click', closeInfoModal);
    }
    if (infoModal) {
      infoModal.addEventListener('click', (e) => {
        if (e.target === infoModal) closeInfoModal();
      });
    }

    // Fechamento via tecla Escape para todos os modais e gavetas
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeProductDetailModal();
        closePriceConfigModal();
        closeInfoModal();
        closeAllDrawers();
      }
    });

    // Atualizar ano no rodapé
    const yearEl = document.getElementById('current-year');
    if (yearEl) {
      yearEl.textContent = String(new Date().getFullYear());
    }
  }

  /* ==========================================================================
     INTRODUÇÃO CINEMATOGRÁFICA DE ABERTURA (IM STORE)
     Exibida sempre na abertura / recarregamento do site com ritmo lento e suave
     ========================================================================== */

  function initCinematicIntro() {
    const introEl = document.getElementById('site-intro');
    if (!introEl) return null;

    const prefersReducedMotion =
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Se o usuário preferir movimento reduzido, dispensa a intro imediatamente
    if (prefersReducedMotion) {
      introEl.classList.add('is-dismissed');
      introEl.hidden = true;
      document.body.classList.remove('is-intro-active');
      document.body.classList.add('intro-completed');
      return {
        dismiss: () => {},
        isDismissed: () => true
      };
    }

    document.body.classList.add('is-intro-active');

    let isDismissed = false;
    function dismissIntro() {
      if (isDismissed) return;
      isDismissed = true;

      // Inicia a transição suave de saída da intro e a revelação do header e da hero
      introEl.classList.add('is-exiting');
      document.body.classList.add('is-intro-revealing');

      // Após a transição de saída (1.6s), remove o elemento e libera a navegação
      setTimeout(() => {
        introEl.classList.add('is-dismissed');
        introEl.hidden = true;
        document.body.classList.remove('is-intro-active');
        document.body.classList.remove('is-intro-revealing');
        document.body.classList.add('intro-completed');

        // Atualiza o motor de parallax
        if (state.parallaxEngine && typeof state.parallaxEngine.update === 'function') {
          state.parallaxEngine.update();
        }
      }, 1600);
    }

    // Cronograma cinematográfico:
    // 0s - 2.0s: entrada suave do título com blur reveal e escala
    // 2.0s - 3.0s: pausa para contemplação e apreciação da marca
    // 3.0s: disparo da saída suave da intro e revelação do cabeçalho e da Hero
    const timer = setTimeout(dismissIntro, 3000);

    // Timeout de segurança absoluto para nunca bloquear o usuário
    setTimeout(() => {
      if (!isDismissed) dismissIntro();
    }, 5500);

    // Permite ao usuário clicar na tela de abertura para avançar imediatamente se desejar
    introEl.addEventListener('click', () => {
      clearTimeout(timer);
      dismissIntro();
    }, { once: true });

    return {
      dismiss: dismissIntro,
      isDismissed: () => isDismissed
    };
  }

  /* ==========================================================================
     COMPONENTE IMSTORERIBBON — FAIXA VETORIAL ORGÂNICA COM TEXTO AO LONGO DA CURVA
     Reproduz a faixa com formato horizontal, leve queda no centro e movimento scroll-linked
     ========================================================================== */
  function createIMStoreRibbon(elementOrSelector = '#imstore-ribbon') {
    const rootEl =
      typeof elementOrSelector === 'string'
        ? document.querySelector(elementOrSelector)
        : elementOrSelector;

    if (!rootEl) return null;

    const textPathEl =
      rootEl.querySelector('#imstore-ribbon-textpath') ||
      rootEl.querySelector('#cleanTextPath') ||
      rootEl.querySelector('textPath');

    const prefersReducedMotion =
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let currentProgress = 0;

    function update(progress) {
      if (!rootEl) return;
      currentProgress = Math.max(0, Math.min(1, Number(progress) || 0));

      if (!prefersReducedMotion && textPathEl) {
        // Deslocamento contínuo e bidirecional do texto ao longo da curva:
        // P = 0 -> startOffset: 5%
        // P = 1 -> startOffset: -30%
        const targetOffset = 5 - (currentProgress * 35);
        textPathEl.setAttribute('startOffset', `${targetOffset.toFixed(2)}%`);
      }

      if (!prefersReducedMotion) {
        const isMobile = window.innerWidth <= 768;
        const shiftX = isMobile ? currentProgress * -15 : currentProgress * -30;
        const shiftY = isMobile ? currentProgress * 4 : currentProgress * 8;
        rootEl.style.setProperty('--ribbon-shift-x', `${shiftX.toFixed(1)}px`);
        rootEl.style.setProperty('--ribbon-shift-y', `${shiftY.toFixed(1)}px`);
      }

      const opacity = currentProgress > 0.9 ? Math.max(0.2, 1 - (currentProgress - 0.9) * 8) : 1;
      rootEl.style.setProperty('--ribbon-opacity', opacity.toFixed(3));
    }

    function reset() {
      if (!rootEl) return;
      if (textPathEl) {
        textPathEl.setAttribute('startOffset', '5%');
      }
      rootEl.style.setProperty('--ribbon-shift-x', '0px');
      rootEl.style.setProperty('--ribbon-shift-y', '0px');
      rootEl.style.setProperty('--ribbon-opacity', '1');
      currentProgress = 0;
    }

    // Inicializa na posição de repouso no topo
    update(0);

    return {
      element: rootEl,
      textPath: textPathEl,
      update,
      reset,
      getProgress: () => currentProgress,
      getOffset: () => (textPathEl ? textPathEl.getAttribute('startOffset') : null),
      isSupported: () => Boolean(rootEl) && !prefersReducedMotion
    };
  }

  const createHeroScrollWave = createIMStoreRibbon;

  /* ==========================================================================
     MOTOR DE SCROLL-LINKED PARALLAX (INSPIRADO EM FRAMER MOTION)
     Implementa useScroll e useTransform reativos com IntersectionObserver e RAF
     ========================================================================== */

  function initScrollParallax() {
    const prefersReducedMotion =
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      return {
        isEnabled: () => false,
        update: () => {},
        getActiveSections: () => [],
        getSectionProgress: () => 0,
        destroy: () => {}
      };
    }

    /**
     * useScroll(options)
     * Acompanha o progresso vertical (0 a 1) da seção alvo dentro da viewport.
     * Suporta offsets no padrão Framer Motion: ['start end', 'end start'] e ['start start', 'end start'].
     */
    function useScroll({ target, offset = ['start end', 'end start'] }) {
      if (!target) return () => 0;

      return function getScrollProgress() {
        const rect = target.getBoundingClientRect();
        const vh = window.innerHeight || document.documentElement.clientHeight;

        if (offset[0] === 'start start' && offset[1] === 'end start') {
          // Usado na Hero: 0 no topo da página, 1 quando a Hero sai pelo topo da tela
          const scrollY = window.pageYOffset || document.documentElement.scrollTop;
          const targetHeight = target.offsetHeight || rect.height;
          if (targetHeight <= 0) return 0;
          return Math.max(0, Math.min(1, scrollY / targetHeight));
        }

        // Padrão ['start end', 'end start']:
        // 0 quando o topo da seção entra no rodapé da viewport (rect.top === vh)
        // 1 quando o rodapé da seção sai pelo topo da viewport (rect.bottom === 0)
        const totalDistance = rect.height + vh;
        if (totalDistance <= 0) return 0;
        const currentDistance = vh - rect.top;
        return Math.max(0, Math.min(1, currentDistance / totalDistance));
      };
    }

    /**
     * useTransform(progressGetter, inputRange, outputRange)
     * Converte o progresso do scroll em deslocamento vertical (px ou %) ou opacidade.
     */
    function useTransform(progressGetter, inputRange, outputRange) {
      const parsedOutputs = outputRange.map((val) => {
        if (typeof val === 'number') {
          return { num: val, unit: '' };
        }
        const str = String(val).trim();
        const match = str.match(/^(-?[\d.]+)(.*)$/);
        if (match) {
          return { num: parseFloat(match[1]), unit: match[2] || '' };
        }
        return { num: 0, unit: '' };
      });

      return function evaluateTransform(scaleMultiplier = 1) {
        const progress = typeof progressGetter === 'function' ? progressGetter() : progressGetter;

        if (progress <= inputRange[0]) {
          const first = parsedOutputs[0];
          return first.unit ? `${first.num * scaleMultiplier}${first.unit}` : first.num;
        }

        const lastIdx = inputRange.length - 1;
        if (progress >= inputRange[lastIdx]) {
          const last = parsedOutputs[lastIdx];
          return last.unit ? `${last.num * scaleMultiplier}${last.unit}` : last.num;
        }

        for (let i = 0; i < lastIdx; i++) {
          const inStart = inputRange[i];
          const inEnd = inputRange[i + 1];
          if (progress >= inStart && progress <= inEnd) {
            const rangeSpan = inEnd - inStart;
            const t = rangeSpan === 0 ? 0 : (progress - inStart) / rangeSpan;
            const outStart = parsedOutputs[i];
            const outEnd = parsedOutputs[i + 1];
            const interpolated = outStart.num + (outEnd.num - outStart.num) * t;
            const unit = outEnd.unit || outStart.unit;
            return unit ? `${interpolated * scaleMultiplier}${unit}` : interpolated;
          }
        }

        const fallback = parsedOutputs[0];
        return fallback.unit ? `${fallback.num * scaleMultiplier}${fallback.unit}` : fallback.num;
      };
    }

    const trackedSections = [];
    const activeSectionSet = new Set();

    function registerSection(sectionEl, configFn) {
      if (!sectionEl) return;
      const bindings = configFn(sectionEl, { useScroll, useTransform });
      if (bindings && bindings.length > 0) {
        trackedSections.push({
          sectionEl,
          bindings
        });
      }
    }

    // 1. Hero Section
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
      registerSection(heroSection, (section, { useScroll, useTransform }) => {
        const scrollYProgress = useScroll({
          target: section,
          offset: ['start start', 'end start']
        });

        const giantTitleY = useTransform(scrollYProgress, [0, 1], ['0px', '75px']);
        const ambientGlowY = useTransform(scrollYProgress, [0, 1], ['0px', '40px']);
        const isaY = useTransform(scrollYProgress, [0, 1], ['0px', '22px']);
        const heroContentFade = useTransform(scrollYProgress, [0, 0.45, 0.85], [1, 1, 0]);
        const heroContentY = useTransform(scrollYProgress, [0, 0.45, 0.85], ['0px', '0px', '-18px']);

        const backdropEl = section.querySelector('.hero-Select-backdrop');
        const ambientEl = section.querySelector('.hero-ambient-layer');
        const centerColEl = section.querySelector('.hero-col-center');
        const leftColEl = section.querySelector('.hero-col-left');
        const rightColEl = section.querySelector('.hero-col-right');

        const ribbonEl = section.querySelector('#imstore-ribbon') || document.querySelector('#imstore-ribbon');
        const ribbonController = createIMStoreRibbon(ribbonEl);
        if (state) {
          state.imstoreRibbon = ribbonController;
          state.heroScrollWave = ribbonController;
        }

        return [
          {
            element: backdropEl,
            apply: (scale) => {
              backdropEl.style.setProperty('--parallax-y', giantTitleY(scale));
            }
          },
          {
            element: ambientEl,
            apply: (scale) => {
              ambientEl.style.setProperty('--parallax-y', ambientGlowY(scale));
            }
          },
          {
            element: centerColEl,
            apply: (scale) => {
              centerColEl.style.setProperty('--parallax-y', isaY(scale));
            }
          },
          {
            element: leftColEl,
            apply: (scale) => {
              leftColEl.style.setProperty('--parallax-y', heroContentY(scale));
              leftColEl.style.setProperty('--parallax-opacity', heroContentFade(1));
            }
          },
          {
            element: rightColEl,
            apply: (scale) => {
              rightColEl.style.setProperty('--parallax-y', heroContentY(scale));
              rightColEl.style.setProperty('--parallax-opacity', heroContentFade(1));
            }
          },
          {
            element: ribbonEl,
            apply: () => {
              const p = scrollYProgress();
              if (ribbonController) ribbonController.update(p);
            }
          }
        ].filter((b) => b.element);
      });
    }

    // 2. Categorias (Vitrine estilo Nike)
    const catSection = document.getElementById('categorias');
    if (catSection) {
      registerSection(catSection, (section, { useScroll, useTransform }) => {
        const scrollYProgress = useScroll({
          target: section,
          offset: ['start end', 'end start']
        });

        const catImgY = useTransform(scrollYProgress, [0, 1], ['-7%', '7%']);
        const catImages = Array.from(section.querySelectorAll('.category-img'));

        return catImages.map((img) => ({
          element: img,
          apply: (scale) => {
            img.style.setProperty('--parallax-y', catImgY(scale));
          }
        }));
      });
    }

    // 4. Seção de Benefícios
    const beneficiosSection = document.getElementById('beneficios');
    if (beneficiosSection) {
      registerSection(beneficiosSection, (section, { useScroll, useTransform }) => {
        const scrollYProgress = useScroll({
          target: section,
          offset: ['start end', 'end start']
        });

        const floatA = useTransform(scrollYProgress, [0, 1], ['10px', '-10px']);
        const floatB = useTransform(scrollYProgress, [0, 1], ['-10px', '10px']);
        const cards = Array.from(section.querySelectorAll('.benefit-card'));

        return cards.map((card, idx) => ({
          element: card,
          apply: (scale) => {
            const val = idx % 2 === 0 ? floatA(scale) : floatB(scale);
            card.style.setProperty('--parallax-y', val);
          }
        }));
      });
    }

    let intersectionObserver = null;
    if (typeof window.IntersectionObserver === 'function') {
      intersectionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              activeSectionSet.add(entry.target);
            } else {
              activeSectionSet.delete(entry.target);
            }
          });
          scheduleUpdate();
        },
        { root: null, rootMargin: '120px 0px', threshold: 0 }
      );

      trackedSections.forEach((item) => {
        intersectionObserver.observe(item.sectionEl);
      });
    } else {
      trackedSections.forEach((item) => activeSectionSet.add(item.sectionEl));
    }

    let ticking = false;

    function renderParallax() {
      ticking = false;
      const isMobile = window.innerWidth <= 768;
      const scaleMultiplier = isMobile ? 0.45 : 1;

      for (let i = 0; i < trackedSections.length; i++) {
        const item = trackedSections[i];
        if (activeSectionSet.has(item.sectionEl)) {
          for (let j = 0; j < item.bindings.length; j++) {
            item.bindings[j].apply(scaleMultiplier);
          }
        }
      }
    }

    function scheduleUpdate() {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(renderParallax);
      }
    }

    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate, { passive: true });

    scheduleUpdate();

    return {
      isEnabled: () => true,
      update: scheduleUpdate,
      getActiveSections: () => Array.from(activeSectionSet).map((el) => el.id || el.className),
      getSectionProgress: (sectionId) => {
        const found = trackedSections.find((item) => item.sectionEl.id === sectionId || item.sectionEl.classList.contains(sectionId));
        if (!found) return null;
        const fn = useScroll({
          target: found.sectionEl,
          offset: found.sectionEl.classList.contains('hero-section') ? ['start start', 'end start'] : ['start end', 'end start']
        });
        return fn();
      },
      destroy: () => {
        window.removeEventListener('scroll', scheduleUpdate);
        window.removeEventListener('resize', scheduleUpdate);
        if (intersectionObserver) intersectionObserver.disconnect();
      }
    };
  }

  
  function initProductShowcaseAnimation() {
    const section = document.getElementById('cuidados-pele');
    if (!section) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    if (typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined') {
      window.gsap.registerPlugin(window.ScrollTrigger);

      // 1. Trilha Ondulada SVG (Wave Track Ribbon & Line)
      const trackLine = section.querySelector('.showcase-track-line');
      const trackRibbon = section.querySelector('.showcase-track-ribbon');
      if (trackLine) {
        window.gsap.to(trackLine, {
          strokeDashoffset: -600,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1
          }
        });
      }
      if (trackRibbon) {
        window.gsap.fromTo(trackRibbon,
          { opacity: 0.65, y: -40 },
          {
            opacity: 1,
            y: 40,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.5
            }
          }
        );
      }

      // 2. Animação de cada Etapa (Stages 1, 2, 3)
      const stages = section.querySelectorAll('.showcase-stage');
      stages.forEach((stage, idx) => {
        const card = stage.querySelector('.showcase-editorial-card');
        const product = stage.querySelector('.showcase-product-figure');
        const halo = stage.querySelector('.showcase-product-halo');
        const shadow = stage.querySelector('.showcase-product-shadow');

        const isEven = idx % 2 === 1;

        // Revelação de entrada da etapa
        const tl = window.gsap.timeline({
          scrollTrigger: {
            trigger: stage,
            start: 'top 82%',
            end: 'top 38%',
            scrub: 0.8
          }
        });

        if (card) {
          tl.from(card, {
            y: 60,
            opacity: 0,
            scale: 0.94,
            duration: 1,
            ease: 'power2.out'
          }, 0);
        }

        if (product) {
          tl.from(product, {
            y: 110,
            opacity: 0,
            scale: 0.88,
            rotation: isEven ? -18 : 16,
            duration: 1.2,
            ease: 'power2.out'
          }, 0.1);
        }

        if (halo) {
          tl.from(halo, {
            scale: 0.6,
            opacity: 0,
            duration: 1,
            ease: 'power2.out'
          }, 0.15);
        }

        // Parallax contínuo enquanto a etapa percorre o viewport
        if (product) {
          window.gsap.to(product, {
            yPercent: isEven ? -16 : -20,
            rotation: isEven ? '+=4' : '-=4',
            ease: 'none',
            scrollTrigger: {
              trigger: stage,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.2
            }
          });
        }

        if (shadow) {
          window.gsap.to(shadow, {
            scaleX: 0.85,
            opacity: 0.6,
            ease: 'none',
            scrollTrigger: {
              trigger: stage,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.2
            }
          });
        }
      });

      // 3. Apresentação Final (Grand Finale)
      const finale = section.querySelector('.showcase-finale');
      if (finale) {
        const title = finale.querySelector('.showcase-finale-title');
        const subtitle = finale.querySelector('.showcase-finale-subtitle');
        const eyebrow = finale.querySelector('.finale-eyebrow');
        const ctaBtn = finale.querySelector('.showcase-cta-btn');
        const ctaArrow = finale.querySelector('.showcase-cta-arrow');
        const flankLeft = finale.querySelector('.decor-left');
        const flankRight = finale.querySelector('.decor-right');

        const finaleTl = window.gsap.timeline({
          scrollTrigger: {
            trigger: finale,
            start: 'top 82%',
            end: 'top 45%',
            scrub: 0.8
          }
        });

        if (eyebrow) {
          finaleTl.from(eyebrow, { y: 25, opacity: 0, duration: 0.6 }, 0);
        }
        if (title) {
          finaleTl.from(title, { y: 40, opacity: 0, duration: 0.8 }, 0.1);
        }
        if (subtitle) {
          finaleTl.from(subtitle, { y: 30, opacity: 0, duration: 0.8 }, 0.2);
        }
        if (ctaBtn) {
          finaleTl.from(ctaBtn, { y: 35, opacity: 0, scale: 0.92, duration: 0.8 }, 0.3);
        }
        if (ctaArrow) {
          finaleTl.from(ctaArrow, { opacity: 0, scale: 0.7, rotation: -20, duration: 0.6 }, 0.4);
        }
        if (flankLeft) {
          finaleTl.from(flankLeft, { y: 60, opacity: 0, rotation: 6, duration: 1 }, 0.2);
        }
        if (flankRight) {
          finaleTl.from(flankRight, { y: 60, opacity: 0, rotation: -6, duration: 1 }, 0.25);
        }
      }
    }
  }

  async function init() {
    loadStoredState();
    state.introController = initCinematicIntro();
    initScrollReveal();
    state.parallaxEngine = initScrollParallax();
    initProductShowcaseAnimation();
    if (window.IMSupabase && window.IMSupabase.isConfigured()) {
      try {
        const remoteProducts = await window.IMSupabase.fetchCatalog();
        if (Array.isArray(remoteProducts)) {
          CATALOG_PRODUCTS = remoteProducts;
          state.customPrices = {};
          state.cart = state.cart.filter((item) => getProductById(item.productId));
          savePricesToStorage();
          saveCartToStorage();
        }
      } catch (error) {
        console.error('Não foi possível carregar o catálogo do Supabase. Exibindo os produtos locais.', error);
      }
    }
    renderCatalog();
    renderCart();
    bindEvents();
    initNavScrollSpy();
  }

  // Expõe API utilitária de leitura para inspeção e testes automatizados
  window.IMStore = {
    getCatalog: () => CATALOG_PRODUCTS.slice(),
    refreshCatalog: async () => {
      if (!window.IMSupabase || !window.IMSupabase.isConfigured()) return false;
      const remoteProducts = await window.IMSupabase.fetchCatalog();
      if (!Array.isArray(remoteProducts)) return false;
      CATALOG_PRODUCTS = remoteProducts;
      state.customPrices = {};
      state.cart = state.cart.filter((item) => getProductById(item.productId));
      savePricesToStorage();
      saveCartToStorage();
      renderCatalog();
      renderCart();
      return true;
    },
    getCart: () => state.cart.slice(),
    getFavorites: () => state.favorites.slice(),
    toggleFavorite,
    navigateToSection,
    dismissIntro: () => (state.introController ? state.introController.dismiss() : undefined),
    isIntroDismissed: () => (state.introController ? state.introController.isDismissed() : false),
    parallax: {
      isEnabled: () => (state.parallaxEngine ? state.parallaxEngine.isEnabled() : false),
      update: () => (state.parallaxEngine ? state.parallaxEngine.update() : undefined),
      getActiveSections: () => (state.parallaxEngine ? state.parallaxEngine.getActiveSections() : []),
      getSectionProgress: (id) => (state.parallaxEngine ? state.parallaxEngine.getSectionProgress(id) : null)
    },
    imstoreRibbon: {
      update: (p) => (state.imstoreRibbon ? state.imstoreRibbon.update(p) : undefined),
      reset: () => (state.imstoreRibbon ? state.imstoreRibbon.reset() : undefined),
      getProgress: () => (state.imstoreRibbon ? state.imstoreRibbon.getProgress() : 0),
      getOffset: () => (state.imstoreRibbon ? state.imstoreRibbon.getOffset() : null),
      isSupported: () => (state.imstoreRibbon ? state.imstoreRibbon.isSupported() : false)
    },
    heroScrollWave: {
      update: (p) => (state.imstoreRibbon ? state.imstoreRibbon.update(p) : undefined),
      reset: () => (state.imstoreRibbon ? state.imstoreRibbon.reset() : undefined),
      getProgress: () => (state.imstoreRibbon ? state.imstoreRibbon.getProgress() : 0),
      isSupported: () => (state.imstoreRibbon ? state.imstoreRibbon.isSupported() : false)
    },
    getEffectiveWhatsAppNumber,
    buildWhatsAppOrderMessage,
    buildWhatsAppCheckoutUrl
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

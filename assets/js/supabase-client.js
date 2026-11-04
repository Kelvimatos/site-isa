(function () {
  'use strict';

  const config = window.IM_SUPABASE_CONFIG || {};
  const publicKey = config.publishableKey || config.anonKey || '';
  const configured = /^https:\/\/[^/]+\/?$/.test(config.url || '') &&
    typeof publicKey === 'string' && publicKey.length > 20 &&
    !publicKey.includes('COLE_');

  let client = null;

  function getClient() {
    if (!configured) throw new Error('Configure a URL e a chave pública do Supabase em assets/js/supabase-config.js.');
    if (!window.supabase || typeof window.supabase.createClient !== 'function') {
      throw new Error('Não foi possível carregar a biblioteca do Supabase. Verifique a conexão com a internet.');
    }
    if (!client) client = window.supabase.createClient(config.url, publicKey);
    return client;
  }

  function normalizeImageUrl(url) {
    if (typeof url !== 'string' || !url.trim()) return '';
    let clean = url.trim();
    if (!/^(https?:|\/|data:|\.\/)/i.test(clean) && clean.startsWith('assets/')) {
      clean = './' + clean;
    }
    // Auto-recuperação de URLs do Supabase Storage corrompidas para .webp
    if (clean.includes('/storage/v1/object/public/product-images/') && clean.endsWith('.webp')) {
      clean = clean.replace(/\.webp$/i, '.jpg');
    }
    return clean;
  }

  function toStoreProduct(row) {
    const variants = Array.isArray(row.variants) ? row.variants : [];
    const variantNames = variants.map((variant) => variant.name).filter(Boolean);
    const variantImages = {};
    const variantColors = {};
    variants.forEach((variant) => {
      if (variant.image_url) variantImages[variant.name] = normalizeImageUrl(variant.image_url);
      if (/^#[0-9a-f]{6}$/i.test(variant.color_hex || '')) {
        variantColors[variant.name] = {
          label: variant.name,
          bg: variant.color_hex,
          circleCss: 'background-color: ' + variant.color_hex + ';'
        };
      }
    });

    const categoryKey = row.category_key || 'acessorios-beleza';
    const filterGroupsByCategory = {
      esfoliantes: ['todos', 'esfoliantes', 'cuidados-pele'],
      skincare: ['todos', 'skincare', 'cuidados-pele', 'acessorios', 'acessorios-beleza'],
      faixas: ['todos', 'faixas', 'skincare', 'acessorios', 'acessorios-beleza'],
      acessorios: ['todos', 'acessorios', 'acessorios-beleza'],
      'acessorios-beleza': ['todos', 'acessorios', 'acessorios-beleza']
    };

    const isContainProduct = categoryKey === 'skincare' ||
      categoryKey === 'faixas' ||
      (typeof row.slug === 'string' && (row.slug.includes('escova') || row.slug.includes('faixa')));

    return {
      id: row.slug,
      name: row.name,
      categoryKey,
      categoryLabel: row.category_label || 'IM Store',
      filterGroups: filterGroupsByCategory[categoryKey] || ['todos', categoryKey],
      tag: row.category_label || 'IM Store',
      spec: row.spec || '',
      shortDesc: row.short_description || row.description || '',
      description: row.description || row.short_description || '',
      image: normalizeImageUrl(row.image_url) || '',
      imageAlt: row.image_alt || row.name,
      imageFit: row.image_fit || (isContainProduct ? 'contain' : 'cover'),
      careNote: row.care_note || '',
      highlights: Array.isArray(row.highlights) ? row.highlights : [],
      variants: variantNames.length ? variantNames : ['Unidade'],
      variantImages,
      variantColors: Object.keys(variantColors).length ? variantColors : null,
      defaultVariant: variantNames[0] || 'Unidade',
      defaultPrice: typeof row.price === 'number' ? row.price : null,
      originalPrice: typeof row.original_price === 'number' ? row.original_price : null,
      rating: 5,
      reviewsCount: 0,
      featuredOrder: row.sort_order || 0
    };
  }

  async function fetchCatalog() {
    if (!configured) return null;
    const { data, error } = await getClient()
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
      .order('name', { ascending: true });
    if (error) throw error;
    return data.map(toStoreProduct);
  }

  window.IMSupabase = {
    isConfigured: () => configured,
    getClient,
    fetchCatalog,
    toStoreProduct
  };
})();

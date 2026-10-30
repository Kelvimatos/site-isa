(function () {
  'use strict';

  const byId = (id) => document.getElementById(id);
  const categoryLabels = {
    esfoliantes: 'Esfoliantes faciais e corporais',
    skincare: 'Acessórios para skincare',
    faixas: 'Faixas de cabelo para maquiagem',
    'acessorios-beleza': 'Acessórios de beleza',
    acessorios: 'Acessórios'
  };

  let client = null;
  let products = [];
  let toastTimer = null;

  function setMessage(id, message, isError) {
    const element = byId(id);
    if (!element) return;
    element.textContent = message || '';
    element.style.color = isError ? 'var(--danger)' : 'var(--success)';
  }

  function notify(message) {
    const toast = byId('admin-toast');
    toast.textContent = message;
    toast.hidden = false;
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => { toast.hidden = true; }, 3600);
  }

  function showLogin(message) {
    byId('dashboard-view').hidden = true;
    byId('login-view').hidden = false;
    byId('logout-button').hidden = true;
    setMessage('login-message', message || '', Boolean(message));
  }

  function isAdmin(user) {
    return Boolean(user && user.app_metadata && user.app_metadata.is_admin === true);
  }

  function normalizeImageUrl(url) {
    if (typeof url !== 'string' || !url.trim()) return '';
    let clean = url.trim().replace(/\.(jpeg|jpg|png)$/i, '.webp');
    if (!/^(https?:|\/|data:|\.\/)/i.test(clean) && clean.startsWith('assets/')) {
      clean = './' + clean;
    }
    return clean;
  }

  function slugFromName(name) {
    return String(name || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 90);
  }

  function formatPrice(value) {
    if (value === null || value === undefined || value === '') return 'Preço sob consulta';
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(value));
  }

  function createTextField(labelText, input, extraClass) {
    const label = document.createElement('label');
    label.className = 'variant-field ' + (extraClass || '');
    const caption = document.createElement('span');
    caption.textContent = labelText;
    label.append(caption, input);
    return label;
  }

  function createVariantRow(variant) {
    const row = document.createElement('div');
    row.className = 'variant-row';
    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.maxLength = 80;
    nameInput.placeholder = 'Ex.: Rosa blush';
    nameInput.value = variant && variant.name ? variant.name : '';
    nameInput.className = 'variant-name-input';
    row.appendChild(createTextField('Nome da opção', nameInput, 'variant-name-field'));

    const colorInput = document.createElement('input');
    colorInput.type = 'color';
    colorInput.value = /^#[0-9a-f]{6}$/i.test((variant && variant.color_hex) || '') ? variant.color_hex : '#d9a3a7';
    colorInput.className = 'variant-color-input';
    row.appendChild(createTextField('Cor', colorInput, 'variant-color-field'));

    const colorLabel = document.createElement('label');
    colorLabel.className = 'variant-color-check';
    const colorCheckbox = document.createElement('input');
    colorCheckbox.type = 'checkbox';
    colorCheckbox.checked = Boolean(variant && variant.color_hex);
    colorCheckbox.className = 'variant-color-enabled';
    const colorText = document.createElement('span');
    colorText.textContent = 'Mostrar cor';
    colorLabel.append(colorCheckbox, colorText);
    row.appendChild(colorLabel);

    const imageInput = document.createElement('input');
    imageInput.type = 'file';
    imageInput.accept = 'image/jpeg,image/png,image/webp,image/gif';
    imageInput.className = 'variant-image-input';
    const variantImgUrl = normalizeImageUrl((variant && variant.image_url) || '');
    imageInput.dataset.currentUrl = variantImgUrl;
    const imageLabel = createTextField('Foto desta opção (opcional)', imageInput, 'variant-image-field');

    const variantPreview = document.createElement('img');
    variantPreview.className = 'variant-thumb-preview';
    if (variantImgUrl) {
      variantPreview.src = variantImgUrl;
      variantPreview.alt = 'Foto da opção ' + ((variant && variant.name) || '');
      variantPreview.onerror = () => { variantPreview.hidden = true; };
    } else {
      variantPreview.hidden = true;
    }
    imageLabel.appendChild(variantPreview);

    imageInput.addEventListener('change', () => {
      const file = imageInput.files && imageInput.files[0];
      if (file) {
        variantPreview.src = URL.createObjectURL(file);
        variantPreview.hidden = false;
      } else if (variantImgUrl) {
        variantPreview.src = variantImgUrl;
        variantPreview.hidden = false;
      } else {
        variantPreview.hidden = true;
      }
    });

    if (variantImgUrl) {
      const hint = document.createElement('small');
      hint.textContent = 'Foto atual mantida se não escolher outra.';
      hint.className = 'field-hint';
      imageLabel.appendChild(hint);
    }
    row.appendChild(imageLabel);

    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'variant-remove';
    remove.setAttribute('aria-label', 'Remover variação');
    remove.textContent = '×';
    remove.addEventListener('click', () => row.remove());
    row.appendChild(remove);
    return row;
  }

  function addVariant(variant) {
    byId('variants-list').appendChild(createVariantRow(variant));
  }

  function renderProducts() {
    const container = byId('products-list');
    container.replaceChildren();
    byId('product-count').textContent = products.length + (products.length === 1 ? ' produto cadastrado' : ' produtos cadastrados');

    if (products.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'empty-state';
      const title = document.createElement('strong');
      title.textContent = 'Seu catálogo está vazio.';
      empty.append(title, document.createTextNode('Use “Novo produto” para começar a cadastrar.'));
      container.appendChild(empty);
      return;
    }

    products.forEach((product) => {
      const row = document.createElement('article');
      row.className = 'product-row';
      const imgUrl = normalizeImageUrl(product.image_url);
      if (imgUrl) {
        const img = document.createElement('img');
        img.src = imgUrl;
        img.alt = product.image_alt || product.name;
        img.loading = 'lazy';
        img.onerror = () => { img.replaceWith(createPlaceholder()); };
        row.appendChild(img);
      } else {
        row.appendChild(createPlaceholder());
      }

      const info = document.createElement('div');
      const name = document.createElement('h3');
      name.textContent = product.name;
      const category = document.createElement('p');
      category.textContent = (product.category_label || categoryLabels[product.category_key] || 'Acessórios') + ' · ' + formatPrice(product.price);
      const meta = document.createElement('div');
      meta.className = 'product-meta';
      const status = document.createElement('span');
      status.className = 'badge ' + (product.is_active ? 'published' : 'draft');
      status.textContent = product.is_active ? 'Publicado' : 'Oculto';
      meta.appendChild(status);
      const variations = Array.isArray(product.variants) ? product.variants.length : 0;
      if (variations) {
        const badge = document.createElement('span');
        badge.className = 'badge';
        badge.textContent = variations + (variations === 1 ? ' variação' : ' variações');
        meta.appendChild(badge);
      }
      info.append(name, category, meta);
      row.appendChild(info);

      const actions = document.createElement('div');
      actions.className = 'row-actions';
      const edit = document.createElement('button');
      edit.type = 'button';
      edit.className = 'button button-outline';
      edit.textContent = 'Editar';
      edit.addEventListener('click', () => openEditor(product));
      const remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'button button-quiet';
      remove.textContent = 'Excluir';
      remove.addEventListener('click', () => deleteProduct(product));
      actions.append(edit, remove);
      row.appendChild(actions);
      container.appendChild(row);
    });
  }

  function createPlaceholder() {
    const placeholder = document.createElement('div');
    placeholder.className = 'product-placeholder';
    placeholder.setAttribute('aria-hidden', 'true');
    placeholder.textContent = 'IM';
    return placeholder;
  }

  async function loadProducts() {
    setMessage('dashboard-message', '');
    byId('product-count').textContent = 'Carregando produtos…';
    const { data, error } = await client.from('products').select('*').order('sort_order', { ascending: true }).order('name', { ascending: true });
    if (error) throw error;
    products = data || [];
    renderProducts();

    // Sincroniza referências legadas (.jpeg/.png) para .webp diretamente no Supabase em segundo plano
    try {
      const legacyProducts = products.filter((p) =>
        /\.(jpeg|jpg|png)$/i.test(p.image_url || '') ||
        (Array.isArray(p.variants) && p.variants.some((v) => /\.(jpeg|jpg|png)$/i.test(v.image_url || '')))
      );
      if (legacyProducts.length > 0) {
        for (const p of legacyProducts) {
          const updatedImg = normalizeImageUrl(p.image_url);
          const updatedVariants = Array.isArray(p.variants)
            ? p.variants.map((v) => ({ ...v, image_url: normalizeImageUrl(v.image_url) }))
            : p.variants;
          await client.from('products').update({
            image_url: updatedImg,
            variants: updatedVariants
          }).eq('id', p.id);
        }
      }
    } catch (syncErr) {
      console.warn('Aviso ao sincronizar imagens legadas no Supabase:', syncErr);
    }
  }

  function openEditor(product) {
    const form = byId('product-form');
    form.reset();
    byId('variants-list').replaceChildren();
    setMessage('editor-message', '');
    byId('product-active').checked = true;
    byId('product-id').value = product ? product.id : '';
    byId('editor-title').textContent = product ? 'Editar produto' : 'Novo produto';
    byId('delete-product-button').hidden = !product;
    byId('product-name').value = product ? product.name : '';
    byId('product-category').value = product ? product.category_key : 'acessorios-beleza';
    byId('product-category-label').value = product ? product.category_label : categoryLabels['acessorios-beleza'];
    byId('product-short-description').value = product ? product.short_description : '';
    byId('product-description').value = product ? product.description : '';
    byId('product-price').value = product && product.price !== null ? product.price : '';
    byId('product-original-price').value = product && product.original_price !== null ? product.original_price : '';
    byId('product-spec').value = product ? product.spec : '';
    byId('product-care-note').value = product ? product.care_note : '';
    byId('product-highlights').value = product && Array.isArray(product.highlights) ? product.highlights.join('\n') : '';
    byId('product-sort-order').value = product ? product.sort_order : products.length + 1;
    byId('product-active').checked = product ? product.is_active : true;
    byId('product-image').value = '';
    const mainImgUrl = normalizeImageUrl(product && product.image_url);
    const previewBox = byId('product-image-preview-box');
    const previewImg = byId('product-image-preview-img');
    const previewLabel = byId('product-image-preview-label');
    if (previewBox && previewImg) {
      if (mainImgUrl) {
        previewImg.src = mainImgUrl;
        previewImg.alt = 'Foto atual de ' + ((product && product.name) || '');
        if (previewLabel) previewLabel.textContent = 'Foto atual';
        previewBox.hidden = false;
      } else {
        previewBox.hidden = true;
      }
    }
    byId('current-image-hint').textContent = mainImgUrl
      ? 'Foto atual cadastrada. Envie uma imagem de até 5 MB para substituí-la.'
      : 'Envie uma imagem de até 5 MB.';

    byId('product-image').onchange = () => {
      const file = byId('product-image').files && byId('product-image').files[0];
      if (previewBox && previewImg) {
        if (file) {
          previewImg.src = URL.createObjectURL(file);
          if (previewLabel) previewLabel.textContent = 'Nova foto selecionada';
          previewBox.hidden = false;
        } else if (mainImgUrl) {
          previewImg.src = mainImgUrl;
          if (previewLabel) previewLabel.textContent = 'Foto atual';
          previewBox.hidden = false;
        } else {
          previewBox.hidden = true;
        }
      }
    };
    if (product && Array.isArray(product.variants)) product.variants.forEach(addVariant);
    const editor = byId('product-editor');
    const heading = byId('dashboard-view').querySelector('.page-heading');
    if (heading && editor.previousElementSibling !== heading) heading.after(editor);
    editor.hidden = false;
    editor.scrollIntoView({ behavior: 'smooth', block: 'start' });
    byId('product-name').focus({ preventScroll: true });
  }

  function closeEditor() {
    byId('product-editor').hidden = true;
    setMessage('editor-message', '');
  }

  function validateImage(file) {
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) {
      throw new Error('Use uma imagem JPG, PNG, WebP ou GIF.');
    }
    if (file.size > 5 * 1024 * 1024) throw new Error('Cada imagem pode ter no máximo 5 MB.');
  }

  async function uploadImage(file, slug) {
    if (!file) return '';
    validateImage(file);
    const extensionByType = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif' };
    const path = 'products/' + slug + '/' + crypto.randomUUID() + '.' + extensionByType[file.type];
    const { error } = await client.storage.from('product-images').upload(path, file, {
      cacheControl: '3600',
      contentType: file.type,
      upsert: false
    });
    if (error) throw error;
    return client.storage.from('product-images').getPublicUrl(path).data.publicUrl;
  }

  async function collectVariants(slug) {
    const rows = Array.from(byId('variants-list').querySelectorAll('.variant-row'));
    const result = [];
    for (const row of rows) {
      const name = row.querySelector('.variant-name-input').value.trim();
      if (!name) continue;
      const colorEnabled = row.querySelector('.variant-color-enabled').checked;
      const colorHex = row.querySelector('.variant-color-input').value;
      const imageInput = row.querySelector('.variant-image-input');
      const imageFile = imageInput.files && imageInput.files[0];
      let imageUrl = normalizeImageUrl(imageInput.dataset.currentUrl) || '';
      if (imageFile) imageUrl = await uploadImage(imageFile, slug);
      result.push({
        name,
        color_hex: colorEnabled ? colorHex : null,
        image_url: imageUrl || null
      });
    }
    return result;
  }

  async function saveProduct(event) {
    event.preventDefault();
    const saveButton = byId('save-product-button');
    saveButton.disabled = true;
    saveButton.textContent = 'Salvando…';
    setMessage('editor-message', '');

    try {
      const name = byId('product-name').value.trim();
      const slug = slugFromName(name);
      if (!slug) throw new Error('Informe um nome válido para o produto.');
      const existing = products.find((item) => item.id === byId('product-id').value);
      const mainFile = byId('product-image').files[0];
      validateImage(mainFile);
      if (!existing && !mainFile) throw new Error('Escolha a foto principal do produto.');

      const imageUrl = mainFile ? await uploadImage(mainFile, slug) : normalizeImageUrl(existing.image_url);
      const categoryKey = byId('product-category').value;
      const categoryLabel = byId('product-category-label').value.trim() || categoryLabels[categoryKey] || 'Acessórios';
      const variants = await collectVariants(slug);
      const priceValue = byId('product-price').value.trim();
      const originalValue = byId('product-original-price').value.trim();
      const payload = {
        slug,
        name,
        category_key: categoryKey,
        category_label: categoryLabel,
        short_description: byId('product-short-description').value.trim(),
        description: byId('product-description').value.trim(),
        spec: byId('product-spec').value.trim(),
        care_note: byId('product-care-note').value.trim(),
        highlights: byId('product-highlights').value.split('\n').map((line) => line.trim()).filter(Boolean),
        price: priceValue === '' ? null : Number(priceValue),
        original_price: originalValue === '' ? null : Number(originalValue),
        image_url: imageUrl,
        image_alt: name,
        variants: variants.length ? variants : [{ name: 'Unidade', color_hex: null, image_url: null }],
        is_active: byId('product-active').checked,
        sort_order: Number(byId('product-sort-order').value) || 0
      };

      let response;
      if (existing) {
        response = await client.from('products').update(payload).eq('id', existing.id).select().single();
      } else {
        response = await client.from('products').insert(payload).select().single();
      }
      if (response.error) throw response.error;
      await loadProducts();
      closeEditor();
      notify(existing ? 'Produto atualizado. Recarregue a loja para ver a alteração.' : 'Produto cadastrado. Recarregue a loja para ver a alteração.');
    } catch (error) {
      setMessage('editor-message', error.message || 'Não foi possível salvar o produto.', true);
    } finally {
      saveButton.disabled = false;
      saveButton.textContent = 'Salvar produto';
    }
  }

  async function deleteProduct(product) {
    const confirmed = window.confirm('Excluir “' + product.name + '” do catálogo? Essa ação não pode ser desfeita.');
    if (!confirmed) return;
    setMessage('dashboard-message', 'Excluindo…');
    const { error } = await client.from('products').delete().eq('id', product.id);
    if (error) {
      setMessage('dashboard-message', error.message, true);
      return;
    }
    if (byId('product-id').value === product.id) closeEditor();
    await loadProducts();
    notify('Produto excluído do catálogo.');
  }

  async function startDashboard(user) {
    if (!isAdmin(user)) {
      await client.auth.signOut();
      showLogin('Esta conta ainda não recebeu permissão de administradora no Supabase.');
      return;
    }
    await loadProducts();
    byId('login-view').hidden = true;
    byId('dashboard-view').hidden = false;
    byId('logout-button').hidden = false;
  }

  async function init() {
    if (!window.IMSupabase || !window.IMSupabase.isConfigured()) {
      byId('setup-notice').hidden = false;
      byId('login-view').hidden = true;
      return;
    }
    try {
      client = window.IMSupabase.getClient();
      const { data, error } = await client.auth.getSession();
      if (error) throw error;
      if (data.session) await startDashboard(data.session.user);
      else showLogin('');
    } catch (error) {
      byId('setup-notice').hidden = false;
      byId('setup-notice').replaceChildren();
      const title = document.createElement('strong');
      title.textContent = 'Não foi possível conectar ao Supabase.';
      const detail = document.createElement('span');
      detail.textContent = error.message || 'Confira a configuração e tente novamente.';
      byId('setup-notice').append(title, detail);
    }
  }

  byId('login-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const button = event.currentTarget.querySelector('button[type="submit"]');
    button.disabled = true;
    setMessage('login-message', 'Entrando…');
    try {
      const { data, error } = await client.auth.signInWithPassword({
        email: byId('login-email').value.trim(),
        password: byId('login-password').value
      });
      if (error) throw error;
      await startDashboard(data.user);
    } catch (error) {
      setMessage('login-message', error.message || 'Não foi possível entrar.', true);
    } finally {
      button.disabled = false;
    }
  });

  byId('logout-button').addEventListener('click', async () => {
    if (client) await client.auth.signOut();
    showLogin('Você saiu do painel.');
  });
  document.addEventListener('click', (event) => {
    const newProductButton = event.target.closest('#new-product-button');
    if (!newProductButton) return;
    try {
      openEditor(null);
    } catch (error) {
      setMessage('dashboard-message', 'Não foi possível abrir o formulário: ' + (error.message || 'erro inesperado.'), true);
    }
  });
  byId('refresh-button').addEventListener('click', () => loadProducts().catch((error) => setMessage('dashboard-message', error.message, true)));
  byId('add-variant-button').addEventListener('click', () => addVariant(null));
  byId('cancel-edit-button').addEventListener('click', closeEditor);
  byId('cancel-edit-button-bottom').addEventListener('click', closeEditor);
  byId('product-form').addEventListener('submit', saveProduct);
  byId('delete-product-button').addEventListener('click', () => {
    const product = products.find((item) => item.id === byId('product-id').value);
    if (product) deleteProduct(product);
  });
  byId('product-category').addEventListener('change', (event) => {
    const current = byId('product-category-label').value.trim();
    const previousDefault = Object.values(categoryLabels);
    if (!current || previousDefault.includes(current)) {
      byId('product-category-label').value = categoryLabels[event.target.value] || 'Acessórios';
    }
  });

  init();
})();

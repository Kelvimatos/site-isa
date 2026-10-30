-- IM Store: banco de produtos, segurança (RLS), imagens e catálogo inicial.
-- Execute este arquivo uma vez em Supabase > SQL Editor.

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  category_key text not null default 'acessorios-beleza',
  category_label text not null default 'Acessórios de beleza',
  short_description text not null default '',
  description text not null default '',
  spec text not null default '',
  care_note text not null default '',
  highlights text[] not null default '{}',
  price numeric(10,2),
  original_price numeric(10,2),
  image_url text not null default '',
  image_alt text not null default '',
  variants jsonb not null default '[]'::jsonb,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint products_price_nonnegative check (price is null or price >= 0),
  constraint products_original_price_nonnegative check (original_price is null or original_price >= 0),
  constraint products_variants_array check (jsonb_typeof(variants) = 'array')
);

create or replace function public.set_products_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
revoke all on function public.set_products_updated_at() from public, anon, authenticated;

drop trigger if exists products_updated_at on public.products;
create trigger products_updated_at
before update on public.products
for each row execute function public.set_products_updated_at();

alter table public.products enable row level security;
grant select on public.products to anon, authenticated;
grant insert, update, delete on public.products to authenticated;

drop policy if exists "Public can view active products" on public.products;
create policy "Public can view active products"
on public.products for select to anon, authenticated
using (is_active or (auth.jwt() -> 'app_metadata' ->> 'is_admin') = 'true');

drop policy if exists "Admins can insert products" on public.products;
create policy "Admins can insert products"
on public.products for insert to authenticated
with check ((auth.jwt() -> 'app_metadata' ->> 'is_admin') = 'true');

drop policy if exists "Admins can update products" on public.products;
create policy "Admins can update products"
on public.products for update to authenticated
using ((auth.jwt() -> 'app_metadata' ->> 'is_admin') = 'true')
with check ((auth.jwt() -> 'app_metadata' ->> 'is_admin') = 'true');

drop policy if exists "Admins can delete products" on public.products;
create policy "Admins can delete products"
on public.products for delete to authenticated
using ((auth.jwt() -> 'app_metadata' ->> 'is_admin') = 'true');

-- Bucket público para as imagens exibidas na loja; somente administradores podem enviar/remover.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('product-images', 'product-images', true, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can view product images" on storage.objects;
create policy "Public can view product images"
on storage.objects for select to anon, authenticated
using (bucket_id = 'product-images');

drop policy if exists "Admins can upload product images" on storage.objects;
create policy "Admins can upload product images"
on storage.objects for insert to authenticated
with check (bucket_id = 'product-images' and (auth.jwt() -> 'app_metadata' ->> 'is_admin') = 'true');

drop policy if exists "Admins can update product images" on storage.objects;
create policy "Admins can update product images"
on storage.objects for update to authenticated
using (bucket_id = 'product-images' and (auth.jwt() -> 'app_metadata' ->> 'is_admin') = 'true')
with check (bucket_id = 'product-images' and (auth.jwt() -> 'app_metadata' ->> 'is_admin') = 'true');

drop policy if exists "Admins can delete product images" on storage.objects;
create policy "Admins can delete product images"
on storage.objects for delete to authenticated
using (bucket_id = 'product-images' and (auth.jwt() -> 'app_metadata' ->> 'is_admin') = 'true');

-- Catálogo atual da loja para o painel já abrir com os seis produtos existentes.
insert into public.products
  (slug, name, category_key, category_label, short_description, description, spec, care_note, highlights,
   price, original_price, image_url, image_alt, variants, is_active, sort_order)
values
  ('esfoliante-pitaya-150g', 'Esfoliante de Pitaya — 150 g', 'esfoliantes', 'Bio Instinto • Rosto e corpo',
   'Linha Banho Premium Bio Instinto. Desobstrui poros e elimina impurezas da pele.',
   'Esfoliante facial e corporal de Pitaya, 150 g, da linha Banho Premium Bio Instinto.',
   'Peso líquido: 150 g • Rosto e corpo', 'Indicado para uso facial e corporal. Enxágue após a aplicação.',
   array['150 g', 'Uso facial e corporal', 'Fragrância de Pitaya'], 17.60, 24.90,
   './assets/images/esfoliantes.1.webp', 'Esfoliante de Pitaya Bio Instinto 150 g',
   '[{"name":"150 g — Pitaya (Unidade)"}]'::jsonb, true, 1),
  ('esfoliante-morango-150g', 'Esfoliante de Morango — 150 g', 'esfoliantes', 'Bio Instinto • Rosto e corpo',
   'Linha Banho Premium Bio Instinto. Desobstrui poros e elimina impurezas da pele.',
   'Esfoliante facial e corporal de Morango, 150 g, da linha Banho Premium Bio Instinto.',
   'Peso líquido: 150 g • Rosto e corpo', 'Ideal para a rotina de cuidados com o rosto e o corpo.',
   array['150 g', 'Uso facial e corporal', 'Fragrância de Morango'], 17.60, 24.90,
   './assets/images/esfoliantes.2.webp', 'Esfoliante de Morango Bio Instinto 150 g',
   '[{"name":"150 g — Morango (Unidade)"}]'::jsonb, true, 2),
  ('esfoliante-uva-150g', 'Esfoliante de Uva — 150 g', 'esfoliantes', 'Bio Instinto • Rosto e corpo',
   'Linha Banho Premium Bio Instinto. Desobstrui poros e elimina impurezas da pele.',
   'Esfoliante facial e corporal de Uva, 150 g, da linha Banho Premium Bio Instinto.',
   'Peso líquido: 150 g • Rosto e corpo', 'Proporciona sensação de frescor e renovação.',
   array['150 g', 'Uso facial e corporal', 'Fragrância de Uva'], 17.60, 24.90,
   './assets/images/esfoliantes.3.webp', 'Esfoliante de Uva Bio Instinto 150 g',
   '[{"name":"150 g — Uva (Unidade)"}]'::jsonb, true, 3),
  ('esfoliante-framboesa-150g', 'Esfoliante de Framboesa — 150 g', 'esfoliantes', 'Bio Instinto • Rosto e corpo',
   'Linha Banho Premium Bio Instinto. Desobstrui poros e elimina impurezas da pele.',
   'Esfoliante facial e corporal de Framboesa, 150 g, da linha Banho Premium Bio Instinto.',
   'Peso líquido: 150 g • Rosto e corpo', 'Ideal para um ritual de banho e autocuidado.',
   array['150 g', 'Uso facial e corporal', 'Fragrância de Framboesa'], 17.60, 24.90,
   './assets/images/esfoliantes.4.webp', 'Esfoliante de Framboesa Bio Instinto 150 g',
   '[{"name":"150 g — Framboesa (Unidade)"}]'::jsonb, true, 4),
  ('escova-limpeza-facial', 'Escova de Limpeza Facial 2 em 1', 'skincare', 'Acessórios para skincare',
   'Limpeza com cerdas suaves e massagem esfoliante de silicone.',
   'Escova facial 2 em 1 com cerdas ultrafinas para limpeza e silicone para massagem.',
   'Cerdas ultrafinas + silicone esfoliante • Cabo anatômico', 'Use suavemente com seu sabonete facial habitual.',
   array['Design 2 em 1', 'Cabo anatômico', 'Escolha sua cor'], null, null,
   './assets/images/escovafacial.webp', 'Escova facial rosa',
   '[{"name":"Rosa","color_hex":"#f69cb2","image_url":"./assets/images/escovafacial.webp"},{"name":"Branca e Rosa","color_hex":"#f4cbd5","image_url":"./assets/images/escovafacial-rosa.webp"},{"name":"Azul","color_hex":"#64b7e8","image_url":"./assets/images/escovafacial-azul.webp"}]'::jsonb, true, 5),
  ('faixa-cabelo-make', 'Faixa de Cabelo Plush com Laço', 'faixas', 'Acessórios de beleza',
   'Toque macio e ajuste confortável para proteger os fios na make e no skincare.',
   'Faixa de cabelo peluciada com laço, confortável para manter os fios afastados do rosto.',
   'Tecido plush macio • Ideal para maquiagem e skincare', 'Lave delicadamente para preservar o tecido.',
   array['Tecido macio', 'Elástico confortável', 'Quatro variações'], null, null,
   './assets/images/faixadecabelo.webp', 'Faixas de cabelo plush com laço',
   '[{"name":"Rosa com Branco","color_hex":"#f3c4cf"},{"name":"Rosa Estampa Oncinha","color_hex":"#d89a8c"},{"name":"Rosa Blush","color_hex":"#e9a5b5"},{"name":"Lilás","color_hex":"#c6a5db"}]'::jsonb, true, 6)
on conflict (slug) do nothing;

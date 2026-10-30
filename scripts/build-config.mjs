import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

// Helper to parse .env file simple format
function parseEnv(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const content = fs.readFileSync(filePath, 'utf8');
  const env = {};
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx !== -1) {
      const key = trimmed.slice(0, eqIdx).trim();
      let val = trimmed.slice(eqIdx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      env[key] = val;
    }
  }
  return env;
}

const fileEnv = parseEnv(path.join(ROOT_DIR, '.env'));
const SUPABASE_URL = process.env.SUPABASE_URL || fileEnv.SUPABASE_URL || '';
const SUPABASE_PUBLISHABLE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY || fileEnv.SUPABASE_PUBLISHABLE_KEY || '';
const WHATSAPP_NUMBER = process.env.WHATSAPP_NUMBER || fileEnv.WHATSAPP_NUMBER || '';

const targetConfigPath = path.join(ROOT_DIR, 'assets', 'js', 'supabase-config.js');

if (SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY) {
  const configContent = `/*
 * Arquivo gerado automaticamente via "npm run build" / "node scripts/build-config.mjs"
 * a partir das variáveis de ambiente (.env ou painel da hospedagem).
 * Este arquivo está listado no .gitignore para nunca expor credenciais no GitHub.
 */
window.IM_SUPABASE_CONFIG = {
  url: '${SUPABASE_URL}',
  publishableKey: '${SUPABASE_PUBLISHABLE_KEY}'
};
`;
  fs.writeFileSync(targetConfigPath, configContent, 'utf8');
  console.log('✓ assets/js/supabase-config.js gerado com sucesso a partir do ambiente.');
} else if (!fs.existsSync(targetConfigPath)) {
  const examplePath = path.join(ROOT_DIR, 'assets', 'js', 'supabase-config.example.js');
  if (fs.existsSync(examplePath)) {
    fs.copyFileSync(examplePath, targetConfigPath);
    console.log('⚠ Nenhum .env configurado: copiado assets/js/supabase-config.example.js como fallback.');
  }
} else {
  console.log('ℹ assets/js/supabase-config.js existente preservado.');
}

// Update WhatsApp number in script.js if provided via env
if (WHATSAPP_NUMBER && /^\d{10,14}$/.test(WHATSAPP_NUMBER)) {
  const scriptPath = path.join(ROOT_DIR, 'assets', 'js', 'script.js');
  if (fs.existsSync(scriptPath)) {
    let scriptContent = fs.readFileSync(scriptPath, 'utf8');
    const regex = /const ISA_WHATSAPP_NUMBER = '[^']*';/;
    if (regex.test(scriptContent)) {
      scriptContent = scriptContent.replace(regex, `const ISA_WHATSAPP_NUMBER = '${WHATSAPP_NUMBER}';`);
      fs.writeFileSync(scriptPath, scriptContent, 'utf8');
      console.log(`✓ WhatsApp oficial sincronizado no frontend: ${WHATSAPP_NUMBER}`);
    }
  }
}


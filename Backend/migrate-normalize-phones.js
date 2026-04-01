import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

function onlyDigits(value) {
  return String(value || '').replace(/\D/g, '');
}

function formatResidential(digits) {
  if (digits.length !== 10) return null;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
}

function formatMobile(digits) {
  if (digits.length !== 11) return null;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function normalizeResidential(rawValue) {
  return formatResidential(onlyDigits(rawValue));
}

function normalizeMobile(rawValue) {
  return formatMobile(onlyDigits(rawValue));
}

async function normalizePhones() {
  try {
    const [rows] = await pool.query('SELECT id, phone, phone2 FROM patients');

    let updated = 0;
    let unchanged = 0;
    let withoutValidPhone = 0;

    for (const row of rows) {
      const originalPhone = row.phone || null;
      const originalPhone2 = row.phone2 || null;

      let normalizedPhone = normalizeResidential(originalPhone);
      let normalizedPhone2 = normalizeMobile(originalPhone2);

      const phoneDigits = onlyDigits(originalPhone);
      const phone2Digits = onlyDigits(originalPhone2);

      // Caso os campos estejam trocados: phone com celular e/ou phone2 com residencial.
      if (!normalizedPhone && !normalizedPhone2) {
        if (phoneDigits.length === 11) {
          normalizedPhone2 = formatMobile(phoneDigits);
        }
        if (phone2Digits.length === 10) {
          normalizedPhone = formatResidential(phone2Digits);
        }
      }

      if (!normalizedPhone && !normalizedPhone2) {
        // Tentar aproveitar qualquer número válido disponível em qualquer coluna.
        if (phoneDigits.length === 10) normalizedPhone = formatResidential(phoneDigits);
        if (phoneDigits.length === 11) normalizedPhone2 = formatMobile(phoneDigits);
        if (!normalizedPhone && phone2Digits.length === 10) normalizedPhone = formatResidential(phone2Digits);
        if (!normalizedPhone2 && phone2Digits.length === 11) normalizedPhone2 = formatMobile(phone2Digits);
      }

      if (!normalizedPhone && !normalizedPhone2) {
        withoutValidPhone += 1;
      }

      const nextPhone = normalizedPhone;
      const nextPhone2 = normalizedPhone2;

      const changed = (originalPhone || null) !== (nextPhone || null)
        || (originalPhone2 || null) !== (nextPhone2 || null);

      if (!changed) {
        unchanged += 1;
        continue;
      }

      await pool.query(
        'UPDATE patients SET phone = ?, phone2 = ? WHERE id = ?',
        [nextPhone, nextPhone2, row.id]
      );

      updated += 1;
    }

    console.log('✅ Normalizacao de telefones concluida');
    console.log(`- Registros analisados: ${rows.length}`);
    console.log(`- Registros atualizados: ${updated}`);
    console.log(`- Registros sem alteracao: ${unchanged}`);
    console.log(`- Registros sem numero valido apos normalizacao: ${withoutValidPhone}`);
  } catch (error) {
    console.error('❌ Erro ao normalizar telefones:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

normalizePhones();

/**
 * reset-db.cjs
 * Dropa tudo no banco (tabelas, enums, índices, sequences) e recria o schema vazio.
 * USE COM CUIDADO - todos os dados serão perdidos permanentemente.
 */
const { Client } = require('pg');

const DB_URL = 'postgres://vidshop:123456Abc@194.163.145.246:5432/vidshop';

async function main() {
  const client = new Client({ connectionString: DB_URL });
  await client.connect();
  console.log('Conectado ao banco.');

  // Dropa o schema público inteiro (tabelas, enums, sequences, views, etc)
  // e recria vazio
  await client.query('DROP SCHEMA public CASCADE;');
  console.log('Schema public dropado.');

  await client.query('CREATE SCHEMA public;');
  console.log('Schema public recriado vazio.');

  // Restaura permissões padrão
  await client.query('GRANT ALL ON SCHEMA public TO PUBLIC;');
  await client.query('GRANT ALL ON SCHEMA public TO postgres;');
  console.log('Permissões restauradas.');

  await client.end();
  console.log('\nBanco limpo com sucesso!');
  console.log('Próximos passos:');
  console.log('  1. Delete todos os arquivos dentro de drizzle/ (exceto a pasta meta/ se quiser)');
  console.log('  2. Delete o conteúdo do drizzle/meta/_journal.json');
  console.log('  3. Rode: npm run db:mig');
}

main().catch(e => { console.error('ERRO:', e.message); process.exit(1); });

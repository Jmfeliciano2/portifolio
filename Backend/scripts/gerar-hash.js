/**
 * Utilitário para gerar hash bcrypt para a senha do administrador.
 * 
 * Uso:
 *   node Backend/scripts/gerar-hash.js "minhaSenhaSuperSegura"
 * Ou:
 *   npm run gerar-hash "minhaSenhaSuperSegura"
 */

const bcrypt = require('bcryptjs');

const senha = process.argv[2];

if (!senha) {
  console.log('\nUso:');
  console.log('  node Backend/scripts/gerar-hash.js "sua_senha_aqui"');
  console.log('Exemplo:');
  console.log('  node Backend/scripts/gerar-hash.js "admin123"\n');
  process.exit(1);
}

const saltRounds = 10;
const hash = bcrypt.hashSync(senha, saltRounds);

console.log('\n========================================');
console.log('HASH GERADO COM SUCESSO!');
console.log('========================================');
console.log('\nCopie a linha abaixo para o seu arquivo .env:');
console.log(`ADMIN_PASSWORD_HASH=${hash}\n`);

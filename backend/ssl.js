// Configuração TLS da conexão com o PostgreSQL.
// Com DB_SSL_CA (certificado da CA do Supabase em PEM), o certificado do servidor é verificado.
// Sem ele, mantém a conexão criptografada, mas sem verificar o servidor, e avisa.
function configurarSsl(env = process.env) {
  const ca = (env.DB_SSL_CA || '').replace(/\\n/g, '\n').trim();
  if (ca) {
    return { ca, rejectUnauthorized: true };
  }
  return { rejectUnauthorized: false };
}

module.exports = { configurarSsl };

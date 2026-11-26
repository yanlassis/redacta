-- Segurança e desempenho do banco (Supabase). Pode ser executado mais de uma vez.
-- Rode depois de create_tables.sql e seed.sql, no SQL Editor do Supabase.

-- 1. RLS ligado nas tabelas do app, sem políticas para anon/authenticated.
--    Isso bloqueia qualquer acesso pela API pública do Supabase (chave anon).
--    O backend acessa o banco por conexão direta, com o usuário redacta_app (seção 3).
ALTER TABLE eixos ENABLE ROW LEVEL SECURITY;
ALTER TABLE temas ENABLE ROW LEVEL SECURITY;
ALTER TABLE argumentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE repertorios ENABLE ROW LEVEL SECURITY;
ALTER TABLE tema_argumento ENABLE ROW LEVEL SECURITY;
ALTER TABLE argumento_repertorio ENABLE ROW LEVEL SECURITY;
ALTER TABLE favoritos ENABLE ROW LEVEL SECURITY;

-- 2. Índices nas chaves estrangeiras (joins e ON DELETE CASCADE)
CREATE INDEX IF NOT EXISTS temas_eixo_id_idx ON temas (eixo_id);
CREATE INDEX IF NOT EXISTS tema_argumento_argumento_id_idx ON tema_argumento (argumento_id);
CREATE INDEX IF NOT EXISTS argumento_repertorio_repertorio_id_idx ON argumento_repertorio (repertorio_id);
CREATE INDEX IF NOT EXISTS favoritos_tema_id_idx ON favoritos (tema_id);
CREATE INDEX IF NOT EXISTS favoritos_repertorio_id_idx ON favoritos (repertorio_id);

-- Constraints UNIQUE idênticas à chave primária (existiam no banco em produção)
ALTER TABLE argumento_repertorio DROP CONSTRAINT IF EXISTS argumento_repertorio_uq;
ALTER TABLE tema_argumento DROP CONSTRAINT IF EXISTS tema_argumento_uq;

-- 3. Usuário do backend com o mínimo de privilégios
--    (em vez de usar o usuário postgres, que é dono do banco e ignora RLS)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'redacta_app') THEN
    CREATE ROLE redacta_app LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOBYPASSRLS NOINHERIT;
  END IF;
END
$$;

-- A senha NÃO fica no repositório. Defina no SQL Editor, uma única vez:
--   ALTER ROLE redacta_app PASSWORD 'uma_senha_forte';
-- No backend, use DB_USER=redacta_app.<ref-do-projeto> (formato do pooler) e DB_PASS com essa senha.

GRANT USAGE ON SCHEMA public TO redacta_app;

-- Conteúdo: somente leitura
GRANT SELECT ON eixos, temas, argumentos, repertorios, tema_argumento, argumento_repertorio TO redacta_app;

-- Favoritos: o backend lista, insere e remove
GRANT SELECT, INSERT, DELETE ON favoritos TO redacta_app;
GRANT USAGE, SELECT ON SEQUENCE favoritos_id_seq TO redacta_app;

-- Políticas valem só para redacta_app; anon e authenticated continuam sem acesso
DROP POLICY IF EXISTS redacta_app_le ON eixos;
CREATE POLICY redacta_app_le ON eixos FOR SELECT TO redacta_app USING (true);
DROP POLICY IF EXISTS redacta_app_le ON temas;
CREATE POLICY redacta_app_le ON temas FOR SELECT TO redacta_app USING (true);
DROP POLICY IF EXISTS redacta_app_le ON argumentos;
CREATE POLICY redacta_app_le ON argumentos FOR SELECT TO redacta_app USING (true);
DROP POLICY IF EXISTS redacta_app_le ON repertorios;
CREATE POLICY redacta_app_le ON repertorios FOR SELECT TO redacta_app USING (true);
DROP POLICY IF EXISTS redacta_app_le ON tema_argumento;
CREATE POLICY redacta_app_le ON tema_argumento FOR SELECT TO redacta_app USING (true);
DROP POLICY IF EXISTS redacta_app_le ON argumento_repertorio;
CREATE POLICY redacta_app_le ON argumento_repertorio FOR SELECT TO redacta_app USING (true);

DROP POLICY IF EXISTS redacta_app_le ON favoritos;
CREATE POLICY redacta_app_le ON favoritos FOR SELECT TO redacta_app USING (true);
DROP POLICY IF EXISTS redacta_app_insere ON favoritos;
CREATE POLICY redacta_app_insere ON favoritos FOR INSERT TO redacta_app WITH CHECK (true);
DROP POLICY IF EXISTS redacta_app_apaga ON favoritos;
CREATE POLICY redacta_app_apaga ON favoritos FOR DELETE TO redacta_app USING (true);

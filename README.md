# Demonstração de Serviço Web Vulnerável  

Este projeto demonstra vulnerabilidades comuns da web, incluindo injeção SQL cega, ataques de dicionário e rastreamento de cookies, apenas para fins educacionais.  

## ⚠️ AVISO ⚠️  

Esta aplicação contém código propositalmente vulnerável e NUNCA deve ser implantada em um ambiente de produção. Ela foi projetada estritamente para fins educacionais, para demonstrar:  

1. Vulnerabilidades de injeção SQL cega  
2. Ataques de dicionário para quebra de senhas
3. Problemas relacionados a rastreamento de cookies  
4. Mecanismos de autenticação inseguros  

## Pré-requisitos  

- Node.js (v14 ou posterior)  
- Banco de dados PostgreSQL
- Banco de dados MySQL (opcional, para demonstração extra)

## Instruções de Configuração  

1. Instale as dependências:  

npm install


2. Configure as configurações do PostgreSQL e/ou MySQL no arquivo `.env`:

Para PostgreSQL:
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=vulnerable_db //o db deve ser criado previamente no postgresql

Para MySQL:
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=senha
MYSQL_DATABASE=vulnerable_db_mysql //o db deve ser criado previamente no mysql

PORT=3000



3. Configure o banco de dados:

Para PostgreSQL:
npm run setup-db

Para MySQL:
npm run setup-db-mysql


4. Inicie o servidor:  
npm start


5. Acesse a aplicação em http://localhost:3000  

## Demonstração de Vulnerabilidades

### Injeção SQL Cega

A API de login em `/api/login` (PostgreSQL) e `/api/login-mysql` (MySQL) é vulnerável a injeção SQL devido à concatenação direta de strings em consultas SQL.  

Por exemplo, é possível contornar a autenticação com:  
- Nome de usuário: `admin' --`  
- Senha: `qualquer coisa`  

Isso transforma a consulta em:  
SELECT * FROM users WHERE username = 'admin' --' AND password = 'qualquer coisa'

#### Demonstração via Interface Web

Na tela de login, há dois botões:
- **Blind SQL Injection (Demo)**: executa o ataque no banco PostgreSQL.
- **Blind SQL Injection (MySQL)**: executa o ataque no banco MySQL.

O progresso e o resultado do ataque são exibidos no console do navegador (pressione F12 para abrir o console antes de iniciar a demonstração).

### Exploração de Cookies de Rastreamento  

A aplicação define cookies de rastreamento sem o consentimento adequado e armazena informações sensíveis dos usuários.  

## Executando a Demonstração de Exploração  

Para ver essas vulnerabilidades em ação, execute os scripts de exploração fornecidos:  

1. Vá para o diretório de exploração:  

```
cd exploit
```

2. Instale as dependências:  

```
npm install
```

3. Execute o exploit:  

   a. Para executar apenas o ataque de injeção SQL cega:
   ```
   node blind-sql-injection.js
   ```
   
   b. Para executar o ataque combinado (dicionário + injeção SQL cega):
   ```
   node combined-attack.js
   ```

## Estratégias de Ataque Implementadas

### 1. Ataque de Dicionário

O ataque de dicionário tenta fazer login usando uma lista predefinida de senhas comuns do arquivo `password-dictionary.txt`. Esta é uma estratégia mais rápida que tenta as senhas mais comuns primeiro.

- Arquivo: `combined-attack.js`
- Função: `dictionaryAttack()`
- Vantagens: Rápido, menos invasivo, eficaz contra senhas fracas

### 2. Ataque de Força Bruta (Injeção SQL Cega)

Este método extrai a senha caractere por caractere usando injeção SQL cega. É uma abordagem mais lenta, mas pode descobrir qualquer senha.

- Arquivo: `blind-sql-injection.js` e `combined-attack.js`
- Função: `extractPassword()`
- Vantagens: Pode extrair qualquer senha, independente de sua complexidade

### Abordagem Estratégica Combinada

O script `combined-attack.js` implementa uma abordagem estratégica:
1. Primeiro tenta o ataque de dicionário (mais rápido)
2. Se falhar, passa automaticamente para o ataque de injeção SQL cega
3. Também demonstra a exploração de cookies de rastreamento

Esta estratégia otimiza o processo de descoberta de senhas, usando primeiro o método mais rápido e recorrendo ao método mais demorado apenas quando necessário.

## Mitigações

Para proteger aplicações reais contra esses tipos de ataques:

1. **Contra Injeção SQL**: Use consultas parametrizadas ou ORM
2. **Contra Ataques de Dicionário**: Implemente limitação de taxa, políticas de senha forte e autenticação de dois fatores
3. **Contra Rastreamento Excessivo**: Obtenha consentimento explícito e minimize a coleta de dados

## Protegendo a Aplicação  

Para proteger esta aplicação em um ambiente real, recomenda-se:  

1. Usar consultas parametrizadas ou um ORM para evitar injeção SQL  
2. Implementar um hashing adequado de senhas  
3. Obter consentimento adequado para cookies e limitar os dados de rastreamento  
4. Adicionar limitação de taxa e mecanismos de bloqueio de conta  
5. Implementar um gerenciamento de sessão adequado  

## Uso Estritamente Educacional  

Este código é fornecido exclusivamente para fins educacionais, a fim de compreender como essas vulnerabilidades funcionam. Sempre siga diretrizes éticas ao testar vulnerabilidades de segurança.



Repositório: https://github.com/nagaminehiro/projetofinalSA45S


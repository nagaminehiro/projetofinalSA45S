# Demonstração de Serviço Web Vulnerável  

Este projeto demonstra vulnerabilidades comuns da web, incluindo injeção SQL cega e rastreamento de cookies, apenas para fins educacionais.  

## ⚠️ AVISO ⚠️  

Esta aplicação contém código propositalmente vulnerável e NUNCA deve ser implantada em um ambiente de produção. Ela foi projetada estritamente para fins educacionais, para demonstrar:  

1. Vulnerabilidades de injeção SQL cega  
2. Problemas relacionados a rastreamento de cookies  
3. Mecanismos de autenticação inseguros  

## Pré-requisitos  

- Node.js (v14 ou posterior)  
- Banco de dados PostgreSQL  

## Instruções de Configuração  

1. Instale as dependências:  

npm install


2. Configure as configurações do PostgreSQL no arquivo `.env`:  
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=vulnerable_db //o db deve ser criado previamente no postgresql
PORT=3000



3. Configure o banco de dados:  

npm run setup-db


4. Inicie o servidor:  
npm start


5. Acesse a aplicação em http://localhost:3000  

## Demonstração de Vulnerabilidades

### Injeção SQL Cega

A API de login em `/api/login` é vulnerável a injeção SQL devido à concatenação direta de strings em consultas SQL.  

Por exemplo, é possível contornar a autenticação com:  
- Nome de usuário: `admin' --`  
- Senha: `qualquer coisa`  

Isso transforma a consulta em:  
SELECT * FROM users WHERE username = 'admin' --' AND password = 'qualquer coisa'

#### Demonstração via Interface Web

Na tela de login, há um botão chamado **Blind SQL Injection (Demo)**. Ao clicar nele, a aplicação executa automaticamente um ataque de injeção SQL cega para extrair a senha do usuário `admin`. O progresso e o resultado do ataque são exibidos no console do navegador (pressione F12 para abrir o console antes de iniciar a demonstração).

### Exploração de Cookies de Rastreamento  

A aplicação define cookies de rastreamento sem o consentimento adequado e armazena informações sensíveis dos usuários.  

## Executando a Demonstração de Exploração  

Para ver essas vulnerabilidades em ação, execute os scripts de exploração fornecidos:  

1. Vá para o diretório de exploração:  

cd exploit


2. Instale as dependências:  

npm install


3. Execute o exploit:  

node blind-sql-injection.js


Isso demonstrará como um invasor poderia extrair a senha do administrador usando injeção SQL cega e rastrear sessões de usuários com cookies.  

## Protegendo a Aplicação  

Para proteger esta aplicação em um ambiente real, recomenda-se:  

1. Usar consultas parametrizadas ou um ORM para evitar injeção SQL  
2. Implementar um hashing adequado de senhas  
3. Obter consentimento adequado para cookies e limitar os dados de rastreamento  
4. Adicionar limitação de taxa e mecanismos de bloqueio de conta  
5. Implementar um gerenciamento de sessão adequado  

## Uso Estritamente Educacional  

Este código é fornecido exclusivamente para fins educacionais, a fim de compreender como essas vulnerabilidades funcionam. Sempre siga diretrizes éticas ao testar vulnerabilidades de segurança.

Abaixo está a lista prática para sabotar de propósito e ver o erro aparecer no terminal. A ideia é sempre a mesma:

comente ou altere uma validação no controller ou utilitário
rode só o arquivo de teste daquele caso
veja o FAIL no terminal
desfaça a sabotagem depois
Use sempre este formato de comando dentro da pasta do back-end:

npx vitest run tests/NOME_DO_TESTE.test.ts --reporter=verbose

CRUD de Filmes

Arquivo para sabotar: filmes.controller.ts
O que sabotar:
Troque o retorno de filme inexistente no update ou delete.
Exemplo:
de 404 para 200
ou remova o bloco que retorna Filme nao encontrado
Teste para rodar:
npx vitest run tests/crud.filmes.test.ts --reporter=verbose
Erro esperado:
falha em “❌ SABOTAGEM CRUD: deve retornar 404 ao atualizar filme inexistente”
ou falha em “❌ SABOTAGEM CRUD: deve retornar 404 ao remover filme inexistente”
CRUD de Salas

Arquivo para sabotar: salas.controller.ts
O que sabotar:
Comente o bloco:
if (!sala) {
return res.status(404).json({ message: "Sala nao encontrada." });
}
Teste para rodar:
npx vitest run tests/crud.salas.test.ts --reporter=verbose
Erro esperado:
falha em “❌ SABOTAGEM CRUD: deve retornar 404 ao atualizar sala inexistente”
falha em “❌ SABOTAGEM CRUD: deve retornar 404 ao remover sala inexistente”
CRUD de Sessões

Arquivo para sabotar: sessoes.controller.ts
O que sabotar:
Comente o bloco:
if (!sessao) {
return res.status(404).json({ message: "Sessao nao encontrada." });
}
Teste para rodar:
npx vitest run tests/crud.sessoes.test.ts --reporter=verbose
Erro esperado:
falha em “❌ SABOTAGEM CRUD: deve retornar 404 ao atualizar sessao inexistente”
falha em “❌ SABOTAGEM CRUD: deve retornar 404 ao remover sessao inexistente”
CRUD de Clientes

Arquivo para sabotar: clientes.controller.ts
O que sabotar:
Comente o bloco:
if (!nome || !emailNormalizado) {
return res.status(400).json({ message: "Nome e email sao obrigatorios." });
}
Teste para rodar:
npx vitest run tests/crud.clientes.test.ts --reporter=verbose
Erro esperado:
falha em “❌ SABOTAGEM CADASTRO: deve bloquear criacao sem nome e email”
CRUD de Ingressos

Arquivo para sabotar: ingressos.controller.ts
O que sabotar:
Comente exatamente este bloco:
if (!sessao || !cliente || !assento) {
return res.status(400).json({ message: "Sessao, cliente ou assento invalido." });
}
Teste para rodar:
npx vitest run tests/crud.ingressos.test.ts --reporter=verbose
Erro esperado:
falha em “❌ SABOTAGEM COMPRA: deve bloquear criacao quando sessao, cliente ou assento forem invalidos”
em alguns cenários pode aparecer erro de runtime ao tentar usar cliente.get quando cliente estiver nulo
CRUD de Pagamentos

Arquivo para sabotar: pagamentos.controller.ts
O que sabotar:
Comente o bloco:
if (!ingresso) {
return res.status(400).json({ message: "Ingresso invalido para pagamento." });
}
Teste para rodar:
npx vitest run tests/crud.pagamentos.test.ts --reporter=verbose
Erro esperado:
falha em “❌ SABOTAGEM PAGAMENTO: deve bloquear pagamento para ingresso invalido”
Login

Arquivo para sabotar: auth.controller.ts
O que sabotar:
Comente a validação de email inválido ou troque o retorno 400 por outro status
Teste para rodar:
npx vitest run tests/autenticacao.test.ts --reporter=verbose
Erro esperado:
falha em “❌ SABOTAGEM LOGIN: Deve bloquear se o e-mail for inválido”
Usuários: CPF inválido

Arquivo para sabotar: users.controller.ts
O que sabotar:
Comente:
if (!isValidCPF(normalizedCpf)) {
return res.status(400).json({ message: "CPF invalido." });
}
Teste para rodar:
npx vitest run tests/usuarios.test.ts --reporter=verbose
Erro esperado:
falha em “❌ SABOTAGEM CPF: Deve bloquear CPF inválido”
Usuários: Email inválido

Arquivo para sabotar: users.controller.ts
O que sabotar:
Comente:
if (!isValidEmail(normalizedEmail)) {
return res.status(400).json({ message: "Email invalido." });
}
Teste para rodar:
npx vitest run tests/usuarios.test.ts --reporter=verbose
Erro esperado:
falha em “❌ SABOTAGEM EMAIL: Deve bloquear E-mail inválido no cadastro”
Usuários: alteração proibida de email

Arquivo para sabotar: users.controller.ts
O que sabotar:
Comente:
if (normalizedEmail !== currentEmail) {
return res.status(400).json({ message: "O email nao pode ser alterado." });
}
Teste para rodar:
npx vitest run tests/usuarios.test.ts --reporter=verbose
Erro esperado:
falha em “❌ SABOTAGEM EDIÇÃO: Deve impedir alteração de e-mail na edição”
Middlewares: sem token

Arquivo para sabotar: auth.middleware.ts
O que sabotar:
Comente o retorno 401 quando não houver token
Teste para rodar:
npx vitest run tests/middlewares.test.ts --reporter=verbose
Erro esperado:
falha em “bloqueia requisição sem token”
Middlewares: admin

Arquivo para sabotar: auth.middleware.ts
O que sabotar:
Comente o retorno 403 para usuário comum em rota admin
Teste para rodar:
npx vitest run tests/middlewares.test.ts --reporter=verbose
Erro esperado:
falha em “bloqueia acesso admin para usuário comum”
Validadores: email

Arquivo para sabotar: validators.ts
O que sabotar:
Faça a função de email retornar true para email inválido
Teste para rodar:
npx vitest run tests/validacoes.test.ts --reporter=verbose
Erro esperado:
falha em “deve validar e-mail corretamente”
Validadores: senha

Arquivo para sabotar: validators.ts
O que sabotar:
Faça a validação de senha forte aceitar senha fraca
Teste para rodar:
npx vitest run tests/validacoes.test.ts --reporter=verbose
Erro esperado:
falha em “deve validar senha forte corretamente”
Validadores: CPF

Arquivo para sabotar: validators.ts
O que sabotar:
Faça a função aceitar CPF inválido, por exemplo 11111111111
Teste para rodar:
npx vitest run tests/validacoes.test.ts --reporter=verbose
Erro esperado:
falha em “deve validar CPF corretamente”
Rota autenticada de usuários

Arquivo para sabotar: app.ts
O que sabotar:
Remova o middleware requireAuth destas rotas:
PUT /users/:id
PUT /usuarios/:id
Teste para rodar:
npx vitest run src/app.users-auth.test.ts --reporter=verbose
Erro esperado:
falha em “retorna 401 em PUT /users/:id sem token”
falha em “retorna 401 em PUT /usuarios/:id sem token”
Os três exemplos mais fáceis para demonstrar em aula

Clientes:
Comente a validação de nome/email em clientes.controller.ts e rode:
npx vitest run tests/crud.clientes.test.ts --reporter=verbose

Ingressos:
Comente a validação de sessao/cliente/assento em ingressos.controller.ts e rode:
npx vitest run tests/crud.ingressos.test.ts --reporter=verbose

Usuários:
Comente a validação de CPF em users.controller.ts e rode:
npx vitest run tests/usuarios.test.ts --reporter=verbose

Dica importante
Para ver o erro claramente no terminal, use sempre run:
npx vitest run tests/arquivo.test.ts --reporter=verbose

Se usar só vitest sem run, ele pode entrar em watch e parecer travado.

Se quiser, eu posso transformar isso em uma tabela pronta dentro de TESTES_GUIA.md, com três colunas:
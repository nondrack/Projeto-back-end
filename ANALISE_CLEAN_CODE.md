# 📋 Análise de Clean Code - Projeto Cinema

## ✅ Pontos Positivos

### 1. **Nomes Significativos**
- ✓ Nomes de métodos descritivos: `findAll()`, `getById()`, `create()`, `update()`, `delete()`
- ✓ Variáveis bem nomeadas: `emailNormalizado`, `clienteExistente`, `hasPagination`
- ✓ Uso de português consistente nos comentários e mensagens

### 2. **Estrutura de Pastas**
- ✓ Separação clara: `controllers/`, `models/`, `utils/`, `middlewares/`
- ✓ Naming pattern consistente: `*.controller.ts`, `*.model.ts`, `*.test.ts`

### 3. **Testes Automatizados**
- ✓ Uso de Vitest para testes unitários
- ✓ Mocks bem estruturados
- ✓ Cobertura de casos de sucesso efalha

### 4. **Validações Implementadas**
- ✓ Validação de email
- ✓ Validação de CPF
- ✓ Validação de senha forte

---

## ❌ Problemas Identificados

### 1. **Inconsistência em Respostas HTTP**
**Problema:** Usar `res.send()`, `res.json()` e `res.status().send()` misturados

```typescript
// ❌ Ruim - Inconsistente
res.send(assentos);                // Sem status
res.status(201).json(cliente);      // Com status + json
return res.status(404).send({...}); // Com status + send
```

**Solução:**
```typescript
// ✅ Bom - Consistente
res.status(200).json(assentos);
res.status(201).json(cliente);
res.status(404).json({ message: "Não encontrado" });
```

---

### 2. **Código Duplicado - Lógica de Paginação**
**Problema:** A lógica de paginação se repete em `FilmesController`, `SalasController` e `SessoesController`

```typescript
// ❌ Ruim - Duplicado
const page = Math.max(Number(req.query.page || 1), 1);
const limit = Math.min(Math.max(Number(req.query.limit || 10), 1), 100);
const offset = (page - 1) * limit;
const { rows, count } = await Model.findAndCountAll({ limit, offset });
```

**Solução:** Criar um utilitário
```typescript
// ✅ Bom - Reutilizável
// src/utils/paginationHelper.ts
export function extrairPaginacao(query: any) {
  const pagina = Math.max(Number(query.page || 1), 1);
  const limite = Math.min(Math.max(Number(query.limit || 10), 1), 100);
  return { pagina, limite, deslocamento: (pagina - 1) * limite };
}
```

---

### 3. **Métodos Muito Longos**
**Problema:** `login()` e `create()` fazem muitas coisas

```typescript
// ❌ Ruim - Muitas responsabilidades
static async login(req: Request, res: Response) {
  // Validação
  // Busca de usuário
  // Verificação de senha
  // Criação de token
  // Resposta
}
```

**Solução:** Dividir em métodos pequenos
```typescript
// ✅ Bom - Single Responsibility
private async validarCredenciais(email: string, senha: string): Promise<User> { }
private gerarToken(usuario: User): string { }
static async login(req: Request, res: Response) {
  const usuario = await this.validarCredenciais(email, senha);
  const token = this.gerarToken(usuario);
  res.status(200).json({ token, usuario });
}
```

---

### 4. **Magic Numbers**
**Problema:** Usar números sem significado direto

```typescript
// ❌ Ruim
Math.max(Number(req.query.limit || 10), 1), 100)  // O que é 10 e 100?
expiresIn: "1h"                                     // Hardcoded
```

**Solução:** Usar constantes
```typescript
// ✅ Bom - src/constants/pagination.ts
export const PAGINACAO_PADRAO = {
  PAGINA_INICIAL: 1,
  ITENS_POR_PAGINA: 10,
  LIMITE_MAXIMO: 100,
};

export const JWT_CONFIG = {
  EXPIRES_IN: "24h",
  ALGORITMO: "HS256",
};
```

---

### 5. **Falta de Tratamento de Erros Centralizado**
**Problema:** Cada método trata erros de forma diferente

```typescript
// ❌ Ruim - Sem padronização
if (!user) {
  return res.status(401).json({ message: "Email ou senha invalidos." });
}

if (!filme) {
  return res.status(404).send({ message: "Filme nao encontrado." });
}
```

**Solução:** Middleware de erro centralizado
```typescript
// ✅ Bom - src/middlewares/errorHandler.ts
export function tratadorErros(
  erro: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const statusCode = erro instanceof NaoEncontradoErro ? 404 : 500;
  res.status(statusCode).json({
    mensagem: erro.message,
    timestamp: new Date().toISOString(),
  });
}
```

---

### 6. **Validações Repetidas**
**Problema:** Validação de email e conversão de tipos em vários lugares

```typescript
// ❌ Ruim - Repetido
const emailNormalizado = String(email || "").trim().toLowerCase();
if (!isValidEmail(emailNormalizado)) {
  return res.status(400).json({ message: "Email invalido." });
}
```

**Solução:** Usar classe base com validações
```typescript
// ✅ Bom - src/services/validacaoService.ts
export class ValidacaoService {
  static validarEmail(email: string): void {
    if (!isValidEmail(email)) {
      throw new ErroValidacao("Email inválido");
    }
  }
}
```

---

### 7. **Falta de Sanitização de Dados**
**Problema:** Dados do request usados diretamente sem sanitização

```typescript
// ❌ Ruim
const { titulo, genero } = req.body;
await Filme.create({ titulo, genero });
```

**Solução:** Sanitizar dados
```typescript
// ✅ Bom
const dados = {
  titulo: String(titulo || "").trim(),
  genero: String(genero || "").trim(),
};
```

---

### 8. **Nomes de Métodos Genéricos**
**Problema:** `findAll()` é confuso - busca do server inteira ou do controller?

```typescript
// ❌ Ambíguo
static async findAll(req: Request, res: Response)
```

**Solução:** Ser mais descritivo
```typescript
// ✅ Claro
static async listarTodos(req: Request, res: Response)
static async buscarPorId(req: Request, res: Response)
```

---

## 🎯 Checklist de Clean Code

- [ ] **Nomes Significativos** ✓ (Parcial - Methoodos genéricos)
- [ ] **Funções Pequenas** ✗ (Email/Paginação muito longos)
- [ ] **DRY (Don't Repeat Yourself)** ✗ (Paginação e validação repetidas)
- [ ] **Tratamento de Erros** ✗ (Sem centralização)
- [ ] **Comentários Úteis** ✓ (Bom padrão)
- [ ] **Formatação Consistente** ✓ (Bom)
- [ ] **Sem Magic Numbers** ✗ (Paginação com números soltos)
- [ ] **Testabilidade** ✓ (Bom com Vitest)
- [ ] **Responsabilidade Única** ✗ (Controllers manipulam muita lógica)
- [ ] **Em Português** ✓ (Bom)

---

## 📝 Prioridades de Refatoração

1. **ALTA** 🔴
   - Extrair lógica de paginação em utilitário
   - Padronizar respostas HTTP
   - Criar middleware de erro centralizado

2. **MÉDIA** 🟡
   - Extrair validações em serviço
   - Dividir métodos grandes
   - Usar constantes em vez de Magic Numbers

3. **BAIXA** 🟢
   - Renomear métodos para ser mais descritivos (findAll → listarTodos)
   - Adicionar sanitização de dados
   - Documentação de API


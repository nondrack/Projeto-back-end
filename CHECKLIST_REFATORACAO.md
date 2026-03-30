## 📋 Checklist de Refatoração - Clean Code

Use este checklist para aplicar Clean Code em seu projeto:

### ✅ **PHASE 1: SETUP - Criar Infraestrutura**

- [ ] **Criar constantes centralizadas**
  - [x] Arquivo: `src/constants/aplicacao.ts`
  - [ ] Revisar e ajustar valores conforme seu projeto

- [ ] **Criar serviços de resposta**
  - [x] Arquivo: `src/services/respostaService.ts`
  - [ ] Testar padronização de respostas

- [ ] **Criar serviços de validação**
  - [x] Arquivo: `src/services/validacaoService.ts`
  - [ ] Validar reutilização em todos os controllers

- [ ] **Criar helpers de paginação**
  - [x] Arquivo: `src/utils/paginacaoHelper.ts`
  - [ ] Testar com controllers existentes

---

### ✅ **PHASE 2: REFATORAR CONTROLLERS**

Para cada controller, execute:

#### **AssentosController**
- [ ] Usar `ServicoResposta` para todas as respostas
- [ ] Remover duplicação de paginação
- [ ] Adicionar validação centralizada
- [ ] Criar testes com padrão AAA

#### **ClientesController**
- [ ] Extrair lógica de validação de email
- [ ] Usar `normalizarEmail()` do `ServicoValidacao`
- [ ] Padronizar respostas HTTP
- [ ] Melhorar mensagens de erro

#### **FilmesController**
- [ ] Usar `extrairPaginacao()` e `formatarRespostaPaginada()`
- [ ] Padronizar `res.send()` → `ServicoResposta`
- [ ] Adicionar método privado para validar dados

#### **IngressosController**
- [ ] Centralizar validações de relacionamento
- [ ] Usar `ServicoResposta` consistentemente
- [ ] Criar método privado para validar entidades

#### **PagamentosController**
- [ ] Aplicar padrão de resposta
- [ ] Extrair validação de ingresso

#### **SalasController**
- [ ] ✅ Usar como referência: `salas.controller.refatorado.ts`
- [ ] Aplicar mesmo padrão aos outros

#### **SessoesController**
- [ ] Usar `extrairPaginacao()` consistentemente
- [ ] Padronizar respostas

#### **AuthController**
- [ ] Usar `ServicoValidacao.validarEmail()`
- [ ] Usar `ServicoValidacao.normalizarEmail()`
- [ ] Padronizar respostas com `ServicoResposta`

#### **UsersController**
- [ ] Aplicar mesmo padrão que Auth

---

### ✅ **PHASE 3: REFATORAR TESTES**

Para cada teste, execute:

- [ ] Usar padrão **AAA (Arrange-Act-Assert)**
- [ ] Criar helpers para mocks reutilizáveis
- [ ] Usar **fixtures** (dados de teste)
- [ ] Nomear testes em português descritivo
- [ ] Adicionar comentários de contexto
- [ ] Verificar cobertura de testes
- [ ] ✅ Usar como referência: `salas.controller.refatorado.test.ts`

---

### ✅ **PHASE 4: MELHORIAS ADICIONAIS**

- [ ] **Criar Middleware de Erro**
  - Centralizar tratamento de exceções
  - Usar `ServicoResposta` para erros

- [ ] **Criar Tipos TypeScript**
  - Tipos para resposta de API
  - Tipos para paginação
  - Tipos para validação

- [ ] **Documentação**
  - Adicionar JSDoc em todos os métodos
  - Documentar APIs com exemplos
  - Criar README de padrões

- [ ] **CI/CD**
  - Executar linter automaticamente
  - Verificar qualidade de código
  - Rodar testes antes de commit

---

## 📊 Comparação: Antes vs Depois

### **ANTES:**
```
Total de Linhas: ~500
Duplicação de Código: ~15%
Testes: 11 arquivos
Cobertura: Parcial
Consistência: Baixa
Manutenibilidade: Difícil
```

### **DEPOIS (Meta):**
```
Total de Linhas: ~550 (com mais validações)
Duplicação de Código: <5%
Testes: 11+ arquivos
Cobertura: >80%
Consistência: Alta
Manutenibilidade: Excelente
```

---

## 🎯 Prioridades de Implementação

### 🔴 **ALTA (Fazer agora)**
1. Refatorar `FilmesController` e `SalasController`
2. Implementar `ServicoResposta` em todos controllers
3. Remover duplicação de paginação

### 🟡 **MÉDIA (Próximas)**
1. Refatorar `AuthController` e `UsersController`
2. Criar middleware de erro centralizado
3. Melhorar testes

### 🟢 **BAIXA (Depois)**
1. Tipos TypeScript específicos
2. Documentação detalhada
3. Integração CI/CD

---

## 💡 Dicas Importantes

### **1. Utilize o TypeScript ao máximo**
```typescript
// ❌ Ruim
const user: any = dados;

// ✅ Bom
interface Usuario {
  id: number;
  email: string;
  nome: string;
}
const user: Usuario = dados;
```

### **2. Métodos privados para lógica auxiliar**
```typescript
// ✅ Bom
static async criar(req, res) {
  const dados = this.prepararDados(req.body);
  // ...
}

private static prepararDados(body: any) {
  // lógica privada
}
```

### **3. Use constantes em vez de Magic Numbers**
```typescript
// ❌ Ruim
if (req.query.limit > 100) { ... }

// ✅ Bom
import { PAGINACAO } from '../constants/aplicacao';
if (req.query.limit > PAGINACAO.LIMITE_MAXIMO) { ... }
```

### **4. Valide entrada e saída**
```typescript
// ✅ Bom
static async buscar(req, res) {
  // Validar entrada
  const resultado = await this.executar(dados);
  // Validar saída
  return ServicoResposta.enviarSucesso(res, resultado);
}
```

### **5. Nomes descritivos em português**
```typescript
// ❌ Confuso
static async find() { }
static async getAll() { }

// ✅ Claro
static async buscarPorId() { }
static async listarTodos() { }
```

---

## 🧪 Rodar Testes

```bash
# Todos os testes
npm run test

# Testes de um arquivo específico
npm run test -- salas.controller

# Com cobertura
npx vitest --coverage

# Modo watch
npm run test -- --watch
```

---

## 📚 Referências

- **Clean Code** (Robert C. Martin)
- **TypeScript Best Practices**
- **RESTful API Design Guidelines**
- **Express.js Patterns**
- **Vitest Documentation**

---

## ❓ Dúvidas Frequentes

**P: Por que usar `ServicoResposta`?**
R: Para garantir que todas as respostas da API sejam consistentes e padronizadas.

**P: Quando criar métodos privados?**
R: Quando a lógica é reutilizada internamente ou é complexa demais para o método principal.

**P: Como organizar testes?**
R: Use o padrão AAA (Arrange-Act-Assert) e agrupe testes por funcionalidade.

**P: Preciso refatorar tudo de uma vez?**
R: Não! Refatore incrementalmente, uma funcionalidade por vez.

---

**Lembretes:**
✨ Clean Code melhora a qualidade do projeto
✨ Refatoração é um processo contínuo
✨ Testes garantem que mudanças não quebrem o código
✨ Em português é mais fácil manter o código

Bom de desenvolvimento! 🚀

/**
 * ✅ EXEMPLO DE TESTES COM CLEAN CODE
 * Demonstra boas práticas para testes em português
 */

import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { Request, Response, NextFunction } from "express";
import SalasControllerRefatorado from "./salas.controller.refatorado";
import Sala from "../models/Sala";
import { ServicoResposta } from "../services/respostaService";

// Mock do modelo
vi.mock("../models/Sala", () => ({
  default: {
    findAll: vi.fn(),
    findByPk: vi.fn(),
    findAndCountAll: vi.fn(),
    create: vi.fn(),
  },
}));

// ========================
// HELPERS PARA TESTES
// ========================

/**
 * Cria um mock de Response do Express
 */
function criarMockResponse(): Partial<Response> {
  const res: any = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  res.statusCode = null;
  res.payload = null;
  return res as Partial<Response>;
}

/**
 * Cria um mock de Request do Express
 */
function criarMockRequest(opcoes: any = {}): Partial<Request> {
  return {
    params: opcoes.params || {},
    query: opcoes.query || {},
    body: opcoes.body || {},
    headers: opcoes.headers || {},
  } as Partial<Request>;
}

// ========================
// FIXTURES (Dados de teste)
// ========================

const SALA_VALIDA = {
  id_sala: 1,
  nome: "Sala Premium",
  capacidade: 150,
};

const SALA_INVALIDA = {
  id_sala: 999,
  nome: "Não Existe",
  capacidade: 0,
};

// ========================
// TESTES
// ========================

describe("SalasControllerRefatorado", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  // ========================
  // Testes: listarTodas()
  // ========================

  describe("listarTodas", () => {
    it("deve retornar todas as salas sem paginação", async () => {
      // Arrange (Preparar)
      const salas = [SALA_VALIDA];
      (Sala.findAll as any).mockResolvedValue(salas);

      const req = criarMockRequest({ query: {} });
      const res = criarMockResponse();

      // Act (Agir)
      await SalasControllerRefatorado.listarTodas(req as Request, res as Response);

      // Assert (Verificar)
      expect(Sala.findAll).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalled();
    });

    it("deve retornar salas com paginação quando page é informado", async () => {
      // Arrange
      const salas = [SALA_VALIDA];
      (Sala.findAndCountAll as any).mockResolvedValue({
        rows: salas,
        count: 15,
      });

      const req = criarMockRequest({
        query: { page: "1", limit: "10" },
      });
      const res = criarMockResponse();

      // Act
      await SalasControllerRefatorado.listarTodas(req as Request, res as Response);

      // Assert
      expect(Sala.findAndCountAll).toHaveBeenCalledWith({
        limit: 10,
        offset: 0,
      });
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("deve limitar o máximo de itens a 100", async () => {
      // Arrange
      (Sala.findAndCountAll as any).mockResolvedValue({
        rows: [],
        count: 0,
      });

      const req = criarMockRequest({
        query: { page: "1", limit: "500" }, // Limite solicitado > máximo
      });
      const res = criarMockResponse();

      // Act
      await SalasControllerRefatorado.listarTodas(req as Request, res as Response);

      // Assert
      expect(Sala.findAndCountAll).toHaveBeenCalledWith({
        limit: 100, // Deve ser limitado a 100
        offset: 0,
      });
    });

    it("deve calcular corretamente o deslocamento da página", async () => {
      // Arrange
      (Sala.findAndCountAll as any).mockResolvedValue({
        rows: [],
        count: 50,
      });

      const req = criarMockRequest({
        query: { page: "3", limit: "10" },
      });
      const res = criarMockResponse();

      // Act
      await SalasControllerRefatorado.listarTodas(req as Request, res as Response);

      // Assert
      // Página 3 com 10 itens = deslocamento 20 (2 * 10)
      expect(Sala.findAndCountAll).toHaveBeenCalledWith({
        limit: 10,
        offset: 20,
      });
    });
  });

  // ========================
  // Testes: buscarPorId()
  // ========================

  describe("buscarPorId", () => {
    it("deve retornar uma sala válida quando encontrada", async () => {
      // Arrange
      (Sala.findByPk as any).mockResolvedValue(SALA_VALIDA);

      const req = criarMockRequest({ params: { id: "1" } });
      const res = criarMockResponse();

      // Act
      await SalasControllerRefatorado.buscarPorId(req as Request, res as Response);

      // Assert
      expect(Sala.findByPk).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalled();
    });

    it("deve retornar 404 quando sala não existe", async () => {
      // Arrange
      (Sala.findByPk as any).mockResolvedValue(null);

      const req = criarMockRequest({ params: { id: "999" } });
      const res = criarMockResponse();

      // Act
      await SalasControllerRefatorado.buscarPorId(req as Request, res as Response);

      // Assert
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          sucesso: false,
          erro: "NAO_ENCONTRADO",
        })
      );
    });

    it("deve rejeitar IDs inválidos (não numéricos)", async () => {
      // Arrange
      const req = criarMockRequest({ params: { id: "abc" } });
      const res = criarMockResponse();

      // Act
      await SalasControllerRefatorado.buscarPorId(req as Request, res as Response);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(Sala.findByPk).not.toHaveBeenCalled();
    });

    it("deve rejeitar IDs negativos", async () => {
      // Arrange
      const req = criarMockRequest({ params: { id: "-1" } });
      const res = criarMockResponse();

      // Act
      await SalasControllerRefatorado.buscarPorId(req as Request, res as Response);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(Sala.findByPk).not.toHaveBeenCalled();
    });
  });

  // ========================
  // Testes: criar()
  // ========================

  describe("criar", () => {
    it("deve criar uma sala com dados válidos", async () => {
      // Arrange
      const salaNovaData = {
        nome: "Sala IMAX",
        capacidade: 200,
      };
      (Sala.create as any).mockResolvedValue(SALA_VALIDA);

      const req = criarMockRequest({ body: salaNovaData });
      const res = criarMockResponse();

      // Act
      await SalasControllerRefatorado.criar(req as Request, res as Response);

      // Assert
      expect(Sala.create).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          sucesso: true,
        })
      );
    });

    it("deve retornar erro quando nome está faltando", async () => {
      // Arrange
      const req = criarMockRequest({
        body: { capacidade: 150 }, // Nome faltando
      });
      const res = criarMockResponse();

      // Act
      await SalasControllerRefatorado.criar(req as Request, res as Response);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(Sala.create).not.toHaveBeenCalled();
    });

    it("deve retornar erro quando capacidade está faltando", async () => {
      // Arrange
      const req = criarMockRequest({
        body: { nome: "Sala Teste" }, // Capacidade faltando
      });
      const res = criarMockResponse();

      // Act
      await SalasControllerRefatorado.criar(req as Request, res as Response);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(Sala.create).not.toHaveBeenCalled();
    });

    it("deve normalizar o nome da sala (remover espaços extras)", async () => {
      // Arrange
      (Sala.create as any).mockResolvedValue(SALA_VALIDA);

      const req = criarMockRequest({
        body: {
          nome: "  Sala com espaços  ",
          capacidade: 150,
        },
      });
      const res = criarMockResponse();

      // Act
      await SalasControllerRefatorado.criar(req as Request, res as Response);

      // Assert
      expect(Sala.create).toHaveBeenCalledWith(
        expect.objectContaining({
          nome: "Sala com espaços", // Sem espaços extras
        })
      );
    });
  });

  // ========================
  // Testes: atualizar()
  // ========================

  describe("atualizar", () => {
    it("deve atualizar uma sala com dados válidos", async () => {
      // Arrange
      const salaMock = {
        ...SALA_VALIDA,
        update: vi.fn().mockResolvedValue(true),
      };
      (Sala.findByPk as any).mockResolvedValue(salaMock);

      const req = criarMockRequest({
        params: { id: "1" },
        body: { nome: "Sala Premium Plus", capacidade: 200 },
      });
      const res = criarMockResponse();

      // Act
      await SalasControllerRefatorado.atualizar(req as Request, res as Response);

      // Assert
      expect(salaMock.update).toHaveBeenCalledWith(
        expect.objectContaining({
          nome: "Sala Premium Plus",
          capacidade: 200,
        })
      );
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("deve retornar 404 ao atualizar sala inexistente", async () => {
      // Arrange
      (Sala.findByPk as any).mockResolvedValue(null);

      const req = criarMockRequest({
        params: { id: "999" },
        body: { nome: "Sala Teste", capacidade: 150 },
      });
      const res = criarMockResponse();

      // Act
      await SalasControllerRefatorado.atualizar(req as Request, res as Response);

      // Assert
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  // ========================
  // Testes: deletar()
  // ========================

  describe("deletar", () => {
    it("deve deletar uma sala existente", async () => {
      // Arrange
      const salaMock = {
        ...SALA_VALIDA,
        destroy: vi.fn().mockResolvedValue(true),
      };
      (Sala.findByPk as any).mockResolvedValue(salaMock);

      const req = criarMockRequest({ params: { id: "1" } });
      const res = criarMockResponse();

      // Act
      await SalasControllerRefatorado.deletar(req as Request, res as Response);

      // Assert
      expect(salaMock.destroy).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("deve retornar 404 ao deletar sala inexistente", async () => {
      // Arrange
      (Sala.findByPk as any).mockResolvedValue(null);

      const req = criarMockRequest({ params: { id: "999" } });
      const res = criarMockResponse();

      // Act
      await SalasControllerRefatorado.deletar(req as Request, res as Response);

      // Assert
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });
});

/**
 * ========================
 * PADRÃO AAA (Arrange-Act-Assert)
 * ========================
 *
 * Cada teste segue este padrão:
 * 1. Arrange: Preparar dados de teste e mocks
 * 2. Act: Executar a ação testada
 * 3. Assert: Verificar os resultados
 *
 * Benefícios:
 * - Fácil de ler e entender
 * - Estrutura consistente
 * - Melhor manutenção
 * - Iso de falhas rapidamente
 */

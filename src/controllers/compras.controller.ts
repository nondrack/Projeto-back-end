import { Request, Response } from "express";
import { Op } from "sequelize";
import Assento from "../models/Assento";
import Cliente from "../models/Cliente";
import Filme from "../models/Filme";
import Ingresso from "../models/Ingresso";
import Pagamento from "../models/Pagamento";
import Sessao from "../models/Sessao";

type AuthenticatedRequest = Request & {
  authUser?: {
    id_usuario: number;
    email: string;
    tipo_usuario: string;
  };
};

class ComprasController {
  static async findMyPurchases(req: AuthenticatedRequest, res: Response) {
    const email = String(req.authUser?.email || "").trim().toLowerCase();

    if (!email) {
      return res.status(401).json({ message: "Usuario nao autenticado." });
    }

    const clientes = await Cliente.findAll({ where: { email } });
    const clienteIds = clientes
      .map((cliente) => Number(cliente.get("id_cliente")))
      .filter((idCliente) => idCliente > 0);

    if (clienteIds.length === 0) {
      return res.status(200).json([]);
    }

    const ingressos = await Ingresso.findAll({
      where: { id_cliente: { [Op.in]: clienteIds } },
      order: [["data_compra", "DESC"]],
    });

    if (ingressos.length === 0) {
      return res.status(200).json([]);
    }

    const ingressoIds = ingressos.map((ingresso) => Number(ingresso.get("id_ingresso")));
    const sessaoIds = [...new Set(ingressos.map((ingresso) => Number(ingresso.get("id_sessao"))))];
    const assentoIds = [...new Set(ingressos.map((ingresso) => Number(ingresso.get("id_assento"))))];

    const pagamentos = await Pagamento.findAll({
      where: { id_ingresso: { [Op.in]: ingressoIds } },
    });
    const sessoes = await Sessao.findAll({
      where: { id_sessao: { [Op.in]: sessaoIds } },
    });
    const assentos = await Assento.findAll({
      where: { id_assento: { [Op.in]: assentoIds } },
    });

    const filmeIds = [...new Set(sessoes.map((sessao) => Number(sessao.get("id_filme"))))];
    const filmes = await Filme.findAll({
      where: { id_filme: { [Op.in]: filmeIds } },
    });

    const pagamentosMap = new Map(
      pagamentos.map((pagamento) => [Number(pagamento.get("id_ingresso")), pagamento])
    );
    const sessoesMap = new Map(
      sessoes.map((sessao) => [Number(sessao.get("id_sessao")), sessao])
    );
    const filmesMap = new Map(
      filmes.map((filme) => [Number(filme.get("id_filme")), filme])
    );
    const assentosMap = new Map(
      assentos.map((assento) => [Number(assento.get("id_assento")), assento])
    );

    const compras = ingressos.map((ingresso) => {
      const idIngresso = Number(ingresso.get("id_ingresso"));
      const sessao = sessoesMap.get(Number(ingresso.get("id_sessao")));
      const filme = sessao ? filmesMap.get(Number(sessao.get("id_filme"))) : null;
      const assento = assentosMap.get(Number(ingresso.get("id_assento")));
      const pagamento = pagamentosMap.get(idIngresso);

      return {
        id: idIngresso,
        filme: String(filme?.get("titulo") || "Filme nao encontrado"),
        sessao: sessao?.get("horario")
          ? new Date(String(sessao.get("horario"))).toLocaleString("pt-BR")
          : "Horario nao informado",
        assento: assento
          ? `${String(assento.get("fila") || "")}${String(assento.get("numero") || "")}`.trim()
          : `ID ${Number(ingresso.get("id_assento"))}`,
        valor: Number(pagamento?.get("valor") || 0),
        metodo: String(pagamento?.get("metodo_pagamento") || "Nao informado"),
        dataCompra: ingresso.get("data_compra")
          ? new Date(String(ingresso.get("data_compra"))).toLocaleString("pt-BR")
          : "Data nao informada",
      };
    });

    return res.status(200).json(compras);
  }
}

export default ComprasController;
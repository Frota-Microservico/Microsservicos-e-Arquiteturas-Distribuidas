import { VeiculoModel } from "../../models/veiculo.model.js";
import { Op } from "sequelize";
import { connectConsumer } from "../kafka/consumer.js";

export class VeiculoService {

  static async createVeiculo(req, res) {
    const { modelo, placa, ano } = req.body;
    const userId = req.userId;

    if (!modelo || !placa || !ano) {
      return res.status(400).json({ status: 400, detail: "Dados inválidos" });
    }

    const placaFormatada = placa.replace(/[-\s]/g, '').toUpperCase();

    const existingVeiculo = await VeiculoModel.findOne({ where: { placa: placaFormatada } });
    if (existingVeiculo) {
      return res.status(409).json({ status: 409, detail: "Veículo já cadastrado com esta placa" });
    }

    const veiculo = await VeiculoModel.create(
      {
        modelo,
        placa: placaFormatada,
        ano,
        status: "DISPONIVEL",
      },
      { usuario: userId }
    );

    return res.status(201).json(veiculo);
  }

  static async getListarVeiculos() {
    return await VeiculoModel.findAll();
  }

  static async getProcuraVeiculo(req, res) {
    const { id } = req.params;
    const veiculo = await VeiculoModel.findByPk(id);

    if (!veiculo) {
      return res.status(404).json({ status: 404, detail: "Veículo não encontrado" });
    }

    return res.status(200).json(veiculo);
  }

  static async updateVeiculo(req, res) {
    const { id } = req.params;
    const { modelo, placa, ano, status } = req.body;
    const userId = req.userId;

    const veiculo = await VeiculoModel.findByPk(id);
    if (!veiculo) {
      return res.status(404).json({ status: 404, detail: "Veículo não encontrado" });
    }

    const placaFormatada = placa
      ? placa.replace(/[-\s]/g, '').toUpperCase()
      : veiculo.placa;

    const placaExistente = await VeiculoModel.findOne({
      where: {
        placa: placaFormatada,
        id: { [Op.ne]: id },
      },
    });

    if (placaExistente) {
      return res.status(409).json({ status: 409, detail: "Placa já cadastrada em outro veículo" });
    }

    await veiculo.update(
      {
        modelo: modelo || veiculo.modelo,
        placa: placaFormatada,
        ano: ano || veiculo.ano,
        status: status || veiculo.status,
      },
      { usuario: userId }
    );
    return res.status(200).json(veiculo);
  }

  static async deletaVeiculo(req, res) {
    const { id } = req.params;
    const userId = req.userId;

    const veiculo = await VeiculoModel.findByPk(id);
    if (!veiculo) {
      return res.status(404).json({ status: 404, detail: "Veículo não encontrado" });
    }

    await veiculo.destroy({ usuario: userId });

    return res.status(204).send();
  }

  static async startKafkaConsumer() {
    await connectConsumer();
  }
}

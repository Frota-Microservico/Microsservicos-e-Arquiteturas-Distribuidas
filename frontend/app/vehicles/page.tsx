"use client";
import { useState } from "react";
import Navbar from "../components/navbar";

export default function VehiclesPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);

  const vehicles = [
    { id: 1, placa: "ABC-1234", modelo: "Fiat Uno", ano: 2019, status: "Disponível" },
    { id: 2, placa: "XYZ-9876", modelo: "Ford Ka", ano: 2021, status: "Reservado" },
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-r from-blue-100 to-blue-300 p-8 pt-6">
        {/* Cabeçalho */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-blue-700">Gerenciar Veículos</h1>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            + Novo Veículo
          </button>
        </div>

        {/* Tabela */}
        <div className="overflow-x-auto bg-white rounded-xl shadow-md">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-blue-50 text-blue-700">
                <th className="px-4 py-2 text-left">ID</th>
                <th className="px-4 py-2 text-left">Placa</th>
                <th className="px-4 py-2 text-left">Modelo</th>
                <th className="px-4 py-2 text-left">Ano</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((vehicle) => (
                <tr key={vehicle.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{vehicle.id}</td>
                  <td className="px-4 py-2">{vehicle.placa}</td>
                  <td className="px-4 py-2">{vehicle.modelo}</td>
                  <td className="px-4 py-2">{vehicle.ano}</td>
                  <td className="px-4 py-2">{vehicle.status}</td>
                  <td className="px-4 py-2 text-center space-x-2">
                    <button
                      onClick={() => {
                        setSelectedVehicle(vehicle);
                        setIsEditOpen(true);
                      }}
                      className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => {
                        setSelectedVehicle(vehicle);
                        setIsDeleteOpen(true);
                      }}
                      className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Deletar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal Criar */}
        {isCreateOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm">
            <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
              <h2 className="text-xl font-bold text-blue-700 mb-4">Novo Veículo</h2>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Placa</label>
                  <input
                    type="text"
                    placeholder="Digite a placa"
                    className="w-full mt-1 px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Modelo</label>
                  <input
                    type="text"
                    placeholder="Digite o modelo"
                    className="w-full mt-1 px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Ano</label>
                  <input
                    type="number"
                    placeholder="Digite o ano"
                    className="w-full mt-1 px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select className="w-full mt-1 px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Disponível</option>
                    <option>Reservado</option>
                    <option>Em Uso</option>
                    <option>Indisponível</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsCreateOpen(false)}
                    className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Salvar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Editar */}
        {isEditOpen && selectedVehicle && (
          <div className="fixed inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm">
            <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
              <h2 className="text-xl font-bold text-green-700 mb-4">Editar Veículo</h2>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Placa</label>
                  <input
                    type="text"
                    defaultValue={selectedVehicle.placa}
                    className="w-full mt-1 px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Modelo</label>
                  <input
                    type="text"
                    defaultValue={selectedVehicle.modelo}
                    className="w-full mt-1 px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Ano</label>
                  <input
                    type="number"
                    defaultValue={selectedVehicle.ano}
                    className="w-full mt-1 px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                {/* Checkbox para tornar veículo indisponível */}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="indisponivel"
                    className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-2 focus:ring-green-500"
                  />
                  <label htmlFor="indisponivel" className="text-sm text-gray-700">
                    Tornar veículo indisponível
                  </label>
                  {/* Ícone de informação */}
                  <div className="relative group">
                    <span className="ml-1 text-gray-400 cursor-pointer">ℹ️</span>
                    <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 w-48 bg-gray-700 text-white text-xs rounded-md p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      Marcando esta opção, o veículo ficará indisponível para reservas. Use quando o veículo estiver em manutenção ou indisponível por outro motivo.
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsEditOpen(false)}
                    className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                  >
                    Atualizar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Deletar */}
        {isDeleteOpen && selectedVehicle && (
          <div className="fixed inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm">
            <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm text-center">
              <h2 className="text-xl font-bold text-red-600 mb-4">Confirmar Exclusão</h2>
              <p className="mb-6">
                Tem certeza que deseja excluir o veículo{" "}
                <span className="font-semibold">{selectedVehicle.modelo}</span>?
              </p>
              <div className="flex justify-center space-x-3">
                <button
                  onClick={() => setIsDeleteOpen(false)}
                  className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    // lógica de deleção aqui
                    setIsDeleteOpen(false);
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  Deletar
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}

"use client";
import { useState } from "react";
import Navbar from "../components/navbar";

export default function AllReservationsPage() {
  // Simulando usuário admin
  const isAdmin = true;

  // Simulação de reservas de todos os usuários
  const [reservations, setReservations] = useState([
    {
      id: 1,
      user: "Fabio Favareto",
      vehicle: "Fiat Uno (ABC-1234)",
      startDate: "2025-10-01",
      endDate: "2025-10-03",
    },
    {
      id: 2,
      user: "Luis Pereira",
      vehicle: "Ford Ka (XYZ-9876)",
      startDate: "2025-10-05",
      endDate: "2025-10-07",
    },
    {
      id: 3,
      user: "Ana Souza",
      vehicle: "Chevrolet Onix (DEF-5678)",
      startDate: "2025-10-08",
      endDate: "2025-10-10",
    },
  ]);

  const [selectedReservation, setSelectedReservation] = useState<any>(null);
  const [isCancelOpen, setIsCancelOpen] = useState(false);

  const handleCancel = (id: number) => {
    setReservations((prev) => prev.filter((res) => res.id !== id));
    setIsCancelOpen(false);
  };

  if (!isAdmin) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-blue-300 p-8">
          <h1 className="text-2xl font-bold text-red-600">
            Acesso negado: página apenas para administradores
          </h1>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-r from-blue-100 to-blue-300 p-8 pt-6">
        {/* Cabeçalho */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-blue-700">Todas as Reservas</h1>
        </div>

        {/* Tabela */}
        <div className="overflow-x-auto bg-white rounded-xl shadow-md">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-blue-50 text-blue-700">
                <th className="px-4 py-2 text-left">ID</th>
                <th className="px-4 py-2 text-left">Usuário</th>
                <th className="px-4 py-2 text-left">Veículo</th>
                <th className="px-4 py-2 text-left">Data Início</th>
                <th className="px-4 py-2 text-left">Data Fim</th>
                <th className="px-4 py-2 text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((res) => (
                <tr key={res.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{res.id}</td>
                  <td className="px-4 py-2">{res.user}</td>
                  <td className="px-4 py-2">{res.vehicle}</td>
                  <td className="px-4 py-2">{res.startDate}</td>
                  <td className="px-4 py-2">{res.endDate}</td>
                  <td className="px-4 py-2 text-center space-x-2">
                    {/* Cancelar reserva */}
                    <button
                      onClick={() => {
                        setSelectedReservation(res);
                        setIsCancelOpen(true);
                      }}
                      className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Cancelar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal Cancelar Reserva */}
        {isCancelOpen && selectedReservation && (
          <div className="fixed inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm">
            <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm text-center">
              <h2 className="text-xl font-bold text-red-600 mb-4">Cancelar Reserva</h2>
              <p className="mb-6">
                Tem certeza que deseja cancelar a reserva do veículo{" "}
                <span className="font-semibold">{selectedReservation.vehicle}</span> do
                usuário <span className="font-semibold">{selectedReservation.user}</span>?
              </p>
              <div className="flex justify-center space-x-3">
                <button
                  onClick={() => setIsCancelOpen(false)}
                  className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleCancel(selectedReservation.id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}

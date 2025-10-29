"use client";
import { useState, useEffect } from "react";
import { useAuth, logout } from "../utils/auth";
import Navbar from "../components/navbar";

export default function AllReservationsPage() {
  const { user, loading } = useAuth(true);
  const [reservations, setReservations] = useState<any[]>([]);
  const [selectedReservation, setSelectedReservation] = useState<any>(null);
  const [isCancelOpen, setIsCancelOpen] = useState(false);

  // Buscar reservas do backend
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/reservas"); // ajuste a URL conforme seu backend
        if (!res.ok) throw new Error("Erro ao buscar reservas");
        const data = await res.json();
        setReservations(
          data.map((r: any) => ({
            id: r.id,
            user: r.user?.name || `Usuário #${r.id_usuario}`,
            vehicle: r.veiculo ? `${r.veiculo.modelo} (${r.veiculo.placa})` : `Veículo #${r.id_veiculo}`,
            status: r.status || "DESCONHECIDO",
            startDate: r.dt_reserva,
            endDate: r.dt_devolucao,
          }))
        );
      } catch (err) {
        console.error(err);
      }
    };

    fetchReservations();
  }, []);

  const handleCancel = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:3001/api/reservas/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Erro ao cancelar reserva");
      setReservations((prev) => prev.filter((res) => res.id !== id));
      setIsCancelOpen(false);
    } catch (err) {
      console.error(err);
      alert("Falha ao cancelar reserva");
    }
  };

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // mês começa em 0
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
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
                <th className="px-4 py-2 text-left">Status</th>
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
                  <td className="px-4 py-2">{res.status}</td>
                  <td className="px-4 py-2">{formatDate(res.startDate)}</td>
                  <td className="px-4 py-2">{formatDate(res.endDate)}</td>
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

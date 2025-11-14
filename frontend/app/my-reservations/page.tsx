"use client";
import { useState, useEffect } from "react";
import Navbar from "../components/navbar";
import { useAuth } from "../utils/auth";

export default function MyReservationsPage() {
  const { user, loading } = useAuth(false); // pega o usuário logado
  const userId = user?.id;

  const [reservations, setReservations] = useState<any[]>([]);
  const [selectedReservation, setSelectedReservation] = useState<any>(null);
  const [isCancelOpen, setIsCancelOpen] = useState(false);

  // Buscar reservas do usuário logado
  useEffect(() => {
    if (!userId) return;

    const fetchReservations = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/reservas");
        if (!res.ok) throw new Error("Erro ao buscar reservas");
        const data = await res.json();

        // Filtra apenas as reservas do usuário logado
        const minhasReservas = data
          .map((r: any) => ({
            ...r,
            vehicle: r.veiculo ? `${r.veiculo.modelo} (${r.veiculo.placa})` : "N/D",
            startDate: r.dt_reserva,
            endDate: r.dt_devolucao,
          }))
          .filter((r: any) => r.id_usuario === userId);

        setReservations(minhasReservas);
      } catch (err) {
        console.error(err);
      }
    };

    fetchReservations();
  }, [userId]);

 // Função de devolução
const handleReturn = async (reservaId: number, veiculoId: number) => {
  if (!confirm("Confirmar devolução deste veículo?")) return;

  try {
    const res = await fetch(`http://localhost:3006/api/devolucao`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        reservaId,
        veiculoId
      })
    });

    alert("Veículo devolvido com sucesso!");

    // Atualiza lista
    location.reload();

  } catch (err) {
    console.error(err);
    alert("Erro ao processar devolução");
  }
};

  // Função de cancelamento
  const handleCancel = async (id: number) => {
    if (!confirm("Deseja realmente cancelar esta reserva?")) return;
    try {
      const res = await fetch(`http://localhost:3001/api/reservas`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id,
        })
      });
      if (!res.ok) throw new Error("Erro ao cancelar reserva");
      alert("Reserva cancelada com sucesso!");
      // Atualiza reservas
      location.reload();
    } catch (err) {
      console.error(err);
      alert("Erro ao cancelar reserva");
    }
  };

function formatDate(dateString: string) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

function isInUse(startDate: string, endDate: string) {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);

  return now >= start && now <= end;
}

function getStatus(res: any) {
  // Prioridade para status vindo do backend
  if (res.status === "FINALIZADA") return "FINALIZADA";
  if (res.status === "CANCELADA") return "CANCELADA";

  // Se o período está ativo
  if (isInUse(res.startDate, res.endDate)) return "EM USO";

  // Caso contrário mostra o status padrão
  return res.status;
}


  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-r from-blue-100 to-blue-300 p-8 pt-6">
        {/* Cabeçalho */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-blue-700">Minhas Reservas</h1>
        </div>

        {/* Tabela */}
        <div className="overflow-x-auto bg-white rounded-xl shadow-md">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-blue-50 text-blue-700">
                <th className="px-4 py-2 text-left">ID</th>
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
                  <td className="px-4 py-2">{res.vehicle}</td>
                  <td className="px-4 py-2">{getStatus(res)}</td>
                  <td className="px-4 py-2">{formatDate(res.startDate)}</td>
                  <td className="px-4 py-2">{formatDate(res.endDate)}</td>
                  <td className="p-2 flex gap-2">
                    <>
                      {/* Botão DEVOLVER → apenas quando está em uso */}
                      {getStatus(res) === "EM USO" && (
                        <button
                          onClick={() => handleReturn(res.id, res.veiculo.id)}
                          className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                        >
                          Devolver
                        </button>
                      )}

                      {/* Botão CANCELAR → apenas quando NÃO está finalizada, cancelada ou em uso */}
                      {getStatus(res) !== "FINALIZADA" &&
                      getStatus(res) !== "CANCELADA" &&
                      getStatus(res) !== "EM USO" && (
                        <button
                          onClick={() => handleCancel(res.id)}
                          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                          Cancelar
                        </button>
                      )}
                    </>
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
                <span className="font-semibold">{selectedReservation.vehicle}</span>?
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

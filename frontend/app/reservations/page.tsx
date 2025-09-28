"use client";
import { useState, useEffect } from "react";
import Navbar from "../components/navbar";
import { useAuth } from "../utils/auth";

export default function ReservationsPage() {
  const [vehicles, setVehicles] = useState<{ id: number; placa: string; modelo: string }[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const { user, loading } = useAuth(true); // pega o usuário logado
  const userId = user?.id; // pega o id real do usuário logado

  // Buscar veículos disponíveis do backend
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const res = await fetch("http://localhost:3002/api/veiculo");
        if (!res.ok) throw new Error("Erro ao buscar veículos");
        const data = await res.json();
        setVehicles(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchVehicles();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const vehicle = vehicles.find(
      (v) => `${v.modelo} (${v.placa})` === selectedVehicle
    );

    if (!vehicle) {
      alert("Veículo inválido!");
      return;
    }

    try {
      const res = await fetch("http://localhost:3001/api/reservas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idUsuario: userId,
          idVeiculo: vehicle.id,
          dt_reserva: startDate,
          dt_devolucao: endDate,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Erro ao criar reserva");
      }

      alert("Reserva criada com sucesso!");
      setSelectedVehicle("");
      setStartDate("");
      setEndDate("");
    } catch (err: any) {
      console.error(err);
      alert(err.message);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-r from-blue-100 to-blue-300 p-8 pt-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-blue-700">Criar Reserva</h1>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md max-w-md mx-auto">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700">Veículo</label>
              <select
                value={selectedVehicle}
                onChange={(e) => setSelectedVehicle(e.target.value)}
                className="w-full mt-1 px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Selecione um veículo</option>
                {vehicles.map((v) => (
                  <option key={v.id} value={`${v.modelo} (${v.placa})`}>
                    {v.modelo} ({v.placa})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Data Início</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full mt-1 px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Data Fim</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full mt-1 px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Criar Reserva
              </button>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}

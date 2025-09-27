"use client";
import { useState } from "react";
import Navbar from "../components/navbar";

export default function ReservationsPage() {
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Simulação de lista de veículos disponíveis
  const vehicles = [
    { id: 1, placa: "ABC-1234", modelo: "Fiat Uno" },
    { id: 2, placa: "XYZ-9876", modelo: "Ford Ka" },
    { id: 3, placa: "DEF-5678", modelo: "Chevrolet Onix" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui entraria a lógica de criar reserva
    alert(
      `Reserva criada:\nVeículo: ${selectedVehicle}\nData Início: ${startDate}\nData Fim: ${endDate}`
    );
    setSelectedVehicle("");
    setStartDate("");
    setEndDate("");
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-r from-blue-100 to-blue-300 p-8 pt-6">
        {/* Cabeçalho */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-blue-700">Criar Reserva</h1>
        </div>

        {/* Formulário */}
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

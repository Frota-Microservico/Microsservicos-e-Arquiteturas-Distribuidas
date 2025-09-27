"use client";
import Navbar from "../components/navbar";
import { useAuth, logout } from "../utils/auth";

export default function HomePage() {
  const { user, loading } = useAuth(true);

  const handleGrafana = () => {
    // Substitua pelo link do seu Grafana
    window.open("https://grafana.com/", "_blank");
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-r from-blue-100 to-blue-300 flex flex-col justify-center items-center p-8 pt-6">
        {/* Mensagem de boas-vindas */}
        <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">
          Bem-vindo ao Sistema de Agendamendo de Frotas!
        </h1>
        <p className="text-blue-800 mb-8 text-center">
          Aqui você pode gerenciar veículos, usuários e reservas de forma prática e eficiente.
        </p>

        {/* Botão para Grafana */}
        <button
          onClick={handleGrafana}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-lg"
        >
          Visualizar estatísticas no Grafana
        </button>
      </main>
    </>
  );
}

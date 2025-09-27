import { Lock, User } from "lucide-react";

export default function LoginPage() {
  return (
    <main className="flex h-screen items-center justify-center bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600">
      <div className="w-full max-w-md p-8 bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl">
        {/* Nome do projeto */}
        <h1 className="text-3xl font-extrabold text-center text-indigo-700 mb-2">
          Agendamento de Frotas
        </h1>
        <p className="text-center text-gray-500 mb-8">
          Faça login para continuar
        </p>

        {/* Formulário */}
        <form className="space-y-5">
          {/* Usuário */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Usuário
            </label>
            <div className="flex items-center px-3 py-2 border rounded-lg shadow-sm focus-within:ring-2 focus-within:ring-indigo-500">
              <User className="w-5 h-5 text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Digite seu usuário"
                className="w-full focus:outline-none bg-transparent"
              />
            </div>
          </div>

          {/* Senha */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Senha
            </label>
            <div className="flex items-center px-3 py-2 border rounded-lg shadow-sm focus-within:ring-2 focus-within:ring-indigo-500">
              <Lock className="w-5 h-5 text-gray-400 mr-2" />
              <input
                type="password"
                placeholder="Digite sua senha"
                className="w-full focus:outline-none bg-transparent"
              />
            </div>
          </div>

          {/* Botão */}
          <button
            type="submit"
            className="w-full py-3 px-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition shadow-md"
          >
            Entrar
          </button>

        </form>
      </div>
    </main>
  );
}

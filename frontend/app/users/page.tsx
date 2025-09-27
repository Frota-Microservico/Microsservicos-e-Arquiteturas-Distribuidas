"use client";
import { useState, useEffect } from "react";
import Navbar from "../components/navbar";
import { useAuth, logout } from "../utils/auth";

export default function UsersPage() {

  interface User {
    id: number;
    name: string;
    pass: string;
    email: string;
    isadmin?: boolean;
  }

  const { user, loading } = useAuth(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:3003/api/users", {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });
        if (!res.ok) throw new Error("Erro ao buscar usuários");
        const data = await res.json();
        setUsers(data); // assumindo que data é a lista de usuários
      } catch (err) {
        console.error(err);
    }
  };

    fetchUsers();
  }, []);

  return (
    <>
    <Navbar />
    <main className="min-h-screen bg-gradient-to-r from-blue-100 to-blue-300 p-8">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-700">Gerenciar Usuários</h1>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          + Novo Usuário
        </button>
      </div>

      {/* Tabela */}
      <div className="overflow-x-auto bg-white rounded-xl shadow-md">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-blue-50 text-blue-700">
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">Nome</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{user.id}</td>
                <td className="px-4 py-2">{user.name}</td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2 text-center space-x-2">
                  <button
                    onClick={() => {
                      setSelectedUser(user);
                      setIsEditOpen(true);
                    }}
                    className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => {
                      setSelectedUser(user);
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
            <h2 className="text-xl font-bold text-blue-700 mb-4">Novo Usuário</h2>
            <form
              className="space-y-4"
              onSubmit={async (e) => {
                e.preventDefault();
                try {
                  const token = localStorage.getItem("token");
                  const formData = new FormData(e.currentTarget as HTMLFormElement);
                  const name = formData.get("name") as string;
                  const email = formData.get("email") as string;
                  const pass = formData.get("pass") as string; // campo senha
                  const isadmin = (formData.get("isadmin") as string) === "on";

                  const res = await fetch("http://localhost:3003/api/users/create", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({ name, email, pass, isadmin })
                  });

                  if (!res.ok) throw new Error("Erro ao criar usuário");
                  const newUser = await res.json();
                  setUsers([...users, newUser]);
                  setIsCreateOpen(false);
                } catch (err) {
                  console.error(err);
                }
              }}
            >
              <div>
                <label className="block text-sm font-medium text-gray-700">Nome</label>
                <input
                  name="name"
                  type="text"
                  placeholder="Digite o nome"
                  className="w-full mt-1 px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  name="email"
                  type="email"
                  placeholder="Digite o email"
                  className="w-full mt-1 px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Campo Senha */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Senha</label>
                <input
                  name="pass"
                  type="password"
                  placeholder="Digite a senha"
                  className="w-full mt-1 px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Checkbox isadmin */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="isadmin"
                  id="isadmin"
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
                <label htmlFor="isadmin" className="text-sm text-gray-700">
                  Administrador
                </label>
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
      {isEditOpen && selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold text-green-700 mb-4">Editar Usuário</h2>
            <form
              className="space-y-4"
              onSubmit={async (e) => {
                e.preventDefault();
                try {
                  const token = localStorage.getItem("token");
                  const formData = new FormData(e.currentTarget as HTMLFormElement); // forçar tipo
                  const name = formData.get("name") as string;
                  const email = formData.get("email") as string;
                  const res = await fetch(`http://localhost:3003/api/users/${selectedUser.id}`, {
                    method: "PUT",
                    headers: {
                      "Content-Type": "application/json",
                      "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({ name, email })
                  });
                  if (!res.ok) throw new Error("Erro ao atualizar usuário");
                  const updatedUser = await res.json();
                  setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
                  setIsEditOpen(false);
                } catch (err) {
                  console.error(err);
                }
              }}
            >
              <div>
                <label className="block text-sm font-medium text-gray-700">Nome</label>
                <input
                  name="name"
                  type="text"
                  defaultValue={selectedUser.name}
                  className="w-full mt-1 px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  name="email"
                  type="email"
                  defaultValue={selectedUser.email}
                  className="w-full mt-1 px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
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
      {isDeleteOpen && selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm text-center">
            <h2 className="text-xl font-bold text-red-600 mb-4">Confirmar Exclusão</h2>
            <p className="mb-6">
              Tem certeza que deseja excluir o usuário{" "}
              <span className="font-semibold">{selectedUser.name}</span>?
            </p>
            <div className="flex justify-center space-x-3">
              <button
                onClick={() => setIsDeleteOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
              >
                Cancelar
              </button>
              <button
              onClick={async () => {
                try {
                  const token = localStorage.getItem("token");
                  const res = await fetch(`http://localhost:3003/api/users/${selectedUser.id}`, {
                    method: "DELETE",
                    headers: { "Authorization": `Bearer ${token}` }
                  });
                  if (!res.ok) throw new Error("Erro ao deletar usuário");
                  setUsers(users.filter(u => u.id !== selectedUser.id));
                  setIsDeleteOpen(false);
                } catch (err) {
                  console.error(err);
                }
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

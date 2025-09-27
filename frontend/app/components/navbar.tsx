"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { name: "Home", href: "/home" },
    { name: "Usuários", href: "/users" },
    { name: "Veículos", href: "/vehicles" },
    { name: "Reservar Veículo", href: "/reservations" },
    { name: "Todas Reservas", href: "/all-reservations" },
    { name: "Minhas Reservas", href: "/my-reservations" },
  ];

  const handleLogout = () => {
    // Aqui você pode adicionar lógica de logout, por exemplo limpar token, redirecionar para login, etc.
    alert("Logout realizado!");
  };

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <span className="font-bold text-lg">Sistema de Frotas</span>
        <div className="flex items-center space-x-4">
          {/* Links de navegação */}
          <div className="flex space-x-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-md hover:bg-blue-500 transition ${
                  pathname === link.href ? "bg-blue-800" : ""
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
          {/* Botão de Logout */}
          <button
            onClick={handleLogout}
            className="ml-4 px-3 py-2 bg-red-500 rounded-md hover:bg-red-600 transition text-white"
          >
            Sair
          </button>
        </div>
      </div>
    </nav>
  );
}

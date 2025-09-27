"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { logout } from "../utils/auth";

interface User {
  id: number;
  nome: string;
  isadmin: boolean;
}

export default function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    logout();
    window.location.href = "/login"; // redireciona para login
  };

  // Links dependendo do tipo de usuário
  const adminLinks = [
    { name: "Home", href: "/home" },
    { name: "Usuários", href: "/users" },
    { name: "Veículos", href: "/vehicles" },
    { name: "Reservar Veículo", href: "/reservations" },
    { name: "Todas Reservas", href: "/all-reservations" },
    { name: "Minhas Reservas", href: "/my-reservations" },
  ];

  const userLinks = [
    { name: "Reservar Veículo", href: "/reservations" },
    { name: "Minhas Reservas", href: "/my-reservations" },
  ];

  const links = user?.isadmin ? adminLinks : userLinks;

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <span className="font-bold text-lg">Sistema de Frotas</span>
        <div className="flex items-center space-x-4">
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

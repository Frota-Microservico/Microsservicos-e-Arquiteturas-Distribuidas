// utils/useAuth.ts
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export interface User {
  id: number;
  name: string;
  isadmin: boolean;
}

export function useAuth(requireAdmin: boolean = false) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token || !storedUser) {
      router.push("/login");
      return;
    }

    const parsedUser: User = JSON.parse(storedUser);
    if (requireAdmin && !parsedUser.isadmin) {
      router.push("/reservations");
      return;
    }

    setUser(parsedUser);
    setLoading(false);
  }, [router, requireAdmin]);

  return { user, loading };
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

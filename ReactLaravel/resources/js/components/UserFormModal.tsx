import { useState, useEffect } from "react";
import { router } from "@inertiajs/react";
import { Toaster, toast } from "sonner";

interface User {
  id?: number;
  name: string;
  email: string;
}

interface Props {
  isOpen: boolean;
  closeModal: () => void;
  user?: User | null;
}

export default function UserFormModal({ isOpen, closeModal, user }: Props) {
  const [formData, setFormData] = useState<User>({ name: "", email: "" });

  useEffect(() => {
    if (user) {
      setFormData({ name: user.name, email: user.email });
    } else {
      setFormData({ name: "", email: "" });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (user?.id) {
      router.put(`/users/${user.id}`, formData, { onSuccess: closeModal });
    } else {
      router.post("/users", formData, { onSuccess: closeModal });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
      <div className="bg-[var(--card)] p-6 rounded-lg shadow-lg w-96 relative z-50 pointer-events-auto">
        <h2 className="text-lg font-semibold mb-4 text-[var(--card-foreground)]">
          {user ? "Edit User" : "Add User"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="block text-sm font-medium text-[var(--muted-foreground)]">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border rounded p-2 bg-[var(--input)] text-[var(--foreground)]"
              required
            />
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium text-[var(--muted-foreground)]">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border rounded p-2 bg-[var(--input)] text-[var(--foreground)]"
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 bg-[var(--muted)] text-[var(--muted-foreground)] rounded hover:bg-[var(--muted-foreground)] hover:text-[var(--muted)] transition"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded hover:bg-[var(--primary-foreground)] hover:text-[var(--primary)] transition"
            >
              {user ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
  
}
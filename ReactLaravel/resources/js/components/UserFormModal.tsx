import { useState, useEffect } from "react";
import { router } from "@inertiajs/react";
import { toast } from "sonner";

interface User {
  id?: number;
  name: string;
  email: string;
  password?: string;
}

interface Props {
  isOpen: boolean;
  closeModal: () => void;
  user?: User | null;
}

export default function UserFormModal({ isOpen, closeModal, user }: Props) {
  const [formData, setFormData] = useState<User>({ name: "", email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({ name: user.name, email: user.email, password: "" });
    } else {
      setFormData({ name: "", email: "", password: "" });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const method = user?.id ? 'put' : 'post';
    const url = user?.id ? `/users/${user.id}` : '/users';

    router[method](url, formData, {
      onSuccess: () => {
        toast.success(user?.id ? 'User updated successfully!' : 'User created successfully!');
        closeModal();
      },
      onError: () => {
        toast.error(user?.id ? 'Failed to update user.' : 'Failed to create user.');
      },
      onFinish: () => {
        setIsSubmitting(false);
      }
    });
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
              placeholder="John Doe"
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
              placeholder="email@example"
              value={formData.email}
              onChange={handleChange}
              className="w-full border rounded p-2 bg-[var(--input)] text-[var(--foreground)]"
              required
            />
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium text-[var(--muted-foreground)]">Password</label>
            <input
              type="password"
              name="password"
              placeholder="minimum 6 characters"
              value={formData.password}
              onChange={handleChange}
              className="w-full border rounded p-2 bg-[var(--input)] text-[var(--foreground)]"
              required={!user}
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={closeModal}
              disabled={isSubmitting}
              className="px-4 py-2 bg-[var(--muted)] text-[var(--muted-foreground)] rounded hover:bg-[var(--muted-foreground)] hover:text-[var(--muted)] transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded hover:bg-[var(--primary-foreground)] hover:text-[var(--primary)] transition"
            >
              {isSubmitting ? (user ? "Updating..." : "Creating...") : (user ? "Update" : "Create")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

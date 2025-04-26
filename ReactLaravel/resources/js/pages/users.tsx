import { useState } from "react";
import AppLayout from "@/layouts/app-layout";
import UserFormModal from "@/components/UserFormModal";
import { Head, router, usePage } from "@inertiajs/react";
import { Toaster, toast } from "sonner";

export default function Users() {
    const { users } = usePage<{ users: { data: { id: number; name: string; email: string; created_at: string }[] } }>().props;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const openModal = (user = null) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const handleDelete = (id: number) => {
        if (confirm("Are you sure you want to delete this user?")) {
            toast.success("User deleted successfully.");
            router.delete(`/users/${id}`);
        }
    };
return (
    <AppLayout>
        <Head title="Users" />
          <Toaster position="top-right" richColors />
          <div className="flex flex-col gap-6 p-6 bg-[var(--muted)] text-[var(--foreground)] shadow-lg rounded-xl">
            <div className="flex justify-end">
              <button
                onClick={() => openModal()}
                className="bg-[var(--primary)] text-[var(--primary-foreground)] rounded px-3 py-1 text-sm hover:bg-[var(--primary-foreground)] transition"
              >
                Add User
              </button>
            </div>
      
            {/* Responsive Table Wrapper */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-[var(--card)] text-[var(--card-foreground)] text-center shadow-sm rounded-xl">
                <thead>
                  <tr className="bg-[var(--card)] text-[var(--card-foreground)] border-b rounded-xl">
                    {["ID", "Name", "Email", "Created At", "Actions"].map((header) => (
                      <th key={header} className="border p-3 text-left">{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.data.length ? (
                    users.data.map(({ id, name, email, created_at }) => (
                      <tr key={id} className="border-b">
                        <td className="p-3 text-[var(--muted-foreground)]">{id}</td>
                        <td className="p-3 text-[var(--muted-foreground)]">{name}</td>
                        <td className="p-3 text-[var(--muted-foreground)]">{email}</td>
                        <td className="p-3 text-[var(--muted-foreground)]">
                          {new Date(created_at).toLocaleDateString()}
                        </td>
                        <td className="p-3 flex gap-2 justify-center">
                          <button
                            onClick={() => openModal({ id, name, email })}
                            className="bg-[var(--primary)] text-sm text-[var(--primary-foreground)] px-3 py-1 rounded hover:bg-[var(--primary-foreground)]"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(id)}
                            className="bg-[var(--destructive)] text-sm text-[var(--primary-foreground)] px-3 py-1 rounded hover:bg-[var(--destructive)]"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="text-center p-4 text-[var(--muted-foreground)]">
                        No users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
      
          <UserFormModal isOpen={isModalOpen} closeModal={() => setIsModalOpen(false)} user={selectedUser} />
        </AppLayout>
    );      
}
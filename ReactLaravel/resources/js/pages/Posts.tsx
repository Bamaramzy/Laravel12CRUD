import { useState } from "react";
import AppLayout from "@/layouts/app-layout";
import PostFormModal from "@/components/PostFormModal";
import { Head, router, usePage } from "@inertiajs/react";
import { Toaster, toast } from "sonner";

export default function Posts() {
  const { posts } = usePage<{ posts: { id: number; title: string; content: string; picture?: string, created_at: string, updated_at: string }[] }>().props;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  const openModal = (post = null) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    router.delete(`/posts/${id}`, {
      onSuccess: () => {
        toast.success("Post deleted successfully.");
        router.reload();
      },
      onError: () => {
        toast.error("Failed to delete post.");
        console.error("Failed to delete post.");
      },
    });
  };

return (
  <AppLayout>
    <Head title="Posts" />
      <Toaster position="top-right" richColors />
      <div className="flex flex-col gap-6 p-6 bg-[var(--muted)] text-[var(--foreground)] shadow-lg rounded-xl">
        <div className="flex justify-end">
          <button
            onClick={() => openModal()}
            className="bg-[var(--primary)] text-[var(--primary-foreground)] rounded px-3 py-1 text-sm hover:bg-[var(--primary-foreground)] transition"
          >
            Add Post
          </button>
        </div>
  
        <div className="overflow-x-auto"> {/* Allow horizontal scrolling on smaller screens */}
          <table className="w-full border-collapse bg-[var(--card)] text-[var(--card-foreground)] text-center shadow-sm rounded-xl">
            <thead>
              <tr className="bg-[var(--card)] text-[var(--card-foreground)] border-b rounded-xl">
                {["Picture", "Title", "Content", "Created At", "Updated At", "Actions"].map((header) => (
                  <th key={header} className="border p-3 text-left">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {posts.length ? (
                posts.map((post) => (
                  <tr key={post.id} className="border-b">
                    <td className="p-3 flex justify-center items-center">
                      {post.picture ? (
                        <img src={post.picture} alt="Post" className="w-16 h-16 object-cover rounded-full" />
                      ) : (
                        "No Picture"
                      )}
                    </td>
                    <td className="p-3">
                      <span className="inline-block px-2 py-1 bg-[var(--chart-3)] text-[var(--foreground)] rounded-md text-lg font-bold hover:text-[var(--primary--foreground)]">
                        {post.title}
                      </span>
                    </td>
                    <td className="p-3">{post.content}</td>
                    <td className="p-3">{new Date(post.created_at).toLocaleDateString()}</td>
                    <td className="p-3">{new Date(post.updated_at).toLocaleDateString()}</td>
                    <td className="p-3 flex gap-2 justify-center">
                      <button
                        onClick={() => openModal(post)}
                        className="bg-[var(--primary)] text-sm text-[var(--primary-foreground)] px-3 py-1 rounded hover:bg-[var(--primary-foreground)]"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="bg-[var(--destructive)] text-sm text-[var(--primary-foreground)] px-3 py-1 rounded hover:bg-[var(--destructive)]"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center p-4 text-[var(--muted-foreground)]">
                    No posts found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
  
    <PostFormModal isOpen={isModalOpen} closeModal={() => setIsModalOpen(false)} post={selectedPost} />
  </AppLayout>
);
  
}
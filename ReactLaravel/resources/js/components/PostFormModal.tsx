import { useState, useEffect } from "react";
import { router } from "@inertiajs/react";
import { Toaster, toast } from "sonner";
 
interface Post {
  id?: number;
  title: string;
  content: string;
  picture?: string;
}

interface Props {
  isOpen: boolean;
  closeModal: () => void;
  post?: Post | null;
}

export default function PostFormModal({ isOpen, closeModal, post }: Props) {
  const [formData, setFormData] = useState<Post>({ title: "", content: "", picture: "" });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");

  useEffect(() => {
    if (post) {
      setFormData({ title: post.title, content: post.content, picture: post.picture || "" });
      setPreview(post.picture || "");
      setSelectedFile(null);
    } else {
      setFormData({ title: "", content: "", picture: "" });
      setPreview("");
      setSelectedFile(null);
    }
  }, [post]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const data = new FormData();
    data.append("title", formData.title);
    data.append("content", formData.content);
    if (selectedFile) {
      data.append("picture", selectedFile);
    }
    const successMessage = post?.id? "Post updated successfully." : "Post created successfully.";
    const errorsMessage = post?.id? "Failed to update post." : "Failed to create post.";
    if (post?.id) {
      data.append("_method", "PUT");
      router.post(`/posts/${post.id}`, data, {
        onSuccess: () => {
          successMessage && toast.success("Post updated successfully.");
          closeModal();
          router.reload();
        },
        onError: (errors) => {
          errorsMessage && toast.error("Failed to update post.");
          console.error(errors.message || "Failed to submit post.");
        },
      });
    } else {
      router.post("/posts", data, {
        onSuccess: () => {
          toast.success("Post created successfully.");
          closeModal();
          router.reload();
        },
        onError: (errors) => {
          toast.error("Failed to create post.");
          console.error(errors.message || "Failed to submit post.");
        },
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[var(--background)] bg-opacity-50 z-50">
      <div className="bg-[var(--card)] p-6 rounded-[var(--radius)] shadow-lg w-full max-w-xl">
        <h2 className="text-[var(--foreground)] text-lg font-semibold mb-4">
          {post ? "Edit Post" : "Add Post"}
        </h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border border-[var(--border)] rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">Content</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              className="w-full border border-[var(--border)] rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              required
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">Picture (optional)</label>
            <input
              type="file"
              name="picture"
              onChange={handleFileChange}
              className="w-full text-sm"
              accept="image/*"
            />
          </div>
          {preview && (
            <div className="mb-4">
              <p className="text-sm mb-1 text-[var(--foreground)]">Image Preview:</p>
              <img
                src={preview}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-[var(--radius)]"
              />
            </div>
          )}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 bg-[var(--destructive)] text-[var(--primary-foreground)] rounded-lg hover:bg-[var(--destructive)]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg hover:bg-[var(--primary)]"
            >
              {post ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
  
}
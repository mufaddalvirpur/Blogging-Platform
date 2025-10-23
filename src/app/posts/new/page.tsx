"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "~/trpc/react";
import Link from "next/link";
import dynamic from "next/dynamic";
import "easymde/dist/easymde.min.css";

// Dynamically import SimpleMDE with SSR turned off
const SimpleMDE = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
});

export default function NewPostForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [isPublished, setIsPublished] = useState(true); // Default to published

  const { data: categories, isLoading: isLoadingCategories } =
    api.category.getAll.useQuery();

  const utils = api.useUtils();

  const createPost = api.post.createPost.useMutation({
    onSuccess: () => {
      router.push("/dashboard");
      utils.post.getAll.invalidate();
    },
    onError: (error) => {
      // You can add user-facing error handling here
      console.error("Failed to create post:", error);
    },
  });

  const handleCategoryChange = (categoryId: number) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId],
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createPost.mutate({
      title,
      content,
      categoryIds: selectedCategories,
      published: isPublished,
    });
  };

  return (
    <main className="flex min-h-screen flex-col items-center bg-gray-900 text-white">
      <div className="container mx-auto mt-12 max-w-2xl px-4">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-4xl font-bold">Create New Post</h1>
          <Link
            href="/dashboard"
            className="rounded-lg bg-white/10 px-6 py-2 font-semibold text-white transition hover:bg-white/20"
          >
            Back to Dashboard
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <label
              htmlFor="title"
              className="mb-2 block text-sm font-medium text-gray-300"
            >
              Post Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-gray-600 bg-gray-700 p-3 text-white placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Enter post title"
              required
            />
          </div>

          <div>
            <label
              htmlFor="content"
              className="mb-2 block text-sm font-medium text-gray-300"
            >
              Content
            </label>
            <div className="prose prose-invert max-w-none text-white">
              <SimpleMDE value={content} onChange={setContent} />
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-medium text-gray-300">
              Categories
            </h3>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {isLoadingCategories ? (
                <p>Loading categories...</p>
              ) : (
                categories?.map((category) => (
                  <div key={category.id} className="flex items-center">
                    <input
                      id={`category-${category.id}`}
                      type="checkbox"
                      checked={selectedCategories.includes(category.id)}
                      onChange={() => handleCategoryChange(category.id)}
                      className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-indigo-600 focus:ring-indigo-600"
                    />
                    <label
                      htmlFor={`category-${category.id}`}
                      className="ml-2 text-sm text-gray-300"
                    >
                      {category.name}
                    </label>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="flex items-center">
            <input
              id="published"
              type="checkbox"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-indigo-600 focus:ring-indigo-600"
            />
            <label
              htmlFor="published"
              className="ml-2 text-sm font-medium text-gray-300"
            >
              Publish this post immediately
            </label>
          </div>

          <button
            type="submit"
            disabled={createPost.isPending}
            className="w-full rounded-lg bg-indigo-600 px-5 py-3 text-center font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-800"
          >
            {createPost.isPending ? "Creating..." : "Create Post"}
          </button>
        </form>
      </div>
    </main>
  );
}


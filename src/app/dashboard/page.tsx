"use client";

import Link from "next/link";
import { api } from "~/trpc/react";

export default function Dashboard() {
  const utils = api.useUtils();
  const {
    data: posts,
    isLoading,
    error,
  } = api.post.getAll.useQuery({ includeDrafts: true }); // Fetch drafts too

  const deletePost = api.post.delete.useMutation({
    onSuccess: () => {
      utils.post.getAll.invalidate();
    },
    onError: (error) => {
      console.error("Failed to delete post:", error);
      alert("Failed to delete post");
    },
  });

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      deletePost.mutate({ id });
    }
  };

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-900 text-white">
        <p>Loading posts...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-900 text-white">
        <p>Error loading posts. Please try again later.</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center bg-gray-900 text-white">
      <div className="container mx-auto mt-12 max-w-4xl px-4">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <h1 className="text-4xl font-bold">Dashboard</h1>
          <div className="flex gap-4">
            <Link
              href="/blog"
              className="rounded-lg bg-white/10 px-6 py-2 font-semibold text-white transition hover:bg-white/20"
            >
              View Blog Posts
            </Link>
            <Link
              href="/posts/new"
              className="rounded-lg bg-indigo-600 px-6 py-2 font-semibold text-white transition hover:bg-indigo-700"
            >
              Create New Post
            </Link>
          </div>
        </div>
        <div className="overflow-x-auto rounded-lg border border-gray-700 bg-gray-800">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700/50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-300"
                >
                  Title
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-300"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-300"
                >
                  Last Updated
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {posts && posts.length > 0 ? (
                posts.map((post) => (
                  <tr key={post.id}>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-white">
                      {post.title}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-semibold ${
                          post.published
                            ? "bg-green-500/20 text-green-400"
                            : "bg-yellow-500/20 text-yellow-400"
                        }`}
                      >
                        {post.published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-400">
                      {new Date(post.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <Link
                        href={`/posts/${post.id}/edit`}
                        className="mr-4 text-indigo-400 hover:text-indigo-300"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="text-red-400 hover:text-red-300"
                        disabled={deletePost.isPending}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-8 text-center text-gray-400"
                  >
                    No posts found. Get started by creating one!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}


"use client";

import Link from "next/link";
import { useState } from "react";
import { api } from "~/trpc/react";

export default function BlogPage() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null,
  );

  const {
    data: postsData, // Renamed to avoid conflict with 'posts' from response
    isLoading: isLoadingPosts,
    error: postsError,
  } = api.post.getAll.useQuery({
    categoryId: selectedCategoryId ?? undefined,
    includeDrafts: false, // Ensure we only fetch published posts
  });

  const { data: categories, isLoading: isLoadingCategories } =
    api.category.getAll.useQuery();

  // The API now returns an object { posts: [], totalCount: 0 }
  // We need to access the posts property.
  const posts = postsData?.posts;

  return (
    <main className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-10 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <h1 className="text-5xl font-extrabold tracking-tight">
            Recent <span className="text-indigo-500">Blog Posts</span>
          </h1>
          <Link
            href="/dashboard"
            className="whitespace-nowrap rounded-lg bg-white/10 px-6 py-3 font-semibold text-white transition hover:bg-white/20"
          >
            Go to Dashboard
          </Link>
        </div>

        <div className="mb-8">
          <h2 className="mb-4 text-lg font-semibold">Filter by Category</h2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedCategoryId(null)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                selectedCategoryId === null
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              All Posts
            </button>
            {isLoadingCategories ? (
              <p>Loading categories...</p>
            ) : (
              categories?.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategoryId(category.id)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    selectedCategoryId === category.id
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  {category.name}
                </button>
              ))
            )}
          </div>
        </div>

        {isLoadingPosts && <p>Loading posts...</p>}
        {postsError && (
          <p className="text-red-400">Error loading posts. Please try again.</p>
        )}

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts && posts.length > 0 ? (
            posts.map((post) => (
              <Link href={`/blog/${post.id}`} key={post.id}>
                <article className="flex h-full flex-col overflow-hidden rounded-lg border border-gray-700 bg-gray-800 transition hover:border-indigo-500">
                  <div className="flex-grow p-6">
                    <h3 className="mb-2 text-xl font-bold text-white">
                      {post.title}
                    </h3>
                    <p className="mb-4 text-gray-400">
                      {/* We use a simple substring for the snippet */}
                      {post.content
                        ? post.content.substring(0, 100) + "..."
                        : ""}
                    </p>
                  </div>
                  <div className="border-t border-gray-700 p-6">
                    <div className="flex flex-wrap items-center gap-2">
                      {post.postsToCategories?.map(({ category }) => (
                        <span
                          key={category.id}
                          className="rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-medium text-indigo-400"
                        >
                          {category.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              </Link>
            ))
          ) : (
            !isLoadingPosts && (
              <p className="md:col-span-3">No posts found for this category.</p>
            )
          )}
        </div>

        {/* Pagination UI would go here. Since we skipped that step,
          we are only showing the first page of results.
        */}
      </div>
    </main>
  );
}


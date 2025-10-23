"use client";

import { useState } from "react";
import Link from "next/link";
import { api } from "~/trpc/react";

export default function CategoryManager() {
  const [newCategoryName, setNewCategoryName] = useState("");

  // tRPC utils for invalidating queries
  const utils = api.useUtils();

  // Fetch all existing categories
  const { data: categories, isLoading } = api.category.getAll.useQuery();

  // Mutation for creating a new category
  const createCategory = api.category.createCategory.useMutation({
    onSuccess: () => {
      // When a new category is created, refetch the list of all categories
      utils.category.getAll.invalidate();
      setNewCategoryName(""); // Clear the input field
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategoryName.trim()) {
      createCategory.mutate({ name: newCategoryName.trim() });
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center bg-gray-900 pt-16 text-white">
      <div className="container mx-auto flex w-full max-w-2xl flex-col gap-8 px-4">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-[4rem]">
            Manage <span className="text-indigo-400">Categories</span>
          </h1>
          <Link
            href="/"
            className="whitespace-nowrap rounded-lg bg-gray-700 px-6 py-3 text-base font-medium text-white transition hover:bg-gray-600"
          >
            Back to Home
          </Link>
        </div>

        {/* Form to create a new category */}
        <form onSubmit={handleSubmit} className="flex gap-4">
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="New category name"
            className="flex-grow rounded-lg border border-gray-600 bg-gray-800 p-3 text-white placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            required
          />
          <button
            type="submit"
            disabled={createCategory.isPending}
            className="rounded-lg bg-indigo-600 px-6 py-3 font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-800"
          >
            {createCategory.isPending ? "Adding..." : "Add"}
          </button>
        </form>

        {/* List of existing categories */}
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold">Existing Categories</h2>
          <div className="rounded-lg border border-gray-700 bg-gray-800 p-4">
            {isLoading ? (
              <p className="text-gray-400">Loading categories...</p>
            ) : categories && categories.length > 0 ? (
              <ul className="divide-y divide-gray-700">
                {categories.map((category) => (
                  <li key={category.id} className="py-2">
                    {category.name}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400">No categories found.</p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

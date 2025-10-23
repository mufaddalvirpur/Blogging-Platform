"use client";

import Link from "next/link";
import { api } from "~/trpc/react";
import { marked } from "marked";

export default function PostPage({ params }: { params: { id: string } }) {
  const postId = params.id;

  const { data: post, isLoading, error } = api.post.getById.useQuery({
    id: postId,
  });

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-900 text-white">
        <p>Loading post...</p>
      </main>
    );
  }

  if (error || !post) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-gray-900 text-white">
        <p className="mb-4 text-xl">
          {error ? "Error loading post." : "Post not found."}
        </p>
        <Link
          href="/blog"
          className="rounded-lg bg-indigo-600 px-6 py-2 font-semibold text-white transition hover:bg-indigo-700"
        >
          Back to Blog
        </Link>
      </main>
    );
  }

  // Parse the Markdown content
  const getHtmlContent = () => {
    if (post.content) {
      // Note: In a real app, you should use a more robust sanitizer like DOMPurify
      // The `sanitize` option is deprecated, so we call marked() without it.
      const rawMarkup = marked(post.content); 
      return { __html: rawMarkup };
    }
    return { __html: "" };
  };

  return (
    <main className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto max-w-3xl px-4 py-12">
        <div className="mb-8">
          <Link
            href="/blog"
            className="text-indigo-400 hover:text-indigo-300"
          >
            &larr; Back to all posts
          </Link>
        </div>
        <article>
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            {post.title}
          </h1>
          <div className="mb-6 flex items-center gap-4 text-sm text-gray-400">
            <span>
              Published on {new Date(post.createdAt).toLocaleDateString()}
            </span>
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
          <div
            className="prose prose-invert max-w-none text-lg text-gray-300"
            dangerouslySetInnerHTML={getHtmlContent()}
          />
        </article>
      </div>
    </main>
  );
}


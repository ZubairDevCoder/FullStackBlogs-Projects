import { getPostById } from "@/lib/firebase/posts/read_server";
import { getAllAuthors } from "@/lib/firebase/authors/read_server";
import { getAllCategory } from "@/lib/firebase/category/read_server";
import { User, Tag, Calendar } from "lucide-react";
import Image from "next/image";

export async function generateMetadata({ params }) {
  // ✅ MUST await params in Next.js 16
  const { postsId } = await params;

  let post = null;

  try {
    post = await getPostById(postsId);
  } catch (error) {
    console.error("Metadata fetch error:", error);
  }

  if (!post) {
    return {
      title: "Post Not Found | Zubi Coder Blog",
      description: "The requested post was not found.",
    };
  }

  const description =
    post.excerpt ||
    post.content?.replace(/<[^>]+>/g, "").slice(0, 150) ||
    "Read this post on Zubi Coder Blog.";

  return {
    title: post.name,
    description,
    openGraph: {
      title: post.name,
      description,
      type: "article",
      url: `/posts/${post.id}`,
      images: [post.iconURL || "/default-post-image.jpg"],
    },
    twitter: {
      card: "summary_large_image",
      title: post.name,
      description,
      images: [post.iconURL || "/default-post-image.jpg"],
    },
  };
}
export default async function Page({ params }) {
  const { postsId } = await params;

  const post = await getPostById(postsId);
  const authors = await getAllAuthors();
  const categories = await getAllCategory();

  if (!post) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-3xl font-bold text-red-500">Post Not Found</h1>
      </div>
    );
  }

  const author = authors.find((a) => a.id === post.authorId);
  const category = categories.find((c) => c.id === post.categoryId);

  const createdAt = post.createdAt?.toDate?.();
  const updatedAt = post.updatedAt?.toDate?.();

  return (
    <article className="max-w-3xl mx-auto px-4 py-5 space-y-6">
      <h1 className="md:text-4xl text-xl  text-purple-600 dark:text-white font-bold text-center">
        {post.name}
      </h1>

      {/* Image */}
      <div className="relative w-full h-100 rounded-xl overflow-hidden">
        {post.iconURL && (
          <Image
            src={post.iconURL}
            alt={post.name}
            fill
            loading="lazy"
            className="object-contain rounded-xl"
          />
        )}
      </div>

      <div className="flex md:flex-row flex-col items-center justify-around gap-4">
        {/* Author */}
        <div className="flex flex-row  gap-4 items-center justify-around  w-full text-md font-semibold mx-auto">
          <div className="flex items-center gap-2 justify-center">
            {author?.iconURL ? (
              <img src={author.iconURL} className="w-7 h-7 rounded-full" />
            ) : (
              <User className="w-5 h-5" />
            )}
            <span>{author?.name || "Admin"}</span>
          </div>
          {/* Category */}
          <div className="flex justify-center gap-2 text-purple-500 dark:text-white items-center">
            <Tag className="w-4 h-4 text-green-500 dark:text-white" />
            {category?.name || "General"}
          </div>
        </div>
        {/* Dates */}
        <div className="flex justify-center gap-6  text-gray-500">
          {createdAt && (
            <span className="flex items-center gap-1">
              <Calendar className=" w-4 h-4 text-yellow-500 dark:text-white" />
              {createdAt.toLocaleDateString()}
            </span>
          )}
          {updatedAt && (
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4 text-green-500 dark:text-white" />
              {updatedAt.toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
      {/* Content */}
      {post?.content && (
        <div
          className="
      prose 
      max-w-none
      prose-img:rounded-xl
      prose-img:mx-auto
      prose-a:text-blue-600
      prose-a:no-underline
      hover:prose-a:underline
      dark:prose-invert
    "
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      )}
    </article>
  );
}

import { getAllCategory } from "@/lib/firebase/category/read_server";
import Image from "next/image";
import Link from "next/link";

export default async function footcategories() {
  const categories = await getAllCategory();

  return (
    <main className="px-4 py-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
      {categories.map((category) => (
        <div className="">
          <Link href={`/categories/${category.id}`}>
            <div
              key={category.id}
              className="flex flex-col items-center gap-3 group cursor-pointer"
            >
              

              {/* Name */}
              <span
                className="text-sm font-semibold text-gray-700 dark:text-gray-200
              group-hover:text-purple-600 transition"
              >
                {category.name}
              </span>
            </div>
          </Link>
        </div>
      ))}
    </main>
  );
}

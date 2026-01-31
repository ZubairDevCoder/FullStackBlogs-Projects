import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";
import Link from "next/link";
import CategoryListview from "./components/CategoryListview";

export default function Page() {
  return (
    <>
      <main className="px-2 py-2 w-full">
        <div className="flex items-center justify-between">
          <h1 className="font-bold text-xl">Categories</h1>
          <Link href={`/admin/categories/form`}>
            <Button>
              <CirclePlus />
              Add
            </Button>
          </Link>
        </div>
        <div className="my-4 bg-white dark:bg-gray-800">
          <CategoryListview />
        </div>
      </main>
    </>
  );
}

import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";
import Link from "next/link";
import AuthorsListview from "./components/AuthorsListview";

export default function Page() {
  return (
    <>
      <main className=" px-3 py-2 w-full mx-auto overflow-hidden">
        <div className="flex items-center justify-between">
          <h1 className="font-bold text-xl">Authors</h1>
          <Link href={`/admin/authors/form`}>
            <Button>
              <CirclePlus />
              Add
            </Button>
          </Link>
        </div>
        <div className="my-4 bg-white dark:bg-gray-800">
          <AuthorsListview />
        </div>
      </main>
    </>
  );
}

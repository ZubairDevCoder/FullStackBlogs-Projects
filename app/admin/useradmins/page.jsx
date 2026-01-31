import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";
import Link from "next/link";
import CategoryListview from "./components/AdminsListview";
import AdminsListview from "./components/AdminsListview";

export default function Page() {
  return (
    <>
      <main className=" px-3 py-2 w-full overflow-hidden">
        <div className="flex items-center justify-between">
          <h1 className="font-bold text-xl">Admins</h1>
          <Link href={`/admin/useradmins/form`}>
            <Button>
              <CirclePlus />
              Add
            </Button>
          </Link>
        </div>
        <div className="my-4 bg-white dark:bg-gray-800">
          <AdminsListview />
        </div>
      </main>
    </>
  );
}

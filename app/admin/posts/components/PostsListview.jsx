"use client";

import { usePosts } from "@/lib/firebase/posts/read";
import { deletePosts } from "@/lib/firebase/posts/write";
import { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

/* ------------------ SKELETON ------------------ */
function TableSkeleton({ rows }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-16 rounded-xl" />
      ))}
    </div>
  );
}

/* ------------------ MAIN ------------------ */
export default function PostsListview() {
  const { data, error, isLoading } = usePosts();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [selectedPost, setSelectedPost] = useState(null);
  const [open, setOpen] = useState(false);

  /* Responsive page size */
  useEffect(() => {
    const resize = () => setPageSize(window.innerWidth >= 1024 ? 10 : 6);
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  if (!data && !isLoading) return null;

  const totalPages = Math.ceil((data?.length || 1) / pageSize);
  const start = (page - 1) * pageSize;
  const posts = data?.slice(start, start + pageSize) || [];

  const handleDelete = (post) => {
    setSelectedPost(post);
    setOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deletePosts(selectedPost);
      toast.success("Post deleted");
      setOpen(false);
      setSelectedPost(null);
    } catch (e) {
      toast.error("Delete failed");
    }
  };

  return (
    <Card className="max-w-6xl mx-auto rounded-3xl shadow-lg bg-background/80 backdrop-blur">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold tracking-tight text-center mt-1 text-purple-700 dark:text-white">
          Posts Management
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-2">
        {/* LOADING */}
        {isLoading && <TableSkeleton rows={pageSize} />}
        {/* ERROR */}
        {error && <p className="text-red-500">{error}</p>}
        {/* ================= DESKTOP TABLE ================= */}
        {!isLoading && (
          <div >
            <Table className="border rounded-2xl overflow-hidden">
              <TableHeader className="bg-muted/40">
                <TableRow>
                  <TableHead>SR</TableHead>
                  <TableHead>Image</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {posts.map((post, i) => (
                  <TableRow
                    key={post.id}
                    className="hover:bg-muted/40 transition"
                  >
                    <TableCell>{start + i + 1}</TableCell>

                    <TableCell>
                      <img
                        src={post.iconURL || "/placeholder.png"}
                        className="w-10 h-10 rounded-xl object-cover"
                      />
                    </TableCell>

                    <TableCell className="font-medium truncate max-w-[180px]">
                      {post.name}
                    </TableCell>

                    <TableCell className="text-muted-foreground truncate max-w-[180px]">
                      {post.slug}
                    </TableCell>

                    <TableCell>
                      <div className="flex justify-center gap-2">
                        <Link href={`/admin/posts/form?id=${post.id}`}>
                          <Button size="icon" variant="outline">
                            <Pencil className="w-4 h-4" />
                          </Button>
                        </Link>

                        <AlertDialog
                          open={open && selectedPost?.id === post.id}
                          onOpenChange={setOpen}
                        >
                          <AlertDialogTrigger asChild>
                            <Button
                              size="icon"
                              variant="destructive"
                              onClick={() => handleDelete(post)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>

                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Post</AlertDialogTitle>
                              <AlertDialogDescription>
                                Delete "{post.name}" permanently?
                              </AlertDialogDescription>
                            </AlertDialogHeader>

                            <div className="flex justify-end gap-2 mt-4">
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={confirmDelete}>
                                Delete
                              </AlertDialogAction>
                            </div>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        {/* Pagination */}{" "}
        <div className="flex flex-row items-center justify-between gap-3 mt-4">
          {" "}
          <Button
            size="sm"
            variant="default"
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
          >
            {" "}
            Previous{" "}
          </Button>{" "}
          <div className="flex flex-wrap gap-2 justify-center">
            {" "}
            {Array.from({ length: totalPages }).map((_, i) => {
              const pageNumber = i + 1;
              return (
                <Button
                  key={pageNumber}
                  size="sm"
                  variant={page === pageNumber ? "default" : "outline"}
                  onClick={() => setPage(pageNumber)}
                >
                  {" "}
                  {pageNumber}{" "}
                </Button>
              );
            })}{" "}
          </div>{" "}
          <Button
            size="sm"
            variant="default"
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          >
            {" "}
            Next{" "}
          </Button>{" "}
        </div>
      </CardContent>
    </Card>
  );
}

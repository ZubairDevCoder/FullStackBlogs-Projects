"use client";

import { usePosts } from "@/lib/firebase/Posts/read";
import { deletePosts } from "@/lib/firebase/Posts/write";
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { MoreVertical } from "lucide-react";

// ================= TABLE SKELETON =================
function PostsTableSkeleton({ rows = 5 }) {
  return (
    <>
      <div className="overflow-y-scroll max-h-96 scrollbar-hide">
        <Table className="border rounded-md">
          <TableHeader>
            <TableRow>
              <TableHead>
                <Skeleton className="h-4 w-6" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-16" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-24" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-24" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-16" />
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {Array.from({ length: rows }).map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Skeleton className="h-4 w-6" />
                </TableCell>

                <TableCell>
                  <Skeleton className="h-12 w-12 rounded-md mx-auto" />
                </TableCell>

                <TableCell>
                  <Skeleton className="h-4 w-32" />
                </TableCell>

                <TableCell>
                  <Skeleton className="h-4 w-36" />
                </TableCell>

                <TableCell>
                  <div className="flex gap-2 justify-center">
                    <Skeleton className="h-8 w-16 rounded-md" />
                    <Skeleton className="h-8 w-16 rounded-md" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Skeleton */}
      <div className="flex justify-between mt-4">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-8 w-20" />
      </div>
    </>
  );
}

// ================= MAIN COMPONENT =================
export default function PostsListview() {
  const { data, error, isLoading } = usePosts();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [selectedPost, setSelectedPost] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  // Responsive pageSize
  useEffect(() => {
    const handleResize = () => {
      setPageSize(window.innerWidth >= 1024 ? 10 : 5);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!data && !isLoading) return null;

  const totalPages = data ? Math.ceil(data.length / pageSize) : 1;
  const startIndex = (page - 1) * pageSize;
  const paginatedData = data
    ? data.slice(startIndex, startIndex + pageSize)
    : [];

  const handleDelete = (post) => {
    setSelectedPost(post);
    setOpenDialog(true);
  };

  const confirmDelete = async () => {
    if (!selectedPost) return;
    try {
      await deletePosts(selectedPost);
      toast.success("Post deleted successfully");
      setOpenDialog(false);
      setSelectedPost(null);
    } catch (err) {
      toast.error(err.message || "Failed to delete post");
    }
  };

  return (
    <Card className="w-full max-w-5xl mx-auto h-fit">
      <CardHeader>
        <CardTitle>Posts</CardTitle>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <PostsTableSkeleton rows={pageSize} />
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table className="border rounded-md min-w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead>Sr</TableHead>
                    <TableHead>Image</TableHead>
                    <TableHead className="w-32">Title</TableHead>
                    <TableHead className="w-32">Slug</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {paginatedData.map((post, index) => (
                    <TableRow key={post.id}>
                      <TableCell>{startIndex + index + 1}</TableCell>

                      <TableCell>
                        <img
                          src={post.iconURL || "/placeholder.png"}
                          className="w-12 h-12 rounded-md mx-auto"
                          alt={post.name}
                        />
                      </TableCell>

                      <TableCell className="truncate max-w-30">
                        {post.name}
                      </TableCell>
                      <TableCell className="truncate max-w-30">
                        {post.slug}
                      </TableCell>

                      <TableCell className="p-2 flex justify-center items-center">
                        {/* Desktop */}
                        <div className="hidden md:flex gap-2">
                          <Link href={`/admin/posts/form?id=${post.id}`}>
                            <Button size="sm" variant="outline">
                              Edit
                            </Button>
                          </Link>

                          <AlertDialog
                            open={openDialog && selectedPost?.id === post.id}
                            onOpenChange={setOpenDialog}
                          >
                            <AlertDialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDelete(post)}
                              >
                                Delete
                              </Button>
                            </AlertDialogTrigger>

                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Post</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{post.name}"?
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

                        {/* Mobile */}
                        <div className="md:hidden">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button className="p-2 rounded-md hover:bg-muted">
                                <MoreVertical className="h-5 w-5" />
                              </button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link href={`/admin/posts/form?id=${post.id}`}>
                                  Edit
                                </Link>
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => handleDelete(post)}
                              >
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        )}

        {/* Pagination */}
        <div className="flex flex-row items-center justify-between gap-3 mt-4">
          <Button
            size="sm"
            variant="default"
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
          >
            Previous
          </Button>

          <div className="flex flex-wrap gap-2 justify-center">
            {Array.from({ length: totalPages }).map((_, i) => {
              const pageNumber = i + 1;
              return (
                <Button
                  key={pageNumber}
                  size="sm"
                  variant={page === pageNumber ? "default" : "outline"}
                  onClick={() => setPage(pageNumber)}
                >
                  {pageNumber}
                </Button>
              );
            })}
          </div>

          <Button
            size="sm"
            variant="default"
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          >
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

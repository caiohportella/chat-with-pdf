"use client";

import useSubscription from "@/hooks/useSubscription";
import byteSize from "byte-size";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { DownloadCloud, Trash2Icon } from "lucide-react";
import { Button } from "./ui/button";
import { deleteDocument } from "@/actions/deleteDocument";

const Document = ({
  id,
  name,
  size,
  downloadUrl,
}: {
  id: string;
  name: string;
  size: number;
  downloadUrl: string;
}) => {
  const router = useRouter();

  const { hasActiveMembership } = useSubscription();
  const [isDeleting, startTransition] = useTransition();

  return (
    <div className="flex flex-col w-64 h-80 rounded-xl bg-white drop-shadow-md justify-between p-4 transition-all transform hover:scale-105 hover:bg-blue-600 hover:text-white cursor-pointer group">
      <div
        onClick={() => {
          router.push(`/dashboard/files/${id}`);
        }}
        className="flex-1"
      >
        <p className="font-semibold line-clamp-2">{name}</p>
        <p className="text-sm text-gray-500 group-hover:text-blue-100">
          {byteSize(size).value} KB
        </p>
      </div>

      <div className="flex space-x-2 justify-end">
        <Button
          variant="outline"
          disabled={isDeleting || !hasActiveMembership}
          onClick={() => {
            const prompt = window.confirm(
              "Are you sure you want to delete this document?"
            );
            if (prompt) {
              startTransition(async () => {
                await deleteDocument(id);
              });
            }
          }}
        >
          <Trash2Icon className="h-6 w-6 text-red-500" />
          {!hasActiveMembership && (
            <span className="text-red-500 ml-2">PRO Feature</span>
          )}
        </Button>

        <Button variant="outline" asChild>
          <a href={downloadUrl} download target="_blank">
            <DownloadCloud className="h-6 w-6 text-blue-600" />
          </a>
        </Button>
      </div>
    </div>
  );
};
export default Document;

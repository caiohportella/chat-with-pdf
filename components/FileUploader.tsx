"use client";

import { useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import {
  CheckCircleIcon,
  CircleArrowDown,
  HammerIcon,
  RocketIcon,
  SaveIcon,
} from "lucide-react";
import useUpload, { StatusText } from "@/hooks/useUpload";
import { useRouter } from "next/navigation";
import useSubscription from "@/hooks/useSubscription";
import { useToast } from "./ui/use-toast";

const FileUploader = () => {
  const { progress, status, fileId, handleUpload } = useUpload();
  const { isOverFileLimit, filesLoading } = useSubscription();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (fileId) {
      router.push(`/dashboard/files/${fileId}`);
    }
  }, [fileId, router]);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      if (file) {
        if (!isOverFileLimit && !filesLoading) {
          await handleUpload(file);
        } else {
          toast({
            variant: "destructive",
            title: "Free plan file limit reached",
            description:
              "You've reached the maximum number of files allowed for your account. Please upgrade your plan to add more documents.",
          });
        }
      }
    },
    [handleUpload, isOverFileLimit, filesLoading, toast]
  );

  const statusIcons: { [key in StatusText]: JSX.Element } = {
    [StatusText.UPLOADING]: (
      <RocketIcon className="h-20 w-20 text-blue-600" />
    ),
    [StatusText.UPLOADED]: (
      <CheckCircleIcon className="h-20 w-20 text-blue-600" />
    ),
    [StatusText.GENERATING]: (
      <HammerIcon className="h-20 w-20 text-blue-600 animate-bounce" />
    ),
    [StatusText.SAVING]: <SaveIcon className="h-20 w-20 text-blue-600" />,
  };

  const { getRootProps, getInputProps, isDragActive, isFocused, isDragAccept } =
    useDropzone({
      onDrop,
      accept: { "application/pdf": [".pdf"] },
      maxFiles: 1,
    });

  const uploadInProgress = progress != null && progress >= 0 && progress <= 100;

  return (
    <div className="flex flex-col gap-4 items-center max-w-7xl mx-auto">
      {uploadInProgress && (
        <div className="mt-32 flex flex-col justify-center items-center gap-5">
          <div
            className={`radial-progress bg-blue-300 text-white border-blue-600 border-4 ${
              progress === 100 && "hidden"
            }`}
            role="progressbar"
            style={{
              //@ts-ignore
              "--value": progress,
              "--size": "12rem",
              "--thickness": "1.3rem",
            }}
          >
            {progress} %
          </div>

          {/* @ts-ignore */}
          {statusIcons[status!]}

          {/* @ts-ignore */}
          <p className="text-blue-600 animate-pulse">{status}</p>
        </div>
      )}

      {!uploadInProgress && (
        <div
          {...getRootProps()}
          className={`p-10 border-2 border-dashed border-blue-600 text-blue-600 mt-10 w-[90%] rounded-lg h-96 flex items-center justify-center ${
            isFocused || isDragAccept ? "bg-blue-300" : "bg-blue-100"
          }`}
        >
          <input {...getInputProps()} />

          <div className="flex flex-col items-center justify-center">
            {isDragActive ? (
              <>
                <RocketIcon className="h-20 w-20 animate-ping" />
                <p>Drop the files here ...</p>
              </>
            ) : (
              <>
                <CircleArrowDown className="h-20 w-20 animate-bounce" />
                <p>Drag and drop some files here, or click to select files</p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
export default FileUploader;

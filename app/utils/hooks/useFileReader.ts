import { useCallback, useMemo, useState } from "react";

export type FileReaderStatus = "loadstart" | "loadend" | "error";

export const useFileReader = () => {
  const [status, setStatus] = useState<FileReaderStatus | null>(null);
  const [filename, setFilename] = useState<string>("");
  const [size, setSize] = useState<number>(0);
  const [error, setError] = useState<Error | null>(null);
  const [loadedPercents, setLoadedPercents] = useState<number>(0);
  const [result, setResult] = useState<string | ArrayBuffer | null>(null);

  const reader = useMemo(() => {
    if (typeof FileReader !== "undefined") {
      return new FileReader();
    }

    return new Proxy(
      {},
      {
        get() {
          return () => ({});
        },
      },
    ) as FileReader;
  }, []);

  const upload = useCallback(
    async (file: File) => {
      console.log("Start uploading");

      setFilename(file.name);
      setSize(file.size);
      setError(null);

      console.log("Reading file and convert content to binary string");

      reader.readAsDataURL(file);
    },
    [reader],
  );

  const reset = useCallback(() => {
    console.log("Reset");

    setStatus(null);
    setFilename("");
    setSize(0);
    setError(null);
    setLoadedPercents(0);
    setResult(null);
  }, []);

  reader.addEventListener("loadstart", () => {
    setStatus("loadstart");
  });

  reader.addEventListener("loadend", (e) => {
    setResult(e.target?.result || null);
    setStatus("loadend");
  });

  reader.addEventListener("progress", (e) => {
    setLoadedPercents((100 * e.loaded) / e.total);
  });

  reader.addEventListener("error", (e) => {
    if (e?.target?.error) {
      setError(e?.target?.error);
    }

    setStatus("error");
  });

  return {
    status,
    error,
    loadedPercents,
    upload,
    reset,
    result,
    filename,
    size,
  };
};

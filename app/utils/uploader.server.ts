import {
  UploadHandler,
  unstable_composeUploadHandlers,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
  writeAsyncIterableToWritable,
} from "@remix-run/node";
import cloudinary, { UploadApiResponse } from "cloudinary";

import { getOrThrow } from "./env";

cloudinary.v2.config({
  cloud_name: getOrThrow("CLOUDINARY_ACCOUNT_NAME"),
  api_key: getOrThrow("CLOUDINARY_API_KEY"),
  api_secret: getOrThrow("CLOUDINARY_API_SECRET"),
  secure: true,
});

export const parseMultipartFormData = async (
  request: Request,
  uploadFieldName: string,
) => {
  const uploadHandler: UploadHandler = unstable_composeUploadHandlers(
    async (params) => {
      const { name, data } = params;
      if (name === uploadFieldName) {
        try {
          const uploadedImage = await upload(data);
          return uploadedImage.secure_url;
        } catch (error) {
          console.error(">>> Cloudinary upload error", error);
          return null;
        }
      }
    },
    unstable_createMemoryUploadHandler(),
  );

  const formData = await unstable_parseMultipartFormData(
    request,
    uploadHandler,
  );

  return formData;
};

export const upload = async (data: AsyncIterable<Uint8Array>) =>
  // eslint-disable-next-line no-async-promise-executor
  new Promise<UploadApiResponse>(async (resolve, reject) => {
    const uploadStream = cloudinary.v2.uploader.upload_stream(
      {
        folder: getOrThrow("CLOUDINARY_UPLOAD_FOLDER"),
      },
      (error, result) => {
        if (error || !result) {
          reject(error);
          return;
        }

        resolve(result);
      },
    );

    await writeAsyncIterableToWritable(data, uploadStream);
  });

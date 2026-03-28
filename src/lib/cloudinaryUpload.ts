const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME?.trim();
const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET?.trim();
const uploadFolder = import.meta.env.VITE_CLOUDINARY_FOLDER?.trim();

function buildUploadEndpoint() {
  if (!cloudName) {
    throw new Error("Cloudinary cloud name is missing.");
  }

  return `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
}

export function isCloudinaryConfigured() {
  return Boolean(cloudName && uploadPreset);
}

export async function uploadImageToCloudinary(file: string) {
  if (!uploadPreset) {
    throw new Error("Cloudinary upload preset is missing.");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  if (uploadFolder) {
    formData.append("folder", uploadFolder);
  }

  const response = await fetch(buildUploadEndpoint(), {
    method: "POST",
    body: formData,
  });

  const payload = (await response.json()) as {
    secure_url?: string;
    error?: { message?: string };
  };

  if (!response.ok || !payload.secure_url) {
    throw new Error(payload.error?.message || "Cloudinary upload failed.");
  }

  return payload.secure_url;
}

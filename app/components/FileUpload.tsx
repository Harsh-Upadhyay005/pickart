"use client";
import { IKUpload } from "imagekitio-next";
import { IKUploadResponse } from "@imagekit/next";
import { useState } from "react";

export default function FileUpload() {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);
    const onError = (err: Error) => {
        console.error("Upload error:", err);
        setError(err.message);
        setUploading(false);
    };

    const onSuccess = (response: IKUploadResponse) => {
        console.log("Upload successful:", response);
        setUploadedFileUrl(response.url);
        setUploading(false);
    };
    const handleStartUpload = () => {
        setError(null);
        setUploadedFileUrl(null);
        setUploading(true);
    };

    return (
        <div className="space-y-2">
            <h2>File Upload</h2>
            <IKUpload
                fileName="product-image.jpg"
                onError={onError}
                onSuccess={onSuccess}
                onUploadStart={handleStartUpload}
                validateFile={(file: File) => {
                    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
                    if (!allowedTypes.includes(file.type)) {
                        setError("Only JPEG, PNG, and GIF files are allowed.");
                    }
                    if (file.size > 5 * 1024 * 1024) {
                        setError("File size must be less than 5MB.");
                    }
                    return true;
                }
            />
            {uploading && <p>Uploading...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {uploadedFileUrl && (
                <div>
                    <p>Upload successful! File URL:</p>
                    <a href={uploadedFileUrl} target="_blank" rel="noopener noreferrer">
                        {uploadedFileUrl}
                    </a>
                </div>
            )}
        </div>
    );
}

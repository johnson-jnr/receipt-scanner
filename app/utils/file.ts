export function formatFileSize(bytes: number): string {
    if (bytes === 0) return "0B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const size = bytes / Math.pow(k, i);
    return `${i === 0 ? size.toString() : size.toFixed(0)}${sizes[i]}`;
}

export function createObjectUrl(file: File): string | undefined {
    return URL.createObjectURL(file);
}

// src/utils/imageUtils.js
export const resizeAndCompressImage = (
  base64Image,
  maxWidth = 1600,
  maxHeight = 1600
) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = base64Image;

    img.onload = () => {
      const originalSize = base64Image.length;
      console.log(`Original image size: ${originalSize} bytes`);

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      let { width, height } = img;
      const aspectRatio = width / height;

      // Smart resize logic
      if (width > height) {
        if (width > maxWidth) {
          width = maxWidth;
          height = width / aspectRatio;
        }
      } else {
        if (height > maxHeight) {
          height = maxHeight;
          width = height * aspectRatio;
        }
      }

      // Ensure minimum dimension is 800px
      const minDimension = 800;
      if (width < minDimension && height < minDimension) {
        if (width > height) {
          width = minDimension;
          height = width / aspectRatio;
        } else {
          height = minDimension;
          width = height * aspectRatio;
        }
      }

      canvas.width = Math.round(width);
      canvas.height = Math.round(height);

      // Apply sharpening
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, Math.round(width), Math.round(height));

      // Progressive JPEG compression
      canvas.toBlob(
        (blob) => {
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = () => {
            const optimizedImage = reader.result.split(",")[1];
            console.log(`Optimized image size: ${optimizedImage.length} bytes`);
            console.log(
              `Compression ratio: ${(
                (optimizedImage.length / originalSize) *
                100
              ).toFixed(2)}%`
            );
            resolve(optimizedImage);
          };
        },
        "image/jpeg",
        0.92 // Higher quality but still compressed
      );
    };

    img.onerror = reject;
  });
};

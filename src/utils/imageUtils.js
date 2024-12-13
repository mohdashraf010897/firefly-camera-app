// src/utils/imageUtils.js
export const resizeAndCompressImage = (base64Image, maxWidth, maxHeight) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = base64Image;

    img.onload = () => {
      const originalSize = base64Image.length;
      console.log(`Original image size: ${originalSize} bytes`);

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      let width = img.width;
      let height = img.height;

      // Ensure at least one dimension is 800px while maintaining aspect ratio
      const minDimension = 800;
      if (width < height) {
        if (width < minDimension) {
          height = (height * minDimension) / width;
          width = minDimension;
        }
      } else {
        if (height < minDimension) {
          width = (width * minDimension) / height;
          height = minDimension;
        }
      }

      // Apply max dimensions if needed
      if (width > maxWidth) {
        height *= maxWidth / width;
        width = maxWidth;
      }
      if (height > maxHeight) {
        width *= maxHeight / height;
        height = maxHeight;
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = () => {
            const optimizedImage = reader.result.split(",")[1];
            resolve(optimizedImage);
          };
        },
        "image/jpeg",
        0.8
      );
    };

    img.onerror = reject;
  });
};

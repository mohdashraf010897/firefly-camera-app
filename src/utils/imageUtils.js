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

      if (width > height) {
        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width *= maxHeight / height;
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = () => {
            const optimizedImage = reader.result;
            const optimizedSize = optimizedImage.length;
            console.log(`Optimized image size: ${optimizedSize} bytes`);
            console.log(
              `Size reduction: ${originalSize - optimizedSize} bytes`
            );
            resolve(optimizedImage);
          };
        },
        "image/jpeg",
        0.8 // Adjust quality setting for JPEG compression
      );
    };

    img.onerror = (err) => {
      reject(err);
    };
  });
};

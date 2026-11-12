
import { Request, Response } from "express";
import { cloudinary } from "../config/cloudinary.js";

export const uploadProductImage = async (
  req: Request,
  res: Response
) => {
  try {
    if (!req.file) {
      res.status(400).json({
        success: false,
        message: "Please select an image to upload",
      });
      return;
    }

    const result = await new Promise<any>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "shopsphere/products",
          resource_type: "image",
        },
        (error, uploadedImage) => {
          if (error) {
            reject(error);
          } else {
            resolve(uploadedImage);
          }
        }
      );

      stream.end(req.file!.buffer);
    });

    res.status(200).json({
      success: true,
      message: "Product image uploaded successfully",
      imageUrl: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    console.error("Cloudinary upload failed:", error);

    res.status(500).json({
      success: false,
      message: "Image upload failed",
    });
  }
};


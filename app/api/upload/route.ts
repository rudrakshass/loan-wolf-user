// import { NextResponse } from "next/server";
// import { Readable } from "stream";
// import { v2 as cloudinary } from "cloudinary"; // Ensure correct import
// import { UploadApiResponse } from "cloudinary";

// export async function POST(request: Request): Promise<Response> {
//   try {
//     const formData = await request.formData();
//     const file: File | null = formData.get("file") as File;

//     if (!file) {
//       return NextResponse.json(
//         { message: "No file uploaded" },
//         { status: 400 }
//       );
//     }

//     const arrayBuffer = await file.arrayBuffer();
//     const buffer = Buffer.from(arrayBuffer);
//     const stream = Readable.from(buffer);

//     // try {
//     //   // const uploadResult: UploadApiResponse = await new Promise(
//     //   //   (resolve, reject) => {
//     //   //     const uploadStream = cloudinary.uploader.upload_stream(
//     //   //       { folder: "loan_wolf_docs" },
//     //   //       (error, result) => {
//     //   //         if (error || !result) reject(error);
//     //   //         else resolve(result);
//     //   //       }
//     //   //     );

//     //       stream.pipe(uploadStream);
//     //     }
//     //   );

// //       return NextResponse.json({
// //         secure_url: uploadResult.secure_url,
// //       });
// //     } catch (uploadError) {
// //       console.error("Cloudinary upload error:", uploadError);
// //       return NextResponse.json(
// //         { message: "Upload failed" },
// //         { status: 500 }
// //       );
// //     }
// //   } catch (error) {
// //     console.error("Request error:", error);
// //     return NextResponse.json(
// //       { message: "Invalid request" },
// //       { status: 400 }
// //     );
// //   }
// // }

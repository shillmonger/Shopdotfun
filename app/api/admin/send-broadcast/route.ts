// import { NextResponse } from "next/server";
// import { Resend } from "resend";
// import { db } from "@/lib/db"; // adjust to your DB

// const resend = new Resend(process.env.RESEND_API_KEY);

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();

//     const {
//       subject,
//       message,
//       recipientType,
//       singleEmail,
//     } = body;

//     if (!subject || !message) {
//       return NextResponse.json(
//         { error: "Missing subject or message" },
//         { status: 400 }
//       );
//     }

//     let emails: string[] = [];

//     /* ---------------------------------
//        GET USERS BASED ON TYPE
//     ----------------------------------*/

//     if (recipientType === "all") {
//       const users = await db.user.findMany({
//         where: { isActive: true },
//         select: { email: true },
//       });

//       emails = users.map((u) => u.email);
//     }

//     if (recipientType === "sellers") {
//       const sellers = await db.user.findMany({
//         where: { role: "SELLER" },
//         select: { email: true },
//       });

//       emails = sellers.map((u) => u.email);
//     }

//     if (recipientType === "buyers") {
//       const buyers = await db.user.findMany({
//         where: { role: "BUYER" },
//         select: { email: true },
//       });

//       emails = buyers.map((u) => u.email);
//     }

//     if (recipientType === "single") {
//       if (!singleEmail) {
//         return NextResponse.json(
//           { error: "Email required" },
//           { status: 400 }
//         );
//       }

//       emails = [singleEmail];
//     }

//     /* ---------------------------------
//        SEND WITH RESEND
//     ----------------------------------*/

//     const result = await resend.emails.send({
//       from: "Admin <noreply@yourdomain.com>",
//       to: emails,
//       subject,
//       html: `
//         <div style="font-family: Arial; line-height:1.6">
//           <h2>${subject}</h2>
//           <p>${message.replace(/\n/g, "<br/>")}</p>

//           <hr/>
//           <p style="font-size:12px;color:gray">
//             You received this because you use our platform.
//           </p>
//         </div>
//       `,
//     });

//     return NextResponse.json({
//       success: true,
//       sent: emails.length,
//       result,
//     });
//   } catch (err) {
//     console.error(err);

//     return NextResponse.json(
//       { error: "Failed to send emails" },
//       { status: 500 }
//     );
//   }
// }


import { NextResponse } from "next/server";

export async function POST(request: Request) {
  return NextResponse.json({ success: true });
}

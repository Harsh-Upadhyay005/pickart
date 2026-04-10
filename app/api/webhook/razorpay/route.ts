import { NextRequest } from "next/server";
import crypto from "crypto";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Order from "@/models/Order";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
    try {
        const body = await req.text();
        const signature = req.headers.get("x-razorpay-signature");

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
            .update(body)
            .digest("hex");
        if (signature !== expectedSignature) {
            return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
        }
        const event = JSON.parse(body);
        await connectToDatabase();

        if (event.event === "payment.captured") {
            const payment = event.payload.payment.entity;
           
            const order = await Order.findOneAndUpdate(
                { razorpayOrderId: payment.order_id },
                { status: "completed" },
                { new: true }
            ).populate({
                path: "productId",
                select: "name description imageUrl variants"},
                {path: "userId", select: "email name"}
            );
        
            if (order) {
                // Send confirmation email to user
                const transporter = nodemailer.createTransport({
                    service: "Gmail",
                    port: 587,
                    auth: {
                        user: process.env.EMAIL_USER,
                        pass: process.env.EMAIL_PASS,
                    },
                });
                await transporter.sendMail({
                    from: process.env.EMAIL_USER,
                    to: order.userId.email,
                    subject: "Order Confirmation",
                    text: `Your order for ${order.productId.name} has been confirmed!`,
                });
            } 
        } 
        
    }catch (error) {
            console.error("Error processing webhook:", error);
            return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });

    }
}



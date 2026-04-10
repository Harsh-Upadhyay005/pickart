import Razorpay from "razorpay";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Order from "@/models/Order";
import { IVariant } from "@/models/Product";


const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const { productId, variantId } = await request.json();
        await connectToDatabase();

        // create order in Razorpay
        const order = await razorpay.orders.create({
            amount: Math.round(variant.price * 100), // amount in paise
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
            notes: {
                productId: productId.toString(),
                variantId: variantId.toString(),
            }

        })  
        const newOrder = await new Order({
            userId: session.user.id,
            productId,
            variantId,
            razorpayOrderId: order.id,
            amount: Math.round(variant.price * 100),
            status: "pending",
        });

        return NextResponse.json(
            {
                orderId: order.id,
                amount: order.amount,
                currency: order.currency,
                dborder: newOrder._id,
            }
        );
    } catch (error) {
        console.error("Error creating order:", error);
        return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
    }
}
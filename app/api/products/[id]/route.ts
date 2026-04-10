import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Product from "@/models/Product";

export async function GET (
    request: NextRequest,
    props: {params: Promise<{id: string}>}

) {
    try {
        const { id } = await props.params;
        await connectToDatabase();
        const product = await Product.findById(id).lean();

        if (!product) {
            return NextResponse.json({ message: "Product not found" }, { status: 404 });
        }
        return NextResponse.json({ product }, { status: 200 });
    } catch (error) {
        console.error("Error fetching product:", error);
        return NextResponse.json({ message: "Error fetching product" }, { status: 500 });
    }
}
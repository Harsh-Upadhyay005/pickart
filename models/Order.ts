import mongoose, { model, models, Schema  } from 'mongoose';
import { ImageVariant, ImageVariantType } from './Product';


interface PopulatedUser {
    _id: mongoose.Types.ObjectId;
    email: string;
}

interface PopulatedProduct {
    _id: mongoose.Types.ObjectId;
    name: string;
    imageUrl: string;
}

export interface IOrder {
    _id?: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId | PopulatedUser;
    productId: mongoose.Types.ObjectId | PopulatedProduct;
    variantType: ImageVariant;
    razorepayOrderId: string;
    razorpayPaymentId: string;
    amount: number;
    status: 'pending' | 'completed' | 'failed';
    downloadUrl?: string;
    previewUrl?: string;
    createdAt: Date;
    updatedAt: Date;
}   
    


const orderItemSchema = new Schema<IOrder>({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    productId: {
        type: mongoose.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    variantType: {
        type: String,
        required: true,
        enum: ['SQUARE', 'WIDE', 'PORTRAIT'], as ImageVariantType[],
        set: (value: string) => value.toUpperCase(),
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    license: {
        type: String,
        required: true,
        enum: ["personal", "commercial"],
    },
    razorpayOrderId: {
        type: String,
        required: true,
    },
    razorpayPaymentId: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
        min: 0,
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending',
    },
    downloadUrl: {
        type: String,
    },
    previewUrl: {
        type: String,
    },
}, { timestamps: true });

const Order = models?.Order || model('Order', orderItemSchema);
export default Order;
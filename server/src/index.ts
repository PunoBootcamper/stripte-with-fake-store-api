import express, { Request, Response } from "express";
import cors from "cors";
import Stripe from "stripe";
import { PrismaClient } from "@prisma/client";
import "dotenv/config";

const prisma = new PrismaClient();

const app = express();
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
  throw new Error("Stripe secret key is not defined in environment variables");
}

const stripe = new Stripe(stripeSecretKey);

app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_URL }));

app.post("/create-payment-intent", async (req: Request, res: Response) => {
  const { amount, currency, email, name } = req.body;
  console.log(req.body);
  try {
    // Find or create the user in the database
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name,
        },
      });
    }

    // Create a payment intent
    await prisma.transaction.create({
      data: {
        amount,
        currency,
        status: "pending",
        userId: user.id,
      },
    });

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      payment_method_types: ["card"],
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

import express, { Request, Response } from "express";
import cors from "cors";
import Stripe from "stripe";
import { PrismaClient } from "@prisma/client";
import "dotenv/config";

const prisma = new PrismaClient();

const app = express();
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
  throw new Error(
    "La clave secreta de Stripe no está definida en las variables de entorno"
  );
}

const stripe = new Stripe(stripeSecretKey);

app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_URL }));

app.post("/create-payment-intent", async (req: Request, res: Response) => {
  const { amount, paymentMethodId, email, name } = req.body;

  let user;
  let paymentIntent;
  let transactionStatus = "failed";
  let errorMessage = null;

  try {
    let customer;
    const existingCustomers = await stripe.customers.list({
      email,
      limit: 1,
    });

    if (existingCustomers.data.length > 0) {
      customer = existingCustomers.data[0];
    } else {
      customer = await stripe.customers.create({
        email,
        name,
      });
    }

    const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);
    if (paymentMethod.customer !== customer.id) {
      await stripe.paymentMethods.attach(paymentMethodId, {
        customer: customer.id,
      });
    }

    await stripe.customers.update(customer.id, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });

    paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      customer: customer.id,
      payment_method: paymentMethodId,
      off_session: true,
      confirm: true,
    });

    transactionStatus = paymentIntent.status;

    if (paymentIntent.status === "requires_action") {
      res.status(200).json({
        message: "Se requiere una acción adicional para completar el pago.",
        status: paymentIntent.status,
      });
    } else if (paymentIntent.status === "succeeded") {
      res.status(200).json({
        message: "Pago realizado con éxito",
        status: paymentIntent.status,
      });
    } else {
      res.status(200).json({
        message: "El pago está en estado: " + paymentIntent.status,
        status: paymentIntent.status,
      });
    }
  } catch (error: any) {
    console.error("Error:", error);
    errorMessage = error.message || "Error interno del servidor";

    if (error.type === "StripeCardError") {
      res.status(400).json({ error: errorMessage });
    } else {
      res.status(500).json({ error: errorMessage });
    }
  } finally {
    try {
      user = await prisma.user.upsert({
        where: { email },
        update: { name },
        create: { email, name },
      });

      await prisma.transaction.create({
        data: {
          amount,
          currency: "usd",
          status: transactionStatus,
          userId: user.id
        },
      });
    } catch (dbError) {
      console.error("Error al registrar en la base de datos:", dbError);
    }
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});

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
  try {
    // Buscar o crear el cliente en Stripe
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
        payment_method: paymentMethodId,
      });
    }

    // Adjuntar el método de pago al cliente
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customer.id,
    });

    // Actualizar el método de pago predeterminado del cliente
    await stripe.customers.update(customer.id, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });

    // Crear y confirmar el PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      customer: customer.id,
      payment_method: paymentMethodId,
      off_session: true,
      confirm: true,
    });

    // Guardar la transacción en la base de datos
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

    await prisma.transaction.create({
      data: {
        amount,
        currency: "usd",
        status: "succeeded",
        userId: user.id,
      },
    });

    res.status(200).json({ message: "Pago realizado con éxito" });
  } catch (error: any) {
    console.error("Error:", error);
    if (error.type === "StripeCardError") {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});

import express from "express";
import cors from "cors";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const app = express();
const PORT = process.env.PORT || 5050;

const allowedOrigins = [process.env.FRONTEND_ORIGIN, "http://localhost:5173"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["POST"],
  })
);
app.use(express.json());

app.post("/api/create-upgrade-session", async (req, res) => {
  const { finalistId, tier, amount } = req.body;

  const validTiers = {
    boost: 900,
    premium: 4900,
  };

  if (finalistId !== "FIN_123" || validTiers[tier] !== amount) {
    return res.status(403).json({ error: "Invalid request" });
  }

  try {
    const frontendBase = process.env.FRONTEND_ORIGIN || "http://localhost:5173";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${tier.charAt(0).toUpperCase() + tier.slice(1)} Upgrade`,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.FRONTEND_ORIGIN}?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendBase}?canceled=true`,
    });

    res.json({ sessionId: session.id });
  } catch (err) {
    console.error("Stripe Error:", err);
    res.status(500).json({ error: "Payment session creation failed" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

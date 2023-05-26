const router = require("express").Router();

// const stripe = require("stripe")(process.env.STRIPE_KEY);
const KEY = process.env.STRIPE_KEY;
const stripe = require("stripe")(KEY);

router.post("/payment", async (req, res) => {
  // stripe.charges.create(
  //   {
  //     source: req.body.tokenId,
  //     amount: req.body.amount,
  //     currency: "usd",
  //   },
  await stripe.checkout.sessions.create(
    {
      payment_method_types: ["card"],
      line_items: [
        {
          price: req.body.amount,
          // quantity: req.body.quantity,
        },
      ],
      payment_intent_data: {
        application_fee_amount: 200,
      },
      mode: "payment",
      success_url: "http://localhost:3000/cart",
      cancel_url: "http://localhost:3000/",
    },
    // {
    //   stripeAccount: "{{CONNECTED_STRIPE_ACCOUNT_ID}}",
    // },
    // (stripeErr, stripeRes) => {
    //   if (stripeErr) {
    //     res.status(500).json(stripeErr);
    //   } else {
    //     res.status(200).json(stripeRes);
    //   }
    // }
  );
});

module.exports = router;

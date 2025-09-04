import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;
const UBER_SERVER_TOKEN = process.env.UBER_SERVER_TOKEN;

// test pickup/drop
const TEST_PICKUP = {
  latitude: 19.1677053,
  longitude: 72.960964
};
const TEST_DROPOFF = {
  latitude: 19.1720999,
  longitude: 72.956671
};

// Endpoint to fetch fare
app.post("/lastmile/fare", async (req, res) => {
  try {
    const { pickup, dropoff } = req.body || {
      pickup: TEST_PICKUP,
      dropoff: TEST_DROPOFF
    };

    // 🚖 Uber Price Estimates API
    // Docs: https://developer.uber.com/docs/riders/references/api/v1.2/estimates-price-get
    const url = `https://api.uber.com/v1.2/estimates/price`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Token ${UBER_SERVER_TOKEN}`
      },
      params: {
        start_latitude: pickup.latitude,
        start_longitude: pickup.longitude,
        end_latitude: dropoff.latitude,
        end_longitude: dropoff.longitude
      }
    });

    res.json({
      status: "success",
      pickup,
      dropoff,
      uber_estimates: response.data.prices || []
    });
  } catch (err) {
    console.error("Error fetching Uber fare:", err.message);

    // fallback mock response
    res.json({
      status: "mock",
      pickup: TEST_PICKUP,
      dropoff: TEST_DROPOFF,
      uber_estimates: [
        {
          localized_display_name: "UberGo",
          estimate: "₹120-150",
          duration: 600,
          distance: 2.1
        },
        {
          localized_display_name: "UberAuto",
          estimate: "₹80-100",
          duration: 650,
          distance: 2.1
        }
      ]
    });
  }
});

app.listen(PORT, () =>
  console.log(`🚀 Last-mile backend running on http://localhost:${PORT}`)
);

const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Lebensmittel-Abfrage
app.post("/food", async (req, res) => {
  const { food } = req.body;

  if (!food) {
    return res.status(400).json({ error: "Kein Lebensmittel angegeben" });
  }

  try {
    const response = await fetch(
      `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(
        food
      )}&search_simple=1&action=process&json=1&page_size=1`
    );

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();

    if (!data.products || data.products.length === 0) {
      return res.json({ found: false });
    }

    const product = data.products[0];

    res.json({
      found: true,
      name: product.product_name || food,
      category: product.categories_tags?.[0] || null
    });
  } catch (error) {
    console.error("Food API Error:", error);
    res.status(500).json({ error: "Fehler bei Open Food Facts" });
  }
});

app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});

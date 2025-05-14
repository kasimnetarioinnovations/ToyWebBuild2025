// // routes/offer.js
// const express = require("express");
// const multer = require("multer");
// const path = require("path");
// const Offer = require("../Modal/offerModal");
// const router = express.Router();

// // storage setup
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/"); // make sure this folder exists
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname));
//   },
// });

// const upload = multer({ storage });

// // POST /api/offers
// router.post("/", upload.single("image"), async (req, res) => {
//   try {
//     const { title, description, discount } = req.body;
//     const imagePath = `/uploads/${req.file.filename}`;

//     const offer = new Offer({
//       title,
//       description,
//       discount,
//       image: imagePath,
//     });

//     await offer.save();
//     res.status(201).json(offer);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // GET /api/offers
// router.get("/", async (req, res) => {
//   const offers = await Offer.find();
//   res.json(offers);
// });

// module.exports = router;

// Route/offer.js

const express = require("express");
const router = express.Router();
const Offer = require("../Modal/offerModal");
const multer = require("multer");
const path = require("path");

// Set up multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../settings"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage });

// POST route to upload offer with image
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const fileImage = req.file;
    const urlImage = req.body.image; // (optional, agar kisi din URL se bhejna chahe)

    if (!fileImage && !urlImage) {
      return res.status(400).json({ message: "Image is required (file or URL)" });
    }

    const newOffer = new Offer({
      image: fileImage ? `/settings/${fileImage.filename}` : urlImage,
    });

    await newOffer.save();
    res.status(201).json({ success: true, offer: newOffer });
  } catch (err) {
    console.error("Offer save error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});


  router.get('/', async (req, res) => {
    try {
      const offers = await Offer.find();
      res.status(200).json(offers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch offers", error });
    }
  });



module.exports = router;


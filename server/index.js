require("dotenv").config();
const session = require("express-session");
const express = require("express");

const cors = require("cors"); //it uses for sharing data
const mongoose = require("mongoose");
const productModal = require("./Modal/Productmodal");
const multer = require("multer");
const app = express();
app.use(cors());
//webhook route for order history
const webhookRoutes = require("./Route/WebhookRoute.js");
app.use("/api", webhookRoutes);
app.use(express.json()); //EXCEPTING DATA IN THE FORM OF JSON
app.use(express.urlencoded({ extended: false })); //parse form data
const path = require("path");
const fs = require("fs");
const cartRouter = require("./Route/CartRoute");
const userRouter = require("./Route/UserRoute.js");
const jwtDecode = require("jwt-decode");
const wishlistRouter = require("./Route/WishlistRoute.js");
const emailRoute = require("./Route/sendVerificationRoute.js");
const paymentRouter = require("./Route/PaymentRoute.js");
const forgotrouter = require("./Route/ForgotPasswordRoute.js");
const resetrouter = require("./Route/ResetPasswordRoute.js");

const orderRoutes = require("./Route/orderRoutes.js");
const addressRouter = require("./Route/AddressRoute.js");
const checkoutrouter = require("./Route/CheckOutRoute.js");
const categoriesrouter = require("./Route/CategoriesRoute.js");
const targetrouter = require("./Route/TargetRoute.js");
const offerRouter = require("./Route/offer");
const transactionrouter = require("./Route/transactionRoutes.js");
const checkoutformrouter = require("./Route/CheckoutFormDataRoute.js");


//user api
app.use("/api/users", userRouter);
//cart api
app.use("/api/cart", cartRouter);
//wishlist api
app.use("/api/wishlist", wishlistRouter);
//send verification api
app.use("/send-verification", emailRoute);
//payment
app.use("/", paymentRouter);

//forgot & reset password api
app.use("/api/users", forgotrouter);
app.use("/api/users", resetrouter);

//order route
app.use("/api", orderRoutes);

//address route
app.use("/", addressRouter);

//checkout route
app.use("/", checkoutrouter);
//setting offer admin
app.use("/api/offers", offerRouter);

app.use("/settings", express.static(path.join(__dirname, "settings")));

//categories route
app.use("/api/categories", categoriesrouter);

//categories route
app.use("/api/categories", categoriesrouter);

//categories route
app.use("/api/target", targetrouter);

//transaction route
app.use('/api/transactions', transactionrouter)

//checkout route
app.use('/api/checkoutform', checkoutformrouter )

//very very important stop config that arises with different url for backend and frontend

//statick files

app.use(express.static(path.join(__dirname, "./frontends/build")));


app.get('*', function (req,res){
  res.sendFile(path.join(__dirname, "./frontends/build/index.html"));

})

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET, POST, PUT, DELETE",
    allowedHeaders: ["Content-Type"],
    credentials: true,
  })
);

const PORT = process.env.PORT || 8081; // 8081 has using somewhere else then use another port

//image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // cb(null, "./uploads");
    cb(null, path.join(__dirname, "uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "" + Date.now() + "" + file.originalname);
  },
});
//middleware for file uploads
const upload = multer({
  storage: storage,
});
//middleware for uploads products
app.use("/uploads", express.static("uploads"));

//middleware for upload profileImage
app.use("/profileImage", express.static(path.join(__dirname, "profileImage")));

//create and save data in database
////http://localhost:8081/create

// app.post("/create", upload.single("image"), async (req, res) => {
//   try {
//     const image = req.file ? req.file.path: null
//     console.log("File received:", req.file);
//     console.log("Body received:", req.body);

//     const data = new userModal({
//       ...req.body,
//       image: image
//     })
//     await data.save();

//     res.json({
//       success: true,
//       message: "Data saved successfully",
//       data: data,
//     });
//   } catch (error) {
//     console.error("Error saving data:", error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// });

app.post("/create", upload.array("image", 10), async (req, res) => {
  // console.log("File received:", req.files);
  try {
    const images = req.files
      ? req.files.map((file) => ({
          url: `/uploads/${file.filename}`,
        }))
      : [];
    // console.log("Body received:", req.body);
    // console.log("File received:", req.files);
    // console.log("req.file:", images);

    const data = new productModal({
      ...req.body,

      image: images,
    });
    await data.save();

    res.json({
      success: true,
      message: "Data saved successfully",
      data: data,
    });
  } catch (error) {
    console.error("Error saving data:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

//read
//http://localhost:8081
app.get("/", async (req, res) => {
  //it's an api  callback function of two parameter
  const data = await productModal.find({});
  res.json({ success: true, data: data });
});

//update data
//http://localhost:8081/update
// app.put("/update", async (req, res) => {
//   console.log(req.body);
//   const { _id, ...rest } = req.body;
//   console.log("rest", rest);
//   const data = await userModal.updateOne({ _id: _id }, rest);
//   res.send({ success: true, message: "Data updated success", data: data });
// });

//current code
// app.put("/update", upload.array("image", 10), async (req, res) => {
//   try {
//     console.log(req.body);
//     console.log("Received file:", req.file);

//     const { _id, ...rest } = req.body;

//     const existingProduct = await userModal.findById(_id);
//     console.log("Existing product found:", existingProduct);

//     if (!existingProduct) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Product not found" });
//     }

//     let updatedImages = existingProduct.image || [];
//     console.log('Current images on product:', updatedImages)
//     //if a new image is uploaded delete old and update new
//     console.log('existproduct.image', existingProduct.image)
//     if (req.files && req.files.length > 0) {
//       existingProduct.image.forEach((imagePath) => {
//         const oldImagePath = path.join(__dirname, "..", imagePath);
//         if (fs.existsSync(oldImagePath)) {
//           fs.unlinkSync(oldImagePath);
//         }
//       });
//       updatedImages = req.files.map((file) => `/uploads/${file.filename}`);
//     }
//     rest.image = updatedImages;
//     console.log("Final images array:", rest.image);

//     const updatedProduct = await userModal.findByIdAndUpdate(_id, rest, {
//       new: true,
//     });
//     res.json({
//       success: true,
//       message: "Data updated success",
//       data: updatedProduct,
//     });
//   } catch (error) {
//     console.error("Updated error", error);
//   }
// });

app.put("/update", upload.array("image", 10), async (req, res) => {
  try {
    // console.log("Request body:", req.body);
    // console.log("Updated files:", req.files);

    const { _id, ...rest } = req.body;

    const existingProduct = await productModal.findById(_id);
    // console.log("Existing product found:", existingProduct);
    if (!existingProduct) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    let updatedImages = existingProduct.image || [];
    // console.log("Current images on product:", updatedImages);

    //if new images are uploaded, append them to the existing images
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file) => ({
        url: `/uploads/${file.filename}`,
      }));

      updatedImages = [...updatedImages, ...newImages];
      // console.log("Updated images array:", updatedImages);
    }
    //assign the updated images array to the image field
    rest.image = updatedImages;
    const updatedProduct = await productModal.findByIdAndUpdate(_id, rest, {
      new: true,
    });
    // console.log("Updated product:", updatedProduct);
    res.json({
      success: true,
      message: "Data updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    console.error("Error during update", error);
    res.status.json({ success: false, message: "An error occured" });
  }
});

//delete api
// http://localhost:8081/delete/id
app.delete("/delete/:id", async (req, res) => {
  try {
    const id = req.params.id;
    // console.log("aaa", id);

    const data = await productModal.findById(id);
    if (!data) {
      return res
        .status(404)
        .json({ success: false, message: "Record not found" });
    }

    //delete image from file system
    if (data.image && Array.isArray(data.image)) {
      data.image.forEach((imagePath) => {
        if (imagePath && imagePath.url) {
          const oldImagePath = path.join(__dirname, imagePath.url);
          if (fs.unlinkSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
            //fs.promises.unlink(oldImagePath)
          }
        }
      });
    } else {
      console.error("Image array is missing or invalid");
    }

    await productModal.deleteOne({ _id: id });
    res.send({ success: true, message: "Data Deleted Success", data: data });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.delete("/delete-image/:productId/:imageId", async (req, res) => {
  try {
    const { productId, imageId } = req.params;
    // console.log("Received delete request for product ID:", productId);
    // console.log("Image ID to delete:", imageId);

    const product = await productModal.findById(productId);

    if (!product) {
      // console.log("Product not found in database");
      return res.status(404).json({ message: "Product not found" });
    }
    // console.log("Product found:", product);

    //find the image using its ID
    const imageToDelete = product.image.find(
      (img) => img._id.toString() === imageId
    );

    if (!imageToDelete) {
      // console.log("Image not found in product images array");
      return res.status(404).json({ message: "Image not found in product" });
    }
    //construct the full path to the image
    const imagePath = path.join(__dirname, imageToDelete.url);
    // console.log("Attempting to delete file from:", imagePath);

    //delete file from storage
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
      // console.log("File deleted successfully");
    } else {
      // console.log("File not found on server:", imagePath);
    }
    //remove image from database
    product.image = product.image.filter(
      (img) => img._id.toString() !== imageId
    );
    await product.save();
    // console.log("Image removed from product database entry");
    res.json({ message: "Image deleted successfully" });
  } catch (error) {
    console.error("Error deleting image:", error);
    res.status(500).json({ error: error.message });
  }
});

// console.log("cartRouter:", cartRouter);

mongoose
  .connect(
    "mongodb+srv://userakashnettechinnov123:Akash123@cluster0.0aqag.mongodb.net/playpalooza?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    console.log("connectt to DB");
    app.listen(PORT, () => console.log("Server is running"));
  })
  .catch((err) => console.log(err));

const mongoose = require("mongoose");
const express = require("express");
const Listing = require("./model/Listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
let app = express();

// Middleware
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, "/public")));

// MongoDB connection
main().then(() => {
    console.log("MongoDB connection established successfully");
}).catch(err => {
    console.error("MongoDB connection error:", err);
    process.exit(1); // Exit the process if connection fails
});

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wonderlust');
}

// Server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});

// Routes
app.get("/", (req, res) => {
    res.send("Root is working");
});

app.get('/listing', async (req, res) => {
    try {
        const allListings = await Listing.find({});
        res.render("./listing/index.ejs", { allListings });
    } catch (error) {
        console.error("Error fetching listings:", error);
        res.status(500).send("Error fetching listings");
    }
});

app.get('/listing/new', (req, res) => {
    res.render("./listing/new.ejs");
});

app.post('/listing', async (req, res) => {
    try {
        const newListing = new Listing(req.body.listing);
        await newListing.save();
        res.redirect("/listing");
    } catch (error) {
        console.error("Error creating new listing:", error);
        res.status(500).send("Error creating new listing");
    }
});

app.get("/listing/:id/edit", async (req, res) => {
    try {
        const { id } = req.params;
        const listing = await Listing.findById(id);
        res.render("./listing/edit.ejs", { listing });
    } catch (error) {
        console.error("Error fetching listing for edit:", error);
        res.status(500).send("Error fetching listing for edit");
    }
});

app.put("/listing/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await Listing.findByIdAndUpdate(id, req.body.listing);
        res.redirect(`/listing/${id}`);
    } catch (error) {
        console.error("Error updating listing:", error);
        res.status(500).send("Error updating listing");
    }
});

app.get("/listing/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const listing = await Listing.findById(id);
        res.render("./listing/show.ejs", { listing });
    } catch (error) {
        console.error("Error fetching listing:", error);
        res.status(500).send("Error fetching listing");
    }
});

app.delete('/listing/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Listing.findByIdAndDelete(id);
        console.log(deleted);
        res.redirect("/listing");
    } catch (error) {
        console.error("Error deleting listing:", error);
        res.status(500).send("Error deleting listing");
    }
});

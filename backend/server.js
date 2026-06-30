const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
console.log("RUNNING FILE:", __filename);

const app = express();

app.use(cors());
app.use(express.json());

app.use(
    "/uploads",
    express.static(path.join(__dirname, "../uploads"))
);

// ======================
// MySQL Connection
// ======================

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root123",
    database: "vinpropel"
});

db.connect((err) => {

    if (err) {
        console.log(err);
    } else {
        console.log("MySQL Connected");
    }

});

// ======================
// Multer Upload
// ======================

const storage = multer.diskStorage({

    destination: (req, file, cb) => {

        cb(null, path.join(__dirname, "../uploads"));

    },

    filename: (req, file, cb) => {

        cb(
            null,
            Date.now() + path.extname(file.originalname)
        );

    }

});

const upload = multer({
    storage: storage
});

// ======================
// Home
// ======================

app.get("/", (req, res) => {

    res.send("SERVER VERSION 29-JUNE");

});

// ======================
// Upload Image
// ======================

app.post(
    "/upload-image",
    upload.single("image"),
    (req, res) => {

        if (!req.file) {

            return res.status(400).json({
                message: "No Image Selected"
            });

        }

        res.json({
            filename: req.file.filename
        });

    }
);
// ======================
// Upload PDF
// ======================

app.post(
    "/upload-pdf",
    upload.single("pdf"),
    (req, res) => {

        if (!req.file) {

            return res.status(400).json({
                message: "No PDF Selected"
            });

        }

        res.json({
            filename: req.file.filename
        });

    }
);

// ======================
// Get All Products
// ======================

app.get("/products", (req, res) => {

    db.query(
        "SELECT * FROM products ORDER BY id DESC",
        (err, result) => {

            if (err) {

                return res.status(500).json(err);

            }

            res.json(result);

        }
    );

});

// ======================
// Get Single Product
// ======================

app.get("/product/:id", (req, res) => {

    const id = req.params.id;

    db.query(
        "SELECT * FROM products WHERE id = ?",
        [id],
        (err, result) => {

            if (err) {

                return res.status(500).json(err);

            }

            if (result.length === 0) {

                return res.status(404).json({
                    message: "Product Not Found"
                });

            }

            res.json(result[0]);

        }
    );

});
// ======================
// Add Product
// ======================

app.post("/add-product", (req, res) => {

    const {
        product_name,
        model_number,
        description,
        image,
        pdf,
        rated_voltage,
        rated_power,
        max_power,
        rated_speed,
        max_speed,
        hover_thrust,
        max_thrust,
        propeller_size
    } = req.body;

    const sql = `
    INSERT INTO products
    (
        product_name,
        model_number,
        description,
        image,
        pdf,
        rated_voltage,
        rated_power,
        max_power,
        rated_speed,
        max_speed,
        hover_thrust,
        max_thrust,
        propeller_size
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)
    `;

    db.query(
        sql,
        [
            product_name,
            model_number,
            description,
            image,
            pdf,
            rated_voltage,
            rated_power,
            max_power,
            rated_speed,
            max_speed,
            hover_thrust,
            max_thrust,
            propeller_size
        ],
        (err) => {

            if (err) {

                console.log(err);

                return res.status(500).json(err);

            }

            res.json({
                message: "Product Added Successfully"
            });

        }
    );

});

// ======================
// Update Product
// ======================

app.put("/product/:id", (req, res) => {

    const id = req.params.id;

    const {
        product_name,
        model_number,
        description,
        image,
        pdf,
        rated_voltage,
        rated_power,
        max_power,
        rated_speed,
        max_speed,
        hover_thrust,
        max_thrust,
        propeller_size
    } = req.body;

    const sql = `
    UPDATE products
    SET
        product_name=?,
        model_number=?,
        description=?,
        image=?,
        pdf=?,
        rated_voltage=?,
        rated_power=?,
        max_power=?,
        rated_speed=?,
        max_speed=?,
        hover_thrust=?,
        max_thrust=?,
        propeller_size=?
    WHERE id=?
    `;

    db.query(
        sql,
        [
            product_name,
            model_number,
            description,
            image,
            pdf,
            rated_voltage,
            rated_power,
            max_power,
            rated_speed,
            max_speed,
            hover_thrust,
            max_thrust,
            propeller_size,
            id
        ],
        (err) => {

            if (err) {

                console.log(err);

                return res.status(500).json(err);

            }

            res.json({
                message: "Product Updated Successfully"
            });

        }
    );

});
// ======================
// Delete Product
// ======================

app.delete("/product/:id", (req, res) => {

    const id = req.params.id;

    db.query(
        "DELETE FROM products WHERE id = ?",
        [id],
        (err, result) => {

            if (err) {

                console.log(err);

                return res.status(500).json(err);

            }

            if (result.affectedRows === 0) {

                return res.status(404).json({
                    message: "Product Not Found"
                });

            }

            res.json({
                message: "Product Deleted Successfully"
            });

        }
    );

});

// ======================
// Database Test
// ======================

app.get("/test-db", (req, res) => {

    db.query(
        "SELECT NOW() AS server_time",
        (err, result) => {

            if (err) {

                return res.status(500).json(err);

            }

            res.json({
                status: "Database Connected",
                serverTime: result[0].server_time
            });

        }
    );

});

// ======================
// Table Structure
// ======================

app.get("/table-structure", (req, res) => {

    db.query(
        "DESCRIBE products",
        (err, result) => {

            if (err) {

                return res.status(500).json(err);

            }

            res.json(result);

        }
    );

});
app.get("/sabari", (req, res) => {
    res.send("SERVER IS UPDATED");
});

// ======================
// Start Server
// ======================

const PORT = 5000;

app.listen(PORT, () => {

    console.log("==================================");
    console.log(" VINPROPEL Backend Started");
    console.log(" Server Running : http://localhost:5000");
    console.log("==================================");

});
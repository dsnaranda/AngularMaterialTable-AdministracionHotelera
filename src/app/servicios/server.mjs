import { MongoClient } from "mongodb";
import express from "express";
import cors from "cors";
import { ObjectId } from 'mongodb';

const app = express();
const PORT = 3000;
// Middleware para permitir CORS
app.use(cors());
app.use(express.json()); // Para manejar JSON

// Conexión a MongoDB
const getConnection = async () => {
    try {
        const mongoUrl = "mongodb://localhost:27017/BDCasas";
        const client = await MongoClient.connect(mongoUrl);
        console.log("Conexión a MongoDB establecida");
        return client.db();
    } catch (error) {
        console.error("Error al conectar a MongoDB:", error);
    }
};

// Obtener todas las casas
const getCasas = async () => {
    try {
        const database = await getConnection();
        const casas = await database.collection("casas").find().toArray();
        return casas;
    } catch (error) {
        console.error("Error al obtener las casas:", error);
        throw error;
    }
};

const getCasaById = async (id) => {
    try {
        const database = await getConnection();
        const casa = await database.collection("casas").findOne({ id: parseInt(id, 10) });  // Convertir a número
        return casa;
    } catch (error) {
        console.error("Error al obtener la casa por ID:", error);
        throw error;
    }
};

// Agregar una nueva casa
const agregarCasa = async (nuevaCasa) => {
    try {
        const database = await getConnection();
        const result = await database.collection("casas").insertOne(nuevaCasa);
        return result;
    } catch (error) {
        console.error("Error al agregar la nueva casa:", error);
        throw error;
    }
};

// Actualizar una casa
const updateCasa = async (id, casaActualizada) => {
    try {
        const database = await getConnection();
        const result = await database.collection("casas").updateOne(
            { id: id },  // Aquí se usa el id numérico
            { $set: casaActualizada }
        );
        return result;
    } catch (error) {
        console.error("Error al actualizar la casa:", error);
        throw error;
    }
};


// Eliminar una casa por ID
const eliminarCasaPorId = async (id) => {
    try {
        const database = await getConnection();
        const result = await database.collection("casas").deleteOne({ _id: new ObjectId(id) });
        return result;
    } catch (error) {
        console.error("Error al eliminar la casa por ID:", error);
        throw error;
    }
};

// Rutas de la API

// Ruta para obtener todas las casas
app.get("/api/casas", async (req, res) => {
    try {
        const casas = await getCasas();
        res.status(200).json(casas);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener las casas" });
    }
});

// Ruta para obtener una casa por ID
app.get("/api/casas/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const casa = await getCasaById(id);
        if (casa) {
            res.status(200).json(casa);
        } else {
            res.status(404).json({ error: "Casa no encontrada" });
        }
    } catch (error) {
        res.status(500).json({ error: "Error al obtener la casa por ID" });
    }
});

// Ruta para agregar una nueva casa
app.post("/api/addcasa", async (req, res) => {
    const nuevaCasa = req.body;
    try {
        const result = await agregarCasa(nuevaCasa);
        res.status(201).json({ message: "Casa agregada", result });
    } catch (error) {
        res.status(500).json({ error: "Error al agregar la casa" });
    }
});

// Ruta para actualizar una casa
app.put("/api/casas/:id", async (req, res) => {
    const { id } = req.params; // Recibe el id como cadena
    const idNumerico = parseInt(id, 10); // Convertimos el id a número
    const casaActualizada = req.body;

    if (isNaN(idNumerico)) {
        return res.status(400).json({ error: "El id debe ser un número" });
    }

    try {
        const result = await updateCasa(idNumerico, casaActualizada);  // Usamos el id numerico
        if (result.matchedCount > 0) {
            res.status(200).json({ message: "Casa actualizada", result });
        } else {
            res.status(404).json({ error: "Casa no encontrada" });
        }
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar la casa" });
    }
});


// Ruta para eliminar una casa por ID
app.delete("/api/casas/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const result = await eliminarCasaPorId(id);
        if (result.deletedCount > 0) {
            res.status(200).json({ message: "Casa eliminada" });
        } else {
            res.status(404).json({ error: "Casa no encontrada" });
        }
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar la casa por ID" });
    }
});

// Ruta para verificar credenciales
app.post("/api/login", async (req, res) => {
    const { correo, password } = req.body;

    try {
        const db = await getConnection();
        const usuario = await db.collection("usuarios").findOne({ correo });

        if (!usuario) {
            res.status(404).json({ error: 'Usuario no encontrado' });
        } else if (usuario.password !== password) {
            res.status(401).json({ error: 'Contraseña incorrecta' });
        } else {
            res.status(200).json({ message: 'Inicio de sesión exitoso', usuario });
        }
    } catch (error) {
        console.error("Error al verificar credenciales:", error);
        res.status(500).json({ error: "Error al verificar credenciales" });
    }
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
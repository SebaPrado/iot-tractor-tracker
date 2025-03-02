console.log("Iniciando mqttClient.js...");
require("dotenv").config();
console.log("Variables de entorno cargadas");

const awsIot = require("aws-iot-device-sdk");
console.log("SDK de AWS IoT cargado");

// Si estás usando Express
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
console.log("Express configurado");

const path = require("path");
const fs = require("fs");

// 1. Verificar certificados
try {
  const key = fs.readFileSync(path.join(__dirname, "certs", "private.pem.key"));
  const cert = fs.readFileSync(path.join(__dirname, "certs", "certificate.pem.crt"));
  const ca = fs.readFileSync(path.join(__dirname, "certs", "AmazonRootCA1.pem"));
  console.log("✅ Certificados leídos correctamente");
} catch (error) {
  console.error("❌ Error leyendo certificados:", error.message);
  process.exit(1); // Detiene el script si hay error
}

// 2. Crear cliente MQTT
try {
  console.log("Intentando crear el cliente MQTT...");
  const device = awsIot.device({
    keyPath: path.join(__dirname, "certs", "private.pem.key"),
    certPath: path.join(__dirname, "certs", "certificate.pem.crt"),
    caPath: path.join(__dirname, "certs", "AmazonRootCA1.pem"),
    clientId: "tractor-fixed-id-001",
    host: process.env.AWS_ENDPOINT, // Asegúrate de que AWS_ENDPOINT esté en .env
    region: "eu-north-1",
    debug: true,
  });
  console.log("Cliente MQTT creado exitosamente");

  // 📌 Evento cuando el cliente se conecta
  device.on("connect", function () {
    console.log("✅ Conectado a AWS IoT Core");
    try {
      console.log("Intentando suscribirse a tractor/datos...");
      device.subscribe("tractor/datos", function (err) {
        if (err) {
          console.error("Error al suscribirse:", err);
        } else {
          console.log("Suscripción exitosa. Intentando publicar mensaje...");
          device.publish(
            "tractor/datos",
            JSON.stringify({ mensaje: "Hola desde el tractor 🚜" }),
            function (err) {
              if (err) {
                console.error("Error al publicar mensaje:", err);
              } else {
                console.log("Mensaje publicado exitosamente");
              }
            }
          );
        }
      });
    } catch (error) {
      console.error("Error en el manejo de conexión:", error);
    }
  });

  device.on("reconnect", function () {
    console.log("Intentando reconectar a AWS IoT Core...");
  });

  device.on("offline", function () {
    console.log("Dispositivo desconectado de AWS IoT Core");
  });

  device.on("close", function () {
    console.log("Conexión cerrada con AWS IoT Core");
  });

  // 📌 Evento cuando llega un mensaje
  device.on("message", function (topic, payload) {
    console.log(`📩 Mensaje recibido en ${topic}:`, payload.toString());
  });

  // 📌 Manejo de errores
  device.on("error", function (error) {
    console.error("❌ Error en MQTT:", error);
  });
} catch (error) {
  console.error("Error al configurar el cliente MQTT:", error);
}

// Si estás usando Express
app.use(express.json());

app.get("/status", (req, res) => {
  res.json({ status: "online" });
});

app.listen(port, () => {
  console.log(`Servidor Express escuchando en puerto ${port}`);
});
console.log("Iniciando mqttClient.js...");
require("dotenv").config();
console.log("Variables de entorno cargadas");

const awsIot = require("aws-iot-device-sdk");
console.log("SDK de AWS IoT cargado");

const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
console.log("Express configurado");

const path = require("path");
const fs = require("fs");

// Verificar certificados
try {
  const key = fs.readFileSync(path.join(__dirname, "certs", "private.pem.key"));
  const cert = fs.readFileSync(path.join(__dirname, "certs", "certificate.pem.crt"));
  const ca = fs.readFileSync(path.join(__dirname, "certs", "AmazonRootCA1.pem"));
  console.log("✅ Certificados leídos correctamente");
} catch (error) {
  console.error("❌ Error leyendo certificados:", error.message);
  process.exit(1);
}

// Verificar endpoint
if (!process.env.AWS_ENDPOINT) {
  console.error("❌ ERROR: AWS_ENDPOINT no está definido en .env");
  process.exit(1);
}

// Crear cliente MQTT
let device;
try {
  console.log("Intentando crear el cliente MQTT...");
  device = awsIot.device({
    keyPath: path.join(__dirname, "certs", "private.pem.key"),
    certPath: path.join(__dirname, "certs", "certificate.pem.crt"),
    caPath: path.join(__dirname, "certs", "AmazonRootCA1.pem"),
    clientId: `tractor-${Math.random().toString(36).substring(7)}`,
    host: process.env.AWS_ENDPOINT,
    region: "eu-north-1",
    debug: true, // Habilita logs detallados
    keepalive: 30, // KeepAlive reducido
    protocol: "mqtts",
    port: 8883,
    secureProtocol: "TLSv1_2_method",
  });

  console.log("✅ Cliente MQTT creado exitosamente");
} catch (error) {
  console.error("❌ Error al configurar el cliente MQTT:", error);
  process.exit(1);
}

// Eventos del cliente MQTT
device.on("connect", () => {
  console.log("✅ Conectado a AWS IoT Core");

  device.subscribe("tractor/datos", (err) => {
    if (err) {
      console.error("❌ Error al suscribirse:", err);
    } else {
      console.log("📡 Suscripción exitosa. Publicando mensaje...");

      device.publish(
        "tractor/datos",
        JSON.stringify({ mensaje: "Hola desde el tractor 🚜" }),
        (err) => {
          if (err) {
            console.error("❌ Error al publicar mensaje:", err);
          } else {
            console.log("✅ Mensaje publicado exitosamente");
          }
        }
      );
    }
  });
});

device.on("reconnect", () => console.log("🔄 Intentando reconectar..."));
device.on("offline", () => console.log("⚠️ Dispositivo offline"));
device.on("close", () => console.log("🔒 Conexión cerrada"));
device.on("message", (topic, payload) => console.log(`📩 Mensaje en ${topic}:`, payload.toString()));
device.on("error", (error) => {
  console.error("❌ Error en MQTT:", error);
  device.end(); // Cerrar conexión en caso de error crítico
});

// Express API
app.use(express.json());

app.get("/status", (req, res) => {
  res.json({ status: "online" });
});

app.listen(port, () => {
  console.log(`🚀 Servidor Express escuchando en puerto ${port}`);
});

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

// Verificar variables de entorno
console.log("Verificando variables de entorno:");
console.log("AWS_KEY existe:", !!process.env.AWS_KEY);
console.log("AWS_CERT existe:", !!process.env.AWS_CERT);
console.log("AWS_CA existe:", !!process.env.AWS_CA);
console.log("AWS_ENDPOINT existe:", !!process.env.AWS_ENDPOINT);

try {
  console.log("Intentando crear el cliente MQTT...");
  const device = awsIot.device({
    keyPath: process.env.AWS_KEY,
    certPath: process.env.AWS_CERT,
    caPath: process.env.AWS_CA,
    clientId: `tractor-fixed-id-001`,
    host: process.env.AWS_ENDPOINT,
    region: 'eu-north-1',
  });
  console.log("Cliente MQTT creado exitosamente");

  // 📌 Evento cuando el cliente se conecta
  device.on("connect", function () {
    console.log("✅ Conectado a AWS IoT Core");
    try {
        console.log("Intentando suscribirse a tractor/datos...");
        device.subscribe("tractor/datos");
        console.log("Suscripción exitosa. Intentando publicar mensaje...");
        device.publish(
            "tractor/datos",
            JSON.stringify({ mensaje: "Hola desde el tractor 🚜" })
        );
        console.log("Mensaje publicado exitosamente");
    } catch (error) {
        console.error("Error en el manejo de conexión:", error);
    }
});
device.on("reconnect", function() {
    console.log("Intentando reconectar a AWS IoT Core...");
});

device.on("offline", function() {
    console.log("Dispositivo desconectado de AWS IoT Core");
});

device.on("close", function() {
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

app.get('/status', (req, res) => {
  res.json({ status: 'online' });
});

app.listen(port, () => {
  console.log(`Servidor Express escuchando en puerto ${port}`);
});
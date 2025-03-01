# iot-tractor-tracker
Seguimiento de un tractor con AWS IoT Core y  MQTT

1# Carpeta  aws-mqtt-tractor y archivo package.json.

mkdir aws-mqtt-tractor
cd aws-mqtt-tractor
npm init -y

#2 Esto instalará:

aws-iot-device-sdk → Conectar Node.js con AWS IoT Core.
mqtt → Librería para el protocolo MQTT.
dotenv → Manejar variables de entorno de manera segura.

# .env
1 - AWS_ENDPOINT de: https://eu-north-1.console.aws.amazon.com/iot/home?region=eu-north-1#/domain-configuration-hub
2 - de los archivos descargados de web AWS al creat el thing 
3 -                            '' 

#Crear el Cliente MQTT en Node.js
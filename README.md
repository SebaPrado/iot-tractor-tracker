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

3 #Crear el Cliente MQTT en Node.js

4 # Crear una Policy en AWS IoT Core > Security > Policies.
    Cree un json 

5 # A partir del paso 4 , tengo un certificado ..  
     Pasos:
    a) Ve a AWS IoT Core > Security > Certificates.
    b) Selecciona el certificado que estás usando (el que tiene el ID 68bafeaa2afa9fd8b8413fb7e90225347d6aef646898c1b046382bd4df3af106).
    c) En la sección Policies, haz clic en Attach Policy.
    d) Selecciona la política que acabas de crear (TractorPolicy).
    e) Haz clic en Attach


/IOT_TRACTOR_TRACKER
├── mqttClient.js       
├── package.json        
├── .env                  
└── certs
    └── certs\AmazonRootCA1.pem 
    └── certs\certificate.pem.crt
    └── certs\private.pem.key
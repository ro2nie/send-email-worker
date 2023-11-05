export const getEmailContent = {
  es: `<html>
        <body>
          <h1>Hola {{params.websiteOwnerName}}</h1>
          <p>Has recibido un nuevo mensaje de {{params.customerName}} ({{params.customerEmailAddress}}).</p>
          <p>Mensaje: {{params.customerEmailBody}}</p>
        </body>
       </html>`,
  en: `<html>
        <body>
          <h1>Hello {{params.websiteOwnerName}}</h1>
          <p>You have received a new message from {{params.customerName}} ({{params.customerEmailAddress}}).</p>
          <p>Message: {{params.customerEmailBody}}</p>
        </body>
      </html>`,
};

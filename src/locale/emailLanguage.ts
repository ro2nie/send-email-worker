export const getEmailContent = {
  'es-ES': `<html>
        <body>
          <h1>Hello {{params.websiteOwnerName}}</h1>
          <p>Has recibido un nuevo mensaje</p>
          <p>Message de: {{params.customerName}}
          <p>Móvil/Teléfono: {{params.phoneNumber}}</p>          
          <p>Enviado el: {{params.dateTime}}.</p>
          <p>Mensaje:</p>
          <p>{{params.customerEmailBody}}</p>
        </body>
       </html>`,
  'en-GB': `<html>
        <body>
          <h1>Hello {{params.websiteOwnerName}}</h1>
          <p>You have received a new message</p>
          <p>Message from: {{params.customerName}}
          <p>Phone number: {{params.phoneNumber}}</p>          
          <p>Sent on {{params.dateTime}}.</p>
          <p>Message:</p>
          <p>{{params.customerEmailBody}}</p>
        </body>
      </html>`,
};

export const getEmailSubject = (websiteName: string) => {
  return {
    'es-ES': `${websiteName} - formulario de contacto`,
    'en-GB': `${websiteName} - contact form`,
  };
};

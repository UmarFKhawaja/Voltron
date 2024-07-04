export const NODEMAILER_CONSTANTS = {
  Symbols: {
    Factories: {
      NodemailerTransportFactory: 'NODEMAILER_TRANSPORT_FACTORY'
    },
    Services: {
      MailService: 'NODEMAILER_MAIL_SERVICE'
    }
  },
  Settings: {
    host: process.env['NODEMAILER_HOST'] || '',
    port: parseInt(process.env['NODEMAILER_PORT'] || '587'),
    useTLS: process.env['NODEMAILER_USE_TLS'] == 'true',
    auth: {
      username: process.env['NODEMAILER_USERNAME'] || '',
      password: process.env['NODEMAILER_PASSWORD'] || ''
    }
  }
};

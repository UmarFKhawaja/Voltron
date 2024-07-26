import { Transporter as Connection } from 'nodemailer';

export type ConnectionFactory = () => Promise<Connection>;

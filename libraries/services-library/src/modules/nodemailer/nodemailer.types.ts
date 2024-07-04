import { Transporter } from 'nodemailer';

export type TransporterFactory = () => Transporter;

import { Injectable } from '@nestjs/common';
import mjml2html from 'mjml';
import { MailFormatterService } from '../../contracts';
import { Mail } from '../../types';
import { MJML_CONSTANTS } from './mjml.constants';

@Injectable()
export class MJMLMailFormatterService implements MailFormatterService {
  async formatRegisterMail(emailAddress: string, verificationURL: string): Promise<Mail> {
    const content: string = this.renderTemplate(MJML_CONSTANTS.Templates.RegisterMail, {
      FRONTEND_PUBLIC_URL: MJML_CONSTANTS.Settings.FrontendPublicURL,
      EMAIL_ADDRESS: emailAddress,
      VERIFICATION_URL: verificationURL
    });

    return {
      from: MJML_CONSTANTS.Settings.Sender,
      to: emailAddress,
      subject: `Jadoo | Verify Registration`,
      content
    };
  }

  async formatLoginWithMagicLoginMail(emailAddress: string, confirmationURL: string): Promise<Mail> {
    const content: string = this.renderTemplate(MJML_CONSTANTS.Templates.LoginWithMagicLogin, {
      FRONTEND_PUBLIC_URL: MJML_CONSTANTS.Settings.FrontendPublicURL,
      EMAIL_ADDRESS: emailAddress,
      CONFIRMATION_URL: confirmationURL
    });

    return {
      from: MJML_CONSTANTS.Settings.Sender,
      to: emailAddress,
      subject: `Jadoo | Confirm Login`,
      content
    };
  }

  async formatResetPasswordMail(emailAddress: string, confirmationURL: string): Promise<Mail> {
    const content: string = this.renderTemplate(MJML_CONSTANTS.Templates.ResetPassword, {
      FRONTEND_PUBLIC_URL: MJML_CONSTANTS.Settings.FrontendPublicURL,
      EMAIL_ADDRESS: emailAddress,
      CONFIRMATION_URL: confirmationURL
    });

    return {
      from: MJML_CONSTANTS.Settings.Sender,
      to: emailAddress,
      subject: `Jadoo | Confirm Login`,
      content
    };
  }

  async formatConfirmEmailAddressChange(oldEmailAddress: string, newEmailAddress: string, confirmationURL: string): Promise<Mail> {
    const content: string = this.renderTemplate(MJML_CONSTANTS.Templates.ConfirmEmailAddressChange, {
      FRONTEND_PUBLIC_URL: MJML_CONSTANTS.Settings.FrontendPublicURL,
      OLD_EMAIL_ADDRESS: oldEmailAddress,
      NEW_EMAIL_ADDRESS: newEmailAddress,
      CONFIRMATION_URL: confirmationURL
    });

    return {
      from: MJML_CONSTANTS.Settings.Sender,
      to: oldEmailAddress,
      subject: `Jadoo | Confirm Email Address Change`,
      content
    };
  }

  async formatCompleteEmailAddressChange(oldEmailAddress: string, newEmailAddress: string, confirmationURL: string): Promise<Mail> {
    const content: string = this.renderTemplate(MJML_CONSTANTS.Templates.CompleteEmailAddressChange, {
      FRONTEND_PUBLIC_URL: MJML_CONSTANTS.Settings.FrontendPublicURL,
      OLD_EMAIL_ADDRESS: oldEmailAddress,
      NEW_EMAIL_ADDRESS: newEmailAddress,
      CONFIRMATION_URL: confirmationURL
    });

    return {
      from: MJML_CONSTANTS.Settings.Sender,
      to: newEmailAddress,
      subject: `Jadoo | Complete Email Address Change`,
      content
    };
  }

  private renderTemplate(template: string, values: Record<string, string>): string {
    template = template.replace(/\{([A-Za-z0-9_ |]+)}/ig, (_, match: string) => values[match] || '');

    const result = mjml2html(template);

    return result.html;
  }
}

import { format } from 'date-fns';
import { pt } from 'date-fns/locale/pt-BR';
import Mail from '../../lib/Mail';

class NewPackage {
  get key() {
    return 'NewPackage';
  }

  async handle({ data }) {
    const { deliveryman, recipient } = data;

    await Mail.sendMail({
      to: `${deliveryman.name} <${deliveryman.email}>`,
      subject: `Fastfeet - Uma nova entrega para você`,
      template: 'newPackage',
      context: {
        deliveryman_name: deliveryman.name,
        recipient_name: recipient.name,
        recipient_street: recipient.street,
        recipient_number: recipient.number,
        recipient_complement: recipient.complement,
        recipient_state: recipient.state,
        recipient_city: recipient.city,
        recipient_cep: recipient.cep,
        created: format(new Date(), "dd 'de' MMMM', às' H:mm'h'", {
          locale: pt,
        }),
      },
    });
  }
}

export default new NewPackage();

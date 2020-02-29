import Mail from '../../lib/Mail';

class CancelDelivery {
  get key() {
    return 'CancelDelivery';
  }

  async handle({ data }) {
    const { deliveryman, recipient, product } = data;

    await Mail.sendMail({
      to: `${deliveryman.name} <${deliveryman.email}>`,
      subject: `Fastfeet - Entrega cancelada`,
      template: 'cancelDelivery',
      context: {
        deliveryman_name: deliveryman.name,
        recipient: recipient.name,
        address: `${recipient.street}, N° ${recipient.number}, ${recipient.city} - ${recipient.state}`,
        product,
      },
    });
  }
}

export default new CancelDelivery();

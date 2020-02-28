import * as Yup from 'yup';
import { parseISO, isBefore, format } from 'date-fns';
import { pt } from 'date-fns/locale/pt-BR';

import Package from '../models/Package';
import Recipient from '../models/Recipient';
import Deliveryman from '../models/Deliveryman';

import Mail from '../../lib/Mail';

class DeliveryController {
  async index(req, res) {
    const { page = 1 } = req.query;
    const deliveries = await Package.findAll({
      limit: 20,
      offset: (page - 1) * 20,
      attributes: [
        'id',
        'product',
        'start_date',
        'end_date',
        'end_date',
        'canceled_at',
      ],
      include: [
        {
          model: Recipient,
          as: 'recipient',
          attributes: [
            'id',
            'name',
            'street',
            'number',
            'complement',
            'state',
            'city',
            'cep',
          ],
        },
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    return res.json(deliveries);
  }

  async details(req, res) {
    const { id } = req.params;
    const deliveries = await Package.findOne({
      where: { id },
      attributes: ['id', 'product', 'end_date', 'end_date', 'canceled_at'],
      include: [
        {
          model: Recipient,
          as: 'recipient',
          attributes: [
            'id',
            'name',
            'street',
            'number',
            'complement',
            'state',
            'city',
            'cep',
          ],
        },
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    return res.json(deliveries);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      product: Yup.string().required(),
      recipient_id: Yup.number()
        .required()
        .positive()
        .integer(),
      deliveryman_id: Yup.number()
        .required()
        .positive()
        .integer(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation errors' });
    }

    const { recipient_id, deliveryman_id } = req.body;

    const recipient = await Recipient.findByPk(recipient_id);

    if (!recipient) {
      return res.status(400).json({ error: `Recipient not found` });
    }
    const deliveryman = await Deliveryman.findByPk(deliveryman_id, {
      attributes: ['name', 'email'],
    });
    if (!deliveryman) {
      return res.status(400).json({ error: `Deliveryman not found` });
    }

    const delivery = await Package.create(req.body);

    await Mail.sendMail({
      to: `${deliveryman.name} <${deliveryman.email}>`,
      subject: `Nova encomenda para você`,
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

    return res.json(delivery);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      product: Yup.string(),
      recipient_id: Yup.number()
        .positive()
        .integer(),
      deliveryman_id: Yup.number()
        .positive()
        .integer(),
      start_date: Yup.date(),
      end_date: Yup.date(),
      canceled_at: Yup.date(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation errors' });
    }

    const { id } = req.params;
    const { recipient_id, deliveryman_id, end_date, start_date } = req.body;

    const delivery = await Package.findByPk(id);

    if (recipient_id && recipient_id !== delivery.recipient_id) {
      const recipientExists = await Recipient.findByPk(recipient_id);

      if (recipientExists) {
        return res.status(400).json({ error: 'Recipient not found' });
      }
    }

    if (deliveryman_id && deliveryman_id !== delivery.deliveryman_id) {
      const deliverymanExists = await Deliveryman.findByPk(deliveryman_id);

      if (deliverymanExists) {
        return res.status(400).json({ error: 'Deliveryman not found' });
      }
    }

    const startDate = parseISO(start_date);
    const endDate = parseISO(end_date);

    if (isBefore(endDate, startDate)) {
      return res
        .status(401)
        .json({ error: 'End date is before the start date' });
    }

    const updatedDelivery = await delivery.update(req.body);

    return res.json(updatedDelivery);
  }

  async destroy(req, res) {
    const { id } = req.params;

    const delivery = await Package.findByPk(id);

    if (!delivery) {
      return res.status(404).json({ error: 'Delivery not found' });
    }

    await delivery.destroy();
    return res.json({ res: 'Delivery is deleted' });
  }
}

export default new DeliveryController();

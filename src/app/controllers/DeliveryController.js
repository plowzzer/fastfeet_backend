import * as Yup from 'yup';
import Delivery from '../models/Delivery';
import Recipient from '../models/Recipient';
import Deliveryman from '../models/Deliveryman';

class DeliveryController {
  async index(req, res) {
    const { page = 1 } = req.query;
    const deliveries = await Delivery.findAll({
      limit: 20,
      offset: (page - 1) * 20,
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

    const { recipient_id, deliveryman_id } = req.body;

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation errors' });
    }

    const recipient = await Recipient.findByPk(recipient_id);

    if (!recipient) {
      return res.status(400).json({ error: `Recipient not found` });
    }
    const deliveryman = await Deliveryman.findByPk(deliveryman_id);
    if (!deliveryman) {
      return res.status(400).json({ error: `Deliveryman not found` });
    }

    const delivery = await Delivery.create(req.body);

    return res.json(delivery);
  }
}

export default new DeliveryController();

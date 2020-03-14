import DeliveryProblem from '../models/DeliveryProblem';
import Deliveryman from '../models/Deliveryman';
import Recipient from '../models/Recipient';
import Package from '../models/Package';

import CancelDelivery from '../jobs/NewPackage';
import Queue from '../../lib/Queue';

class DeliveryProblemsController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const deliveryProblems = await DeliveryProblem.findAll({
      limit: 20,
      offset: (page - 1) * 20,
      attributes: ['id', 'description'],
      include: [
        {
          model: Package,
          as: 'package',
          attributes: ['id', 'product'],
          include: [
            {
              model: Deliveryman,
              as: 'deliveryman',
              attributes: ['id', 'name'],
            },
            {
              model: Recipient,
              as: 'recipient',
              attributes: ['name', 'street', 'number', 'city', 'cep'],
            },
          ],
        },
      ],
    });

    return res.json(deliveryProblems);
  }

  async show(req, res) {
    const { id } = req.params;

    const deliveryPromblens = await DeliveryProblem.findAll({
      where: {
        package_id: id,
      },
      include: [
        {
          model: Package,
          as: 'package',
          attributes: ['id', 'product'],
          include: [
            {
              model: Deliveryman,
              as: 'deliveryman',
              attributes: ['id', 'name'],
            },
            {
              model: Recipient,
              as: 'recipient',
              attributes: ['name', 'street', 'number', 'city', 'cep'],
            },
          ],
        },
      ],
      attributes: ['id', 'description', 'createdAt'],
    });

    return res.json(deliveryPromblens);
  }

  async create(req, res) {
    const { id } = req.params;
    const { description } = req.body;

    const delivery = await Package.findByPk(id);

    if (!delivery) {
      return res.status(401).json({ error: 'Package does not exists' });
    }

    const problem = await DeliveryProblem.create({
      package_id: delivery.id,
      description,
    });

    return res.json(problem);
  }

  async delete(req, res) {
    const { id } = req.params;

    const problem = await DeliveryProblem.findByPk(id);

    const delivery = await Package.findByPk(problem.package_id, {
      include: [
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['name', 'email'],
        },
        {
          model: Recipient,
          as: 'recipient',
          attributes: ['name', 'street', 'number', 'city', 'cep'],
        },
      ],
    });

    if (!delivery) {
      return res.status(401).json({ error: 'Delivery not exists.' });
    }

    // Check if order has already been delivered
    if (delivery.end_date) {
      return res
        .status(401)
        .json({ error: 'the order has already been delivered.' });
    }

    // Check if order has already been canceled
    if (delivery.canceled_at) {
      return res
        .status(401)
        .json({ error: 'the order has already been canceled.' });
    }

    delivery.canceled_at = new Date();

    await Queue.add(CancelDelivery.key, {
      deliveryman: delivery.deliveryman,
      recipient: delivery.recipient,
      product: delivery.product,
    });

    await delivery.save();

    return res.json({ msg: 'Canceled successful.' });
  }
}

export default new DeliveryProblemsController();

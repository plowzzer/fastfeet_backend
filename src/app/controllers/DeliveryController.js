import * as Yup from 'yup';
import { Op } from 'sequelize';
import { parse, startOfToday, endOfToday, isBefore, isAfter } from 'date-fns';

import Package from '../models/Package';
import Recipient from '../models/Recipient';

class PackagesController {
  // Deliveryman getting the packages to delivery
  async index(req, res) {
    const { page = 1 } = req.query;
    const { deliveryman_id } = req.params;

    const packages = await Package.findAll({
      where: { deliveryman_id, canceled_at: null },
      order: ['created_at'],
      attributes: [
        'id',
        'product',
        'start_date',
        'end_date',
        'end_date',
        'canceled_at',
      ],
      limit: 20,
      offset: (page - 1) * 20,
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
      ],
    });

    return res.json(packages);
  }

  // Deliveryman start to delivery a package
  async create(req, res) {
    const { deliveryman_id, id: package_id } = req.params;

    const todayAmount = await Package.findAll({
      where: {
        deliveryman_id,
        start_date: { [Op.between]: [startOfToday(), endOfToday()] },
      },
      attributes: ['id'],
    });

    if (todayAmount.length >= 5) {
      return res
        .status(400)
        .json({ error: 'You have collected more then 5 packages today' });
    }

    const delivery = await Package.findOne({
      where: { deliveryman_id, id: package_id },
    });

    if (!delivery) {
      return res.status(401).json({ error: 'Delivery not found' });
    }

    if (delivery.canceled_at !== null) {
      return res.status(401).json({ error: 'This delivery is canceled' });
    }

    const startTodayWork = parse('8', 'HH', new Date());
    const endTodayWork = parse('18', 'HH', new Date());
    const tN = new Date();

    if (!(isAfter(startTodayWork, tN) && isBefore(endTodayWork, tN))) {
      return res.status(400).json({
        error: 'You cannot start a delivery now, just after 8 and before 18',
      });
    }

    await delivery.update({ start_date: tN });

    return res.json(delivery);
  }

  // Deliveryman delivering the package
  async update(req, res) {
    const schema = Yup.object().shape({
      signature_id: Yup.number()
        .integer()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails' });
    }

    const { signature_id } = req.body;

    const { deliveryman_id, id: package_id } = req.params;

    const delivery = await Package.findOne({
      where: { deliveryman_id, id: package_id },
    });

    if (!delivery) {
      return res.status(401).json({ error: 'Delivery not found' });
    }

    if (delivery.canceled_at !== null) {
      return res.status(401).json({ error: 'This delivery is canceled' });
    }

    const response = await delivery.update({
      signature_id,
      end_date: new Date(),
    });

    return res.json(response);
  }
}

export default new PackagesController();

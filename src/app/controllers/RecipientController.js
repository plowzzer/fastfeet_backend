import * as Yup from 'yup';
import { Op } from 'sequelize';

import Recipient from '../models/Recipient';

class RecipientController {
  async index(req, res) {
    const { q: recipientName = '', page = 1 } = req.query;

    const recipients = await Recipient.findAll({
      where: {
        name: {
          [Op.iLike]: `${recipientName}%`,
        },
      },
      limit: 20,
      offset: (page - 1) * 20,
    });

    return res.json(recipients);
  }

  async details(req, res) {
    const { id } = req.params;

    const recipient = await Recipient.findOne({ where: { id } });

    if (!recipient) {
      return res
        .status(400)
        .json({ error: `There is no Recipient with id ${id}` });
    }

    return res.json(recipient);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      street: Yup.string().required(),
      number: Yup.string().required(),
      complement: Yup.string(),
      state: Yup.string().required(),
      city: Yup.string().required(),
      cep: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails' });
    }

    const recipient = await Recipient.create(req.body);

    return res.json(recipient);
  }

  async update(req, res) {
    const { id } = req.params;

    const schema = Yup.object().shape({
      name: Yup.string(),
      street: Yup.string(),
      number: Yup.string(),
      complement: Yup.string(),
      state: Yup.string(),
      city: Yup.string(),
      cep: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails' });
    }

    const recipient = await Recipient.findByPk(id);

    if (!recipient) {
      return res.status(404).json({ error: 'Recipient not found' });
    }

    const resipient_updated = await recipient.update(req.body);

    return res.json(resipient_updated);
  }

  async destroy(req, res) {
    const { id } = req.params;

    const recipient = await Recipient.findByPk(id);

    if (!recipient) {
      return res.status(404).json({ error: 'Recipient not found' });
    }

    await recipient.destroy();
    return res.json({ res: 'Recipient is deleted' });
  }
}

export default new RecipientController();

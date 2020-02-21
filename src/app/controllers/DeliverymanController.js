import * as Yup from 'yup';
import Deliveryman from '../models/Deliveryman';
import File from '../models/File';

class DeliverymanController {
  async index(req, res) {
    const { page = 1 } = req.query;
    const deliverymen = await Deliveryman.findAll({
      limit: 20,
      offset: (page - 1) * 20,
      attributes: ['id', 'name', 'email'],
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['id', 'name', 'path', 'url'],
        },
      ],
    });

    return res.json(deliverymen);
  }

  async details(req, res) {
    const { id } = req.params;

    const deliveryman = await Deliveryman.findOne({
      where: { id },
      attributes: ['id', 'name', 'email'],
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['id', 'name', 'path', 'url'],
        },
      ],
    });

    if (!deliveryman) {
      return res
        .status(400)
        .json({ error: `There is no deliveryman with id ${id}` });
    }

    return res.json(deliveryman);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      avatar_id: Yup.number().integer(),
    });

    const { email } = req.body;

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails' });
    }

    const checkEmail = await Deliveryman.findOne({ where: { email } });

    if (checkEmail) {
      return res
        .status(400)
        .json({ error: `${req.body.email} already registred` });
    }

    const deliveryman = await Deliveryman.create(req.body);

    return res.json(deliveryman);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      avatar_id: Yup.number().integer(),
    });
    const { id } = req.params;
    const { email } = req.body;

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails' });
    }

    const deliveryman = await Deliveryman.findOne(id);

    if (email && email !== deliveryman.email) {
      const checkEmail = await Deliveryman.findOne({ where: { email } });
      if (checkEmail) {
        return res
          .status(400)
          .json({ error: `${req.body.email} already registred` });
      }
    }

    if (!deliveryman) {
      return res
        .status(400)
        .json({ error: `There is no deliveryman with id ${id}` });
    }

    const deliveryman_updated = await deliveryman.update(req.body);

    return res.json(deliveryman_updated);
  }

  async delete(req, res) {
    const { id } = req.params;
    const deliveryman = await Deliveryman.findOne(id);

    if (!deliveryman) {
      return res.status(404).json({ error: 'Deliverymen not found' });
    }

    await deliveryman.destroy();
    return res.json({ res: 'Deliveryman is deleted' });
  }
}

export default new DeliverymanController();

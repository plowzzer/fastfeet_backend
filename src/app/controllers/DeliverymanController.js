import Deliveryman from '../models/Deliveryman';

class DeliverymanController {
  async store(req, res) {
    console.log(req.body);
    const deliveryman = await Deliveryman.create(req.body);

    return res.json(deliveryman);
  }
}

export default new DeliverymanController();

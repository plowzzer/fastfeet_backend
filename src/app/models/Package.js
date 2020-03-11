import Sequelize, { Model } from 'sequelize';

class Package extends Model {
  static init(sequelize) {
    function getStatusValue(thisPackage) {
      if (thisPackage.start_date === null && thisPackage.end_date === null) {
        return 'AGURADANDO';
      }
      if (thisPackage.start_date !== null && thisPackage.end_date === null) {
        return 'RETIRADA';
      }
      if (thisPackage.start_date !== null && thisPackage.end_date !== null) {
        return 'ENTREGUE';
      }
      return 'BUG';
    }

    super.init(
      {
        product: Sequelize.STRING,
        start_date: Sequelize.DATE,
        end_date: Sequelize.DATE,
        canceled_at: Sequelize.DATE,
        status: {
          type: Sequelize.VIRTUAL,
          get() {
            return getStatusValue(this);
          },
        },
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Recipient, {
      foreignKey: 'recipient_id',
      as: 'recipient',
    });
    this.belongsTo(models.Deliveryman, {
      foreignKey: 'deliveryman_id',
      as: 'deliveryman',
    });
    this.belongsTo(models.File, {
      foreignKey: 'signature_id',
      as: 'signature',
    });
  }
}

export default Package;

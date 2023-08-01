import pinsRepository from '../repositories/pins.repository.js';
import plansRepository from '../repositories/plans.repository.js';

export const createPins = async (event) => {
  const planId = event.pathParameters.id;
  const body = JSON.parse(event.body);

  const plan = await plansRepository.findByCodeWithPins(planId);
  if (!plan) {
    return { statusCode: 404, body: 'plan-not-found' };
  }
  if (plan.pins.length > 0) {
    const pinIds = plan.pins.map((pin) => pin.id);
    await pinsRepository.bulkDelete(pinIds);
  }
  const pinsBody = body.map((pin) => {
    return { ...pin, planId: plan.id };
  });
  const pins = await pinsRepository.bulkCreate(pinsBody);

  return { statusCode: 200, body: JSON.stringify(pins, null, 2) };
};

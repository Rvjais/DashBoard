import WorkUpdate from '../models/WorkUpdate.js';
import User from '../models/User.js';

const monthRange = () => {
  const s = new Date(); s.setDate(1); s.setHours(0,0,0,0);
  const e = new Date(s.getFullYear(), s.getMonth()+1, 1);
  return { s, e };
};

export const getMetrics = async (_req, res) => {
  const { s, e } = monthRange();

  const clients = await User.countDocuments({});
  const kpi = await WorkUpdate.aggregate([
    { $match: { createdAt: { $gte: s, $lt: e }, metric: { $in: ['pages','leads','gmb_calls','conversions'] } } },
    { $group: { _id: '$metric', total: { $sum: '$value' } } }
  ]);
  const sum = k => kpi.find(x => x._id === k)?.total || 0;

  res.json({
    agency: { clients: { current: clients, target: 60 } },
    seo:    { leadsPerSite: { current: sum('leads'), target: 20 },
              gmbCalls:     { current: sum('gmb_calls'), target: 100 } },
    ads:    { conversions: { current: sum('conversions'), target: 12 } },
    web:    { pages: { current: sum('pages'), target: 200 } },
  });
};

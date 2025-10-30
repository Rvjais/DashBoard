import WorkUpdate from "../models/WorkUpdate.js";
import User from "../models/User.js";

export const getMetrics = async (req, res) => {
  // TODO: calculate from real data. For now, return sample structure
  const clients = await User.countDocuments(); // example
  const webPagesThisMonth = 165;  // replace with real calc
  const seoLeads = 15;
  const gmbCalls = 85;
  const adsConv = 8;

  res.json({
    agency: { clients: { current: clients, target: 60 } },
    seo:    { leadsPerSite: { current: seoLeads, target: 20 }, gmbCalls: { current: gmbCalls, target: 100 } },
    ads:    { conversions: { current: adsConv, target: 12 } },
    web:    { pages: { current: webPagesThisMonth, target: 200 } },
  });
};

// Fake dashboard data
const dashboardData = {
  commandesPassees: ['Order #12347', 'Order #18645', 'Order #7547', 'Order #12347'],
  livraisonsAcceptees: ['Order #12347', 'Order #1417', 'Order #1907', 'Order #12347'],
  commandesAcceptees: ['Order #3347', 'Order #94347', 'Order #9541', 'Order #9534'],
  livraisonsTerminees: ['Order #4107', 'Order #12347', 'Order #59632', 'Order #12347'],
  statistiques: {
    'Nombres de commandes en cours': '85 commandes',
    'Chiffre d\'affaire transactionnel global en cours': '2500€ en cours'
  }
};

export async function GET() {
  return Response.json(dashboardData);
} 
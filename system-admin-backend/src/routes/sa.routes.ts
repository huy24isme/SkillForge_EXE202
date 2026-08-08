import { Router } from 'express';
import { login } from '../controllers/auth.controller';
import { getDashboardStats } from '../controllers/dashboard.controller';
import { getPlans } from '../controllers/plan.controller';
import {
  getTenants,
  getTenant,
  createTenant,
  updateTenantStatus,
} from '../controllers/tenant.controller';
import { getInvoices, updateInvoiceStatus, deleteInvoice } from '../controllers/invoice.controller';
import {
  getKpiTemplates,
  createKpiTemplate,
  deleteKpiTemplate,
  getBscTemplates,
  createBscTemplate,
  deleteBscTemplate,
} from '../controllers/template.controller';
import { getAuditLogs } from '../controllers/auditLog.controller';
import { getSettings, updateSettings } from '../controllers/setting.controller';
import { authenticateSystemAdmin } from '../middleware/auth';

const router = Router();

// Public auth routes
router.post('/auth/login', login);

// Authenticated System Admin routes
router.use(authenticateSystemAdmin);

// Dashboard
router.get('/dashboard', getDashboardStats);

// Plans
router.get('/plans', getPlans);

// Tenants
router.get('/tenants', getTenants);
router.get('/tenants/:companyId', getTenant);
router.post('/tenants', createTenant);
router.patch('/tenants/:companyId/status', updateTenantStatus);

// Invoices
router.get('/invoices', getInvoices);
router.patch('/invoices/:invoiceId/status', updateInvoiceStatus);
router.delete('/invoices/:invoiceId', deleteInvoice);

// KPI Templates
router.get('/templates/kpi', getKpiTemplates);
router.post('/templates/kpi', createKpiTemplate);
router.delete('/templates/kpi/:id', deleteKpiTemplate);

// BSC Templates
router.get('/templates/bsc', getBscTemplates);
router.post('/templates/bsc', createBscTemplate);
router.delete('/templates/bsc/:id', deleteBscTemplate);

// Audit Logs
router.get('/audit-logs', getAuditLogs);

import {
  getCustomLeads,
  updateCustomLeadStatus,
  deleteCustomLead,
} from '../controllers/customLead.controller';

// Custom Plan Leads
router.get('/custom-leads', getCustomLeads);
router.patch('/custom-leads/:leadId/status', updateCustomLeadStatus);
router.delete('/custom-leads/:leadId', deleteCustomLead);

import {
  getAdminReviews,
  updateReviewStatus,
  deleteReview,
} from '../controllers/review.controller';

// Reviews Management
router.get('/reviews', getAdminReviews);
router.patch('/reviews/:id/status', updateReviewStatus);
router.delete('/reviews/:id', deleteReview);

export default router;

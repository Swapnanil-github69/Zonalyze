import { InvestigateController } from "./investigate.controller.js";
import { handleAuditChat } from "./chatController.js";

/**
 * Audit Controller:
 * Handles high-speed decoupled location audits and dynamic conversational inquiries.
 */
export const auditLocation = InvestigateController.investigateCoordinate;
export const investigateCoordinate = InvestigateController.investigateCoordinate;
export { handleAuditChat, InvestigateController };
export default InvestigateController;

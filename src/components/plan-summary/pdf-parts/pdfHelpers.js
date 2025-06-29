import {
  JOB_TITLES_KSA,
  COMMITTEE_MEMBER_ROLES,
  MONITORING_NUMBERS,
  MONITORING_PERIODS,
  MONITORING_WEEKS,
  IMPLEMENTATION_LEVELS,
  ACHIEVEMENT_INDICATORS
} from '@/lib/operationalPlanConstants';

export const getDisplayValue = (value, optionsArray, placeholder = "غير محدد") => {
  if (value === null || value === undefined || value === '') return placeholder;
  const foundOption = optionsArray.find(opt => String(opt.value) === String(value));
  return foundOption ? foundOption.label : value;
};

export const createPage = (content, templateUrl) => {
  return `
    <div class="page" style="${templateUrl ? `background-image: url('${templateUrl}'); background-color: transparent;` : 'background-color: #ffffff;'}">
      <div class="page-content-overlay">
        ${content}
      </div>
    </div>
  `;
};

export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try { return new Date(dateString).toLocaleDateString('ar-SA-u-nu-latn'); } catch (e) { return dateString; }
};
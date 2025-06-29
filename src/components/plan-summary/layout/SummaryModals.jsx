import React from 'react';
import SharePlanDialog from '@/components/plan-summary/SharePlanDialog';
import PlanPreviewModal from '@/components/plan-summary/PlanPreviewModal';
import PptxExportDialog from '@/components/plan-summary/PptxExportDialog';
import TemplateUploadDialog from '@/components/operational-plan/TemplateUploadDialog';

const SummaryModals = ({
  planData,
  dialogs,
  setDialogs,
  templateUrl,
  onDataRefresh,
  onConfirmExportPptx,
  onShareStateChange,
}) => {
  return (
    <>
      <SharePlanDialog
        isOpen={dialogs.share}
        onOpenChange={(isOpen) => setDialogs(d => ({ ...d, share: isOpen }))}
        planId={planData.id}
        isShared={planData.is_shared}
        onShareStateChange={onShareStateChange}
      />
      <PlanPreviewModal
        isOpen={dialogs.preview}
        onOpenChange={(isOpen) => setDialogs(d => ({ ...d, preview: isOpen }))}
        planData={planData}
        templateUrl={templateUrl}
        onSaveChangesSuccess={onDataRefresh}
      />
      <PptxExportDialog
        isOpen={dialogs.pptx}
        onOpenChange={(isOpen) => setDialogs(d => ({ ...d, pptx: isOpen }))}
        onConfirmExport={onConfirmExportPptx}
        previewImageUrl={templateUrl}
      />
      <TemplateUploadDialog
        isOpen={dialogs.upload}
        onOpenChange={(isOpen) => setDialogs(d => ({ ...d, upload: isOpen }))}
        onUploadSuccess={() => {
          onDataRefresh();
          setDialogs(d => ({ ...d, upload: false }));
        }}
        templateType="operational_plan"
      />
    </>
  );
};

export default SummaryModals;
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { STRATEGIC_DOMAINS_OPTIONS } from '@/lib/goalsOptions';
import DomainSelection from '../strategic-goals/DomainSelection';
import DomainObjectivesCard from '../strategic-goals/DomainObjectivesCard';

const GoalsSection = ({ strategicGoals, onChange }) => {
    const handleAddDomain = useCallback((domainId) => {
        if (!strategicGoals.some(d => d.domain_id === domainId)) {
            const domainInfo = STRATEGIC_DOMAINS_OPTIONS.find(d => d.id === domainId);
            if (domainInfo) {
                const newDomainGoal = {
                    domain_id: domainId,
                    domain_name: domainInfo.label, 
                    objectives: domainInfo.objectives.map(obj => ({
                        id: obj.id,
                        objective_title_id: obj.objective_title_id,
                        objective_title_label: obj.objective_title_label,
                        domain_objective_id: obj.id,
                        domain_objective_label: obj.label,
                        selected: false,
                        kpis: [],
                        required_resources: obj.required_resources.map(res => ({ name: res, selected: false })),
                        isCustomResources: false,
                        customResources: ""
                    }))
                };
                onChange([...strategicGoals, newDomainGoal]);
            }
        }
    }, [strategicGoals, onChange]);

    const handleRemoveDomain = useCallback((domainId) => {
        onChange(strategicGoals.filter(d => d.domain_id !== domainId));
    }, [strategicGoals, onChange]);
    
    const handleObjectivesChange = useCallback((domainId, updatedObjectives) => {
        const newStrategicGoals = strategicGoals.map(domainGoal => {
            if (domainGoal.domain_id === domainId) {
                return { ...domainGoal, objectives: updatedObjectives };
            }
            return domainGoal;
        });
        onChange(newStrategicGoals);
    }, [strategicGoals, onChange]);

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
        exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
    };

    return (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>اختيار المجالات الاستراتيجية</CardTitle>
                    <CardDescription>
                        اختر المجالات التي ستركز عليها خطتك التشغيلية. يمكنك إضافة أو إزالة المجالات حسب الحاجة.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <DomainSelection
                        domains={STRATEGIC_DOMAINS_OPTIONS}
                        selectedDomains={strategicGoals.map(d => d.domain_id)}
                        onAddDomain={handleAddDomain}
                        onRemoveDomain={handleRemoveDomain}
                    />
                </CardContent>
            </Card>

            <AnimatePresence>
                {strategicGoals.map((domainGoal, index) => {
                    const domainInfo = STRATEGIC_DOMAINS_OPTIONS.find(d => d.id === domainGoal.domain_id);
                    if (!domainInfo) return null;

                    return (
                        <motion.div
                            key={domainGoal.domain_id}
                            variants={cardVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            layout
                        >
                            <DomainObjectivesCard
                                domainInfo={domainInfo}
                                objectivesData={domainGoal.objectives || []}
                                onObjectivesChange={(updatedObjectives) => handleObjectivesChange(domainGoal.domain_id, updatedObjectives)}
                                onRemoveDomain={() => handleRemoveDomain(domainGoal.domain_id)}
                            />
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>
    );
};

export default GoalsSection;
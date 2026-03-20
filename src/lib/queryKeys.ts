export const qk = {
  overview:      (seminarId?: string) => ['overview', seminarId] as const,
  registrations: (filters: Record<string, string>) => ['registrations', filters] as const,
  crmStages:     () => ['crm', 'stages'] as const,
  crmFollowups:  (overdueOnly: boolean) => ['crm', 'followups', overdueOnly] as const,
  report:        (seminarId: string, type: string) => ['report', seminarId, type] as const,
  seminars:      () => ['seminars'] as const,
  interactions:  (contactId: string) => ['interactions', contactId] as const,
}

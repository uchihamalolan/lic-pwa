import { ProgressBar } from "@astryxdesign/core";
import { Button } from "@astryxdesign/core/Button";
import { Card } from "@astryxdesign/core/Card";
import { Dialog } from "@astryxdesign/core/Dialog";
import { Grid } from "@astryxdesign/core/Grid";
import { Heading } from "@astryxdesign/core/Heading";
import { HStack } from "@astryxdesign/core/HStack";
import { Icon, type IconType } from "@astryxdesign/core/Icon";
import { Layout, LayoutContent, LayoutFooter, LayoutHeader } from "@astryxdesign/core/Layout";
import { SegmentedControl, SegmentedControlItem } from "@astryxdesign/core/SegmentedControl";
import { Text } from "@astryxdesign/core/Text";
import { VStack } from "@astryxdesign/core/VStack";
import { Activity, CheckCircle2, Hourglass, MessageSquare, Send, Users } from "lucide-react";
import { useState } from "react";

import { useDispatchStats, type StatsScope } from "@/hooks/use-dispatch-stats.ts";
import { closeStats, useIsStatsOpen } from "@/store/app-state.ts";

import { AppDialogHeader } from "./app-dialog-header";

type StatCardProps = {
  icon: IconType;
  title: string;
  count: string;
  unit?: string;
};
const StatCard = ({ icon, title, count, unit }: StatCardProps) => (
  <Card variant="muted">
    <VStack gap={2}>
      <HStack align="center" gap={2}>
        <Icon icon={icon} size="sm" />
        <Text type="supporting">{title}</Text>
      </HStack>
      <HStack align="end" gap={1}>
        <Heading level={2}>{count}</Heading>
        {unit ? <Text type="supporting">{unit}</Text> : null}
      </HStack>
    </VStack>
  </Card>
);

export function DispatchStatsDialog() {
  const isOpen = useIsStatsOpen();
  const [scope, setScope] = useState<StatsScope>("all");

  const stats = useDispatchStats(scope);

  if (!isOpen || !stats) return null;

  const layoutHeader = (
    <LayoutHeader>
      <AppDialogHeader title="Stats" onClose={closeStats} />
    </LayoutHeader>
  );

  const layoutContent = (
    <LayoutContent>
      <VStack gap={2}>
        <SegmentedControl
          label="Stats scope"
          layout="fill"
          value={scope}
          onChange={(val) => setScope(val as StatsScope)}
        >
          <SegmentedControlItem label="All" value="all" />
          <SegmentedControlItem label="Filtered" value="filtered" />
        </SegmentedControl>

        <Card variant="gray">
          <VStack gap={3}>
            <ProgressBar
              formatValueLabel={() => `${stats.agents.notified}/${stats.agents.total}`}
              hasValueLabel
              label="Agents contacted"
              value={stats.agents.percentage}
              variant="success"
            />

            <ProgressBar
              formatValueLabel={() => `${stats.claims.dispatched.total}/${stats.claims.total}`}
              hasValueLabel
              label="Claims dispatched"
              value={stats.claims.percentage}
            />
          </VStack>
        </Card>

        <Grid columns={2} gap={2}>
          <StatCard count={`${stats.agents.total}`} icon={Users} title="Matched Agents" unit="agents" />
          <StatCard count={`${stats.agents.pending}`} icon={Hourglass} title="Pending Agents" unit="agents" />
          <StatCard count={`${stats.claims.total}`} icon={CheckCircle2} title="Total Claims" unit="claims" />
          <StatCard count={`${stats.claims.percentage}%`} icon={Activity} title="Completion Rate" />
          <StatCard count={`${stats.claims.dispatched.wa}`} icon={Send} title="WhatsApp Sent" unit="claims" />
          <StatCard
            count={`${stats.claims.dispatched.sms}`}
            icon={MessageSquare}
            title="SMS Sent"
            unit="claims"
          />
        </Grid>
      </VStack>
    </LayoutContent>
  );

  const layoutFooter = (
    <LayoutFooter>
      <HStack justify="end">
        <Button label="Close" variant="secondary" onClick={closeStats} />
      </HStack>
    </LayoutFooter>
  );

  return (
    <Dialog
      aria-label="Stats Dialog"
      isOpen={isOpen}
      purpose="info"
      onOpenChange={(open) => !open && closeStats()}
    >
      <Layout content={layoutContent} footer={layoutFooter} header={layoutHeader} />
    </Dialog>
  );
}

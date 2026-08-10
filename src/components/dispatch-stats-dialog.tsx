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
      <HStack gap={1} align="end">
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

  if (!isOpen) return null;

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
          value={scope}
          onChange={(val) => setScope(val as StatsScope)}
          layout="fill"
        >
          <SegmentedControlItem value="all" label="All" />
          <SegmentedControlItem value="filtered" label="Filtered" />
        </SegmentedControl>

        <Card variant="gray">
          <VStack gap={3}>
            <ProgressBar
              label="Agents contacted"
              variant="success"
              value={stats.agents.percentage}
              hasValueLabel
              formatValueLabel={() => `${stats.agents.notified}/${stats.agents.total}`}
            />

            <ProgressBar
              label="Claims dispatched"
              value={stats.claims.percentage}
              hasValueLabel
              formatValueLabel={() => `${stats.claims.dispatched.total}/${stats.claims.total}`}
            />
          </VStack>
        </Card>

        <Grid columns={2} gap={2}>
          <StatCard icon={Users} title="Matched Agents" count={`${stats.agents.total}`} unit="agents" />
          <StatCard icon={Hourglass} title="Pending Agents" count={`${stats.agents.pending}`} unit="agents" />
          <StatCard icon={CheckCircle2} title="Total Claims" count={`${stats.claims.total}`} unit="claims" />
          <StatCard icon={Activity} title="Completion Rate" count={`${stats.claims.percentage}%`} />
          <StatCard icon={Send} title="WhatsApp Sent" count={`${stats.claims.dispatched.wa}`} unit="claims" />
          <StatCard
            icon={MessageSquare}
            title="SMS Sent"
            count={`${stats.claims.dispatched.sms}`}
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
      isOpen={isOpen}
      onOpenChange={(open) => !open && closeStats()}
      purpose="info"
      aria-label="Stats Dialog"
    >
      <Layout header={layoutHeader} content={layoutContent} footer={layoutFooter} />
    </Dialog>
  );
}

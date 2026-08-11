import { Card } from "@astryxdesign/core/Card";
import { Grid } from "@astryxdesign/core/Grid";
import { Heading } from "@astryxdesign/core/Heading";
import { HStack } from "@astryxdesign/core/HStack";
import { Icon, type IconType } from "@astryxdesign/core/Icon";
import { Layout, LayoutContent } from "@astryxdesign/core/Layout";
import { ProgressBar } from "@astryxdesign/core/ProgressBar";
import { SegmentedControl, SegmentedControlItem } from "@astryxdesign/core/SegmentedControl";
import { Text } from "@astryxdesign/core/Text";
import { VStack } from "@astryxdesign/core/VStack";
import { Activity, CheckCircle2, Hourglass, MessageSquare, Send, Users } from "lucide-react";
import { useState } from "react";

import { AppLayoutHeader } from "@/components/app-layout-header.tsx";
import { useDispatchStats, type StatsScope } from "@/hooks/use-dispatch-stats.ts";

type StatCardProps = {
  icon: IconType;
  title: string;
  count: string;
};
const StatCard = ({ icon, title, count }: StatCardProps) => (
  <Card variant="muted">
    <VStack gap={2}>
      <HStack align="center" gap={2}>
        <Icon icon={icon} />
        <Text>{title}</Text>
      </HStack>
      <Heading level={2}>{count}</Heading>
    </VStack>
  </Card>
);

export function StatsView() {
  const [scope, setScope] = useState<StatsScope>("all");

  const stats = useDispatchStats(scope);

  if (!stats) return null;

  const layoutHeader = <AppLayoutHeader heading="Analytics & Stats" />;

  const layoutContent = (
    <LayoutContent isScrollable={true} padding={4}>
      <VStack gap={3}>
        <SegmentedControl
          label="Stats scope"
          layout="fill"
          value={scope}
          onChange={(val) => setScope(val as StatsScope)}
        >
          <SegmentedControlItem label="All" value="all" />
          <SegmentedControlItem label="Filtered" value="filtered" />
        </SegmentedControl>

        <Card>
          <VStack gap={6}>
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
          <StatCard count={`${stats.agents.total}`} icon={Users} title="Matched Agents" />
          <StatCard count={`${stats.agents.pending}`} icon={Hourglass} title="Pending Agents" />
          <StatCard count={`${stats.claims.total}`} icon={CheckCircle2} title="Total Claims" />
          <StatCard count={`${stats.claims.percentage}%`} icon={Activity} title="Completion Rate" />
          <StatCard count={`${stats.claims.dispatched.wa}`} icon={Send} title="WhatsApp Sent" />
          <StatCard count={`${stats.claims.dispatched.sms}`} icon={MessageSquare} title="SMS Sent" />
        </Grid>
      </VStack>
    </LayoutContent>
  );

  return <Layout content={layoutContent} header={layoutHeader} />;
}

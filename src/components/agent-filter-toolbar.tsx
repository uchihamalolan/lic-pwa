import { DateInput } from "@astryxdesign/core/DateInput";
import { Selector } from "@astryxdesign/core/Selector";
import { HStack } from "@astryxdesign/core/Stack";
import { TextInput } from "@astryxdesign/core/TextInput";
import { spacingVars } from "@astryxdesign/core/theme/tokens.stylex";
import * as stylex from "@stylexjs/stylex";

import { useAgentFilters, type DispatchStatus, type SortBy } from "@/store/app-state.ts";

type DispatchStatusOption = { value: DispatchStatus; label: string };
const statusOptions: DispatchStatusOption[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "notified", label: "Notified" },
];

type SortOption = { value: SortBy; label: string };
const sortOptions: SortOption[] = [
  { value: "most_claims", label: "Most Claims" },
  { value: "most_pending", label: "Most Pending" },
  { value: "name", label: "Name (A-Z)" },
];

const styles = stylex.create({
  filterStrip: {
    paddingBlockEnd: spacingVars["--spacing-1-5"],
  },
});

export function AgentSearch() {
  const { searchQuery, setSearchQuery } = useAgentFilters();

  return (
    <TextInput
      label="Search agents"
      isLabelHidden={true}
      placeholder="Search by agent name or code"
      value={searchQuery}
      onChange={setSearchQuery}
      startIcon="search"
      hasClear={true}
      size="lg"
    />
  );
}

export function AgentFilterToolbar() {
  const { dispatchStatus, setDispatchStatus, dueFrom, setDueFrom, dueTill, setDueTill, sortBy, setSortBy } =
    useAgentFilters();

  return (
    <HStack gap={2} align="center" isScrollable={true} xstyle={styles.filterStrip}>
      <Selector<DispatchStatusOption>
        label="Status filter"
        isLabelHidden={true}
        options={statusOptions}
        value={dispatchStatus}
        onChange={(val) => setDispatchStatus(val)}
      />

      <DateInput
        label="Claims Due From"
        isLabelHidden={true}
        placeholder="Due From"
        format="date"
        hasClear={true}
        value={dueFrom}
        onChange={(val) => setDueFrom(val)}
        width={200}
      />

      <DateInput
        label="Claims Due Till"
        isLabelHidden={true}
        placeholder="Due Till"
        format="date"
        hasClear={true}
        value={dueTill}
        onChange={(val) => setDueTill(val)}
        width={200}
      />

      <Selector
        label="Sort order"
        isLabelHidden={true}
        options={sortOptions}
        value={sortBy}
        onChange={(val) => setSortBy(val)}
      />
    </HStack>
  );
}

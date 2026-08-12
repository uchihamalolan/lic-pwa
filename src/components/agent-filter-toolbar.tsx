import { DateInput } from "@astryxdesign/core/DateInput";
import { Selector } from "@astryxdesign/core/Selector";
import { HStack } from "@astryxdesign/core/Stack";
import { TextInput } from "@astryxdesign/core/TextInput";
import { useEffect, useRef } from "react";

import { useAgentFilters, type DispatchStatus, type SortBy } from "@/store/app-filters.ts";

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
  const toolbarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (toolbarRef.current) {
      const inputs = toolbarRef.current.querySelectorAll<HTMLInputElement>(".astryx-date-input input");
      inputs.forEach((input) => {
        input.setAttribute("inputmode", "none");
      });
    }
  }, []);

  return (
    <HStack ref={toolbarRef} gap={2} align="center" isScrollable={true} className="hide-scrollbar">
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
        value={dueFrom ?? undefined}
        onChange={(val) => setDueFrom(val ?? null)}
        width={200}
      />

      <DateInput
        label="Claims Due Till"
        isLabelHidden={true}
        placeholder="Due Till"
        format="date"
        hasClear={true}
        value={dueTill ?? undefined}
        onChange={(val) => setDueTill(val ?? null)}
        width={200}
      />

      <Selector
        label="Sort order"
        isLabelHidden={true}
        placeholder="Sort by"
        options={sortOptions}
        value={sortBy}
        hasClear
        onChange={(val) => setSortBy(val)}
      />
    </HStack>
  );
}

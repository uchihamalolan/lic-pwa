# Illustration Foundations in Astryx

## When to Use Illustrations

Illustrations reinforce context and provide visual guidance. Use illustrations in these specific product contexts:

| Context | Typical Use Cases | Target Image Size |
| :--- | :--- | :--- |
| **Empty States** | No search results, empty data lists, first-time experience | `120px – 200px` |
| **Onboarding** | Welcome screens, feature walkthroughs, setup wizards | `200px – 240px` |
| **Feature Highlights** | New feature announcements, upgrade prompts | `160px – 220px` |
| **Error / Edge States** | Permission denied, 404 not found, service unavailable | `160px – 200px` |

---

## Placement & Centering Pattern

Place illustrations inside `<Center>` with a vertical `<Stack>` aligned to center (`hAlign="center"`). Always pair illustrations with a `<Heading>` and optional supporting `<Text>` explaining next steps.

```tsx
import * as stylex from '@stylexjs/stylex';
import { Center, Stack, Heading, Text } from '@astryxdesign/core';

const styles = stylex.create({
  illustration: {
    width: 200,
    height: 200,
  },
});

export function EmptySearchResults() {
  return (
    <Center>
      <Stack direction="vertical" gap={3} hAlign="center">
        <img
          src="/illustrations/empty-search.svg"
          alt="No results found"
          {...stylex.props(styles.illustration)}
        />
        <Heading level={3}>No results found</Heading>
        <Text type="body" color="secondary">
          Try adjusting your search or filters to find what you are looking for.
        </Text>
      </Stack>
    </Center>
  );
}
```

---

## Do's and Don'ts Matrix

| Guidance | DO | DON'T |
| :--- | :--- | :--- |
| **Purpose** | Use illustrations to explain status or guide empty states/onboarding. | Use illustrations as decorative background clutter without purpose. |
| **Consistency** | Maintain a unified vector/flat illustration style across all app flows. | Mix disparate illustration styles (e.g. 3D renders + hand-drawn vector). |
| **Sizing** | Scale illustrations proportionally to container (`120px – 240px`). | Use massive full-screen images that distort or compress layout regions. |
| **Styling** | Use StyleX (`{...stylex.props(styles.illustration)}`) for sizing images. | Use inline `style={{ width: 200 }}` attributes. |
| **Dark Mode** | Use simple flat SVGs that render cleanly in both light and dark themes. | Use illustrations with hardcoded solid white background fills. |

# Tiwalo Digital Bank — MVP UX/UI Vision (Shared Web + Mobile)

**Status:** Approved visual direction for Tiwalo's *simulated* digital-banking MVP. Applies to `banking-web` (customer + operations) and `banking-mobile` (customer only). Backend contract and financial/security invariants take precedence over illustrative mockups.

**Brand philosophy:** *Tiwala sa bawat daloy.* — Trust in every flow.

**Visual reference:** `tiwalo-mvp-ux-reference.png` accompanies this document. The reference image is a conceptual mockup and NOT a source of authoritative balances, transaction counts, account details, operation statuses, recipient names, notifications, or deployable logo/vector assets.

## 1. Identity

- **Name:** Tiwalo Digital Bank as a fictional portfolio brand. Public demo pages must identify the system as a simulated banking demonstration, not an actual licensed bank or payment provider.
- **Logo:** Single approved, flat navy-blue flowing-letter-**T** mark across web and mobile. No gradients, shadows, distortion, or independently redrawn substitutes. If no approved vector/image asset exists in the repository, identify the gap and use a clearly marked temporary text wordmark rather than cropping/reconstructing the mockup image.
- **Language:** Warm, professional, precise, trustworthy, distinctly Filipino, globally readable. Brand phrase *Tiwala sa bawat daloy.* is optional in headers and onboarding, not forced into every screen.
- **Motifs:** Subtle original guilloché-like lines, wave engravings, and Philippine landscape line art. Use as low-contrast decoration behind/away from content. Don't reproduce actual banknotes, denominations, genuine security elements, or artwork without usage rights.
- **Design precedence:** Transaction clarity, status semantics, accessibility, financial trust and safety come before visual resemblance to the reference image.

## 2. Color tokens (exact source hex values)

### Primary

| Token | Hex | Typical use |
| --- | --- | --- |
| `brand.navy` | `#092C62` | Flat logo, headings, operations sidebar |
| `brand.pesoBlue` | `#1F618D` | Primary navigation/actions, balance card |
| `brand.skyBlue` | `#5DADE2` | Secondary surfaces, illustrative line art |
| `brand.softTeal` | `#76B5C5` | Supporting pattern transitions |

### Banknote-inspired accents

| Family | Palette | Meaning |
| --- | --- | --- |
| ₱100 Violet | `#6A3D9A`, `#A882C8`, `#7A94CC` | Secondary information/details/history |
| ₱200 Green | `#2E8B57`, `#8BC34A`, `#6BB5B5` | Confirmed success, reconciled/matched |
| ₱500 Yellow | `#E6B800`, `#F4D03F`, `#B8A85A` | Processing/pending |
| ₱20 Orange | `#E86A24`, `#F5B041`, `#8FA8BE` | Noncritical attention |
| ₱50 Red | `#C83232`, `#E87A7A`, `#B5658A` | Error, failure, reconciliation discrepancy |

### Neutral

| Token | Hex | Typical use |
| --- | --- | --- |
| `surface.paper` | `#FFFFFF` | Cards/forms/main surfaces |
| `surface.ivory` | `#FAF8F3` | App background |
| `surface.blueGray` | `#EEF4F9` | Navigation selections/subtle containers |
| `border.default` | `#DCE5EF` | Dividers/form edges |
| `text.muted` | `#64748B` | Supporting metadata |
| `text.deepInk` | `#172B4D` | Body and financial information |

Do **not** assume source palette values automatically satisfy text/button contrast. Use tested foreground/background pairs or accessible derived state tokens as needed; document intentional adjustments. Do not depend on color alone for status. Flat logo only; restrained tonal grading may appear in illustrations/balance-card surfaces, not required for standard buttons/inputs.

## 3. Typography, layout, icons, and accessibility

- **Font:** Inter, including semibold titles and tabular numeral treatment for PHP balances and transaction amounts. Use a legitimately sourced and supported font integration for each runtime; avoid copying unlicensed assets.
- **Spacing:** Base 8px system; generous internal padding and alignment.
- **Radius:** Inputs/buttons about 8–12px; cards about 12–16px.
- **Controls:** Solid Peso Blue primaries; outlined secondary controls; understandable disabled/busy states.
- **Icons:** One coherent icon style across platforms (e.g., compatible Lucide sets), with accessible labels.
- **Accessibility:** WCAG 2.2 AA target, sufficient text/control contrast, visible focus, semantic navigation, labeled inputs, error summaries, touch targets, reduced-motion awareness, and screen-reader announcements for transfer states.
- **Responsive:** Web customer desktop-first left sidebar, adaptive tablet/mobile. Mobile app native layout, five-tab bottom navigation. Operations interface prioritizes dense, usable tables and redacted data over decorative elements.

## 4. Customer Web Portal (`banking-web`)

Navigation order: **Dashboard, Accounts, Send Money, Transactions, Receipts, Profile**; Logout control separately. Fixed left sidebar on desktop, accessible compact menu at smaller widths.

- **Dashboard:** Personalized greeting using authorized customer display name; total PHP balance only from authorized API-provided accounts (if safely aggregatable); individual account preview; recent transaction preview **only when contracted**; Send Money / View Accounts / View Transactions actions.
- **Accounts:** Masked account number/reference, PHP available/posted balances, account status, account-specific history when contracted.
- **Send Money:** Account choice → opaque recipient reference → amount → validation → review → confirmation → processing/outcome resolution. Do not imply recipient-name verification exists unless API supports it.
- **Transactions:** Paginated/history/filter/search only if the backend exposes the respective fields/queries. Otherwise show a clear design-time dependency, not fake live records.
- **Receipts:** Confirmed backend-sourced reference, amount, timestamp, permitted sender/recipient summary, status, accessible printable layout. No manufactured receipt for uncertain outcome.
- **Profile:** Authorized read-only information and safe logout; editing only if contracted.

## 5. Customer Mobile App (`banking-mobile`)

Five bottom tabs exactly: **Home, Accounts, Send, Activity, Profile**. Receipts are reached from transfer result/Activity; they are **not** a sixth tab. Native navigation and safe-area support.

- **Home:** Header/flat T logo, greeting, blue balance card with subtle etched landscape, quick action shortcuts, account summaries, recent activity **only if contracted**.
- **Accounts:** Masked references, balances/statuses and account details.
- **Send:** Thumb-friendly form fields, review/confirmation, visible in-progress state, authoritative outcome and recoverable uncertain-outcome state. No offline money-moving requests.
- **Activity:** Bounded real history when API supports it, recognizable incoming/outgoing icons and status labels.
- **Profile:** Limited profile/session controls and secure sign-out.
- **Receipts:** Backend-confirmed transaction details and reference with copy/select accessibility, reached from Send/Activity.
- **Auth:** OIDC Authorization Code + PKCE, secure token storage, safe deep-link callback handling; never present login or biometric unlock as a substitute for backend authorization.

## 6. Banking Operations Portal (`banking-web` only)

Separate operator route group/navigation: **Operations Dashboard, Transactions, Investigation, Ledger, Reconciliation, Audit Trail**; role-aware Profile and Logout as appropriate.

- **Operations dashboard:** Reconciliation status, run summaries and findings available from the actual operator API; show counts/timestamps only if backend contract provides them.
- **Transactions/investigation:** Read-only, bounded transaction lookup and lifecycle/evidence **only if contracted**. Don't fabricate an Open/In Review/Resolved case workflow without backend support.
- **Ledger:** Read-only journals/postings **only if contracted**; operations should not mutate or correct balances.
- **Reconciliation:** Distinguish matched/reconciled versus findings/discrepancies with labels and accessible iconography.
- **Audit:** Authorized, sanitized actions/timestamps **only if contracted**. Never expose tokens, raw payloads, full account identifiers or PII.

Illustrated counts (12,840 transactions, 28 discrepancies, etc.), dates, names, and merchant-payment examples in the reference are **fictional visual placeholders** and MUST NOT be shipped as live metrics or imply features excluded from MVP (e.g., external merchant transfers).

## 7. API and financial-safety dependencies

- `banking-core-api` is the authority; OpenAPI 3.1 source is `api/openapi/banking-v1.yaml` when published, pinned by commit/tag. Backend path `/api/v1`.
- PHP centavos represented as signed 64-bit integer on the server and **decimal strings** in JSON (`"500000"` means ₱5,000.00). No floating-point money logic in clients.
- No client posting directly to ledger. No invented account histories, balance modifications, recipients, operator dashboards, statuses, or endpoints.
- Same logical transfer attempt retains the same idempotency key on network retry. Timeout is an **unknown outcome** until resolved with the documented status/receipt lookup or safe same-key replay.
- Backend planned milestones: B0 `chore/backend-verification`; B1 `feat/api-v1-contract`; B2 `feat/identity-and-accounts`; B3 `feat/ledger-posting`; B4 `feat/atomic-internal-transfers`; B5 `feat/reconciliation-investigation`.
- Any desired UI feature not exposed by the published API should appear in an explicit **contract-gap register**, and in isolated UI previews only as labeled, synthetic fixtures.

## 8. Design acceptance examples

- Flat consistent brand mark and verified accessible color roles across web/mobile.
- Identical semantic labels for account and transfer statuses, but platform-native layout interactions.
- Customer Web: desktop navigation, balance card, account preview, loading/empty/error states; real data when backend gates pass.
- Mobile: five native tabs, safe-area support, easy one-handed Send flow, secure session navigation.
- Operations: legible tables, redacted details, safe role boundaries; actual API metrics only.
- Tests: accessible form labels/focus, money formatting, statuses not conveyed solely by color, screenshots at representative viewport sizes, no invented successful transfers.

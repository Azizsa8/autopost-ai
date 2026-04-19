
Here's the full breakdown of all 49 errors, grouped by root cause and sorted from highest to lowest priority (fix the top ones and the bottom ones cascade-fix automatically).

----------

## PRIORITY 1 — ROOT CAUSE: Dead Stripe Imports (fixes 5 errors, unblocks everything)

These files still import `stripe.service` / `stripe.controller` which were deleted. TypeScript fails to compile the entire module tree because of these broken imports.

#

File

Error

Fix

1

`src/api/api.module.ts:6`

Cannot find module `@gitroom/backend/api/routes/stripe.controller`

Remove the import line and remove `StripeController` from the module's `controllers: []` array

2

`src/api/api.module.ts:7`

Cannot find module `@gitroom/nestjs-libraries/services/stripe.service`

Remove the import line and remove `StripeService` from `providers: []`

3

`src/api/routes/billing.controller.ts:3`

Cannot find module `stripe.service`

Remove import + remove `StripeService` from constructor injection

4

`src/api/routes/users.controller.ts:16`

Cannot find module `stripe.service`

Remove import + remove from constructor

5

`src/public-api/public.api.module.ts:3`

Cannot find module `stripe.service`

Remove import + remove from providers

6

`libraries/.../database.module.ts:19`

Cannot find module `stripe.service`

Remove import + remove from providers

----------

## PRIORITY 2 — ROOT CAUSE: SubscriptionService missing methods (fixes 8 errors)

Gemini replaced the old `SubscriptionService` but didn't implement the methods that other files still call. Add stubs or proper implementations to your new `SubscriptionService`.

#

File

Error

Fix

7

`billing.controller.ts:194`

`addSubscription` does not exist on `SubscriptionService`

Add method: `async addSubscription(...) {}` to SubscriptionService

8

`copilot.controller.ts:111`

`checkCredits` does not exist

Add method: `async checkCredits(org) { return 0; }`

9

`media.controller.ts:59`

`checkCredits` does not exist

Same — same method needed

10

`media.service.ts:85`

`checkCredits` does not exist

Same

11

`public.controller.ts:146`

`modifySubscriptionByOrg` does not exist

Add stub: `async modifySubscriptionByOrg(...) {}`

12

`permissions.service.ts:107`

`getSubscription` does not exist

Add: `async getSubscription(orgId: string) { return this.getSubscriptionByOrganizationId(orgId); }`

13

`media.service.ts:40`

`useCredit` does not exist

Add: `async useCredit(org, type, func) { return func(); }`

14

`media.service.ts:110`

`useCredit` does not exist

Same method

15

`nowpayments.ts:42`

`lifeTime` does not exist on `SubscriptionService`

Add stub: `async lifeTime(org, make, plan) {}`

----------

## PRIORITY 3 — ROOT CAUSE: organization.repository.ts using old schema fields (fixes 6 errors)

The repository was partially fixed but lines 28, 63, 95, 188, 234 still use old Postiz subscription schema fields. These Prisma queries will fail type-checking because the new schema doesn't have these fields.

#

File

Error

Fix

16

`organization.repository.ts:28`

`totalChannels` does not exist in `SubscriptionCreateInput`

Replace `totalChannels: 1000000` with `maxProfiles: 999999`

17

`organization.repository.ts:63`

`subscriptionTier: true` in select

Replace with `plan: true`

18

`organization.repository.ts:95`

`subscriptionTier: true` in select

Replace with `plan: true`

19

`organization.repository.ts:188`

`subscriptionTier: true` in select

Replace with `plan: true`

20

`organization.repository.ts:234`

`subscription?.subscriptionTier ===`

Replace with `subscription?.plan ===`

21

`oauth.repository.ts:195`

`subscriptionTier: true` in select

Replace with `plan: true`

----------

## PRIORITY 4 — ROOT CAUSE: PricingInnerInterface missing fields (fixes 7 errors)

The old Postiz pricing interface had fields like `channel`, `webhooks`, `posts_per_month` etc. Gemini's new interface only has `maxProfiles`, `maxPostsPerDay`, `ai`. The `permissions.service.ts` and `public.controller.ts` still reference old field names.

#

File

Error

Fix

22

`permissions.service.ts:29`

`channel` does not exist on `PricingInnerInterface`

Change `const { channel, ...all }` → `const { maxProfiles, ...all }`

23

`public.controller.ts:144`

`pricing[load.billing].channel`

Change `.channel` → `.maxProfiles`

24

`permissions.service.ts:89`

`subscription?.totalChannels`

Change to `subscription?.maxProfiles`

25

`permissions.service.ts:98`

`options.webhooks`

Remove this block or add `webhooks?: number` to `PricingInnerInterface` with value 0

26

`permissions.service.ts:118`

`options.posts_per_month`

Change to `options.maxPostsPerDay`

27

`permissions.service.ts:124`

`options.team_members`

Add `team_members?: number` to interface or remove the block

28

`permissions.service.ts:139`

`options.community_features`

Add `community_features?: boolean` to interface or remove block

29

`permissions.service.ts:147`

`options.featured_by_gitroom`

Add `featured_by_gitroom?: boolean` to interface or remove block

30

`permissions.service.ts:160`

`options.import_from_channels`

Add `import_from_channels?: boolean` to interface or remove block

31

`permissions.service.ts:26`

`subscription?.subscriptionTier`

Change to `subscription?.plan`

----------

## PRIORITY 5 — ROOT CAUSE: Missing Prisma includes / wrong relation names (fixes 6 errors)

These files query relations that aren't being included in the Prisma select, or use the wrong field name on the result object.

#

File

Error

Fix

32

`auth.middleware.ts:57`

`loadImpersonate.user` does not exist

Check what `loadImpersonate` actually returns — add `include: { user: true }` to the query that fetches it

33

`auth.middleware.ts:67`

`loadImpersonate.organization` (did you mean `organizationId`?)

Change to `loadImpersonate.organizationId` then fetch org separately, or add `include: { organization: { include: { users: true } } }`

34

`auth.middleware.ts:81`

`f.users[0].disabled` — `users` not included on org

Add `include: { users: true }` to the organization query in this middleware

35

`users.controller.ts:211`

`f.users[0].disabled` — same issue

Same fix — include users in the org query

36

`organization.service.ts:105`

`findOrgToDelete.users[0].role`

Add `include: { users: true }` to the `findOrgToDelete` query

37

`public.auth.middleware.ts:30`

`authorization.organization` (did you mean `organizationId`?)

Change to `authorization.organizationId` and fetch org from DB separately

38

`public.auth.middleware.ts:49`

`org.subscription` does not exist

Add `include: { subscription: true }` to the org query

39

`chat/start.mcp.ts:30`

`authorization.organization`

Same as #37 — change to `authorization.organizationId`

----------

## PRIORITY 6 — SIMPLE TYPE FIXES (fixes 2 errors)

#

File

Error

Fix

40

`integrations.controller.ts:60`

`getAllowedArticlesIntegrations` does not exist — did you mean `getAllowedSocialsIntegrations`?

Change the method call to `getAllowedSocialsIntegrations()`

41

`whatsapp.provider.ts:95`

`error.message` does not exist on `unknown`

Change `error.message` to `(error as any).message`

----------

## EXECUTION ORDER (what to fix first)

```
Step 1 → Remove all stripe imports (Priority 1) — 5 files, ~10 lines each
Step 2 → Add missing SubscriptionService methods (Priority 2) — 1 file, add ~9 stub methods
Step 3 → Fix organization.repository.ts field names (Priority 3) — 1 file, ~6 line changes
Step 4 → Fix PricingInnerInterface + permissions.service (Priority 4) — 2 files
Step 5 → Fix Prisma includes in middleware/service (Priority 5) — 5 files
Step 6 → Two simple one-line fixes (Priority 6)
```

**Fastest path:** Steps 1-3 alone will likely reduce errors from 41 to under 10, because the stripe import failures block entire module compilation trees. Fix those first, redeploy, then tackle what remains.

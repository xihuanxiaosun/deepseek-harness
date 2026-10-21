/** DayDayUp DSH fork brand: warm sunrise tile + wordmark for the sidebar slots. */
import type { Context as ClientContext } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/dsh-client-ui-renderer/client'
import type {} from '@deepseek-ai/dsh-client-ui-sidebar/client'
import { DayDayUpBrandMark, DayDayUpBrandName } from './Brand.tsx'

/** Required service: the UI slot registry. */
export const inject = ['slots']

/**
 * Fill the sidebar brand slots as one declaration-aware registration set.
 * Unlike the official brand package there is no build-profile guard: this is
 * the fork's own identity and renders in every build.
 * @param ctx - Client root context.
 */
export function apply(ctx: ClientContext): void {
  ctx.slots.inject('sidebar.brand.mark', () =>
    ctx.slots.inject('sidebar.brand.name', function* () {
      yield ctx.slots.register({ name: 'sidebar.brand.mark' }, DayDayUpBrandMark)
      yield ctx.slots.register({ name: 'sidebar.brand.name' }, DayDayUpBrandName)
    }))
}
